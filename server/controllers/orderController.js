import Order from "../models/Order.js";
import User from "../models/User.js";
import { roleValidation } from "../services/roleValidation.js";
import { handleHistory } from "../services/historyAdd.js";

export const handleNewOrder = async (req, res) => {
    const {userId} = req
    try {
        const owner = User.findById(userId)
        const ownerName = owner.name

        const {name, type, text, addresseeName, manufacturer, cat, initialDestination} = req.body;
        const targetUser = await User.findOne({name: addresseeName});
        const addressee = targetUser.id

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
    roleValidation(req, res, 'changeOrderStatus');
    const {userId} = req
    try {

        const {target, status} = req.params;
        const order = await Order.findById(target);
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
    roleValidation(req, res, 'deleteOrder');
    const {userId} = req
    try {

        const {target} = req.params;
        const order = await Order.findById(target);
        const name = order.name;
        const itemId = order.uniqueId;
        await order.delete()

        await handleHistory(userId, {name, target, itemId}, 'deleteOrder')
        res.status(200).json({message: 'success', clientMessage: 'Статус успешно изменен'})

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
    roleValidation(req, res, 'getAllOrders');
   
    try { 
        const {status} = req.params

        const handleOrderReqParams = () => {
            switch (status) {
                case 'all':
                    return {addressee: userId, archive: false}
                case 'active':
                    return {addressee: userId, archive: false, status: {$nin : ['canceled', 'confirmed']}}
                case 'new':
                    return {addressee: userId, archive: false, status: 'created'}
                case 'completed':
                    return {addressee: userId, archive: false, status: 'completed'}
                case 'archive':
                    return {addressee: userId, archive: true}
                case 'archive':
                    return {addressee: userId, archive: true}
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


