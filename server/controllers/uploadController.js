import Reagent from "../models/Reagent.js";
import { unlink } from 'node:fs';
import path from "path";
import { roleValidation } from "../services/roleValidation.js";

export const handleUpload = async (req, res) => {
    
    roleValidation(req, res, 'addReag')
    const handleIsURL = (str) =>  {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    // 
    try{
        const {itemId} = req.params
        const reagent = await Reagent.findOne({itemId}) 

        if(!reagent) return res.status(400).json({ message: "couldnt upload", clientMessage: "ошибка при загрузке файла паспорта"});
        const fileName = req.body.fileName
        console.log(handleIsURL(reagent.passport))
        if (reagent.passport && handleIsURL(reagent.passport)){
            const file = path.resolve('./docs/'+reagent.passport)
            unlink(file, (err) => {
            if (err) throw err;
            console.log(file, ' was deleted');
            });
        }
        
        const name = `${itemId}--${fileName}`
        reagent.passport = name
        reagent.save();
        res.json({message: 'uploaded'})

    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
    }
}




