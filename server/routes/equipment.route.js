import { Router } from 'express';
import { handleAddEquipment, handleChangeEquipment, handleGetAllEquipment, handleGetOneEquipment, handleLog, handleStatusEquipment, handleTrain, handleVerifyEquipment } from '../controllers/euipmentController.js';
import { handleEquipmentCert, handleEquipmentManual, handleEquipmentPassport } from '../controllers/docsController.js';
import { handleFavorite, handleUnfavorite } from '../controllers/favoriteController.js';

const equipmentRouter = Router();

equipmentRouter.post(
    '/add/',
   handleAddEquipment
);

equipmentRouter.get(
    '/getAll/:type',
    handleGetAllEquipment
);

equipmentRouter.get(
    '/getOne/:target',
    handleGetOneEquipment
);

equipmentRouter.patch(
    '/change/:target',
    handleChangeEquipment
);

equipmentRouter.patch(
    '/verify/:target',
    handleVerifyEquipment
);
equipmentRouter.patch(
    '/train/:target',
    handleTrain
);
equipmentRouter.patch(
    '/log/:target',
    handleLog
);
equipmentRouter.patch(
    '/status/:target',
    handleStatusEquipment
);

equipmentRouter.get(
    '/getPassport/:target/',
    handleEquipmentPassport
)

equipmentRouter.get(
    '/getManual/:target/',
    handleEquipmentManual
)

equipmentRouter.get(
    '/getCert/:target/',
    handleEquipmentCert
)
equipmentRouter.patch(
    '/favorite/:target/',
    handleFavorite
)
equipmentRouter.patch(
    '/unfavorite/:target/',
    handleUnfavorite
)




export {equipmentRouter}