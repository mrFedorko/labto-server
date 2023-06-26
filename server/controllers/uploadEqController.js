import { unlink } from 'node:fs';
import path from "path";
import Equipment from '../models/Equipment.js';
import { roleValidation } from "../services/roleValidation.js";

export const handleUploadEqPassport = async (req, res) => {
    
    if(!roleValidation(req, res, 'addEquipment')) return;
    const handleIsURL = (str) =>  {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    try{
        const {itemId} = req.params
        const equipment = await Equipment.findOne({itemId}) 

        if(!equipment) return res.status(400).json({ message: "couldnt upload", clientMessage: "ошибка при загрузке файла паспорта"});

        const fileName = req.body.fileName;
       
        if (`${itemId} -- ${fileName}` === equipment.passport){
            return res.sendStatus(200)
        }
        
        if (equipment.passport && !handleIsURL(equipment.passport)){
            const file = path.resolve('./docs/equipment/passport/'+equipment.passport);
            unlink(file, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(file, ' was deleted'); 
                }             
            });
        }

        const name = `${itemId} -- ${fileName}`
        equipment.passport = name
        equipment.save();
        res.json({message: 'uploaded'})

    } catch (error) {
        res.status(500)
        console.log(error)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при загрузке пасспорта',
        });
    }
}

export const handleUploadEqManual = async (req, res) => {
    
    if(!roleValidation(req, res, 'addEquipment')) return;
    const handleIsURL = (str) =>  {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    try{
        const {itemId} = req.params
        const equipment = await Equipment.findOne({itemId}) 

        if(!equipment) return res.status(400).json({ message: "couldnt upload", clientMessage: "ошибка при загрузке файла инструкции"});

        const fileName = req.body.fileName;
       
        if (`${itemId} -- ${fileName}` === equipment.manual){
            return res.sendStatus(200)
        }
        
        if (equipment.passport && !handleIsURL(equipment.manual)){
            const file = path.resolve('./docs/equipment/manual/'+equipment.manual);
            unlink(file, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(file, ' was deleted'); 
                }             
            });
        }

        const name = `${itemId} -- ${fileName}`
        equipment.manual = name
        equipment.save();
        res.json({message: 'uploaded'})

    } catch (error) {
        res.status(500)
        console.log(error)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при загрузке инструкции',
        });
    }
}
export const handleUploadEqCert = async (req, res) => {
    
    if(!roleValidation(req, res, 'addEquipment')) return;
    const handleIsURL = (str) =>  {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    try{
        const {itemId} = req.params
        const equipment = await Equipment.findOne({itemId}) 

        if(!equipment) return res.status(400).json({ message: "couldnt upload", clientMessage: "ошибка при загрузке файла инструкции"});

        const fileName = req.body.fileName;
       
        if (`${itemId} -- ${fileName}` === equipment.cert){
            return res.sendStatus(200)
        }
        
        if (equipment.cert && !handleIsURL(equipment.cert)){
            const file = path.resolve('./docs/equipment/cert/'+equipment.cert);
            unlink(file, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(file, ' was deleted'); 
                }             
            });
        }

        const name = `${itemId} -- ${fileName}`
        equipment.cert = name
        equipment.save();
        res.json({message: 'uploaded'})

    } catch (error) {
        res.status(500)
        console.log(error)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при загрузке сертификата',
        });
    }
}




