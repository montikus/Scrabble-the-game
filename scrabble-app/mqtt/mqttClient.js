// mqtt/mqttClient.js
import mqtt from 'mqtt';
const logger = console; // или ваш логгер

const options = {
  clientId: 'scrabble_mqtt_client_' + Math.random().toString(16).substring(2),
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
};

const client = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883', options);

client.on('connect', () => {
  logger.log('MQTT клиент подключён');
  // Можно подписаться на общий топик, если нужно
  client.subscribe('game/+/chat', (err) => {
    if (err) {
      logger.error('Ошибка подписки на game/+/chat:', err);
    } else {
      logger.log('Подписка на game/+/chat успешна');
    }
  });
});

client.on('message', (topic, message) => {
  logger.log(`MQTT: [${topic}] ${message.toString()}`);
  // Можно обрабатывать сообщения — напр. 
  // можно ретранслировать их обратно в Socket.io.
});

client.on('error', (error) => {
  logger.error(`MQTT ошибка: ${error.message}`);
});

export default client;
