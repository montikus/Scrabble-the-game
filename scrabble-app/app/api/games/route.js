// app/api/games/route.js
import { connectDB } from '@/lib/db';
import Game from '@/models/Game';
import logger from '@/lib/logger';

export async function GET() {
  try {
    await connectDB();
    const games = await Game.find({});
    return new Response(JSON.stringify(games), { status: 200 });
  } catch (error) {
    logger.error('Error loading games list:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newGame = await Game.create(data);
    return new Response(JSON.stringify(newGame), { status: 201 });
  } catch (error) {
    logger.error('Error creting game:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
