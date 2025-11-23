'use client';

import { useEffect, useState, useRef } from "react";

export default function ReminderPage() {
  const [alertData, setAlertData] = useState(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef(null);

  // 🔓 User must click once to allow audio
  const unlockAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.play().catch(() => {
      // still blocked → means audio is now unlocked for future
    });

    setAudioUnlocked(true);
  };

  // 🔥 Auto-play / stop audio when alertData changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (!audioUnlocked) return;  // ❗ don't play unless unlocked

    if (alertData) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err =>
        console.warn("Audio blocked:", err)
      );
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [alertData, audioUnlocked]);

  // 🔥 SSE Listener
  useEffect(() => {
    const es = new EventSource("/api/reminder");

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("📥 SSE Alarm Received:", data);

      setAlertData(data);
    };

    es.onerror = (err) => console.error("SSE error", err);

    return () => es.close();
  }, []);

  return (
    <div
      onClick={unlockAudio}
      style={{ padding: 40, textAlign: "center", height: "100vh" }}
    >
      <h1>LIVE REMINDER ALERT SYSTEM</h1>

      <audio ref={audioRef} src="/alarm.mp3" preload="auto" playsInline />

      {!audioUnlocked && (
        <p style={{ color: "blue" }}>
          🔔 Tap anywhere to enable alarm sound
        </p>
      )}

      {alertData ? (
        <div style={{
          marginTop: 30,
          padding: 20,
          borderRadius: 10,
          background: "#ffe6e6",
          border: "2px solid #ff0000",
          display: "inline-block"
        }}>
          <h2>🚨 Reminder Triggered!</h2>
          <p><b>Patient:</b> {alertData.name}</p>
          <p><b>Time:</b> {alertData.time}</p>
          <p style={{ color: "red", fontSize: 20 }}>
            Alarm ringing once...
          </p>
        </div>
      ) : (
        <p>No reminders yet...</p>
      )}
    </div>
  );
}