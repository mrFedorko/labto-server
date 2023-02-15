import Order from "../models/Order.js";
import User from "../models/User.js";
import { roleValidation } from "../services/roleValidation.js";
import { handleHistory } from "../services/historyAdd.js";

export const handleNewOrder = async (req, res) => {
    const {userId} = req
    try {
        const owner = await User.findById(userId)
        const ownerName = owner.name

        const {name, type, text, addressee, manufacturer, cat, initialDestination} = req.body;

        const order = new Order({name, type, text, addressee, owner: userId, ownerName, manufacturer, cat, initialDestination});
        await order.save();
        await handleHistory(userId, {name}, 'createOrder')
        res.status(201).json({message: 'created', clientMessage: 'Заказ создан'})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при создании заказа',
        });
    }
}

export const handleStatusOrder = async (req, res) => {
    if(!roleValidation(req, res, 'changeOrderStatus')) return;
    const {userId} = req
    try {

        const {target, status} = req.params;
        const order = await Order.findOne({uniqueId: target});
        const {name, uniqueId} = order;
        order.status = status;
        await order.save()
        await handleHistory(userId, {name, target, itemId: uniqueId}, 'changeOrderStatus')
        res.status(200).json({message: 'success', clientMessage: 'Статус успешно изменен'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении статуса заказа',
        });
    }
}

export const handleDeleteOrder = async (req, res) => {
    if(!roleValidation(req, res, 'deleteOrder')) return;
    const {userId} = req
    try {

        const {target} = req.params;
        const order = await Order.findOne({uniqueId: target});
        if(!order) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти заказ. Возможно, он был удален ранее'})
        const name = order.name;
        const itemId = order.uniqueId;
        await order.delete()

        await handleHistory(userId, {name, target, itemId}, 'deleteOrder')
        res.status(200).json({message: 'success', clientMessage: 'Заказ успешно удален'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при удалении заказа',
        });
    }
}
export const handleArchiveOrder = async (req, res) => {
    if(!roleValidation(req, res, 'changeOrderStatus')) return;
    const {userId} = req
    try {
        const {target} = req.params;
        const order = await Order.findOne({uniqueId: target});
        if(!order) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти заказ. Возможно, он был удален'})
        const name = order.name;
        const itemId = order.uniqueId;
        order.archive = true;
        await order.save();
        await handleHistory(userId, {name, target, itemId}, 'changeOrderStatus')
        res.status(200).json({message: 'success', clientMessage: 'Перенесено в архив'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при удалении заказа',
        });
    }
}

export const handleMessageOrder = async (req, res) => {
    const {userId} = req;
    try {
        const sender = await User.findById(userId);
        const from = sender.name
        const {target} = req.params;
        const {text} = req.body;
        const message = {from, text, date: Date.now()}
        const order = await Order.findById(target);
        order.messages.push(message)
        order.save();
        res.json({message: 'success', clientMessage: 'Комментарий отправлен'})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при отправке сообщения',
        });
    }
}

export const handleGetMyOrders = async (req, res) => {
    const {userId} = req;
    
    try {
        const myOrders = await Order.find({owner: userId});
        if (!myOrders){
            return res.status(400).json({message: 'not found', clientMessage: 'Не найдено заказов пользователя'});
        }
        res.json({myOrders, message: 'success'})    
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении заказов',
        });
    
    }
}

export const handleGetOrders = async (req, res) => {
    const {userId} = req
    if(!roleValidation(req, res, 'getAllOrders')) return;
   
    try { 
        const {reqStatus} = req.params
        
        const handleOrderReqParams = () => {
            switch (reqStatus) {
                case 'allMy':
                    return {addressee: userId, archive: false}
                case 'activeMy':
                    return {addressee: userId, archive: false, status: {$nin : ['canceled', 'confirmed']}}
                case 'newMy':
                    return {addressee: userId, archive: false, status: 'created'}
                case 'completedMy':
                    return {addressee: userId, archive: false, status: 'completed'}
                case 'archiveMy':
                    return {addressee: userId, archive: true}
                case 'all':
                    return  {archive: false}
                case 'archive':
                    return  {archive: true}
                default:
                return {}
            }
        }

        const orders = await Order.find(handleOrderReqParams())
        
        if (!orders){
            return res.status(400).json({message: 'not found', clientMessage: 'Не найдено заказов по выбранным параметрам'});
        }
        res.json({orders, message: 'success'})    
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении заказов',
        });
    }
}

export const handleRedirectOrder = async (req, res) => {
    if(!roleValidation(req, res, 'redirectOrder')) return;
    const {userId} = req
    try {
        const {targetUser, target} = req.params;
        const order = await Order.findOne({uniqueId: target});
        if(!order){
            return res.status(400).json({message: 'error', clientMessage: 'Заказ не найден. Возможно кто-то уже удалил его'})
        }
        const user = await User.findById(targetUser);
        if(!user){
            return res.status(400).json({message: 'error', clientMessage: 'Пользователь не найден. Действие отменено'})
        }
        const targetName = user.name;
        const orderId = order.uniqueId;
        const orderName = order.name
        order.addressee = targetUser;
        await order.save();

        await handleHistory(userId, {name: orderName, target: targetName, itemId:orderId }, 'redirectOrder')
        res.json({message: 'success', clientMessage: 'Адресат изменен'})

    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при изменении адресата',
        });
    }
}



