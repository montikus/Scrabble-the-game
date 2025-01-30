// app/api/words/route.js
import { connectDB } from '@/lib/db';
import Word from '@/models/Word';
import logger from '@/lib/logger';

// GET: /api/words?search=es
// 1) Если ?search=... передан, выполняем поиск по подстроке
// 2) Если не передан, возвращаем все слова

export async function GET(request) {
  try {
    await connectDB();
    const { search } = Object.fromEntries(new URL(request.url).searchParams.entries());

    let words;
    if (search) {
      // Регулярное выражение для поиска подстроки
      const regex = new RegExp(search, 'i'); // 'i' - без учёта регистра
      words = await Word.find({ text: { $regex: regex } });
    } else {
      words = await Word.find({});
    }

    return new Response(JSON.stringify(words), { status: 200 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении слов' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newWord = await Word.create(data);
    return new Response(JSON.stringify(newWord), { status: 201 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify({ error: 'Ошибка при создании слова' }), { status: 500 });
  }
}
