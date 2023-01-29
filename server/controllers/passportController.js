import Reagent from "../models/Reagent.js";
import path from "path";

export const handlePassport = async (req, res) => {
 
    try {

        const {target} = req.params;
        const reagent = await Reagent.findById(target);
        const passportName = reagent.passport
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