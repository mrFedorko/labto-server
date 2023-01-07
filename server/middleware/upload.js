import multer from 'multer';


const fileStorageEng = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './layouts');
    },
    filename: (req, file , cb) => {
        cb(null, req.params.id + '_' + req.params.date  + '--' + file.originalname);
    },
});




export const uploadMW =  multer({storage: fileStorageEng});