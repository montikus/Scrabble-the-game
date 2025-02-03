// app/api/words/file/route.js
import { connectDB } from '@/lib/db';
import Word from '@/models/Word';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    // Получаем все слова из базы данных
    const words = await Word.find({}).lean();
    // Извлекаем только текст слов
    const wordList = words.map((w) => w.text).join('\n');
    
    // Возвращаем ответ в виде plain text
    return new NextResponse(wordList, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Ошибка при получении слов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
