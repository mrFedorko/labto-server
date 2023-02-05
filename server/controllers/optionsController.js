import Option from "../models/Option.js"
import User from "../models/User.js"
import { roleValidation } from "../services/roleValidation.js"

export const handleGetUsers = async (req, res) => {
    try {
        const users = await User.find({}, ['name', 'phone', 'direction', 'department', 'position', 'role', 'email'])
        if(!users)return res.sendStatus(400)
        res.json({message: 'success', users})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'не удается загрузить пользователей',
        });
    }
}

export const handleGetOptions = async (req, res) => {
    try {
        const options = await Option.find({});
        if (!options) { return res.sendStatus(500)}
        const hasRsType = options.filter(item=> item.name === "rsType");
        const hasManufacturer = options.filter(item=> item.name === "manufacturer");

        if(!hasRsType.length || !hasManufacturer.length){
            return res.status(500).json({message: 'error', clientMessage: 'Ошибка базы данных. Обратитесь в поддержку'})
        }
        res.json({message: 'success', options})
        
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
        });
    }
} ;

export const handleAddOption = async (req, res) => {
    roleValidation(req, res, 'addOption')

    try {
        const {name, option} = req.body;
        const target = await Option.findOne({name})
        if(!target){
            const newOption = new Option({name, options: [option]});
            await newOption.save();
            return res.status(201).json({message: 'created', clientMessage: 'Опция успешно добавлена'});
        }
        if(target.options.includes(option)){
            res.status(400).json({message: 'forbidden', clientMessage: 'Ошибка: вы пытаетесь добавить опцию, которая уже существует'});
        }
        target.options.push(option)
        await target.save();
        res.json({message: 'success', clientMessage: 'Опция успешно добавлена'});
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера'
        });
    }
}

export const handleDeleteOption = async (req, res) => {
    roleValidation(req, res, 'deleteOption')

    try {
        const {name, option} = req.body;
        const target = await Option.findOne({name})
        if(!target.options.includes(option)){
            res.status(400).json({message: 'forbidden', clientMessage: 'Ошибка: возможно кто-то удалил эту опцию до вас. Перезагрузите приложение и попробуйте снова'});
        }
        target.options = target.options.filter(item=>item.value !== option.value)
        await target.save();
        res.json({message: 'success', clientMessage: 'Опция успешно удалена'});
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера'
        });
    }
}