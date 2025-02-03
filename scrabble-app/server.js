// server.js
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import { logMessage } from './lib/logger.js';
import mqttClient from './mqtt/mqttClient.js'; // Убедитесь, что mqttClient экспортируется корректно

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function main() {
  try {
    await app.prepare();
    const server = createServer((req, res) => {
      handle(req, res);
    });

    // Инициализируем Socket.io поверх HTTP-сервера
    const io = new Server(server, {
      cors: { origin: "*" },
    });

    io.on('connection', (socket) => {
      console.log('Новый клиент подключился:', socket.id);

      // Обработчик присоединения к комнате
      socket.on('joinRoom', (gameId, playerName) => {
        socket.join(gameId);
        console.log(`Игрок "${playerName}" зашёл в комнату ${gameId}`);
        // Рассылаем всем в комнате уведомление о новом участнике
        io.to(gameId).emit('playerJoined', { playerName, gameId });
        logMessage(`Player ${playerName} joined game ${gameId}`);
      });

      // Обработчик чата
      socket.on('chatMessage', (gameId, message) => {
        console.log(`Message ${gameId} from "${message.sender}": ${message.text}`);
        // Рассылаем сообщение всем участникам комнаты
        io.to(gameId).emit('chatMessage', message);
        // Публикуем сообщение в MQTT (если необходимо)
        mqttClient.publish(`game/${gameId}/chat`, JSON.stringify(message));
        logMessage(`Message in gamechat ${gameId}: ${message.text}`);
      });

      // Новое событие: завершение хода
      socket.on('endTurn', (gameId, move) => {
        console.log(`Ход завершён в комнате ${gameId}:`, move);
        // Здесь можно добавить дополнительную логику:
        // например, сохранить состояние игры в БД, проверить валидность хода и т.д.
        // Рассылаем обновлённое состояние игры всем клиентам в этой комнате:
        io.to(gameId).emit('moveUpdate', move);
        logMessage(`Move in game ${gameId}: ${move.message}`);
      });

      // Дополнительное событие: выход из комнаты (опционально)
      socket.on('leaveRoom', (gameId, playerName) => {
        socket.leave(gameId);
        console.log(`Игрок "${playerName}" покинул комнату ${gameId}`);
        // Можно уведомить остальных участников
        io.to(gameId).emit('playerLeft', { playerName, gameId });
      });

      // Обработка отключения клиента
      socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
      });
    });

    // Запуск сервера на указанном порту
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
