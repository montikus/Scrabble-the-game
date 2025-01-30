// app/dashboard/page.js
'use client';
import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Получаем список игроков
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Ошибка при получении игроков:', err));
  }, []);

  const addPlayer = async () => {
    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role: 'player', password: '123456' }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlayers(prev => [...prev, data]);
        setUsername('');
      } else {
        alert(data.error || 'Ошибка при создании игрока');
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
    }
  };

  return (
    <div>
      <h1>Control panel</h1>

      <h2>Players list</h2>
      <ul>
        {players.map((p) => (
          <li key={p._id}>
            {p.username} ({p.role})
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem' }}>
        <h3>Add new player</h3>
        <input
          type="text"
          placeholder="Player name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={addPlayer}>Add</button>
      </div>
    </div>
  );
}
