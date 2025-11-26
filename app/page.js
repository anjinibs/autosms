'use client';
import { useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
  //  const audioRef = useRef(null);
  //  const handleUserClick = () => {
  //   if (!audioRef.current) return;
  //   audioRef.current.currentTime = 0;
  //   audioRef.current.play().catch(err => console.warn("Audio blocked:", err));
  // };
  return (
    <div  style={{ padding: '2rem', fontFamily: 'Arial, sans-serif',height: '100vh', }}>
      {/* <div onClick={handleUserClick} style={{ padding: 20, textAlign: "center" }}></div> */}
      <h1>Reminder Dashboard</h1>
      <p>Welcome to the automated messaging system. Use the links below to manage patients, view logs or run the scheduler.</p>
{/* <audio ref={audioRef} src="/alarm.mp3" preload="auto" loop playsInline /> */}

      <nav style={{ marginTop: '1.5rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '0.5rem 0' }}>
            <Link href="/patients">📋 View Patients</Link>
          </li>
          <li style={{ margin: '0.5rem 0' }}>
            <Link href="/patients/new">➕ Add New Patient</Link>
          </li>
          <li style={{ margin: '0.5rem 0' }}>
            <Link href="/logs">📝 View Message Logs</Link>
          </li>
          <li style={{ margin: '0.5rem 0' }}>
            <Link href="/reminder">▶️ Run Scheduler Now</Link>
          </li>
        </ul>
      </nav>

      <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#666' }}>
        <p>© {new Date().getFullYear()} Your Company / Project. All rights reserved.</p>
      </footer>
    </div>
  );
}
