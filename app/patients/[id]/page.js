// app/patients/[id]/page.js
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditPatientPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('EditPatientPage: id =', id);
    if (!id) {
      setError('Missing patient id');
      setLoading(false);
      return;
    }
    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/patients?id=${id}`);
        console.log('Fetch /api/patients?id=', id, 'status=', res.status);
        const json = await res.json();
        console.log('Fetch result:', json);
        if (json.success) {
          setForm(json.data);
        } else {
          setError(json.error || 'Failed to load patient');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load patient');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!id) {
      setError('Missing patient id');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/patients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...form })
      });
      const json = await res.json();
      console.log('Update result:', json);
      if (json.success) {
        router.push('/patients');
      } else {
        setError(json.error || 'Update failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Update failed');
    }
  }

  if (loading) {
    return <div style={{ padding:'2rem' }}>Loading…</div>;
  }

  return (
    <div style={{ padding:'2rem' }}>
      <h1>Edit Patient</h1>
      {error && <p style={{ color:'red' }}>Error: {error}</p>}
      {form && (
        <form onSubmit={handleSubmit} style={{ display:'grid', gap:'1rem', maxWidth:'400px' }}>
          <div>
            <label>Name:<br />
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Email:<br />
              <input name="email" value={form.email || ''} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>Phone:<br />
              <input name="phone" value={form.phone || ''} onChange={handleChange} />
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
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
}
