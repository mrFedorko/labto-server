import User from "../models/User.js";
import Project from "../models/Project.js";

export const handleGetProjects = async (req, res) => {
    
    try {
        const projects = await Project.find({closed: false});
        return res.json({projects, message: 'ok'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}

export const handleAddProject = async (req, res) => {
    
    try {
        console.log('start')
        const {userId} = req.params;
        const user = await User.findById(userId);
        const permited = ['head', 'admin', 'developer'];

        if(!permited.includes(user.role)){
            return res.status(403).json({message: "forbiden", clientMessage: "Вы не обладаете необходимыми правами для совершения данного дествия"});
        }

        const {code, name, type} = req.body;
        const newProject = new Project({code, name, closed: false});
        await newProject.save();
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'server side error', clientMessage: 'ошибка сервера при получении данных'})
    }
}