import { Router } from 'express';
import { handleGetCases, handlePostCases } from '../controllers/casesController.js';


const casesRouter = Router();

casesRouter.get(
    '/getall',
    handleGetCases
);

casesRouter.get(
    '/get/:id'
)

casesRouter.post(
    '/post/3474213675/array',
    handlePostCases
)


export {casesRouter}