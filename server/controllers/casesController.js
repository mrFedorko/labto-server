import Case from "../models/Case.js";

export const handleGetCases = async (req, res) => {
    try {
        const cases = await Case.find({});
        res.status(200).json({cases});

    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получччении кейсов',
        });
    }
}

export const handlePostCases = async (req, res) => {
    try {
        const arrData = req.body;
        arrData.forEach((item) => {
            const {type, name, descr, from, adress, term, img, price, allowed} = item;
            const {max, min} = img;
            const newCase = new Case({type, name, descr, from, adress, term, img:{max, min}, price, allowed});
            newCase.save();
        });
        res.status(201).json({message: "new case saved successfuly"})
    } catch (error) {
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получччении кейсов',
        });
    }
}
