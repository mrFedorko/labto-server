import History from "../models/History.js";
import { roleValidation } from "../services/roleValidation.js";

export const handleGetHistory = async (req, res) => {
    const userId = req.userId
    console.log(userId)
    try {
        const history = await History.findOne({owner: userId})
        if(!history) res.status(400).json({message: 'not found', clientMessage: 'похоже, вы не соверщали никаких действий'})
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
        const history = await History.findOne({owner: target})
        if(!history) res.status(400).json({message: 'not found', clientMessage: 'похоже, этот пользователь не соверщали никаких действий'})
        res.json({history})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }
}

