import User from "../models/User.js"

export const handleGetUsers = async (req, res) => {
    try {
        const users = await User.find({}, ['name', 'phone', 'direction', 'department', 'position', 'role'])
        if(!users)return res.sendStatus(400)
        const reqUsers = users.map(item=> {
            return {
                name: item.name,
                phone: item.phone,
                direction: item.direction,
                department: item.department,
                position: item.position,
                role: item.role
            }
        })
        res.json({message: 'success', users: reqUsers})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'не удается загрузить пользователей',
        });
    }
}