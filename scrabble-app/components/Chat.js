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
      console.log('New message:', msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chatMessage', handleChatMessage);

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
    socket.emit('chatMessage', gameId, message);

    setInputText('');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Chat</h3>
      <div style={{ border: '1px solid #ccc', height: '150px', overflowY: 'auto', marginBottom: '0.5rem' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '70%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
