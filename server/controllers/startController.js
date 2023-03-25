import Option from "../models/Option.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";

export const handleStartIsService = async (req, res) => {
    try {
        const service = await Settings.findOne({name: 'service'});
        if (!service) return res.status(400).json({message: 'error', clientMessage: 'Ошибка сервера, обратитесь в поддержку'})
        
        res.json({message: 'success', serviceStatus: service.status})
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

export const handleIsStart = async () => {
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

export const handleStart = async () => {
        
    try {

        // create first admin

        const users = await User.find({});
        if(users.length) return res.sendStatus(403)
        const { email, password } = req.body;
        if(!(email && password)){
            return res.status(400).json({message: 'error', clientMessage: 'Ошибка. Не все данные заполнены'})
        }
        const hashedPassword = await bcrypt.hash(password, 6);

        const newUser = new User({email, password: hashedPassword, role: 'admin'})
        await newUser.save();

        // create options and settings in db
        const optionNames = ['manufacturer', 'rsType', 'role', 'department', 'direction', 'position']
        optionNames.forEach(async name => {
            if(name !== 'role') {
                const option = new Option({name})
                await option.save();
            } else {
                const option = new Option({
                    name: role,
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
        await startSetting.save();

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