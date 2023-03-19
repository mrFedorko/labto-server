import tunnel from 'tunnel-ssh';
import config from 'config';
import  * as dotenv from 'dotenv'
dotenv.config()


function connectDb(dbConnection){

    if (process.env.MODE !== "dev"){
        dbConnection();
    } else{
        const conf = {
            username:process.env.SERVER_USERNAME,
            password:process.env.SERVER_PASSWORD,
            host:process.env.SERVER_HOST,
            port:22,
            dstPort:27017,
            localHost:'127.0.0.1',
            localPort: 27000,
        };

        tunnel(conf, (error, server) =>  {

            if(error){
                console.log('SSH connection error: ' + error);
            }
    
            dbConnection();
        });
    }
}

export default connectDb;