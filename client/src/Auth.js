import React, { useState } from 'react';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e && e.preventDefault();
    setMessage('Processing...');
    const url = `/api/auth/${mode}`;
    const body = mode === 'register' ? { email, password, name } : { email, password };
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) return setMessage(data.error || 'Auth failed');
      onAuth(data.token);
    } catch (err) {
      setMessage('Request failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 30, color: 'white' }}>
        <h2 style={{ marginBottom: 10, fontSize: '1.6rem' }}>Welcome!</h2>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>Analyze your resume and find matching job opportunities</p>
      </div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="email">📧 Email</label><br />
          <input  id="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label htmlFor="password">🔐 Password</label><br />
          <input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password" required />
        </div>
        {mode === 'register' && (
          <div>
            <label htmlFor="name">👤 Full Name</label><br />
            <input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
        )}
        <div style={{ marginTop: 20 }}>
          <button type="submit">{mode === 'login' ? '✓ Login' : '✓ Register'}</button>
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }} style={{ marginLeft: 8 }}>
            {mode === 'login' ? 'Create Account' : 'Login Instead'}
          </button>
        </div>
      </form>
      {message && <div style={{ marginTop: 12, textAlign: 'center', color: message.includes('failed') || message.includes('error') ? '#ff6b6b' : '#fff', fontSize: '14px' }}>{message}</div>}
    </div>
  );
}
