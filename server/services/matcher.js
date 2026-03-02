function normalizeSkill(s) {
  return (s || '').toString().trim().toLowerCase();
}

function matchJobs(candidateSkills = [], jobs = [], topN = 5) {
  const candSet = new Set(candidateSkills.map(normalizeSkill));

  const scored = jobs.map(job => {
    const reqSkills = job.skills || [];
    const normalizedReq = reqSkills.map(normalizeSkill);
    const matched = normalizedReq.filter(s => candSet.has(s));
    const matchCount = matched.length;
    const requiredCount = normalizedReq.length || 1;
    const score = Math.round((matchCount / requiredCount) * 100);
    const gaps = normalizedReq.filter(s => !candSet.has(s));

    return {
      id: job.id,
      title: job.title,
      company: job.company,
      required_skills: reqSkills,
      matched_skills: matched,
      gaps,
      score
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}

module.exports = { matchJobs };
