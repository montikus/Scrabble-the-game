// models/Game.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const GameSchema = new mongoose.Schema({
  status: { type: String, default: 'pending' },
  players: [{ type: String }],
  messages: [MessageSchema],
}, { timestamps: true });

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
