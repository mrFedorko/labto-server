
import User from '../models/User.js';


export const handleGetSettings = async (req, res) =>{
    try {
        const user = await User.findById(req.params.id);
        return res.json(user.settings);
    } catch (error) {
        res.status(500).json({message: 'server side error during get settings data', clientMessage: 'Не удается получить настройки пользователя'});
    }
} 

export const handleSetSettings = async (req, res) =>{
    try {
        const user = await User.findById(req.params.id);
        const {name, adress, phone, entity, entityName, TIN, OGRN, check, corCheck, bank, BIK} =  await req.body;
        await user.updateOne({settings: {name, adress, phone, entity, entityName, TIN, OGRN, check, corCheck, bank, BIK}});
        res.status(200).json({message: 'user was modified', clientMessage: 'Настройки успешно сохранены'});
    } catch (error) {
        res.status(500).json({message: 'server side error during get settings data', clientMessage: 'Серверная ошибка, обратитесь в поддержку'});
    }
} 

