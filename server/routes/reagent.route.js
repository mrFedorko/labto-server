import { Router } from 'express';
import { handlePassport } from '../controllers/passportController.js';
import { handleIsolateReagent, handleDeleteReagent, handleGetReagents, handleAddReagent, handleTakeReagent, handleGetOneReagent, handleAddManyReagents, handleChangeReagent,   } from '../controllers/reagentController.js';
import { handleFavoriteReagent, handleUnfavoriteReagent } from '../controllers/reagentUserController.js';

const reagentRouter = Router();

reagentRouter.patch(
    '/isolate/:target/',
   handleIsolateReagent
);



reagentRouter.delete(
    '/delete/:target/',
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
    '/createOne/',
    handleAddReagent
)

reagentRouter.put(
    '/take/:target/',
    handleTakeReagent
)

reagentRouter.patch(
    '/favorite/:target/',
    handleFavoriteReagent
)

reagentRouter.patch(
    '/unfavorite/:target/',
    handleUnfavoriteReagent
)

reagentRouter.post(
    '/addMany/',
    handleAddManyReagents
)

reagentRouter.patch(
    '/change/:target/',
    handleChangeReagent
)

reagentRouter.get(
    '/getPassport/:target/',
    handlePassport
)




export {reagentRouter}