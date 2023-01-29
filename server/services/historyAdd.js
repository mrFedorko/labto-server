import History from "../models/History.js";

export const handleHistory = async (userId, target, action) => {
    try {
        const date = Date.now();

        const newNote = {
            userId, 
            historyTarget: {
                itemId: target.itemId ,
                name: target.name,
                target: target._id
            } , 
            action, 
            date
        } ;

        const isHistory = await History.findOne({owner: userId});
        if(!isHistory){
            const history = new History({owner: userId})
            history.history.push(newNote);
            await history.save();
        } else {
            isHistory.history.push(newNote);
            await isHistory.save();
        }
    } catch (error) {
        console.log('error during save history')
        console.error(error)
    }
} 