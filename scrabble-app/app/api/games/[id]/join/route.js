// app/api/games/[id]/join/route.js
import { connectDB } from '@/lib/db';
import Game from '@/models/Game';
import { NextResponse } from 'next/server';

export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { playerName } = await request.json();

    console.log(`Присоединение игрока "${playerName}" к игре "${id}"`);

    if (!playerName) {
      console.log('Отправлен пустой playerName');
      return NextResponse.json({ error: 'Имя игрока обязательно' }, { status: 400 });
    }

    const game = await Game.findById(id);
    if (!game) {
      console.log(`Игра с ID "${id}" не найдена`);
      return NextResponse.json({ error: 'Игра не найдена' }, { status: 404 });
    }

    if (!game.players.includes(playerName)) {
      game.players.push(playerName);
      await game.save();
      console.log(`Игрок "${playerName}" успешно присоединился к игре "${id}"`);
    } else {
      console.log(`Игрок "${playerName}" уже в игре "${id}"`);
    }

    return NextResponse.json({ success: true, game }, { status: 200 });
  } catch (error) {
    console.error('Ошибка POST /api/games/[id]/join:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
