'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">

        {/* Branded Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--brown, #6B4226)', color: 'var(--amber, #D4A574)',
            borderRadius: '12px', width: '48px', height: '48px',
            fontWeight: 'bold', fontSize: '1.7rem', fontFamily: 'Georgia, serif',
            boxShadow: '0 2px 8px rgba(107,66,38,0.25)',
          }}>
            A
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-heading, Georgia)', fontSize: '1.25rem', color: 'var(--brown-dark, #2C1810)', fontWeight: '700', lineHeight: 1.1, letterSpacing: '0.04em' }}>
              AKONZI
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--amber, #C08040)', letterSpacing: '0.14em', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>
              SOFA FURNITURE
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '6px' }}>Admin Panel</h2>
        <p style={{ marginBottom: '28px' }}>Sign in to manage your store.</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@akonzifurniture.com"
              required
              autoComplete="email"
              style={{
                width: '100%', padding: '12px 16px',
                borderRadius: 'var(--radius, 12px)',
                border: '1.5px solid var(--border, #E8DCC8)',
                outline: 'none', fontSize: '1rem',
                fontFamily: 'inherit', background: '#fff',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--brown, #6B4226)'}
              onBlur={e => e.target.style.borderColor = 'var(--border, #E8DCC8)'}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={{
                width: '100%', padding: '12px 16px',
                borderRadius: 'var(--radius, 12px)',
                border: '1.5px solid var(--border, #E8DCC8)',
                outline: 'none', fontSize: '1rem',
                fontFamily: 'inherit', background: '#fff',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--brown, #6B4226)'}
              onBlur={e => e.target.style.borderColor = 'var(--border, #E8DCC8)'}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ borderRadius: '50px', padding: '14px', fontSize: '1rem', fontWeight: '600' }}>
            {loading ? 'Signing in...' : 'Access Dashboard'}
          </button>
        </form>

        {/* Role legend */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border, #E8DCC8)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #8A7560)', lineHeight: 1.5 }}>
            Team members: use your assigned email &amp; password.<br />
            Contact your admin if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
