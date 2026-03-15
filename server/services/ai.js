const OpenAI = require('openai');

let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn('OPENAI_API_KEY not set — AI features will be disabled.');
}

async function analyzeResume(text) {
  if (!text) return { skills: [], score: 0, summary: 'No text provided' };
  if (!client) {
    // Provide a lightweight heuristic fallback when OpenAI is not configured.
    // Extract capitalized words and common tech tokens as a simple skill list.
    const techTokens = ['javascript','react','node','express','mongodb','python','docker','kubernetes','sql','html','css','git'];
    const found = new Set();
    const lower = text.toLowerCase();
    techTokens.forEach(t => { if (lower.includes(t)) found.add(t); });
    // also pick capitalized words as candidate skills (very heuristic)
    const caps = (text.match(/\b[A-Z][a-zA-Z0-9+.#-]{1,30}\b/g) || []).slice(0,30);
    caps.forEach(c => { if (found.size < 30) found.add(c); });
    const skills = Array.from(found).slice(0,30);
    const score = Math.min(80, 40 + skills.length * 8);
    return { skills, score, top_roles: [], suggestions: ['Set OPENAI_API_KEY to enable richer analysis'], summary: 'Fallback heuristic used' };
  }

  const system = `You are an assistant that extracts structured information from resumes. Respond ONLY with a JSON object and nothing else.`;

  const userPrompt = `Extract the candidate's key skills from the resume text and produce a resume score from 0 to 100.\nReturn a JSON object with the following keys:\n- skills: an array of skill strings (max 30)\n- score: integer 0-100\n- top_roles: array of up to 5 job role suggestions\n- suggestions: short improvement suggestions array\n\nResume text:\n\"\"\"\n${text}\n\"\"\"`;

  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 600,
      temperature: 0.0
    });

    const raw = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content;
    if (!raw) return { skills: [], score: 0, summary: 'No response from AI' };

    const jsonStart = raw.indexOf('{');
    const jsonText = jsonStart >= 0 ? raw.slice(jsonStart) : raw;
    let parsed = {};
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      return { skills: [], score: 0, summary: 'Failed to parse AI output', raw };
    }

    return parsed;
  } catch (err) {
    console.error('AI analyze error', err);
    return { skills: [], score: 0, summary: 'AI error' };
  }
}

module.exports = { analyzeResume };
