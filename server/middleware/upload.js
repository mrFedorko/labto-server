import multer from 'multer';


const fileStorageEng = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './docs');
    },
    filename: (req, file , cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        cb(null, req.params.itemId +  ' -- ' + file.originalname);
    },
});




export const uploadMW =  multer({storage: fileStorageEng, limits: { fileSize: 10485760 }});