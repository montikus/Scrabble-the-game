// app/api/games/[id]/chat/route.js
import { NextResponse } from 'next/server';

let gamesInMemory = [
  {
    _id: 'g1',
    status: 'pending',
    players: ['PlayerOne'],
    messages: [
      { sender: 'PlayerOne', text: 'Hello!' },
    ],
  },
  {
    _id: 'g2',
    status: 'pending',
    players: [],
    messages: [],
  }
];

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const game = gamesInMemory.find(g => g._id === id);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json({ messages: game.messages }, { status: 200 });
  } catch (error) {
    console.error('Ошибка chat GET:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const game = gamesInMemory.find(g => g._id === id);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const { sender, text } = await request.json();
    game.messages.push({ sender, text });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error chat POST:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
