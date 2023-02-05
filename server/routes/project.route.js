import { Router } from 'express';
import { handleAddProject, handleGetProjects } from '../controllers/projectController.js';

const projectRouter = Router();

projectRouter.post(
    '/addProject/',
    handleAddProject
);

projectRouter.get(
    '/getProjects/:closed',
    handleGetProjects
)




export {projectRouter}