import { Router } from 'express';
import { handleAddProject, handleChangeProject, handleCloseProject, handleDeleteProject, handleGetProjects } from '../controllers/projectController.js';

const projectRouter = Router();

projectRouter.post(
    '/addProject/',
    handleAddProject
);

projectRouter.get(
    '/getProjects/:closed',
    handleGetProjects
)
projectRouter.patch(
    '/close/:target/',
    handleCloseProject
)
projectRouter.delete(
    '/deleteOne/:target',
    handleDeleteProject
)
projectRouter.patch(
    '/changeOne/:target',
    handleChangeProject
)





export {projectRouter}