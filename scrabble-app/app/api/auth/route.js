// app/api/auth/route.js
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.SECRET_KEY || 'SUPER_SECRET_KEY';

export async function POST(request) {
  try {
    await connectDB();
    const { action, username, password } = await request.json();

    if (!username || !password || !action) {
      return NextResponse.json(
        { error: 'Пожалуйста, предоставьте username, password и action' },
        { status: 400 }
      );
    }

    if (action === 'register') {
      // Проверка существования пользователя
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Пользователь уже существует' },
          { status: 400 }
        );
      }
      // Хеширование пароля и создание нового пользователя
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, password: hashedPassword });
      return NextResponse.json(
        { message: 'Пользователь зарегистрирован успешно', user: newUser },
        { status: 201 }
      );
    } else if (action === 'login') {
      // Поиск пользователя по логину
      const user = await User.findOne({ username });
      if (!user) {
        return NextResponse.json(
          { error: 'Пользователь не найден' },
          { status: 404 }
        );
      }
      // Сравнение пароля
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Неверный пароль' },
          { status: 401 }
        );
      }
      // Генерация JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: '1d' }
      );
      return NextResponse.json(
        { message: 'Авторизация успешна', token, user },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Неверное действие' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Ошибка в API auth:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
