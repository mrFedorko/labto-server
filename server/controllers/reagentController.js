import Reagent from "../models/Reagent.js";
import User from "../models/User.js";


export const handleNewReagent = async (req, res) => {
    const creator = req.params.userId;
    const user = await User.findById(creator);
    const permited = ['prep', 'head', 'admin', 'developer'];

    if(!permited.includes(user.role)){
        return res.status(403).json({message: "forbiden", clientMessage: "Вы не обладаете необходимыми правами для совершения данного дествия"});
    }

    try {
        const {
            type, 
            standartType, 
            itemId, 
            name, 
            cat, 
            lot, 
            manufacturer, 
            fromDate,
            toDate,
            units,
            container,
            passport,
            SDS,
            TDS,
            warn,
            price
        } = req.body;     
        

        const newReagent = new Reagent({
            type, 
            standartType, 
            itemId, 
            name, 
            cat, 
            lot, 
            manufacturer, 
            fromDate,
            toDate,
            units,
            container,
            passport,
            SDS,
            TDS,
            warn,
            price,
            creator,
            inUse: [],
            restUnits: container,

        })
    
        newReagent.save();
        res.status(201)
        .json({
            message: 'created', 
            clientMessage: 'Документ создан',
        });

    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при создании документа',
        });
    }
}

export const handleGetReagents = async (req, res) => {
    try {
        const type = req.params.type
        const carantin = req.params.carantin
        if (carantin === 'false'){
            const reagents = await Reagent.find({type, carantin: false});
            res.json({reagents,  message: 'data fetch'})
        }
        if (carantin === 'true'){
            const reagents = await Reagent.find({type, carantin: true});
            res.json({reagents,  message: 'data fetch'})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleTakeReagent = async (req, res) => {
    try {
        const {target, userId} = req.params;
        const {date, destination, quan, test, comment} = req.body;

        const reagent = await Reagent.findById(target);
        reagent.inUse.push({userId, date, destination, quan, test, comment});
        reagent.restUnits = reagent.restUnits - quan;
        await reagent.save();
        res.json({meassage: 'upd', clientMessage: 'Расход оформлен'})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при отправке данных'})
    }
}

export const handleCarantineReagents = async (req, res) => {
    try {
        const {target, userId} = req.params;
        const user = await User.findById(userId);
        const permited = ['prep', 'head', 'admin', 'developer'];

        if(!permited.includes(user.role)){
            return res.status(403).json({message: "forbiden", clientMessage: "Вы не обладаете необходимыми правами для совершения данного дествия"});
        }

        const reagent = await Reagent.findById(target);
        reagent.carantin = true;
        reagent.save();
        res.json({message: 'upd', clientMessage: 'Перенесено в карантин'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleDeleteReagent = async (req, res) => {
    try {
        const {target, userId} = req.params;
        const user = await User.findById(userId);
        const permited = ['prep', 'head', 'admin', 'developer'];

        if(!permited.includes(user.role)){
            return res.status(403).json({message: "forbiden", clientMessage: "Вы не обладаете необходимыми правами для совершения данного дествия"});
        }

        await Reagent.findByIdAndDelete(target);
       
        res.json({message: 'upd', clientMessage: 'Перенесено в карантин'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}




