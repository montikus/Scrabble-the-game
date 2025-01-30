// mqtt/mqttClient.js
import mqtt from 'mqtt';
import logger from '@/lib/logger';

const options = {
  clientId: 'scrabbleClient_' + Math.random().toString(16).slice(2),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const client = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883', options);

client.on('connect', () => {
  logger.info('MQTT клиент подключён');
  // Подпишемся на топик, например, 'scrabble/updates'
  client.subscribe('scrabble/updates', (err) => {
    if (err) {
      logger.error('Ошибка подписки на scrabble/updates:', err);
    } else {
      logger.info('Подписка на scrabble/updates успешна');
    }
  });
});

client.on('message', (topic, message) => {
  logger.info(`MQTT Сообщение: [${topic}] ${message.toString()}`);
  // Здесь можно обрабатывать сообщения (обновлять игру и т.д.)
});

client.on('error', (error) => {
  logger.error(`MQTT ошибка: ${error.message}`);
});

export default client;
