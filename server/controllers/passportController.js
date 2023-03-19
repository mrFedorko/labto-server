import Reagent from "../models/Reagent.js";
import path from "path";
import Column from "../models/Column.js";

export const handlePassport = async (req, res) => {
 
    try {

        const {target} = req.params;
        const column = await Reagent.findById(target);
        const passportName = column.passport
        res.sendFile(path.resolve('./docs/'+passportName))

    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при отправке документа',
        });
    }
}

export const handleColPassport = async (req, res) => {
 
    try {

        const {target} = req.params;
        const column = await Column.findById(target);
        const passportName = column.passport;
        res.sendFile(path.resolve('./docs/'+passportName))

    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при отправке документа',
        });
    }
}