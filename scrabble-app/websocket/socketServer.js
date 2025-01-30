// websocket/socketServer.js
import { Server } from 'socket.io';
import logger from '@/lib/logger';

// Глобальная переменная для Socket.io, чтобы не создавать несколько экземпляров
let io;

export function initSocket(server) {
  if (io) return io;

  io = new Server(server, {
    path: '/api/socketio',
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Новое WebSocket подключение: ${socket.id}`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      logger.info(`${socket.id} зашёл в комнату ${room}`);
    });

    socket.on('chatMessage', (msg) => {
      logger.info(`Сообщение в чате: ${msg}`);
      // Рассылаем всем в комнате
      io.to('scrabbleRoom').emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
      logger.info(`Отключение WebSocket: ${socket.id}`);
    });
  });

  return io;
}
