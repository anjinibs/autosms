// app/admin/run-job/page.js
'use client';

import { useState } from 'react';

export default function RunJobPage() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');

  async function handleRun() {
    setRunning(true);
    setMessage('');
    try {
      const res = await fetch('/api/run-job');
      const json = await res.json();
      if (json.success) setMessage('Job triggered successfully');
      else setMessage('Error triggering job: ' + (json.error || 'Unknown'));
    } catch (err) {
      console.error('Run job error:', err);
      setMessage('Run job failed');
    }
    setRunning(false);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Run Scheduler Now</h1>
      <button onClick={handleRun} disabled={running} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        {running ? 'Running…' : 'Run Now'}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
