// app/api/words/verify/route.js
import { connectDB } from '@/lib/db';
import Word from '@/models/Word';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    // Получаем query-параметры из URL
    const { searchParams } = new URL(request.url);
    const word = searchParams.get('word');

    if (!word) {
      return NextResponse.json({ exists: false, error: 'Word not found' }, { status: 400 });
    }

    // Ищем слово в базе, например, без учёта регистра
    const wordFound = await Word.findOne({ text: new RegExp(`^${word}$`, 'i') }).lean();

    return NextResponse.json({ exists: !!wordFound }, { status: 200 });
  } catch (error) {
    console.error('Error checking word:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
