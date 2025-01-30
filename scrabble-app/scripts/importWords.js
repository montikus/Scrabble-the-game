// scripts/importWords.js
import { readFileSync } from 'node:fs';

// Если у вас Node.js < 18, добавьте:
//   npm install node-fetch
// и раскомментируйте:
// import fetch from 'node-fetch';

async function loadWords() {
  try {
    // 1. Считываем JSON-файл (с массивом объектов)
    const rawData = readFileSync('scripts/words.json', 'utf8');
    const wordsArray = JSON.parse(rawData);

    // 2. Отправляем POST-запрос для каждого слова
    for (const wordObj of wordsArray) {
      const response = await fetch('http://localhost:3000/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wordObj),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error('Ошибка при добавлении слова:', result);
      } else {
        console.log('Добавлено слово:', result);
      }
    }

    console.log('Импорт слов завершён!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка в скрипте importWords:', error);
    process.exit(1);
  }
}

loadWords();
