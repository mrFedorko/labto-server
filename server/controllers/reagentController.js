import Reagent from "../models/Reagent.js";
import User from "../models/User.js";


export const handleAddReagent = async (req, res) => {
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
            CAS, 
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
            location
        } = req.body;     
        
        const existed = await Reagent.findOne({itemId})
        if (existed){
          return res.status(403).json({message: 'forbiden', clientMessage: 'Поле ID должно быть уникальным, внесите изменения и попробуйте снова'})
        }

        const newReagent = new Reagent({
            type, 
            standartType, 
            itemId, 
            name, 
            CAS,
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
            location,
            restUnits: container,

        })
    
        await newReagent.save();
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
        const isolate = req.params.isolate

 
        if (isolate === 'false'){
            
            const reagents = await Reagent.find({type, isolate: false}).select({inUse: 0});
            res.json({reagents,  message: 'data fetch'})
        }
        if (isolate === 'true'){
            const reagents = await Reagent.find({type, isolate: true});
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
        const user = await User.findById(userId);
        
        if(isNaN(+quan)){
            return res.sendStatus(406)
        }

        reagent.inUse.push({userId, date, destination, quan, test, comment, name: user.name});
        
        reagent.restUnits = Math.round((reagent.restUnits - quan)*10000)/10000;
       
        if(reagent.restUnits < 0){
            return res.status(406).json({message: "not allowed", clientMessage: "Вы не можете списать больше, чем остаток. Возможно кто-то списал эту позиию до вас. Обновите список, чтобы увидеть актульные данные"})
        }
        await reagent.save();
        res.json({meassage: 'upd', clientMessage: 'Расход оформлен'});

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при отправке данных'})
    }
}

export const handleIsolateReagent = async (req, res) => {
    try {
        const {target, userId} = req.params;
        const user = await User.findById(userId);
        const permited = ['prep', 'head', 'admin', 'developer'];

        if(!permited.includes(user.role)){
            return res.status(403).json({message: "forbiden", clientMessage: "Вы не обладаете необходимыми правами для совершения данного дествия"});
        }

        const reagent = await Reagent.findById(target);
        reagent.isolate = true;
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

        const users = await User.find({})
        users.forEach(async (user) =>{
   
            user.favorite = user.favorite.filter(item=> item.toString() !== target.toString());
            await user.save();
        } )

        await Reagent.findByIdAndDelete(target);
       
        res.json({message: 'deleted', clientMessage: 'Документ удален'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleGetOneReagent = async (req, res) => {
    try {
        const {target} = req.params;

        const reagent = await Reagent.findById(target);
       
        res.json({message: 'ok', reagent});
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleAddManyReagents = (req, res) => {
    
        try {
            const reagents = req.body;
             reagents.forEach(async item => {
                const {
                    itemId, 
                    name,
                    cat, 
                    lot, 
                    manufacturer, 
                    fromDate,
                    toDate,
                    container,
                } = item;     
                
        
                const newReagent = new Reagent({
                    type: 'reag', 
                    standartType: '', 
                    itemId, 
                    name, 
                    cat, 
                    lot, 
                    manufacturer, 
                    fromDate: +(fromDate),
                    toDate: +(toDate),
                    units: 'g',
                    restUnits: container,
                    container,
        
                })
            
                await newReagent.save();
            });
            
            res.sendStatus(200)
    
        } catch (error) {
            res.status(500)
            .json({
                message: 'server side error', 
                clientMessage: 'Ошибка сервера при создании документа',
            });
        }
    
}


