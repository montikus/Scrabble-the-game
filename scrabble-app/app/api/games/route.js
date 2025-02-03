// app/api/games/route.js
import { connectDB } from '@/lib/db';
import Game from '@/models/Game';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Создаём пустую доску и вставляем начальное слово
    const BOARD_SIZE = 15;
    const createEmptyBoard = () =>
      Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => '')
      );
    const insertInitialWord = (board) => {
      const initialWords = ['CAT', 'DOG', 'FOX', 'BIRD'];
      const word = initialWords[Math.floor(Math.random() * initialWords.length)];
      const row = Math.floor(BOARD_SIZE / 2);
      const startCol = Math.floor((BOARD_SIZE - word.length) / 2);
      const newBoard = board.map((r) => [...r]);
      for (let i = 0; i < word.length; i++) {
        newBoard[row][startCol + i] = word[i];
      }
      return newBoard;
    };

    const boardWithInitialWord = insertInitialWord(createEmptyBoard());

    // Если в теле запроса передан первый игрок, добавляем его в массив players
    const initialPlayers = body.player ? [body.player] : [];

    const newGame = await Game.create({
      players: initialPlayers,
      turnStatus: 0,
      board: boardWithInitialWord,
      moveMessage: '',
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании игры:', error);
    return NextResponse.json({ error: 'Ошибка при создании игры' }, { status: 500 });
  }
}
