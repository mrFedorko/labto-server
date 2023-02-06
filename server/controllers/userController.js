import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { handleHistory } from '../services/historyAdd.js';
import { roleValidation } from "../services/roleValidation.js"

export const handleAddUser = async (req, res) => {
    roleValidation(req, res, "addUser")
    const {userId} = req;
    try {
        const { email, password, name, direction, department, position, role, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 6);
        if(!(email, password, name, direction, department, position, role)){
            return res.status(400).json({message: 'error', clientMessage: 'Ошибка. Не все данные заполнены'})
        }
        const foundUser = await User.findOne({email});
        if(foundUser) return res.status(400).json({message: 'error', clientMessage: 'Поле e-mail должно быть уникальным'});
        const newUser = new User({email, password: hashedPassword, name, phone, role, position, department, direction});
        await newUser.save();
        await handleHistory(userId, {itemId: phone, name}, 'addUser');
        res.status(201).json({mesage: 'created', clientMessage: 'Пользователь создан'})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при создании пользователя',
        });
    }
} 

