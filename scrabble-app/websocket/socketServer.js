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
    logger.info(`New WebSocket connection: ${socket.id}`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      logger.info(`${socket.id} joined room ${room}`);
    });

    socket.on('chatMessage', (msg) => {
      logger.info(`Message in chat: ${msg}`);
      // Рассылаем всем в комнате
      io.to('scrabbleRoom').emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
      logger.info(`Disconnecting WebSocket: ${socket.id}`);
    });
  });

  return io;
}
