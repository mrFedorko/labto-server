
import get_ip from 'ipware'
import  * as dotenv from 'dotenv'
import { allowedIps } from '../../config/allowedIps.js'
dotenv.config()

export const getUserIp = (req, res, next) => {
    
    const getIp = get_ip().get_ip
    const ip = getIp(req)
    req.userIp = ip.clientIp
    if (process.env.VALIDATE_IPS === '0') return next();
    if (allowedIps.includes(ip.clientIp)){
        return next()
    } else {
        return res.sendStatus(401)
    }
}