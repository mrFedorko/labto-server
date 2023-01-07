import jwt from 'jsonwebtoken';
import config from 'config';

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
        config.get('ACCESS_TOKEN_SECRET'),
        (err, decoded) => {
            if(err) return res.sendStatus(403); // invalid
            req.userId = decoded.userId
            next();
        }
    )
} ;

export {verifyJWT};