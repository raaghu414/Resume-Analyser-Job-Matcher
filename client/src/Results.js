import React from 'react';

export default function Results({ data, onReset }) {
  if (!data) return null;
  const { ai, matches } = data;

  return (
    <div className="results-container">
      <h2>Resume Analysis & Job Matches</h2>

      {ai && (
        <div className="analysis-card">
          <h3>Your Resume Score: {ai.score || 0}/100</h3>
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${ai.score || 0}%` }}></div>
          </div>
          {ai.skills && ai.skills.length > 0 && (
            <div>
              <h4>Detected Skills ({ai.skills.length})</h4>
              <div className="skills-tags">
                {ai.skills.slice(0, 15).map((s, i) => (
                  <span key={i} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
          {ai.suggestions && ai.suggestions.length > 0 && (
            <div>
              <h4>Suggestions for Improvement</h4>
              <ul className="suggestions-list">
                {ai.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {matches && matches.length > 0 && (
        <div className="matches-section">
          <h3>Job Matches ({matches.length})</h3>
          <div className="matches-grid">
            {matches.map(m => (
              <div key={m.id} className={`job-card match-${m.score}`}>
                <div className="job-header">
                  <h4>{m.title}</h4>
                  <span className="company">{m.company}</span>
                </div>

                <div className="match-score">
                  <span className="score-label">Match</span>
                  <span className={`score-value ${m.score >= 75 ? 'high' : m.score >= 50 ? 'medium' : 'low'}`}>
                    {m.score}%
                  </span>
                </div>

                {m.matched_skills && m.matched_skills.length > 0 && (
                  <div className="skills-section">
                    <h5>✓ Your Skills</h5>
                    <div className="skills-mini">
                      {m.matched_skills.slice(0, 5).map((s, i) => (
                        <span key={i} className="skill-mini matched">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {m.gaps && m.gaps.length > 0 && (
                  <div className="skills-section">
                    <h5>⊘ Skills to Learn ({m.gaps.length})</h5>
                    <div className="skills-mini">
                      {m.gaps.slice(0, 5).map((s, i) => (
                        <span key={i} className="skill-mini gap">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={onReset} className="btn-secondary">Upload Another Resume</button>
      </div>
    </div>
  );
}
