import mongoose, { Schema } from 'mongoose';
import { TAGS } from '../constants/tags.js';
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: '',
      trim: true,
    },

    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Note = mongoose.model('Note', noteSchema, 'notes');
export default Note;
