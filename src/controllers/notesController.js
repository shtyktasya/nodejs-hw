import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { tag, search, page = 1, perPage = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(perPage);
  const filter = {};

  if (tag) {
    filter.tag = tag;
  }
  if (search) {

    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];

  }
  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter).skip(skip).limit(Number(perPage)),
  ]);
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    notes,
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(note);
};
