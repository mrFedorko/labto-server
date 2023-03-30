import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import  * as dotenv from 'dotenv'
dotenv.config()


export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) {
        console.log('no cookies');
        console.log('cookies: ',cookies)
        return res.sendStatus(401);
       
    };
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken: refreshToken.toString()});
    if(!foundUser) return res.sendStatus(403); 
    // validate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.id !== decoded.userId){
                return res.sendStatus(403);
            };
            const accessToken = jwt.sign(
                {userId: decoded.userId, userRole: decoded.userRole},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '20m'}
            );
            res.json({
                accessToken, 
                userId: foundUser.id, 
                role: foundUser.role, 
                favorite: foundUser.favorite, 
                name : foundUser.name,
                direction : foundUser.direction,
                department : foundUser.department,
                position : foundUser.position,
            })
        } 
    )
}