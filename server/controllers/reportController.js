import Reagent from "../models/Reagent.js";
import { roleValidation } from "../services/roleValidation.js";


export const handleCreateProjectReport = async (req, res) => {
    if(!roleValidation(req, res, 'createReport')) return;
    try {
        const {startDate, endDate, destination} = req.body;
        const dStartDate = new Date(startDate);
        const reags = await Reagent.find({isolateDate: {$gte:dStartDate},})
        const result = [];
        if(!reags.length) {return res.status(400).json({message: 'error', clientMessage: 'Не удается найти рективы'})};
        reags
        .forEach(item=>{
            const {isolateDate, itemId, name, price, container, type} = item;
            item.inUse.forEach(usage => {
                const {date, name: userName, quan, test} = usage
                if(usage.destination === destination && 
                    (new Date(date)) < (new Date(endDate)) && 
                    (new Date(date)) > (new Date(startDate)) &&
                    (new Date(date)) < (new Date(isolateDate))
                    ){
                        const usagePrice = (Math.ceil(price/container*quan*100))/100;
                    result.push({
                        itemId,
                        type,
                        name,
                        userName,
                        quan,
                        test,
                        date,
                        price: usagePrice,
                    })
                }
            })
        })
        
        res.json({result, message: 'ok', clientMessage: 'Данные получены, загрузка отчета'})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }

}