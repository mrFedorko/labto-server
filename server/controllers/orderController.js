import Order from "../models/Order.js";

export const handleNewOrder = async (req, res) => {
    try {
        const {name, type, details, quan, comment, status, date, expDate, layout, owner, delivery, price, receiver} = req.body;        
        const newOrder = new Order({name, type, details, quan, comment, status, date, expDate, layout, owner, delivery, price, receiver})
    
        newOrder.save();
        res.status(201)
        .json({
            message: 'order was created', 
            clientMessage: 'Заказ создан',
        });

    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера HIIII',
        });
    }
}

export const handleGetOrders = async (req, res) => {
    try {
        const id = req.params.id;
        const orders = await Order.find({owner:id});
        res.json({orders,  message: 'data fetch'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: 'couldnt fetch'})
    }
}



