import fs from 'fs/promises';

async function convertDict() {
  try {
    // 1. Считываем исходный JSON (где ключи — слова, а значения — число 1)
    const rawData = await fs.readFile('words_dictionary.json', 'utf8');
    const dictObject = JSON.parse(rawData);
    // dictObject может выглядеть примерно так:
    // { "a": 1, "aa": 1, "aaa": 1, "aah": 1, ... }

    // 2. Превращаем его в массив объектов вида { "text": <ключ> }
    const wordsArray = Object.keys(dictObject).map(key => ({
      text: key
    }));
    // wordsArray будет выглядеть так:
    // [ { "text": "a" }, { "text": "aa" }, { "text": "aaa" }, ... ]

    // 3. Записываем этот массив в новый JSON-файл
    await fs.writeFile('words.json', JSON.stringify(wordsArray, null, 2), 'utf8');
    
    console.log('Файл words.json успешно создан!');
  } catch (error) {
    console.error('Ошибка при конвертации слов:', error);
  }
}

convertDict();
