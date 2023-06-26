import Equipment from "../models/Equipment.js"
import { handleHistory } from "../services/historyAdd.js";
import { roleValidation } from "../services/roleValidation.js";
import { handleIsURL } from "../services/handleIsURL.js";
import User from "../models/User.js";

export const handleGetAllEquipment = async (req, res) => {
    
    try {
        const {type} = req.params
        
        let equipments = [];
        
        if(type === 'all'){
             equipments = await Equipment.find({}).sort('-itemId').select('itemId type eqName model manufacturer sn invn lastVerification nextVerification status')
        } else {
             equipments = await Equipment.find({type}).sort('-itemId').select('itemId type eqName model manufacturer sn invn lastVerification nextVerification status');
        }
        return res.status(200).json({equipments})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }
}

export const handleGetOneEquipment = async (req, res) => {
    try {
        const {target} = req.params;
        if(!target){
            return res.sendStatus(400)
        }
        const equipment = await Equipment.findById(target);
        if(!equipment){
            return res.status(400).json({
                message: 'Error', 
                clientMessage: 'Данные не найдены',
            })
        }
        return res.status(200).json({equipment})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }
}

export const handleAddEquipment = async (req, res) => {
    if(!roleValidation(req, res, 'addEquipment')) return;
    const {userId} = req;
    try {
        const { itemId, type, eqName, model, manufacturer, sn, invn, respUser, deputyRespUser, status, lastVerification, nextVerification, passport, cert, manual, currentSop, location, currentVerification } = req.body;
        if(!(itemId && type && eqName && model && manufacturer && sn && invn && respUser && status && lastVerification && nextVerification )) {
            return res.status(400).json({
                message: 'all data required',
                clientMessage: 'Заполните все обязательные поля'
            })
        };
        const sameId = await Equipment.findOne({itemId});
        if (sameId){
            return res.status(400).json({
                message: 'Error',
                clientMessage: 'Поле ID должно быть уникальным. Поменяйте ID и попробуйте снова'
            })
        };

        const newEquipment = new Equipment({
            itemId,
            type,
            eqName,
            model,
            manufacturer,
            sn,
            invn,
            respUser,
            deputyRespUser,
            status,
            lastVerification,
            nextVerification,
            passport, cert, manual, currentSop, location,
            currentSop,
            sopVersions: [currentSop.version],
            trainigList: [],
            troubleshooting: [],
        })

        if (currentVerification) {
            const {verificator = '', result = '', comment = ''} = currentVerification;

            newEquipment.verificationList.push({
                fromDate: lastVerification,
                toDate: nextVerification,
                verificator,
                result,
                comment
            })
        }

        await newEquipment.save();
        await handleHistory(userId, {itemId, name: eqName}, 'addEquipment');
        res.status(201)
        .json({
            message: 'created', 
            clientMessage: 'Документ создан',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'}) 
    }
}

export const handleChangeEquipment = async (req, res) => {
    if(!roleValidation(req, res, 'changeEquipment')) return;
    const {userId} = req;
    try {
        const {target} = req.params;
        if(!target) {
            return res.sendStatus(400)
        }
        const targetEquipment = await Equipment.findById(target);
        if(!targetEquipment) {
            return res.status(400).json({
                message: 'error',
                clientMessage: 'Данные не найдены, возможно кто-то удалил документ, пока вы просматривали таблицу',
            })
        };
        const {respUser, deputyRespUser, location, passport, manual} = req.body;
        !!respUser && (targetEquipment.respUser = respUser)
        !!deputyRespUser && (targetEquipment.deputyRespUser = deputyRespUser)
        !!location && (targetEquipment.location = location)
        !!passport && (targetEquipment.passport = passport)
        !!manual && (targetEquipment.manual = manual);
        await targetEquipment.save();
        await handleHistory(userId, {itemId, name: eqName}, 'changeEquipment');
        res.json({
            message: 'changed', 
            clientMessage: 'Документ изменен',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'}) 
    }
}

export const handleVerifyEquipment = async (req, res) => {
    if(!roleValidation(req, res, 'changeEquipment')) return;
    const {userId} = req
    const verifyResult = (result) => {
        return ['pass', 'fail'].includes(result)
    }
    try {
        const {target} = req.params;
        if(!target){
            return res.sendStatus(400)
        }
        const equipment = await Equipment.findById(target);
        if(!equipment){
            return res.status(400).json({
                message: 'Error', 
                clientMessage: 'Данные не найдены',
            })
        }
        const {itemId, eqName} = equipment
        const {fromDate, toDate, verificator, result, comment, cert } = req.body;
        if (!verifyResult(result)) return res.status(400).json({message: 'error', clientMessage: 'Недопустимое значение результата поверки'})
        
        if(result === 'fail'){
            
            if(!(fromDate && verificator )) {
                return res.status(400).json({
                    message: 'error',
                    clientMessage: 'Заполните все необходимые данные'
                })
            }
            equipment.status = 'verificationFail' 
            equipment.verificationList.push({
                fromDate,
                toDate: fromDate,
                verificator,
                result,
                comment: comment || 'поверка не пройдена',
            });
            await equipment.save();
            await handleHistory(userId, {itemId, name: eqName}, 'verifyEquipment');
            return res.json({
                message: 'changed', 
                clientMessage: 'Данные о поверке добавлены',
            })
        }
        if(!(fromDate && toDate && verificator && result && comment && cert)) {
            return res.status(400).json({
                message: 'error',
                clientMessage: 'Заполните все необходимые данные'
            })
        }
        equipment.lastVerification = fromDate;
        equipment.nextVerification = toDate;
        equipment.status = 'ready'
        equipment.cert = cert
        equipment.verificationList.push({
            fromDate,
            toDate,
            verificator,
            result,
            comment,
        });
        await equipment.save();
        await handleHistory(userId, {itemId, name: eqName}, 'verifyEquipment');
        res.json({
            message: 'changed', 
            clientMessage: 'Данные о поверке добавлены',
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'});
    }
}

export const handleStatusEquipment = async (req, res) => {
    if(!roleValidation(req, res, 'changeEquipment')) return;
    const {userId} = req
    const statusList = ['ready', 'broken', 'repair', 'storage', 'verification', 'verificationExpired', 'isolate', 'verificationFail']
    try {
       const {target} = req.params 
       const {status} = req.body
       if (!status || ! target) return res.status(400).json({message: 'error', clientMessage: 'Статус и/или обурудование не выбраны'});
       if (!statusList.includes(status)) return res.status(400).json({message: 'error', clientMessage: 'Вы не можете поменять статус на такое значение'});
       const equipment = await Equipment.findById(target);
       if(!equipment) return res.status(400).json({message: 'error', clientMessage: 'Данные не найдены, возможно кто-то удалил документ, пока вы просматривали таблицу'});
       equipment.status = status;
       await equipment.save()
       await handleHistory(userId, {itemId: equipment.itemId, name:equipment.eqName}, 'changeEquipment');
       res.json({
           message: 'changed', 
           clientMessage: 'Статус изменен',
       })


    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'});
    }
}

export const handleGetSopVersions = async (req, res) => {

    try {
       const {target} = req.params;

       if(!target) res.status(400).json({message: 'error', clientMessage: 'Ошибка: некорректный запрос'});
       const equipment = await Equipment.findById(target);
       if(!equipment) return res.status(400).json({message: 'error', clientMessage: 'Данные не найдены, возможно кто-то удалил документ, пока вы просматривали таблицу'});
       const {sopVersions} = equipment;
       res.json({
        message: 'changed', 
        sopVersions,
    })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'});
    }
}

export const handleGetTrainingList = async (req, res) => {
    
    
    try {
       const {target} = req.params;
       const {sopVersion} = req.body;
       if(!target) res.status(400).json({message: 'error', clientMessage: 'Ошибка: некорректный запрос'});
       const equipment = await Equipment.findById(target);
       if(!equipment) return res.status(400).json({message: 'error', clientMessage: 'Данные не найдены, возможно кто-то удалил документ, пока вы просматривали таблицу'});
       const {trainigList} = equipment;

        res.json({
            message: 'ok', 
            trainigList: trainigList.filter(item => item.sopVersion === sopVersion),
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'});
    }
}

export const handleTrain = async (req, res) => {
    const {userId} = req;
    try {
        const {target} = req.params;
        const {sopVersion, trainer} = req.body;
        if (!(sopVersion && trainer)) return res.status(400).json({message: 'error', clientMessage: 'Не все данные внесены'});

        if(!target) res.status(400).json({message: 'error', clientMessage: 'Ошибка: некорректный запрос'});
        const equipment = await Equipment.findById(target);
        if(!equipment) return res.status(400).json({message: 'error', clientMessage: 'Данные не найдены, возможно кто-то удалил документ, пока вы просматривали таблицу'});
        if(!equipment.sopVersions.includes(sopVersion)) res.status(400).json({message: 'error', clientMessage: 'Не найден СОП данной версии'});
        const user = await User.findById(userId);
        if (!user) return res.sendStatus(400)
        const userName = user.name;
        const {eqName} = equipment
        const hasTrained = equipment.trainigList.filter(item => item.userName === userName && item.sopVersion === sopVersion).length;
        if (hasTrained) return res.status(400).json({message: 'error', clientMessage: 'Вы уже ознакомлены с этой версией СОП'})
        equipment.trainigList.push({
            date: Date.now(),
            userName,
            userId,
            sopVersion,
            trainer,
        })
  
        await equipment.save();
        await handleHistory(userId, {itemId: equipment.itemId, name:eqName, _id: sopVersion}, 'sopConfirm');
        return res.json({ message: 'ok', clientMessage: 'Запись об ознакомлении добавлена'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'});
    }
}

export const handleLog = async (req, res) => {
    
    if(!roleValidation(req, res, 'changeEquipment')) return;

    const {userId} = req;
    try {
        const {target} = req.params;
        const {description, action, result, date} = req.body;
        if (!(description && action && result && date)) return res.status(400).json({message: 'error', clientMessage: 'Не все данные внесены'});
        if(!target) res.status(400).json({message: 'error', clientMessage: 'Ошибка: некорректный запрос'});
        const equipment = await Equipment.findById(target);
        if(!equipment) return res.status(400).json({message: 'error', clientMessage: 'Данные не найдены, возможно кто-то удалил документ, пока вы просматривали таблицу'});
        if(!equipment.sopVersions.includes(sopVersion)) res.status(400).json({message: 'error', clientMessage: 'Не найден СОП данной версии'});
        const user = await User.findById(userId);
        if (!user) return res.sendStatus(400)
        const userName = user.name;
       
        equipment.troubleshooting.push({
            date: date ||  Date.now(),
            userName,
            userId,
            description,
            action,
            result
        })
        await equipment.save();
        await handleHistory(userId, {itemId: equipment.itemId, name:eqName, _id: sopVersion}, 'logEquipment');
        return res.json({ message: 'ok', clientMessage: 'Лог успешно добавлен'})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'});
    }
}




