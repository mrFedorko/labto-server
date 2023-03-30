import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { handleHistory } from '../services/historyAdd.js';
import  * as dotenv from 'dotenv'
import { handleCookieOptions } from '../services/cookieOptions.js';
dotenv.config()


export const handleLogin = async (req, res) => {
    
    const cookieOptions = handleCookieOptions();
    
    try {
        const {email, password} = await req.body;
        if (!email || !password) {
            return res.status(400).json({message: "email and/or password required", clientMessage: "Enter credentials (login and password)"});
        }

        const foundUser = await User.findOne({email});
        if(!foundUser) {
            return res.status(401).json({message: "no user with such email", clientMessage: "Incorrect credentials (Login or password)"});
        }
        const isPassword = await bcrypt.compare(password, foundUser.password);

        if(!foundUser.active){
            return res.status(401).json({message: "not verified", clientMessage: "The account is not activated"});
        }

        if (foundUser && isPassword){
/////////// JWTS CREATION
            const accessToken = jwt.sign({
                userId: foundUser.id,
                userRole: foundUser.role,
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '20m'});

            const refreshToken = jwt.sign({
                userId: foundUser.id,
                userRole: foundUser.role
            }, 
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '15h'});

/////////// overwrite refresh token into Mongo

            await foundUser.updateOne({refreshToken: refreshToken.toString()})

/////////// saving accessToken & sending response
            res.cookie('jwt', refreshToken, handleCookieOptions());

            const {role, name, direction, department, position, favorite, id, phone} = foundUser

            res.json({accessToken, userId: foundUser.id, role, favorite, name, direction, department, position, phone,  message: 'Successfully', clientMessage: 'Приветствуем!'})
            handleHistory(id, {itemId: req.userIp, name}, 'enterSystem')
        } else {
            return res.status(400).json({message: 'wrong data during login', clientMessage: 'Not correct data when authorizing'});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error during login', clientMessage: 'Server error, contact support'});
    }
};

