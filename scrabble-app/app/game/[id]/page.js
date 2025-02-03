'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import io from 'socket.io-client';
import Board from '@/components/Board';
import Chat from '@/components/Chat';

// Константы для доски
const BOARD_SIZE = 15;

// Функция создания пустой доски 15×15
const createEmptyBoard = () =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => '')
  );

// Функция вставки случайного начального слова в центральную строку
const insertInitialWord = (board) => {
  const initialWords = ['CAT', 'DOG', 'FOX', 'BIRD'];
  const word = initialWords[Math.floor(Math.random() * initialWords.length)];
  const row = Math.floor(BOARD_SIZE / 2);
  const startCol = Math.floor((BOARD_SIZE - word.length) / 2);
  const newBoard = board.map((r) => [...r]); // создаём копию доски
  for (let i = 0; i < word.length; i++) {
    newBoard[row][startCol + i] = word[i];
  }
  return newBoard;
};

// Функция для извлечения слов (горизонтально и вертикально)
// Возвращает массив строк, длина которых больше 1
const extractWordsFromBoard = (board) => {
  const words = [];

  // Горизонтальные слова
  board.forEach((row) => {
    let currentWord = '';
    row.forEach((cell) => {
      if (cell !== '') {
        currentWord += cell;
      } else {
        if (currentWord.length > 1) words.push(currentWord);
        currentWord = '';
      }
    });
    if (currentWord.length > 1) words.push(currentWord);
  });

  // Вертикальные слова
  for (let col = 0; col < BOARD_SIZE; col++) {
    let currentWord = '';
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (board[row][col] !== '') {
        currentWord += board[row][col];
      } else {
        if (currentWord.length > 1) words.push(currentWord);
        currentWord = '';
      }
    }
    if (currentWord.length > 1) words.push(currentWord);
  }

  return words;
};

// Функция проверки слова через HTTP API
const validateWord = async (word) => {
  try {
    const res = await fetch(`/api/words/verify?word=${encodeURIComponent(word)}`);
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error('Ошибка проверки слова:', error);
    return false;
  }
};

// Функция для проверки всех слов на доске
const validateAllWords = async (board) => {
  const words = extractWordsFromBoard(board);
  for (const word of words) {
    const valid = await validateWord(word);
    if (!valid) {
      return { valid: false, word };
    }
  }
  return { valid: true, words };
};

export default function GamePage() {
  const { id: gameId } = useParams();
  // const router = useRouter();

  // Состояния игры
  const [board, setBoard] = useState(() =>
    insertInitialWord(createEmptyBoard())
  );
  const [localPlayer, setLocalPlayer] = useState('');
  const [currentTurn, setCurrentTurn] = useState('');
  const [scores, setScores] = useState({});
  const [moveMessage, setMoveMessage] = useState('');
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [turnStatus, setTurnStatus] = useState(0); // Для двух игроков: 0 или 1

  // При монтировании: загрузка имени игрока и списка игроков из sessionStorage
  useEffect(() => {
    let storedName = sessionStorage.getItem('username');
    if (!storedName) {
      storedName = prompt('Введите ваш ник:');
      if (storedName) {
        sessionStorage.setItem('username', storedName);
      }
    }
    setLocalPlayer(storedName || '');

    // Загрузка массива игроков из sessionStorage
    const storedPlayers = JSON.parse(sessionStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
  }, []);

  // Функция для добавления нового игрока в локальный массив (и обновления sessionStorage)
  const addPlayer = (playerName) => {
    setPlayers((prevPlayers) => {
      if (!prevPlayers.includes(playerName)) {
        const newPlayers = [...prevPlayers, playerName];
        sessionStorage.setItem('players', JSON.stringify(newPlayers));
        return newPlayers;
      }
      return prevPlayers;
    });
  };

  // Инициализация Socket.io и обработка событий
  useEffect(() => {
    const socketClient = io(undefined, { path: '/socket.io' });
    socketClient.emit('joinRoom', gameId, localPlayer);
    setSocket(socketClient);

    socketClient.on('playerJoined', (data) => {
      console.log(`Получено уведомление о присоединении: ${data.playerName}`);
      addPlayer(data.playerName);
    });

    socketClient.on('moveUpdate', (move) => {
      console.log('Получено обновление хода:', move);
      if (move.board) setBoard(move.board);
      if (typeof move.turnStatus === 'number') {
        setTurnStatus(move.turnStatus);
        // Определяем текущий ход по массиву players
        const nextPlayer = players[move.turnStatus] || '';
        setCurrentTurn(nextPlayer);
      }
      if (move.scores) setScores(move.scores);
      if (move.message) setMoveMessage(move.message);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [gameId, localPlayer, players]);

  // Если currentTurn не установлен, установим его как игрок с индексом turnStatus
  useEffect(() => {
    if (localPlayer && players.length > 0 && !currentTurn) {
      setCurrentTurn(players[turnStatus] || localPlayer);
    }
  }, [localPlayer, players, currentTurn, turnStatus]);

  // Функция для обработки изменений в клетке доски
  // const handleCellChange = (row, col, value) => {
  //   if (localPlayer !== currentTurn) return; // Разрешаем изменения только, если это ход текущего игрока
  //   const newBoard = board.map((r) => [...r]);
  //   newBoard[row][col] = value;
  //   setBoard(newBoard);
  // };

  // Функция завершения хода с проверкой всех слов на доске (горизонтально и вертикально)
  const endTurn = async () => {
    const { valid, word } = await validateAllWords(board);
    if (!valid) {
      alert(`Слово "${word}" отсутствует в словаре`);
      return;
    }

    // Вычисляем суммарные очки за все слова, найденные на доске
    const wordsFound = extractWordsFromBoard(board);
    const totalPoints = wordsFound.reduce((sum, w) => sum + w.length, 0);
    const newScore = (scores[localPlayer] || 0) + totalPoints;
    const newScores = { ...scores, [localPlayer]: newScore };

    // Переключаем ход: turnStatus меняется циклически между 0 и 1 (только два игрока)
    const nextTurnStatus = (turnStatus + 1) % 2;
    setTurnStatus(nextTurnStatus);
    const nextTurn = players[nextTurnStatus] || localPlayer;
    setCurrentTurn(nextTurn);

    const moveMsg = `${localPlayer} ввёл слова [${wordsFound.join(', ')}] и заработал ${totalPoints} очков`;

    const move = {
      board,
      turnStatus: nextTurnStatus,
      scores: newScores,
      message: moveMsg,
    };

    // Отправляем обновление через Socket.io
    if (socket && socket.connected) {
      socket.emit('endTurn', gameId, move);
    }

    setScores(newScores);
    setMoveMessage(moveMsg);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Игра Scrabble (Комната: {gameId})</h1>
      <p>
        Текущий ход: <strong>{currentTurn}</strong>
      </p>
      <p>
        Ваш ник: <strong>{localPlayer}</strong>
      </p>
      <p>
        Ваши очки: <strong>{scores[localPlayer] || 0}</strong>
      </p>
      {moveMessage && <p>{moveMessage}</p>}
      <Board board={board} onCellChange={handleCellChange} disabled={localPlayer !== currentTurn} />
      {localPlayer === currentTurn && (
        <button onClick={endTurn} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Передать ход
        </button>
      )}
      <Chat socket={socket} gameId={gameId} playerName={localPlayer} />
    </div>
  );
}
