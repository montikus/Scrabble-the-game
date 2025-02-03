// models/Word.js
import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true },
});

export default mongoose.models.Word || mongoose.model('Word', WordSchema);
