'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [joinId, setJoinId] = useState('');

  // При монтировании получаем username из sessionStorage (если пользователь авторизован)
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const createGame = async () => {
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/game/${data._id}`);
      } else {
        alert('Error creation game: ' + data.error);
      }
    } catch (error) {
      console.error('Request error:', error);
    }
  };

  const joinGame = async () => {
    if (!joinId.trim()) {
      alert('Enter game ID');
      return;
    }
    router.push(`/game/${joinId}`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    setUsername('');
    router.push('/auth');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {username ? (
        <div>
          <h2>Welcome, {username}!</h2>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            Exit
          </button>
        </div>
      ) : (
        // Если ник не найден, можно перенаправить пользователя на страницу авторизации
        <div>
          <p>Вы не авторизованы. Пожалуйста, войдите в систему.</p>
          <button
            onClick={() => router.push('/auth')}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            Перейти к авторизации
          </button>
        </div>
      )}
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
    </div>
  );
}
