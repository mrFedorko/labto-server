import Sop from "../models/Sop";


export const handleGetSop = async (req, res) => {

    try {
        const { target } = req.params;
        if(!target) return res.sendStatus(400);
        const sop = await Sop.findById(target);
        if(!sop) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти СОП'})
        res.json({sop})

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export const handleGetSopList = async (req, res) => {
    try {
        const sopList = await Sop.find({});
        res.json({sopList})

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export const handleAddSop = async (req, res) => {
    try {
        const sopList = await Sop.find({});
        res.json({sopList})

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}