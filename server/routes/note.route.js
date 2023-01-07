import { Router } from 'express';
import { handleDeleteNote, handleGetNotes, handleLikeNote, handleRecentNote, handleSendNote } from '../controllers/noteController.js';

const notesRouter = Router();

notesRouter.get(
    '/get/:id',
    handleGetNotes
);

notesRouter.post(
    '/post/:id',
    handleSendNote
)

notesRouter.post(
    '/update/like/:id/:target',
    handleLikeNote
)

notesRouter.post(
    '/update/delete/:id/:target',
    handleDeleteNote
)

notesRouter.post(
    '/update/recent/:id/:target',
    handleRecentNote
)

export {notesRouter}