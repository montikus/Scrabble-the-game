// server.js
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import mqttClient from './mqtt/mqttClient.js'; // Убедитесь, что указан правильный путь и расширение


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function main() {
  try {
    await app.prepare();
    const server = createServer((req, res) => {
      handle(req, res);
    });

    // Инициализация Socket.io поверх server
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    // Логика обработки Socket.io
    io.on('connection', (socket) => {
      console.log('Новый клиент подключился:', socket.id);

      // Событие "joinRoom" — пользователь присоединяется к комнате (gameId)
      socket.on('joinRoom', (gameId, playerName) => {
        socket.join(gameId);
        console.log(`Игрок "${playerName}" зашёл в комнату ${gameId}`);

        // Рассылаем всем в комнате информацию о новом игроке
        io.to(gameId).emit('playerJoined', { playerName, gameId });
      });

      // Событие "chatMessage" — отправка сообщения в комнату
      socket.on('chatMessage', (gameId, message) => {
        console.log(`Сообщение в комнате ${gameId} от "${message.sender}": ${message.text}`);

        // 1) Рассылаем всем в комнате
        io.to(gameId).emit('chatMessage', message);

        // 2) Параллельно публикуем в MQTT
        mqttClient.publish(`game/${gameId}/chat`, JSON.stringify(message));
      });

      // Отключение
      socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
      });
    });

    // Запуск сервера на порту 3000
    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Server listening on http://localhost:${port}`);
    });
  } catch (e) {
    console.error('Ошибка при запуске:', e);
  }
}

main();
