import permissions from '../../config/permissions.js'


export const roleValidation = (req, res, action) => {
    const {userRole} = req;

    if (!permissions[action].includes(userRole))
    return res.status(403).json({message: 'forbidden', clientMessage: 'Вы не обладаете правами для совершения данного действия'})

}