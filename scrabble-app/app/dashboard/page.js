// app/dashboard/page.js
'use client';

import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt'; 

export default function Dashboard() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Получаем URL MQTT из переменной окружения или используем дефолтное значение
    const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL || 'ws://broker.hivemq.com:8000/mqtt';
    const options = {
      reconnectPeriod: 1000,
    };

    // Флаг, показывающий, размонтирован ли компонент
    let isUnmounted = false;

    // Подключаемся к MQTT
    const client = mqtt.connect(mqttUrl, options);

    client.on('connect', () => {
      console.log('MQTT клиент подключён к', mqttUrl);
      // Подписываемся только если компонент ещё смонтирован и клиент не отключается
      if (!isUnmounted && client.connected && !client.disconnecting) {
        client.subscribe('dashboard/games', (err) => {
          if (err) {
            console.error('Ошибка подписки на dashboard/games:', err);
          } else {
            console.log('Подписка на dashboard/games успешна');
          }
        });
      }
    });

    client.on('message', (topic, message) => {
      try {
        const msg = JSON.parse(message.toString());
        console.log('Получено MQTT сообщение:', msg);
        // Обновляем список игр в состоянии в зависимости от события
        setGames((prevGames) => {
          if (msg.event === 'created') {
            // Если такой игры ещё нет, добавляем её
            if (!prevGames.some((g) => g._id === msg.game._id)) {
              return [...prevGames, msg.game];
            }
            return prevGames;
          } else if (msg.event === 'updated') {
            return prevGames.map((g) =>
              g._id === msg.game._id ? msg.game : g
            );
          } else if (msg.event === 'deleted') {
            return prevGames.filter((g) => g._id !== msg.game._id);
          }
          return prevGames;
        });
      } catch (error) {
        console.error('Ошибка при разборе MQTT сообщения:', error);
      }
    });

    client.on('error', (error) => {
      console.error('MQTT ошибка:', error);
    });

    // Очистка эффекта: устанавливаем флаг и отключаем клиента
    return () => {
      isUnmounted = true;
      client.end();
    };
  }, []);

  // Функция для удаления игры через REST API (пример)
  const deleteGame = async (gameId) => {
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) {
        alert('Ошибка при удалении игры: ' + result.error);
      }
      // Если сервер публикует событие по MQTT, дашборд обновится автоматически
    } catch (error) {
      console.error('Ошибка запроса при удалении игры:', error);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Дашборд</h1>
      {games.length === 0 ? (
        <p>Нет активных игр</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {games.map((game) => (
            <li
              key={game._id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <p>
                <strong>ID игры:</strong> {game._id}
              </p>
              <p>
                <strong>Игроки:</strong>{' '}
                {game.players && game.players.length > 0
                  ? game.players.join(', ')
                  : 'Нет участников'}
              </p>
              <button
                onClick={() => deleteGame(game._id)}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                }}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
