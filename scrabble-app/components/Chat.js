// components/Chat.js
'use client';

import React, { useEffect, useState } from 'react';

export default function Chat({ socket, gameId, playerName }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Слушаем входящие сообщения "chatMessage"
    const handleChatMessage = (msg) => {
      console.log('Новое сообщение:', msg);
      // Добавляем в список сообщений
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chatMessage', handleChatMessage);

    // Отписка при размонтировании
    return () => {
      socket.off('chatMessage', handleChatMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const message = {
      sender: playerName,
      text: inputText.trim(),
    };
    // Отправляем на сервер
    socket.emit('chatMessage', gameId, message);

    // Очистим поле ввода
    setInputText('');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Чат</h3>
      <div style={{ border: '1px solid #ccc', height: '150px', overflowY: 'auto', marginBottom: '0.5rem' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Сообщение..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '70%' }}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
}
