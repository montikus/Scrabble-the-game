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
    const body = await request.json();
    
    const newGame = await Game.create({
      status: body.status || 'pending',
      players: body.players || [],
      messages: body.messages || [],
    });

    return new Response(JSON.stringify(newGame), { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return new Response(JSON.stringify({ error: 'Error creating game' }), { status: 500 });
  }
}