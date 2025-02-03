// app/api/games/[id]/join/route.js
import { connectDB } from '@/lib/db';
import Game from '@/models/Game';
import { NextResponse } from 'next/server';

export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { playerName } = await request.json();

    console.log(`Coonnecting Player "${playerName}" to game "${id}"`);

    if (!playerName) {
      console.log('Empty playerName sent');
      return NextResponse.json({ error: 'Player name is necessary' }, { status: 400 });
    }

    const game = await Game.findById(id);
    if (!game) {
      console.log(`Game with ID "${id}" not found`);
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (!game.players.includes(playerName)) {
      game.players.push(playerName);
      await game.save();
      console.log(`Player "${playerName}" succesfully connected to game "${id}"`);
    } else {
      console.log(`Player "${playerName}" already in game "${id}"`);
    }

    return NextResponse.json({ success: true, game }, { status: 200 });
  } catch (error) {
    console.error('Error POST /api/games/[id]/join:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
