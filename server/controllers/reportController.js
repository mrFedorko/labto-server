import Column from "../models/Column.js";
import Reagent from "../models/Reagent.js";
import User from "../models/User.js";
import { roleValidation } from "../services/roleValidation.js";
import { createTimeStamp } from "../services/services.js";


export const handleCreateProjectReport = async (req, res) => {
    
    if(!roleValidation(req, res, "createReport")) return;
    try {

        const {startDate, endDate, project: destination} = req.body;

    
        const reags = await Reagent.find({isolateDate:{$gte: startDate},"inUse.destination.code" : destination.code});
        const columns = await Column.find({isolateDate:{$gte: startDate},"inUse.destination.code" : destination.code});

        const resultColumns = [];
        const resultReags = [];
        reags.filter(item => item.inUse.length)
        .forEach(item=>{
            const {isolateDate, itemId, name, price, container, type, units} = item;
            item.inUse.forEach((usage, index) => {

                const {date, name: userName, quan, test} = usage
                if(usage?.destination?.code === destination.code && 
                    date < (new Date(endDate)) && 
                    date > (new Date(startDate)) &&
                    date < isolateDate
                    ){
                    
                    resultReags.push({
                        itemId,
                        type,
                        name,
                        userName,
                        quan,
                        units,
                        test,
                        date,
                        price: (Math.ceil(price/container*quan*100))/100,
                    })
                } else {
                }
            })
        })


        columns.filter(item => item.inUse.length)
        .forEach(item=>{
            const { itemId, name, price, sn, type, totalInj} = item;
            item.inUse.forEach(usage => {
                const { userName, countInj, test, mobilePhase, fromDate, toDate} = usage
                if(
                    usage?.destination?.code === destination.code && 
                    (new Date(toDate)) <= (new Date(endDate)) && 
                    (new Date(toDate)) >= (new Date(startDate)) 
                
                ){ 
                    const usagePrice = (Math.ceil(price/40000*countInj*100))/100;
                    resultColumns.push({
                        itemId,
                        sn,
                        type,
                        name,
                        userName,
                        countInj,
                        test,
                        fromDate,
                        toDate,
                        price: usagePrice,
                        mobilePhase,
                    })
                }
            })
        })
        if(resultReags.length >10000 || resultColumns.length >10000) return res.status(400).json({message: 'tooLarge', clientMessage: 'Набор данных слишком большой. Попробуйте выбрать другой диапазон дат'})

        res.json({
            resultReags: resultReags.sort((a, b) => a.date - b.date), 
            resultColumns: resultColumns.sort((a, b) => a.fromDate - b.fromDate),  
            message: 'ok', 
            clientMessage: 'Данные получены, составление отчета',
        })

    } catch (error) {
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }

}

export const handleCreateDirectionReport = async (req, res) => {
    if(!roleValidation(req, res, "createReport")) return;

    try {
        const {startDate, endDate, direction} = req.body;
        const users = await User.find({direction})
        const currentUsers = users.map(item => item._id.toString())


        const reags = await Reagent.find({isolateDate: {$gte: new Date(startDate)},});
        const columns = await Column.find({isolateDate: {$gte: new Date(startDate)},});

        const resultColumns = [];
        const resultReags = [];

        reags.filter(item => item.inUse.length)
        .forEach(item=>{
            const { itemId, name, price, container, type, units} = item;
            item.inUse.forEach(usage => {
                const {date, name: userName, userId, quan, test, destination} = usage
                if(currentUsers.includes(userId) && 
                    (new Date(date)) < (new Date(endDate)) && 
                    (new Date(date)) > (new Date(startDate)) 
                    ){
                    const usagePrice = (Math.ceil(price/container*quan*100))/100;
                    resultReags.push({
                        itemId,
                        type,
                        name,
                        userName,
                        quan,
                        units,
                        test,
                        date,
                        price: usagePrice,
                        destination,
                    })
                }
            })
        })

        columns.filter(item => item.inUse.length)
        .forEach(item=>{
            const { itemId, name, price, sn, type, totalInj} = item;
            item.inUse.forEach(async usage => {
                const { userName, userId, countInj, test, mobilePhase, fromDate, toDate, destination} = usage
                if(currentUsers.includes(userId) && 
                    (new Date(toDate)) < (new Date(endDate)) && 
                    (new Date(toDate)) > (new Date(startDate)) 
                    ){  
                        const usagePrice = (Math.ceil(price/40000*countInj*100))/100;
                    resultColumns.push({
                        itemId,
                        sn,
                        type,
                        name,
                        userName,
                        countInj,
                        test,
                        fromDate,
                        toDate,
                        price: usagePrice,
                        mobilePhase,
                        destination
                    })
                }
            })
        })

        if(resultReags.length >10000 || resultColumns.length >10000) return res.status(400).json({message: 'tooLarge', clientMessage: 'Набор данных слишком большой. Попробуйте выбрать другой диапазон дат'})

        res.json({
            resultReags: resultReags.sort((a, b) => a.date - b.date), 
            resultColumns: resultColumns.sort((a, b) => a.fromDate - b.fromDate),  
            message: 'ok', 
            clientMessage: 'Данные получены, составление отчета',
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }

}