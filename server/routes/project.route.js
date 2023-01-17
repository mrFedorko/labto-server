import { Router } from 'express';
import { handleAddProject, handleGetProjects } from '../controllers/projectController.js';

const projectRouter = Router();

projectRouter.post(
    '/addProject/:userId/',
    handleAddProject
);

projectRouter.get(
    '/getProjects/',
    handleGetProjects
)




export {projectRouter}