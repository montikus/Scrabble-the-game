// app/api/auth/route.js
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '@/lib/logger';

export async function POST(request) {
  /**
   * Логика логина или регистрации в зависимости от тела запроса.
   * Допустим, разделяем по наличию флага: { "action": "login" | "register" }
   */
  try {
    await connectDB();
    const { username, password, action } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Enter login and password' }), { status: 400 });
    }

    if (action === 'register') {
      // Регистрация
      const candidate = await User.findOne({ username });
      if (candidate) {
        return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        password: hashedPassword,
      });
      logger.info(`New user registered: ${username}`);

      return new Response(JSON.stringify({ message: 'Successfull registration', user: newUser }), { status: 201 });
    } else if (action === 'login') {
      // Логин
      const user = await User.findOne({ username });
      if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 401 });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
        expiresIn: '1d',
      });

      // Пример возврата токена клиенту. Можно сохранить токен в Cookie:
      return new Response(JSON.stringify({ message: 'Succesfull authorization', token }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
  } catch (error) {
    logger.error(`Ошибка в Auth: ${error.message}`);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
