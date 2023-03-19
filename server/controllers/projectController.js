import User from "../models/User.js";
import Project from "../models/Project.js";
import { roleValidation } from "../services/roleValidation.js";
import { handleHistory } from "../services/historyAdd.js";

export const handleGetProjects = async (req, res) => {
    const closed = req.params.closed
    const strToBool = (str) => str === 'true' ? true : false
    try {
        const projects = await Project.find({closed: strToBool(closed)});
        return res.json({projects, message: 'ok'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}


export const handleAddProject = async (req, res) => {
    if(!roleValidation(req, res, 'createProject')) return;
    const {userId} = req
    
    try {
        const {code, name, type, descr} = req.body;
        const newProject = new Project({code, name, closed: false, type, descr, creator: userId});
        await newProject.save();
        handleHistory(userId, {itemId: code, name}, "createProject")
        res.status(201).json({message: 'created', clientMessage: "Проект создан"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}
export const handleCloseProject = async (req, res) => {
    if(!roleValidation(req, res, 'changeProject')) return;
    const {userId} = req 
    try {
        const {target} = req.params
        const {close} = req.body
        if(close === undefined || !target) return res.status(400).json({clientMessage: 'Ошибка'})
        const project = await Project.findById(target);
        if(!project) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти проект. Возможно, его удалил другой администратор'})
        const {code, name} = project
        if(close){
            project.closed = true;
        } 
        if(!close) {
            project.closed = false;
        }
       
        await project.save();
        handleHistory(userId, {itemId: code, name}, "changeProject")
        res.status(201).json({message: 'created', clientMessage: `Проект ${close ? 'закрыт' : 'активирован' }`})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleChangeProject = async (req, res) => {
    if(!roleValidation(req, res, 'changeProject')) return;
    const {userId} = req
    
    try {
        const {target} = req.params
        const {descr} = req.body;
        if(!target)return res.status(400).json({clientMessage: 'Ошибка'})
        const project = await Project.findById(target);
        if(!project) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти проект. Возможно, его удалил другой администратор'});
        const {name, code} = project;
        project.descr = descr;
        await project.save();

        handleHistory(userId, {itemId: code, name}, "changeProject")
        res.status(201).json({message: 'created', clientMessage: "Описание проекта изменено"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleDeleteProject = async (req, res) => {
    if(!roleValidation(req, res, 'deleteProject')) return;
    const {userId} = req
    
    try {
        const {target} = req.params;
        const project = await Project.findById(target);
        if(!project) return res.status(400).json({message: 'error', clientMessage: 'Не удается найти проект. Возможно, его удалил другой администратор'});
        const {name, code} = project
        console.log(name, code, target)
        await project.delete();

        handleHistory(userId, {itemId: code, name}, "deleteProject")
        res.status(200).json({message: 'deleted', clientMessage: "Проект удален"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}


