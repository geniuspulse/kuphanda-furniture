'use client';

import { useState, useEffect } from 'react';

const ROLES = ['admin', 'manager', 'staff'];
const ROLE_LABELS = {
  admin: { label: 'Admin', color: '#6B4226', desc: 'Full access — orders, products, posts, settings & team' },
  manager: { label: 'Manager', color: '#2563eb', desc: 'Orders, products & blog posts' },
  staff: { label: 'Staff', color: '#059669', desc: 'Orders only' },
};

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`${form.name} added as ${form.role}.`);
        setForm({ name: '', email: '', password: '', role: 'staff' });
        setShowAdd(false);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to add user');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    await fetch('/api/auth/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, active: !user.active }),
    });
    fetchUsers();
  };

  const deleteUser = async (user) => {
    if (!confirm(`Remove ${user.name} from the team?`)) return;
    await fetch('/api/auth/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id }),
    });
    fetchUsers();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--brown-dark)', marginBottom: '4px' }}>Team Members</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage who has access to the admin panel and what they can do.</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setError(''); setSuccess(''); }}
          style={{ background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
        >
          + Add Member
        </button>
      </div>

      {/* Role Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {ROLES.map(r => (
          <div key={r} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '14px 16px' }}>
            <span style={{ display: 'inline-block', background: ROLE_LABELS[r].color, color: '#fff', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>{ROLE_LABELS[r].label}</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{ROLE_LABELS[r].desc}</p>
          </div>
        ))}
      </div>

      {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 16px', color: '#166534', marginBottom: '16px', fontSize: '0.9rem' }}>✓ {success}</div>}
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 16px', color: '#991b1b', marginBottom: '16px', fontSize: '0.9rem' }}>⚠ {error}</div>}

      {/* Add Member Form */}
      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px', color: 'var(--brown-dark)' }}>Add New Team Member</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Full Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grace Banda" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="grace@akonzifurniture.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Password *</label>
                <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Set a secure password" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px' }}>Role *</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                  <option value="staff">Staff — Orders only</option>
                  <option value="manager">Manager — Orders, Products, Blog</option>
                  <option value="admin">Admin — Full Access</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={saving} style={{ background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontFamily: 'inherit', fontWeight: '600', cursor: 'pointer' }}>
                {saving ? 'Adding...' : 'Add Member'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: '1.5px solid var(--border)', borderRadius: '8px', padding: '10px 20px', fontFamily: 'inherit', cursor: 'pointer', color: 'var(--text-muted)' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Loading team...</p>
      ) : (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--cream-light, #FAF5EE)', borderBottom: '1px solid var(--border)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '500', color: 'var(--text-dark)' }}>{u.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: ROLE_LABELS[u.role]?.color || '#999', color: '#fff', borderRadius: '20px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {ROLE_LABELS[u.role]?.label || u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: u.active ? '#f0fdf4' : '#fef2f2', color: u.active ? '#166534' : '#991b1b', borderRadius: '20px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => toggleActive(u)} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)' }}>
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteUser(u)} style={{ border: '1px solid #fca5a5', borderRadius: '6px', padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer', background: 'transparent', color: '#dc2626' }}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '1.5px solid var(--border)', borderRadius: '8px',
  fontSize: '0.9rem', fontFamily: 'inherit',
  outline: 'none', background: '#fff',
  boxSizing: 'border-box',
};
