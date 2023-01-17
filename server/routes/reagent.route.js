import { Router } from 'express';
import { handleIsolateReagent, handleDeleteReagent, handleGetReagents, handleAddReagent, handleTakeReagent, handleGetOneReagent, handleAddManyReagents,   } from '../controllers/reagentController.js';
import { handleFavoriteReagent, handleUnfavoriteReagent } from '../controllers/reagentUserController.js';

const reagentRouter = Router();

reagentRouter.post(
    '/isolate/:userId/:target/',
   handleIsolateReagent
);



reagentRouter.delete(
    '/delete/:userId/:target/',
    handleDeleteReagent
)

reagentRouter.get(
    '/getAll/:type/:isolate',
    handleGetReagents
)

reagentRouter.get(
    '/getOne/:target',
    handleGetOneReagent
)

reagentRouter.post(
    '/createOne/:userId/',
    handleAddReagent
)

reagentRouter.put(
    '/take/:userId/:target/',
    handleTakeReagent
)

reagentRouter.patch(
    '/favorite/:userId/:target/',
    handleFavoriteReagent
)

reagentRouter.patch(
    '/unfavorite/:userId/:target/',
    handleUnfavoriteReagent
)

reagentRouter.post(
    '/addMany/',
    handleAddManyReagents
)

// reagentRouter.post(
//     '/inuse/',
//     handleInUse
// )




export {reagentRouter}