'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const router = useRouter();

  // Объявляем состояние для имени пользователя и для ID игры, к которой хотите присоединиться
  const [username, setUsername] = useState('');
  const [joinId, setJoinId] = useState('');

  // При монтировании компонента пытаемся получить имя пользователя из sessionStorage
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username') || '';
    setUsername(storedUsername);
  }, []);

  // Пример функции для создания игры (реализуйте логику по своему усмотрению)
  const createGame = async () => {
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }),
      });
      const data = await res.json();
      if (res.ok) {
        // После создания игры перенаправляем пользователя на страницу игры
        router.push(`/game/${data._id}`);
      } else {
        console.error('Ошибка при создании игры:', data.error);
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
    }
  };

  // Пример функции для присоединения к игре
  const joinGame = async () => {
    try {
      // Здесь реализуйте вашу логику присоединения по введённому joinId
      router.push(`/game/${joinId}`);
    } catch (error) {
      console.error('Ошибка при присоединении к игре:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {username ? (
        <h2>Добро пожаловать, {username}!</h2>
      ) : (
        // Если ник не найден, перенаправляем на страницу авторизации
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
          <button onClick={createGame}>Create new game</button>
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
          <button onClick={joinGame}>Join</button>
        </div>
      </div>
    </div>
  );
}
