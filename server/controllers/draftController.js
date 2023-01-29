import Draft from "../models/Draft.js";

export const handleDraftReagent = async (req, res) => {
    try {
        const userId = req.userId;
        const {date, destination, quan, test, target} = req.body;
        
        const draft = new Draft({
            owner: userId,
            target,
            date,
            destination,
            quan,
            test,
        })

        await draft.save()
        
        res.status(201).json({meassage: 'created', clientMessage: 'Добавлено в черновик'});

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера'})
    }
}

export const handleGetDrafts = async (req, res) => {
    try {
        const userId = req.userId

        const drafts = await Draft.find({owner: userId})
        if(!drafts){
            res.json({message: 'no data', clientMessage: 'не найдено ни одного черновика'})
        }

        res.json({drafts,  message: 'data fetch'})

        }
    catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleDeleteDraft = async (req, res) =>{
    try {
        const {target} = req.params

        const draft = await Draft.findById(target);
        
        draft.delete();
        res.json({message: 'deleted', clientMessage: 'Черновик удален'})

        }
    catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

