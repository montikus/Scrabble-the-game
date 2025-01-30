// app/api/moves/route.js
import { connectDB } from '@/lib/db';
import logger from '@/lib/logger';
import Move from '@/models/Move';
import client from '@/mqtt/mqttClient';

/**
 * GET: Получить все ходы
 * POST: Создать новый ход
 */
export async function GET() {
  try {
    await connectDB();
    const moves = await Move.find({});
    return new Response(JSON.stringify(moves), { status: 200 });
  } catch (error) {
    logger.error('Error getting moves:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newMove = await Move.create(data);

    // Публикация в MQTT топик
    client.publish(
      'scrabble/updates',
      JSON.stringify({ type: 'MOVE', payload: newMove })
    );
    logger.info('New move has been created and sent with MQTT:', newMove._id);

    return new Response(JSON.stringify(newMove), { status: 201 });
  } catch (error) {
    logger.error('Error creating move:', error);
    return new Response(JSON.stringify({ error: 'Error creating move' }), { status: 500 });
  }
}
