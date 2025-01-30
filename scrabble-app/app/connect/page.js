// app/connect/page.js
'use client';  

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const router = useRouter();
  const [joinId, setJoinId] = useState('');

  const createGame = async () => {
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }), 
        // Можно передать и другие поля
      });
      const data = await res.json();

      if (res.ok) {
        // Предположим, нам вернётся { _id: "...", ... }
        const newGameId = data._id;
        router.push(`/game/${newGameId}`);
      } else {
        alert('Error creating gameroom: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating gameroom:', error);
    }
  };

  const joinGame = () => {
    if (!joinId.trim()) {
      return alert('Enter game ID!');
    }
    router.push(`/game/${joinId.trim()}`);
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Connect</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={createGame}>
          Create new game
        </button>
      </div>

      <hr />

      <div style={{ marginTop: '1rem' }}>
        <h2>Join game</h2>
        <input 
          type="text" 
          placeholder="Enter game ID" 
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
        />
        <button onClick={joinGame}>
          Join
        </button>
      </div>
    </div>
  );
}
