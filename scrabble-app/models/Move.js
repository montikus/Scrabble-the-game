// models/Move.js
import mongoose from 'mongoose';

const MoveSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  word: { type: String, required: true },  // Слово, которое выложил игрок
  position: {
    row: Number,
    col: Number,
  },
  points: Number, // Количество очков, заработанных за ход
}, { timestamps: true });

export default mongoose.models.Move || mongoose.model('Move', MoveSchema);
