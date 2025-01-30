// models/Game.js
import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  status: { type: String, default: 'pending' }, // pending, in-progress, finished
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  currentPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Move' }],
  // Дополнительные поля (дата начала, счёт, etc.)
}, { timestamps: true });

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
