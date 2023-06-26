import rateLimit from 'express-rate-limit'
import { allowedIps } from '../../config/allowedIps.js'

export const limiterMW = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) =>  res.status(401).json({message: 'rate-limit', clientMessage: 'Слишком много попыток входа. Попробуйте снова через 20 мин'}),
    skip: (req, res) => allowedIps.includes(req.ip),
})