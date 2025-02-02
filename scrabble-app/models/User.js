// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // будет храниться хеш пароля
  role: { type: String, default: 'player' }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
