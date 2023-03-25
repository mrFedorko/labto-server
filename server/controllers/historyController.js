import History from "../models/History.js";
import { roleValidation } from "../services/roleValidation.js";

export const handleGetHistory = async (req, res) => {
    const userId = req.userId
    console.log(userId)
    try {
        const history = await History.findOne({owner: userId})
        if(!history) res.status(400).json({message: 'not found', clientMessage: 'похоже, вы не совершали никаких действий'})
        const historyLength = history.history.length
        history.history = history.history.filter((item, index) => index >= historyLength - 4000)
        
        res.json({history})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }
}

export const handleGetUserHistory = async (req, res) => {
    if(!roleValidation(req, res, 'getUserHistory')) return;
    try {
        const {target} = req.params;
        const {startDate, endDate} = req.body
        const history = await History.findOne({owner: target})
        if(!history) return res.status(400).json({message: 'not found', clientMessage: 'похоже, этот пользователь не совершал никаких действий'})
        const periodHistory = history.history.filter(item => item.date >= new Date(startDate) && item.date <= new Date(endDate));
        if (periodHistory.length >= 5000) return res.status(400).json({message: 'too big data set', clientMessage: 'Набор данных слишком большой, попробуйте изменить параметры поиска'})
        res.json({history: periodHistory})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }
}

