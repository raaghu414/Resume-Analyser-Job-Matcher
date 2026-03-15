import React, { useState } from 'react';
import Results from './Results';

export default function Upload({ token }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Select a file');
    
    setLoading(true);
    setMessage('Uploading and analyzing resume...');
    try {
      // Upload resume
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await fetch('/api/upload', { 
        method: 'POST', 
        body: fd, 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok) {
        setMessage(uploadData.error || 'Upload failed');
        setLoading(false);
        return;
      }

      setMessage('Finding job matches...');

      // Extract skills from AI analysis and call match endpoint
      const skills = uploadData.ai?.skills || [];
      const matchRes = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills })
      });
      const matchData = await matchRes.json();

      if (!matchRes.ok) {
        setMessage(matchData.error || 'Matching failed');
        setLoading(false);
        return;
      }

      // Store both upload and match results
      setResults({
        ai: uploadData.ai,
        matches: matchData.matches || []
      });

      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setFile(null);
    setMessage('');
  };

  if (results) {
    return <Results data={results} onReset={handleReset} />;
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>📄 Upload Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={e => setFile(e.target.files[0])}
          disabled={loading}
        />
        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Upload & Analyze'}
          </button>
        </div>
      </form>
      {message && <div style={{ marginTop: 8, color: 'white', textAlign: 'center' }}>{message}</div>}
      {file && !loading && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#ccc', textAlign: 'center' }}>
          Selected: {file.name}
        </div>
      )}
    </div>
  );
}
