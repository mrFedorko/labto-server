import Settings from "../models/Settings.js";
import { roleValidation } from "../services/roleValidation.js";


export const handlegeIsService = async (req, res) => {
    if(!roleValidation(req, res, 'adminAction')) {return};
    try {
        const service = await Settings.findOne({name: 'service'});
        if (!service) return res.status(400).json({message: 'error', clientMessage: 'Ошибка сервера, обратитесь в поддержку'})
        res.json({message: 'success', serviceStatus: service.status})
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
} 

export const handlegeStartService = async (req, res) => {
    if(!roleValidation(req, res, 'adminAction')) {return};
    try {
        const service = await Settings.findOne({name: 'service'});
        if (!service) return res.status(400).json({message: 'error', clientMessage: 'Ошибка сервера, обратитесь в поддержку'})
        service.status = true;
        console.log('start service')
        await service.save();
        res.json({message: 'success', clientMessage: 'Работа приложения для пользователей остановлена'})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
} 
export const handlegeStopService = async (req, res) => {
    if(!roleValidation(req, res, 'adminAction')) {return};
    try {
        const service = await Settings.findOne({name: 'service'});
        if (!service) return res.status(400).json({message: 'error', clientMessage: 'Ошибка сервера, обратитесь в поддержку'})
        service.status = false;
        console.log('stop service')

        await service.save();
        res.json({message: 'success', clientMessage: 'Приложение запущено для пользователей'})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
} 