import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../models/User.js';

export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) {
        return res.sendStatus(401)
    };
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken: refreshToken.toString()});
    if(!foundUser) {console.log('no user found'); return res.sendStatus(403); };
    // validate jwt
    jwt.verify(
        refreshToken,
        config.get('REFRESH_TOKEN_SECRET'),
        (err, decoded) => {
            if (err || foundUser.id !== decoded.userId){
                return res.sendStatus(403);
            };
            const accessToken = jwt.sign(
                {userId: decoded.userId},
                config.get('ACCESS_TOKEN_SECRET'),
                {expiresIn: '40m'}
            );
            res.json({accessToken})
        } 
    )
}