import tunnel from 'tunnel-ssh';
import config from 'config';



function connectDb(dbConnection){

    if (config.get('mode') !== "dev"){
        dbConnection();
    } else{
        const conf = {
            username:config.get('server.username'),
            password:config.get('server.password'),
            host:config.get('server.host'),
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