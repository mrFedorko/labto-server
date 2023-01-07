import User from '../models/User.js';

export const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt.toString();
    
    const foundUser = await User.findOne({refreshToken});
    if(!foundUser) {
        res.clearCookie('jwt', refreshToken, {httpOnly: 'true', maxAge: 16*60*60*1000, secure: true,  sameSite:'None',});

        return res.sendStatus(204);
    }
    await foundUser.updateOne({refreshToken: ''})
    res.clearCookie('jwt', refreshToken, {httpOnly: 'true', maxAge: 16*60*60*1000, secure: true,  sameSite:'None',});
    return res.sendStatus(204);
    
}