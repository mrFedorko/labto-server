import { Router } from 'express';
import { handleAddColumn, handleGetColumns, handleGetOneColumn, handleReturnColumn, handleTakeColumn } from '../controllers/columnController.js';
import { handlePassport } from '../controllers/passportController.js';

const columnRouter = Router();

// columnRouter.patch(
//     '/isolate/:target/',
//    handleIsolateReagent
// );



// columnRouter.delete(
//     '/delete/:target/',
//     handleDeleteReagent
// )

columnRouter.get(
    '/getAll/:type/:isolate',
    handleGetColumns
)

columnRouter.get(
    '/getOne/:target',
    handleGetOneColumn
)

columnRouter.post(
    '/createOne/',
    handleAddColumn
)

columnRouter.patch(
    '/take/:target/',
    handleTakeColumn
)

columnRouter.put(
    '/return/:target/',
    handleReturnColumn
)

// columnRouter.patch(
//     '/unfavorite/:target/',
//     handleUnfavoriteReagent
// )

// columnRouter.post(
//     '/addMany/',
//     handleIsolate
// )

// columnRouter.patch(
//     '/change/:target/',
//     handleChangeReagent
// )

// columnRouter.get(
//     '/getPassport/:target/',
//     handlePassport
// )




export {columnRouter}