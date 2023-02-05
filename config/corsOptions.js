import { allowedOrigins } from './allowedOrigins.js';

export const corsOptions = {
    origin: (origin, cb) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            cb(null, true)
        } else {
            cb(new Error('Not allowed by CORS'));
        }
    } ,
    optionsSuccessStatus: 200,

}