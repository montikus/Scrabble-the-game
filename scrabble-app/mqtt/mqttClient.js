// mqtt/mqttClient.js
import mqtt from 'mqtt';
const logger = console; 

const options = {
  clientId: 'scrabble_mqtt_client_' + Math.random().toString(16).substring(2),
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
};

const client = mqtt.connect(process.env.MQTT_URL || 'mqtt://localhost:1883', options);

client.on('connect', () => {
  logger.log('MQTT client connected');
  client.subscribe('game+chat'/*, (err) => {
    if (err) {
      logger.error('Error subscribtion game+chat:', err);
    } else {
      logger.log('Subscribtion no game+chat succesfull');
    }
  }*/);
});

client.on('message', (topic, message) => {
  logger.log(`MQTT: [${topic}] ${message.toString()}`);
});

client.on('error', (error) => {
  logger.error(`MQTT error: ${error.message}`);
});

export default client;
