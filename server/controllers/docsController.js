import Reagent from "../models/Reagent.js";
import path from "path";
import Column from "../models/Column.js";
import Equipment from "../models/Equipment.js";

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

export const handleEquipmentPassport = async (req, res) => {
 
    try {

        const {target} = req.params;
        const equipment = await Equipment.findById(target);
        const passportName = equipment.passport;
        res.sendFile(path.resolve('./docs/equipment/passport/'+passportName))

    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при отправке документа',
        });
    }
}

export const handleEquipmentManual = async (req, res) => {
 
    try {

        const {target} = req.params;
        const equipment = await Equipment.findById(target);
        const manualName = equipment.manual
        res.sendFile(path.resolve('./docs/equipment/passport/'+manualName))

    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при отправке документа',
        });
    }
}

export const handleEquipmentCert = async (req, res) => {
 
    try {

        const {target} = req.params;
        const equipment = await Equipment.findById(target);
        const certName = equipment.cert;
        res.sendFile(path.resolve('./docs/equipment/cert/'+certName))

    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при отправке документа',
        });
    }
}