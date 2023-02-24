import Column from "../models/Column.js";
import User from "../models/User.js";
import { handleHistory } from "../services/historyAdd.js";
import { roleValidation } from "../services/roleValidation.js"

export const handleAddColumn = async (req, res) => {
	if(!roleValidation(req, res, 'addColumn')) return;
	const { userId } = req;
	try {
		const { itemId, name, manufacturer, cat, lot, sn, restSolvent, passport, initialDestination, mainSubstance, type, fromDate, pressureLimit } = req.body;
		if (!(itemId && name && manufacturer && cat && sn && restSolvent && initialDestination && type)){
			return res.status(400).json({message: 'error', clientMessage: 'Заполните обязательные поля'})
		};
		const existed = await Column.findOne({itemId})
        if (existed){
          return res.status(403).json({message: 'forbidden', clientMessage: 'Поле ID должно быть уникальным, внесите изменения и попробуйте снова'})
        }

		const newColumn = new Column({itemId, name, manufacturer, cat, lot, sn, restSolvent, passport, initialDestination, mainSubstance, mainProject: initialDestination, type, pressureLimit})
		if(!!fromDate) newColumn.fromDate = fromDate
		await newColumn.save();
		handleHistory(userId, {itemId, name}, "addColumn");
		res.status(201).json({message: 'created', clientMessage: 'Документ создан'})
	} catch (error) {
		console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при создании документа',
        });
	}
}

export const handleTakeColumn = async (req, res) => {
	const {userId} = req;
	try {
		const {target} = req.params
		const user = await User.findById(userId);
		const column = await Column.findById(target);
		if(!column) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти колонку'})
		if (column.current.userId) return res.status(400).json({message: 'error', clientMessage: `Колонку уже использует ${column.current.userName}. Возможно, он взял ее до вас`})
		const userName = user.name;
		const {destination, test, fromDate} = req.body;
		

		const current = {userId, userName, destination, test, fromDate};
		column.current = current;
		column.busy = true;
		await column.save();
		handleHistory(userId, {itemId: column.itemId, name: column.name}, "takeColumn");
		res.json({message: 'success', clientMessage: 'Колонка взята в работу'})

	} catch (error) {
		console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
	}
}
export const handleReturnColumn = async (req, res) => {
	const {userId} = req;
	try {
		const {target} = req.params
		const column = await Column.findById(target);
		if(!column) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти колонку'})
		if (column.current.userId !== userId) return res.status(400).json({message: 'error', clientMessage: `Вы не можете вернуть колонку, которую не брали`})

		const {countInj, restSolvent, mobilePhase, comment, fromDate, toDate,  test} = req.body;
		if(!(countInj && restSolvent && mobilePhase && comment && fromDate && toDate && test)) return res.status(400).json({message: 'error', clientMessage: 'Заполните все поля'});

		const {userName, destination } = column.current
		const inUseItem = {
			userId, 
			userName, 
			fromDate,
			toDate,
			destination,
			countInj,
			test,
			mobilePhase,
			restSolvent,
			comment
		}

		column.inUse.push(inUseItem);
		column.totalInj += countInj;
		column.busy	 = false
		column.restSolvent = restSolvent;
		column.current = {
			test: '',
			userId: '',
			userName: '',
			destination: {
				code: '',
				name: '',
			},
		}
		await column.save();
		handleHistory(userId, {itemId: column.itemId, name: column.name}, "returnColumn");
		res.json({message: 'success', clientMessage: 'Использование завершено'})
	} catch (error) {
		console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при оформлении использования',
        });
	}
}

export const handleGetColumns = async (req, res) => {
	try {
		const {type, isolate} = req.params
		const strToBool = (str) => {
			if(str === 'true') return true
			if(str === 'false') return false
			return false
		}
		if(!type || !isolate) return res.sendStatus(400);
		if (type === 'all' && isolate === 'true'){
			const columns = await Column.find({isolate: true}).select({inUse: 0});
			return res.json({columns, message: 'data fetch'})
		}

		const columns = await Column.find({type, isolate: strToBool(isolate)}).select({inUse: 0});
		res.json({columns, message: 'data fetch'})
	} catch (error) {
		console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении данных',
        });
	}
}

export const handleGetOneColumn = async (req, res) => {
	try {
		const {target} = req.params;
		const column = await Column.findById(target);
		if(!column) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти колонку. Возможно кто-то удалил ее'})
		res.json({message: 'ok', column})
	} catch (error) {
		console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении данных',
        });
	}
	
}

export const handleDeleteColumn = async (req,res) => {
	const {userId} = req;
	try {
		const {target} = req.params
		const column = await Column.findById(target);
		if(!column) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти колонку. Возможно кто-то удалил ее'})
		const {name, itemId} = column;
		await column.delete();
		handleHistory(userId, {itemId, name}, "deleteColumn");
		res.json({message: 'success' , clientMessage: 'Документ удален'})

	} catch (error) {
		console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении данных',
        });
	}
}



