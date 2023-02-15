import Reagent from "../models/Reagent.js";
import User from "../models/User.js";
import { handleHistory } from "../services/historyAdd.js";
import { unlink } from 'node:fs';
import path from "path";
import { roleValidation } from "../services/roleValidation.js";
import Option from "../models/Option.js";

export const handleAddReagent = async (req, res) => {
    if(!roleValidation(req, res, 'addReag')) return;
    const creator = req.userId;

    try {
        const {type, standartType, itemId, name,CAS, cat, lot, manufacturer, fromDate,toDate,units,container,passport,SDS,TDS,warn,price,location, initialDestination
        } = req.body;     
        
        const existed = await Reagent.findOne({itemId})
        if (existed){
          return res.status(403).json({message: 'forbiden', clientMessage: 'Поле ID должно быть уникальным, внесите изменения и попробуйте снова'})
        }

        const newReagent = new Reagent({type, standartType, itemId, name, CAS,cat, lot, manufacturer, fromDate,toDate,units,container,passport,SDS,TDS,warn,price,creator,inUse: [],location,restUnits: container,initialDestination

        })
    
        await newReagent.save();
        await handleHistory(creator, {itemId, name}, 'addReag')
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

export const handleChangeReagent = async (req, res) => {
    const {target} = req.params;
    const userId = req.userId;
    if(!roleValidation(req, res, 'changeReag')) return;

    try {
        const { CAS,passport,SDS,TDS,warn,price,location } = req.body;     
        
        const reagent = await Reagent.findById(target)
        const {itemId, name} = reagent;
        if(passport) {reagent.passport = passport};
        reagent.SDS = SDS;
        reagent.TDS = TDS;
        reagent.warn = warn;
        reagent.price = price;
        reagent.location = location;
        reagent.CAS = CAS;
        reagent.changed = true;
    
        await reagent.save();
        await handleHistory(userId, {itemId, name, target}, 'changeReag')
        res.status(201)
        .json({
            message: 'updated', 
            clientMessage: 'Документ изменен',
        });

    } catch (error) {
    console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении документа',
        });
    }
}

export const handleGetReagents = async (req, res) => {
    try {
        const {type, isolate} = req.params

 
        if (isolate === 'false'){
            
            const reagents = await Reagent.find({type, isolate: false}).sort('-itemId').select({inUse: 0});
            res.json({reagents,  message: 'data fetch'})
        }
        if (isolate === 'true'){
            const reagents = await Reagent.find({type, isolate: true}).select({inUse: 0});;
            res.json({reagents,  message: 'data fetch'})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleTakeReagent = async (req, res) => {
    try {
        const userId = req.userId
        const {target} = req.params;
        const {date, destination, quan, test, comment} = req.body;
        
        
        const reagent = await Reagent.findById(target);
        const user = await User.findById(userId);

        reagent.inUse.push({userId, date, destination, quan, test, comment, name: user.name});
        
        reagent.restUnits = Math.round((reagent.restUnits - quan)*10000)/10000;
       
        if(reagent.restUnits < 0){
            return res.status(406).json({message: "not allowed", clientMessage: "Вы не можете списать больше, чем остаток. Возможно кто-то списал эту позиию до вас. Обновите список, чтобы увидеть актульные данные"})
        }
        await reagent.save();
        await handleHistory(userId, {itemId: reagent.itemId, name: reagent.name, target}, 'takeReag')
        res.json({meassage: 'upd', clientMessage: 'Расход оформлен'});

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при отправке данных'})
    }
}

export const handleIsolateReagent = async (req, res) => {
    const userId = req.userId;
    if(!roleValidation(req, res, 'isolateReag')) return;

    try {
        
        const {target} = req.params;

        const reagent = await Reagent.findById(target);
        reagent.isolate = true;
        reagent.isolateDate = Date.now();
        await reagent.save();
        await handleHistory(userId, {itemId: reagent.itemId, name: reagent.name, target}, 'isolateReag');
        res.json({message: 'upd', clientMessage: 'Перенесено в карантин'});

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleDeleteReagent = async (req, res) => {
    const userId = req.userId
    if(!roleValidation(req, res, 'deleteReag')) return;
    try {
        
        const {target} = req.params;

        const users = await User.find({})
        users.forEach(async (user) =>{
   
            user.favorite = user.favorite.filter(item=> item.toString() !== target.toString());
            await user.save();
        } )

        const reagent = await Reagent.findById(target);
        

        if (reagent.passport){
            try {
                const file = path.resolve('./docs/'+reagent.passport)
                unlink(file, (err) => {
                    if (err) throw err;
                    console.log(file, ' was deleted');
                });
            } catch (error) {
                console.log(error)
            }
        }
        await handleHistory(userId, {itemId: reagent.itemId, name: reagent.name, target}, 'deleteReag');
        reagent.delete();
        res.json({message: 'deleted', clientMessage: 'Документ удален'});

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при удалении документа'})
    }
}

export const handleGetOneReagent = async (req, res) => {
    try {
        const {target} = req.params;
        const reagent = await Reagent.findById(target);
        if(!reagent) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти реактив. Возможно кто-то удалил его'})
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


