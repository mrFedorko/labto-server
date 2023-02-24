import bcrypt from 'bcryptjs';
import History from '../models/History.js';
import User from '../models/User.js';
import { handleHistory } from '../services/historyAdd.js';
import { handleIsRole } from '../services/optionsValidation.js';
import { roleValidation } from "../services/roleValidation.js"

export const handleAddUser = async (req, res) => {
    if(!roleValidation(req, res, 'addUser')) {return};
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

export const handleChangeCredentials = async (req, res) => {
    if(!roleValidation(req, res, 'changeUser')) return;
    try {
        const {userId} = req;
        const {email, password} = req.body;
        const {target} = req.params;
        const user = await User.findById(target);
        if (!user) return res.status(400).json({message: 'error', clientMessage: 'Пользователь не найден'})
        const name = user.name
        user.email = email;
        user.password = await bcrypt.hash(password, 6);
        await user.save();
        await handleHistory(userId, {name}, 'changeUser')
        res.json({mesage: 'changed', clientMessage: 'Данные для входа изменены'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении пользователя',
        });
    }
} 

export const handleChangeRole = async (req,res) => {
    if(!roleValidation(req, res, 'changeUser')) return;
    try {
        const {userId} = req;
        const {newRole} = req.body;
        const {target} = req.params;
        if(userId === target) return res.status(400).json({message: 'error', clientMessage: 'Изменить Ваши права может только другой администратор'});
        handleIsRole(req, res, newRole)
        const user = await User.findById(target);
        if (!user) return res.status(400).json({message: 'error', clientMessage: 'Пользователь не найден'});
        const name = user.name
        user.role = newRole;
        await user.save();
        await handleHistory(userId, {name}, 'changeUser')
        res.json({mesage: 'changed', clientMessage: 'Права пользователя изменены'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении пользователя',
        });
    }
}

export const handleChangeUserData = async (req,res) => {
    if(!roleValidation(req, res, 'changeUser')) return;
    try {
        const {userId} = req;
        const {newName, newDirection, newDepartment, newPosition, newPhone} = req.body;
        const {target} = req.params;
        const user = await User.findById(target);
        if (!user) return res.status(400).json({message: 'error', clientMessage: 'Пользователь не найден'});
        const name = user.name
        user.name = newName;
        user.position = newPosition;
        user.direction = newDirection;
        user.department = newDepartment;
        user.phone = newPhone;
        await user.save();
        await handleHistory(userId, {name}, 'changeUser')
        res.json({mesage: 'changed', clientMessage: 'Учетные данные пользователя изменены'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении пользователя',
        });
    }
}
export const handleUnactiveUser = async (req,res) => {
    if(!roleValidation(req, res, 'changeUser')) return;
    try {
        const {userId} = req;
        const {target} = req.params;
        const user = await User.findById(target);
        if (!user) return res.status(400).json({message: 'error', clientMessage: 'Пользователь не найден'});
        const name = user.name
        user.active = false;
        
        await user.save();
        await handleHistory(userId, {name}, 'changeUser')
        res.json({mesage: 'changed', clientMessage: 'Пользователь деактивирован'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении пользователя',
        });
    }
}
export const handleActiveUser = async (req,res) => {
    if(!roleValidation(req, res, 'changeUser')) return;
    try {
        const {userId} = req;
        const {target} = req.params;
        const user = await User.findById(target);
        if (!user) return res.status(400).json({message: 'error', clientMessage: 'Пользователь не найден'});
        const name = user.name
        user.active = true;
        
        await user.save();
        await handleHistory(userId, {name}, 'changeUser')
        res.json({mesage: 'changed', clientMessage: 'Пользователь активирован'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении пользователя',
        });
    }
}
export const handleDeleteUser = async (req,res) => {
    if(!roleValidation(req, res, 'deleteUser')) return;
    try {
        const {userId} = req;
        const {target} = req.params;
        const user = await User.findById(target);
        const history = await History.findOne({owner: target})
        if (!user) return res.status(400).json({message: 'error', clientMessage: 'Пользователь не найден'});
        const name = user.name
        const id = user._id
       
        await user.delete();
        if (history) await history.delete();
        await handleHistory(userId, {name}, 'deleteUser')
        res.json({mesage: 'changed', clientMessage: 'Пользователь удален'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при удалении пользователя',
        });
    }
}

