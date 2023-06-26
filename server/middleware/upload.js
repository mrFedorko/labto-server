import multer from 'multer';


const fileStorageEng = (path) =>{
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path);
        },
        filename: (req, file , cb) => {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
            cb(null, req.params.itemId +  ' -- ' + file.originalname);
        },
    }); 
}





export const uploadMW =  multer({storage: fileStorageEng('./docs'), limits: { fileSize: 10485760 }});
export const uploadEquipmentPassportMW =  multer({storage: fileStorageEng('./docs/equipment/passport'), limits: { fileSize: 10485760 }});
export const uploadEquipmentManualMW =  multer({storage: fileStorageEng('./docs/equipment/manual'), limits: { fileSize: 10485760 }});
export const uploadEquipmentCertMW =  multer({storage: fileStorageEng('./docs/equipment/cert'), limits: { fileSize: 10485760 }});