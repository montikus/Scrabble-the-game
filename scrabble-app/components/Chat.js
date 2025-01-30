// components/Chat.js
'use client';  // чтобы использовать WebSocket на фронтенде
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Подключаемся к WebSocket
    socket = io({
      path: '/api/socketio',
    });

    // Присоединяемся к комнате
    socket.emit('joinRoom', 'scrabbleRoom');

    // Слушаем сообщения
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit('chatMessage', message);
    setMessage('');
  };

  return (
    <div>
      <h2>Scrabble Chat</h2>
      <div>
        {messages.map((m, idx) => (
          <div key={idx}>{m}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
