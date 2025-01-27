// lib/logger.js
import winston from 'winston';
import path from 'path';

const logPath = path.join(process.cwd(), 'logs', 'app.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: logPath }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

export default logger;
