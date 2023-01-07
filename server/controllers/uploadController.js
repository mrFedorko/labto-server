import Order from "../models/Order.js";

export const handleUpload = async (req, res) => {
    
    try{
        const owner = req.params.id;
        const date = req.params.date;
        console.log(req.body)
        const order = await Order.findOne({owner, date}) 
        if(!order) return res.status(400).json({owner, message: "couldnt upload", clientMessage: "ошибка при загрузке макета"});


        const name = `${owner}-${date}`
        order.layout.push(name)
        order.save();
        res.json({message: 'uploaded'})

    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
    }
}




