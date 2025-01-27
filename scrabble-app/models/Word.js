// models/Word.js
import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true },
  // возможно, язык, сложность, очки и т.п.
});

export default mongoose.models.Word || mongoose.model('Word', WordSchema);

// Доделать функцию, добавить словарь. 