// app/auth/page.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [action, setAction] = useState('login'); // "login" или "register"
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Ошибка');
      } else {
        if (action === 'login') {
          // Сохраняем токен и данные пользователя
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('username', data.user.username);
          // Перенаправляем на панель управления или в игру
          router.push('/connect');
        } else {
          // После успешной регистрации переключаемся на форму логина
          setAction('login');
          setErrorMsg('Регистрация успешна. Теперь войдите в систему.');
        }
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
      setErrorMsg('Ошибка запроса');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
      <h1>{action === 'login' ? 'Авторизация' : 'Регистрация'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Логин:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <button type="submit" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
          {action === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        {action === 'login' ? (
          <p>
            Нет аккаунта?{' '}
            <button onClick={() => setAction('register')} style={{ cursor: 'pointer', color: 'blue', background: 'none', border: 'none' }}>
              Зарегистрироваться
            </button>
          </p>
        ) : (
          <p>
            Уже есть аккаунт?{' '}
            <button onClick={() => setAction('login')} style={{ cursor: 'pointer', color: 'blue', background: 'none', border: 'none' }}>
              Войти
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
