// app/api/moves/route.js (демо-код)
import { connectDB } from '@/lib/db';
import client from '@/mqtt/mqttClient';
import logger from '@/lib/logger';

export async function POST(request) {
  // Допустим, при создании нового хода публикуем сообщение
  try {
    await connectDB();
    const data = await request.json();
    // Логика сохранения хода в БД...

    // Публикуем сообщение в топик
    client.publish('scrabble/updates', JSON.stringify({ type: 'MOVE', payload: data }));
    logger.info(`Опубликовано MQTT сообщение о новом ходе`);

    return new Response(JSON.stringify({ success: true, move: data }), { status: 201 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка при создании хода' }), { status: 500 });
  }
}
