import Settings from "../models/Settings.js"


export const appService = async (req, res, next) => {
    const {userRole} = req
    const service = await Settings.findOne({name: 'service'});
    if (service.status === false) return next();
    if (userRole === 'admin' || userRole === 'developer') return next();
    return res.status(403).json({message: 'forbidden', clientMessage: 'Проводятся технические работы. Вы не сможете вносить изменения или загружать данные.'})
}