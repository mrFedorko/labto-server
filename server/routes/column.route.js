import { Router } from 'express';
import { handleAddColumn, handleChangeColumn, handleDeleteColumn, handleGetColumns, handleGetOneColumn, handleIsolateColumn, handleReturnColumn, handleTakeColumn } from '../controllers/columnController.js';
import { handleFavorite, handleUnfavorite } from '../controllers/favoriteController.js';
import { handleColPassport } from '../controllers/passportController.js';

const columnRouter = Router();

columnRouter.patch(
    '/isolate/:target/',
   handleIsolateColumn
);

columnRouter.delete(
    '/delete/:target/',
    handleDeleteColumn
)
columnRouter.patch(
    '/change/:target/',
    handleChangeColumn
)
columnRouter.patch(
    '/favorite/:target/',
    handleFavorite
)
columnRouter.patch(
    '/unfavorite/:target/',
    handleUnfavorite
)

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

columnRouter.get(
    '/getPassport/:target/',
    handleColPassport
)





export {columnRouter}