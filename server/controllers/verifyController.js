import User from '../models/User.js';
import config from 'config';


export const handleVerify = async (req, res) => {
    try {
        const key = req.params.key
        const user = await User.findOne({verificationKey: key});

        let accessUrl, rejectUrl

        if(config.get('mode') === 'dev'){
            accessUrl = `${config.get('client').originUrl}:${config.get('client').originPort}/personal`;
            rejectUrl = `${config.get('client').originUrl}:${config.get('client').originPort}`
        } else {
            accessUrl = `${config.get('client').prodUrl}:${config.get('client').prodPort}/personal`;
            rejectUrl = `${config.get('client').prodUrl}:${config.get('client').prodPort}`
        }

        if(!user){
            return res.redirect(rejectUrl)
            .json({message: "forbidden", clientMessage:"запрещено"})
            .status(401);
        }
        user.verified = true;
        user.save();
        return res.redirect(accessUrl)
        .status(200).json({message: "upd", clientMessage: "Профиль пользователя активирован"})

    } catch (error) {
        res.status(402)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
    }
}


