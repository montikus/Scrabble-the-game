// app/game/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function GamePage() {
  const params = useParams();
  const { id } = params; 
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${id}`);
        const data = await res.json();
        if (res.ok) {
          setGameData(data);
        } else {
          console.error('Error getting game:', data.error);
        }
      } catch (error) {
        console.error('Request error:', error);
      }
    };
    fetchGame();
  }, [id]);

  if (!gameData) {
    return <div style={{ margin: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Game: {gameData._id}</h1>
      <p>Status: {gameData.status}</p>

      {/* Здесь может быть ваш компонент доски, например: */}
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h2>Игровая доска (макет)</h2>
        <p>Здесь расположена логика игры, например, компоненты Board, Tiles и т.д.</p>
      </div>
    </div>
  );
}
