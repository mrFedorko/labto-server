import { Router } from 'express';
import { handleDeleteDraft, handleDraftReagent, handleGetDrafts } from "../controllers/draftController.js";

const draftRouter = Router();

draftRouter.post(
    '/add/',
   handleDraftReagent
);

draftRouter.get(
    '/getAll/',
    handleGetDrafts
)

draftRouter.delete(
    '/delete/:target',
    handleDeleteDraft
)


export {draftRouter}