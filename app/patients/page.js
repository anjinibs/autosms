// app/patients/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/patients?id=');  // <-- will fetch list? adjust accordingly
        console.log('Fetch /api/patients status:', res.status);
        const json = await res.json();
        console.log('Response JSON:', json);
        if (json.success && Array.isArray(json.data)) {
          setPatients(json.data);
        } else {
          setError(json.error || 'Failed to fetch patients');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Fetch failed');
      }
    };
    fetchPatients();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Patients List</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <Link href="/patients/new">➕ Add New Patient</Link>
      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Channel</th><th>Preferred Time</th><th>Active</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email || '-'}</td>
              <td>{p.phone || '-'}</td>
              <td>{p.channel}</td>
              <td>{p.preferredTime}</td>
              <td>{p.active ? 'Yes' : 'No'}</td>
              <td><Link href={`/patients/${p._id}`}>Edit</Link></td>
            </tr>
          ))}
          {patients.length === 0 && !error && (
            <tr><td colSpan={7} style={{ textAlign:'center', padding:'1rem' }}>No patients found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
