import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import Chat from '../models/Chat.js';
import { verifyEmail } from '../services/verifyEmail.js';
import Note from '../models/Note.js';

export const handleNewUser = async (req, res) => {
    try {
        const errs = validationResult(req);
            if(!errs.isEmpty()){
                return res.status(400).json({
                    errs: errs.array(),
                    message: 'input data not valid',
                    clientMsg: 'Некорректные данные',
                });
            }
        const {email, password, name} = req.body;
        if (!email || !password || !name) {
            return res.status(400)
            .json({
                message: 'enter all required data',
                clientMessage: 'Не все данные введены',
            })
        }
        const candidate = await User.findOne({email});
        if(candidate) return res.status(409)
        .json({
            message: 'user with such email has already existed',
            clientMessage: 'Такой пользователь уже существует',
        });

        const hashedPassword = await bcrypt.hash(password, 6);
        const verificationKey =  (await bcrypt.hash(`${Date.now()}`, 6)).replace(/\//g,'')
        const newUser = new User({email, settings: {name}, password: hashedPassword, verificationKey});

        // sending verification email

    

        verifyEmail(email, verificationKey).catch(console.log('error'))
        
        // saving new unverified user
        const newChat = new Chat({owner: newUser.id})
        const newNotes = new Note({owner: newUser.id, notes: [{
            text: 'Поздравляем с регистрацией на нашем сайте! При возникновении проблем, вы можете обратиться в поддержку по общему телефону или в live-чате в разделе "Помощь"',
            date: Date.now(),
            isNew: true,
            deleted: false,
            like: false
        }
        ]})
        newUser.save();
        newChat.save();
        newNotes.save();
        res.status(201)
        .json({
            message: 'user was created', 
            clientMessage: 'Аккаунт создан. Активируйте его по ссылке, отправленной на ваш e-mail',
        });     

    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
    }
}


