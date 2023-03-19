import { unlink } from 'node:fs';
import path from "path";
import Column from '../models/Column.js';
import { roleValidation } from "../services/roleValidation.js";

export const handleUploadCol = async (req, res) => {
    
    if(!roleValidation(req, res, 'addColumn')) return;
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
        const column = await Column.findOne({itemId}) 

        if(!column) return res.status(400).json({ message: "couldnt upload", clientMessage: "ошибка при загрузке файла паспорта"});

        const fileName = req.body.fileName;
       
        if (`${itemId} -- ${fileName}` === column.passport){
            return res.sendStatus(200)
        }
        
        if (column.passport && !handleIsURL(column.passport)){
            const file = path.resolve('./docs/'+column.passport);
            unlink(file, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(file, ' was deleted'); 
                }             
            });
        }

        const name = `${itemId} -- ${fileName}`
        column.passport = name
        column.save();
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




