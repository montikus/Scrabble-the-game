// models/Game.js
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema(
  {
    // Список игроков (их ники)
    players: { type: [String], default: [] },
    // Статус хода – индекс игрока из массива players, по умолчанию 0
    turnStatus: { type: Number, default: 0 },
    // Состояние доски – двумерный массив клеток (15x15)
    board: {
      type: [[String]],
      default: () => {
        // Функция, создающая пустую доску 15x15
        const BOARD_SIZE = 15;
        return Array.from({ length: BOARD_SIZE }, () =>
          Array.from({ length: BOARD_SIZE }, () => '')
        );
      },
    },
    // Дополнительное поле для сообщения хода (опционально)
    moveMessage: { type: String, default: '' },
    // Дополнительные поля, например, дата создания, можно задать в опциях timestamps
  },
  { timestamps: true }
);

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
