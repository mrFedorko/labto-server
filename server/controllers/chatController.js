import Chat from "../models/Chat.js";

export const handleGetMessages = async (req, res) => {
    try{
        const owner = req.params.id;
        const currentChat = await Chat.findOne({owner});
        if(!currentChat) return res.status(400).json({owner, message: "couldnt find chat", clientMessage: "неозможно получить данные чата"});
        res.json({currentChat})

    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
    }
}




