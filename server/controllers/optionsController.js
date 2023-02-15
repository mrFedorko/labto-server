import Option from "../models/Option.js"
import User from "../models/User.js"
import { roleValidation } from "../services/roleValidation.js"
import { handleHistory } from "../services/historyAdd.js";

const stringifyОptionName = (type = '') => {
    switch (type) {
        case 'manufacturer':
            return 'производитель';
        case 'position':
            return 'должность';
        case 'direction':
            return 'отдел';
        case 'rsType':
            return 'тип стандарта';
        case 'department':
            return 'управление';
        default:
            return ''
    }
}

export const handleGetUsers = async (req, res) => {
    try {
        const users = await User.find({active: true}, ['name', 'phone', 'direction', 'department', 'position', 'role', 'email'])
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
export const handleGetUnactiveUsers = async (req, res) => {
    const {userId} = req
    try {
        const unactiveUsers = await User.find({active: false}, ['name', 'phone', 'direction', 'department', 'position', 'role', 'email'])
        if(!unactiveUsers)return res.sendStatus(400)
        res.json({message: 'success', unactiveUsers})
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
    if(!roleValidation(req, res, 'addOption')) return;
    const {userId} = req

    try {
        const {name, option} = req.body;
        const target = await Option.findOne({name})
        if(!target){
            const newOption = new Option({name, options: [option]});
            await newOption.save();
            return res.status(201).json({message: 'created', clientMessage: 'Опция успешно добавлена'});
        }
        if(target.options.filter(item => item.label.toLowerCase() === option.label.toLowerCase()).length){
         return  res.status(400).json({message: 'forbidden', clientMessage: 'Ошибка: вы пытаетесь добавить опцию, которая уже существует'});
        }
        target.options.push(option)
        await target.save();
        await handleHistory(userId, {name: stringifyОptionName(name), itemId: option.label}, 'addOption')

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
    if(!roleValidation(req, res, 'deleteOption')) return;
    const {userId} = req;

    try {
        const {name, option} = req.body;
        const {target} = req.params;
        const targetOption = await Option.findOne({name})
        if(!targetOption) return res.sendStatus(400);

        targetOption.options = targetOption.options.filter(item => item.value !== option.value);
        targetOption.save();
        await handleHistory(userId, {name: stringifyОptionName(name), itemId: option.label}, 'deleteOption')
        res.json({message: 'deleted', clientMessage: 'Опция удалена'})
        
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера'
        });
    }
}


