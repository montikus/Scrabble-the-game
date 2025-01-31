// app/game/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client'; // socket.io-client
import Board from '@/components/Board';
import Chat from '@/components/Chat';

let socket;

export default function GameRoomPage() {
  const params = useParams();
  const gameId = params.id;

  const [playerName, setPlayerName] = useState('');
  const [joined, setJoined] = useState(false);

  // При монтировании подключаемся к сокету
  useEffect(() => {
    // Инициализируем socket, если ещё не инициализирован
    if (!socket) {
      socket = io({ path: '/socket.io' }); 
      // Если нужно указать url, делаем: io("http://localhost:3000", {...})
    }

    return () => {
      // При размонтировании можно отключить, если хотим
      // socket.disconnect();
    };
  }, []);

  // Спросим имя игрока
  const handleJoinRoom = () => {
    const name = prompt('Введите ваше имя: ');
    if (name) {
      setPlayerName(name);
      // Отправим событие "joinRoom" на сервер
      socket.emit('joinRoom', gameId, name);
      setJoined(true);
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h1>Комната игры: {gameId}</h1>

      {joined ? (
        <>
          {/* Допустим, Board — это доска */}
          <Board />
          {/* А под ней — чат */}
          <Chat socket={socket} gameId={gameId} playerName={playerName} />
        </>
      ) : (
        <button onClick={handleJoinRoom}>Подключиться к комнате</button>
      )}
    </div>
  );
}
