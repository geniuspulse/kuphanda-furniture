'use client';
import { useState, useEffect } from 'react';

export default function SettingsForm() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Settings saved! The site will update on next deploy.');
      } else {
        setStatus('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading settings...</div>;

  const fields = [
    { group: 'Contact Information', items: [
      { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '265XXXXXXXXX', hint: 'Include country code, no + or spaces. e.g. 265991234567' },
      { key: 'phone', label: 'Phone Number (displayed)', placeholder: '+265 991 234 567' },
      { key: 'email', label: 'Email Address', type: 'email', placeholder: 'info@akonzifurniture.com' },
      { key: 'address', label: 'Physical Address', placeholder: 'Lilongwe, Malawi' },
      { key: 'hours', label: 'Business Hours', placeholder: 'Mon-Sat: 8:00 AM - 5:00 PM' },
    ]},
    { group: 'Social Media', items: [
      { key: 'facebook', label: 'Facebook URL', placeholder: 'https://www.facebook.com/...' },
      { key: 'instagram', label: 'Instagram URL', placeholder: 'https://www.instagram.com/...' },
    ]},
    { group: 'Business Info', items: [
      { key: 'name', label: 'Business Name', placeholder: 'Kuphanda Furniture' },
      { key: 'tagline', label: 'Tagline', placeholder: 'Quality Starts Here!!!' },
      { key: 'description', label: 'Short Description', placeholder: 'We make and supply quality furniture...' },
      { key: 'location', label: 'Location (short)', placeholder: 'Lilongwe, Malawi' },
    ]},
  ];

  return (
    <div>
      {fields.map(group => (
        <div className="admin-card" key={group.group}>
          <h3>{group.group}</h3>
          {group.items.map(field => (
            <div className="form-group" key={field.key}>
              <label>{field.label}</label>
              <input
                type={field.type || 'text'}
                value={settings[field.key] || ''}
                onChange={e => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
              {field.hint && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{field.hint}</p>}
            </div>
          ))}
        </div>
      ))}

      {status && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius)',
          background: status.startsWith('Error') ? '#fff5f5' : '#f0fdf4',
          color: status.startsWith('Error') ? '#dc3545' : '#16a34a',
          border: `1px solid ${status.startsWith('Error') ? '#fecaca' : '#bbf7d0'}`,
          marginBottom: '16px',
          fontSize: '0.9rem',
        }}>{status}</div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary"
        style={{ minWidth: '160px' }}
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
