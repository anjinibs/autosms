// app/patients/new/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPatientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', channel: 'email', preferredTime: '10:00', active: true
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        router.push('/patients');
      } else {
        setError(json.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Submit failed');
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Patient</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label>Name:<br />
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>Email:<br />
            <input name="email" value={form.email} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>Phone:<br />
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>Channel:<br />
            <select name="channel" value={form.channel} onChange={handleChange}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </label>
        </div>
        <div>
          <label>Preferred Time (HH:MM):<br />
            <input name="preferredTime" value={form.preferredTime} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Active
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
