import  * as dotenv from 'dotenv'
dotenv.config()

export const handleCookieOptions = () => {
    
    if(process.env.SECURE === '1'){
        return {
            httpOnly: 'true', 
            maxAge: 16*60*60*1000, 
            secure: true,  
            sameSite: 'None',
        }
    }
    if(process.env.SECURE === '0'){
        return {
            httpOnly: 'true', 
            maxAge: 16*60*60*1000, 
            secure: false,  
        }
    }

 
}