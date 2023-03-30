import bcrypt from 'bcryptjs';
import Option from "../models/Option.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";



export const handleIsStart = async (req, res) => {
    try {
        const users = await User.find({});
        if(users.length) return res.json({start:false})
        return res.json({start: true})
    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
    }
}

export const handleStart = async (req, res) => {
        
    try {

        // create first admin

        const users = await User.find({});
        if(users.length) return res.status(403).json({message: 'forbidden', clientMessage: 'Приложение уже было настроено ранее. Войдите или обратитесь в поддержку'})
        const {department} = req.body
        
        const hashedPassword = await bcrypt.hash("admin", 6);

        const newUser = new User({email: 'admin', password: hashedPassword, role: 'admin', department})
        await newUser.save();

        // create options and settings in db
        
        const optionNames = ['manufacturer', 'rsType', 'role', 'department', 'direction', 'position', 'manufacturerCol', 'manufacturerSubst']
        optionNames.forEach(async name => {
            if(name !== 'role') {
                const option = new Option({name})
                if(name === 'department'){
                    option.options.push({value: department, label:department})
                }
                await option.save();
            } else {
                const option = new Option({
                    name: 'role',
                    options: [
                        {value: 'admin', label: 'Администратор'},
                        {value: 'head', label: 'Начальник'},
                        {value: 'prep', label: 'Препаратор'},
                        {value: 'user', label: 'Пользователь'},
                    ],
                });
                await option.save();
            }
        });

        const serviceSetting = new Settings({name: 'service', status: false})
        await serviceSetting.save();

        res.json({message: 'success', clientMessage: 'Стартовый профиль создан. Теперь войдите, используя введенные данные'})
    } catch (error) {
        console.log(error)
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера',
        });
    }
}