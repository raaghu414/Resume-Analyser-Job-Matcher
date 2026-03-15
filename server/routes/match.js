const express = require('express');
const path = require('path');
const fs = require('fs');
const { analyzeResume } = require('../services/ai');
const { matchJobs } = require('../services/matcher');

const router = express.Router();

const jobsFile = path.join(__dirname, '..', 'data', 'jobs.json');
function loadJobs() {
  try {
    const raw = fs.readFileSync(jobsFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load jobs', err);
    return [];
  }
}

// Accepts { skills: [...strings] } or { text: "resume text" }
router.post('/', async (req, res) => {
  const { skills, text, topN } = req.body || {};
  let candidateSkills = skills;

  if (!candidateSkills || !Array.isArray(candidateSkills) || candidateSkills.length === 0) {
    if (!text) return res.status(400).json({ error: 'Provide `skills` or `text` in body' });
    const ai = await analyzeResume(text);
    candidateSkills = ai.skills || [];
  }

  const jobs = loadJobs();
  const matches = matchJobs(candidateSkills, jobs, topN || 5);

  res.json({ candidate_skills: candidateSkills, matches });
});

module.exports = router;
