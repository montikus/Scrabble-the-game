// app/dashboard/page.js
'use client';
import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  const addPlayer = async () => {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, role: 'player', password: '123456' }),
    });
    const data = await res.json();
    if (!data.error) {
      setPlayers([...players, data]);
    }
  };

  return (
    <div>
      <h1>Players</h1>
      <ul>
        {players.map((p) => (
          <li key={p._id}>{p.username} ({p.role})</li>
        ))}
      </ul>

      <h2>Add Player</h2>
      <input
        type="text"
        placeholder="Player name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={addPlayer}>Add</button>
    </div>
  );
}
