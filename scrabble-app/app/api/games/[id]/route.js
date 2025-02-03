// app/api/games/[id]/route.js
import { connectDB } from '@/lib/db';
import Game from '@/models/Game';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const game = await Game.findById(id).lean();
    if (!game) {
      return NextResponse.json({ error: 'Игра не найдена' }, { status: 404 });
    }
    return NextResponse.json(game, { status: 200 });
  } catch (error) {
    console.error('Ошибка получения игры:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    // Обновляем игру (например, состояние доски, список игроков, turnStatus, moveMessage)
    const updatedGame = await Game.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updatedGame) {
      return NextResponse.json({ error: 'Игра не найдена' }, { status: 404 });
    }
    return NextResponse.json(updatedGame, { status: 200 });
  } catch (error) {
    console.error('Ошибка обновления игры:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
