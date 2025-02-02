// app/api/games/route.js
import { connectDB } from '@/lib/db';
import Game from '@/models/Game';
import logger from '@/lib/logger';
import mqttClient from '@/mqtt/mqttClient';
import { NextResponse } from 'next/server';


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

    // Публикация MQTT-сообщения о создании игры
    // Формат сообщения: { event: 'created', game: newGame }
    mqttClient.publish('dashboard/games', JSON.stringify({ event: 'created', game: newGame }));

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании игры:', error);
    return NextResponse.json({ error: 'Ошибка при создании игры' }, { status: 500 });
  }
}