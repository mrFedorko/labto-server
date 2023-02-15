export const handleIsRole = async (req, res, role) => {
    const roles = ['user', 'prep', 'head', 'admin', 'developer']
    if (!roles.includes(role)) {
        return  res.sendStatus(400)
    }
}