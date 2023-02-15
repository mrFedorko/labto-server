import Column from "../models/Column.js";
import { handleHistory } from "../services/historyAdd.js";
import { roleValidation } from "../services/roleValidation.js"

export const handleAddColumn = async (req, res) => {
	if(!roleValidation(req, res, 'addColumn')) return;
	const { userId } = req;
	try {
		const { itemId, name,  manufacturer, cat, sn, restSolvent, passport, initialDestination } = req.body;
		if (!(itemId && name && manufacturer && cat && sn && restSolvent && initialDestination)){
			return res.status(400).json({message: 'error', clientMessage: 'Заполните обязательные поля'})
		};
		const existed = await Column.findOne({itemId})
        if (existed){
          return res.status(403).json({message: 'forbidden', clientMessage: 'Поле ID должно быть уникальным, внесите изменения и попробуйте снова'})
        }

		const newColumn = new Column({itemId, manufacturer, cat, sn, restSolvent, passport, initialDestination})
		await newColumn.save();
		handleHistory(userId, {itemId, name}, "addColumn");
	} catch (error) {
		console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при создании документа',
        });
	}
}