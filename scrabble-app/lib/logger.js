// lib/logger.js
import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'game.log');

export function logMessage(message) {
  const logEntry = `[${new Date().toISOString()}] ${message}\n`;
  // fs.appendFile открывает файл, записывает строку и закрывает его
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error writtig log:', err);
    }
  });
}

export default logMessage;