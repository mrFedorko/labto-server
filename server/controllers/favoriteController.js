
import History from "../models/History.js";
import User from "../models/User.js";


export const handleFavorite = async (req, res) => {
    const {userId} = req;
    try {
        const {target} = req.params
        const user = await User.findById(userId);
        if (user.favorite.includes(target)){
            return res.sendStatus(403)
        }

        user.favorite.push(target);
        user.save();
        res.json({message: 'upd', clientMessage: 'Добавленно в избранное'});
    } catch (error) {
        console.error(error)
        res.sendStatus(400)
    }
}

export const handleUnfavorite = async (req, res) => {
    const {target} = req.params
    const {userId} = req
    try {
        const user = await User.findById(userId);
        if (!user.favorite.includes(target)){
            return res.sendStatus(403)
        }

        user.favorite = user.favorite.filter(item => item.toString() !== target);
        user.save();
        res.json({message: 'upd', clientMessage: 'Исключено из избранного'});
    } catch (error) {
        console.error(error)
        res.sendStatus(400)
    }
}









