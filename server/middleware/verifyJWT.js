import jwt from 'jsonwebtoken';
import  * as dotenv from 'dotenv'
dotenv.config()


const verifyJWT = (req, res, next) => {
    if (req.method === 'OPTIONS'){
        return next();
    };
    
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.sendStatus(401)
    };
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.sendStatus(403); // invalid
            req.userId = decoded.userId;
            req.userRole = decoded.userRole
            next();
        }
    )
} ;

export {verifyJWT};