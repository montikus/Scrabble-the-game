// app/api/players/route.js
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import logger from '@/lib/logger';

/**
 * GET: Чтение всех игроков
 * POST: Создание нового игрока
 */
export async function GET() {
  try {
    await connectDB();
    const players = await User.find({ role: { $ne: 'admin' } });
    return new Response(JSON.stringify(players), { status: 200 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify({ error: 'Error getting players' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newPlayer = await User.create(data);
    logger.info(`New player created: ${newPlayer.username}`);
    return new Response(JSON.stringify(newPlayer), { status: 201 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify({ error: 'Error creating a player' }), { status: 500 });
  }
}

/**
 * Пример, если требуется отдельная обработка для PUT, DELETE. 
 * В Next.js 13 можно использовать сегмент динамического пути, но здесь
 * демонстрационный вариант "как есть".
 */
