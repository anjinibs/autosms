// app/logs/page.js
'use client';

import { useEffect, useState } from 'react';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ status: '', patientId: '' });

  useEffect(() => {
    const query = new URLSearchParams();
    if (filter.status) query.set('status', filter.status);
    if (filter.patientId) query.set('patientId', filter.patientId);
    fetch('/api/logs?' + query.toString())
      .then(res => res.json())
      .then(json => {
        if (json.success) setLogs(json.data);
      })
      .catch(err => {
        console.error('Error fetching logs:', err);
      });
  }, [filter]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Message Logs</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <label>
          Status:
          <select value={filter.status} onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}>
            <option value="">All</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </label>
        <label>
          Patient ID:
          <input
            value={filter.patientId}
            onChange={e => setFilter(prev => ({ ...prev, patientId: e.target.value }))}
            placeholder="Enter patient ID"
          />
        </label>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Patient ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Channel</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{l.patientId}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{l.channel}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{l.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(l.timestamp).toLocaleString()}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{l.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
