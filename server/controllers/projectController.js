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
    roleValidation(req, res, "createProject")
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

export const handleDeleteProject = async (req, res) => {
    roleValidation(req, res, "deleteProject")
    const {userId} = req
    
    try {
        const {code} = req.body;
        const project = await Project.findOne({code});
        const name = project.name
        await project.delete();
        handleHistory(userId, {itemId: code, name}, "deleteProject")
        res.status(200).json({message: 'deleted', clientMessage: "Проект удален"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}


