import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import config from 'config'
import { handleHistory } from '../services/historyAdd.js';

export const handleLogin = async (req, res) => {
    try {
        const {email, password} = await req.body;
        if (!email || !password) {
            return res.status(400).json({message: "email and/or password required", clientMessage: "Введите данные для входа (e-mail и пароль)"});
        }

        const foundUser = await User.findOne({email});
        if(!foundUser) {
            return res.status(401).json({message: "no user with such email", clientMessage: "Некорректные данные для входа (e-mail или пароль)"});
        }
        // const isPassword = await bcrypt.compare(password, foundUser.password);
        const isPassword = (password === foundUser.password)
        if(!foundUser.verified){
            return res.status(401).json({message: "not verified", clientMessage: "Учетная запись не активирована"});
        }

        if (foundUser && isPassword){
/////////// JWTS CREATION
            const accessToken = jwt.sign({
                userId: foundUser.id,
                userRole: foundUser.role,
            }, 
            config.get('ACCESS_TOKEN_SECRET'),
            {expiresIn: '20m'});

            const refreshToken = jwt.sign({
                userId: foundUser.id,
                userRole: foundUser.role
            }, 
            config.get('REFRESH_TOKEN_SECRET'),
            {expiresIn: '15h'});

/////////// overwrite refresh token into Mongo

            await foundUser.updateOne({refreshToken: refreshToken.toString()})

/////////// saving accessToken & sending response
            res.cookie('jwt', refreshToken, {httpOnly: 'true', maxAge: 16*60*60*1000, secure: true,  sameSite:'None',});

            const {role, name, direction, department, position, favorite, id} = foundUser

            res.json({accessToken, refreshToken, userId: foundUser.id, role, favorite, name, direction, department, position, message: 'Successfully', clientMessage: 'Приветствуем!'})
            handleHistory(id, {target:id}, 'enterSystem')
        } else {
            return res.status(400).json({message: 'wrong data during login', clientMessage: 'Не верные данные при авторизации'});
        }
    } catch (error) {
        res.status(500).json({message: 'server side error during login', clientMessage: 'Ошибка сервера, обратитесь в поддержку'});
    }
};

