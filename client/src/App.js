import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import Upload from './Upload';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const handleLogout = () => setToken(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 Resume Analyzer & Job Matcher</h1>
      {!token ? (
        <Auth onAuth={(t) => setToken(t)} />
      ) : (
        <div>
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
          <Upload token={token} />
        </div>
      )}
    </div>
  );
}
