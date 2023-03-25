import path from 'path';


export const handleHelp = async (req, res) => {

    try{
        res.sendFile(path.resolve('./help.pdf'))
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении данных',
        });
    }
}