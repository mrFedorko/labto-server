
import fs, { unlink } from 'fs';

import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';
import  * as dotenv from 'dotenv'
import path from 'path';
dotenv.config()

export const handleBackup = async (req, res) => {
    
    const handleGetUri = () => {
        if(process.env.MODE === 'prod') return `mongodb://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@localhost:270170`
        if(process.env.MODE === 'dev') return `mongodb://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@localhost:27000/`
        return ''
    }
    
    const handleDate = () => {
        const newDate = new Date()
        const year = newDate.getFullYear();
        const month = newDate.getMonth()+1;
        const day = newDate.getDate()
        const hours = newDate.getHours();
        const minutes = newDate.getMinutes();
        return `_${year}_${month}_${day}_h${hours}m${minutes}`
    }

    try {

        fs.writeFile(`./backups/backup${handleDate()}.tar`,'', function (err) {
            if (err) throw err;
            console.log('File is created successfully.');})
        const mongo_connector = new MongoDBDuplexConnector({
            connection: {
                uri: `${handleGetUri()}`,
                dbname: `${process.env.DB_NAME}`,
            },
        });
    
        const localfile_connector = new LocalFileSystemDuplexConnector({
            connection: {
                path: `./backups/backup${handleDate()}.tar`,
            },
        });
    
        const transferer = new MongoTransferer({
            source: mongo_connector,
            targets: [localfile_connector],
        });
    
        for await (const { total, write } of transferer) {
            console.log(`remaining bytes to write: ${total - write}`);
        }
        res.json({message: 'success', clientMessage: 'Резервное копирование успешно завершено'})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при создании бэкапа',
        });
    }
}

export const handleRestore = async (req, res) => {
    const {backupFileName} = req.body
    if (!backupFileName) return res.status(400).json({message: "error", clientMessage: 'Ошибка. Точка восстановления не выбрана'})


    const handleGetUri = () => {
        if(process.env.MODE === 'prod') return `mongodb://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@localhost:270170`
        if(process.env.MODE === 'dev') return `mongodb://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@localhost:27000/`
        return ''
    }

    try {
        const mongo_connector = new MongoDBDuplexConnector({
            connection: {
                uri: `${handleGetUri()}`,
                dbname: `${process.env.DB_NAME}`,
            },
            astarget : {
                remove_on_failure: true,
                remove_on_startup: true,
            }
        });
    
        const localfile_connector = new LocalFileSystemDuplexConnector({
            connection: {
                path: `./backups/${backupFileName}`,
            },
            astarget : {
                remove_on_failure: true,
                remove_on_startup: true,
            }
        });
    
        const transferer = new MongoTransferer({
            source: localfile_connector,
            targets: [mongo_connector],
        });
    
        for await (const { total, write } of transferer) {
            console.log(`remaining bytes to write: ${total - write}`);
        }
        res.json({message: 'success', clientMessage: 'Восстановление успешно завершено, перезагрузите систему'})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при восстановлении системы',
        });
    }
}


export const handleGetBackupNames = async (req, res) => {
    try{
        const backupFolder = './backups'
        const backupsArr = [];
        fs.readdirSync(backupFolder).forEach(file => {
              backupsArr.push(file);
            });
        res.json({backupsArr})
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении данных',
        });
    }
}

export const handleDownloadBackup = async (req, res) => {
    try{
        const {backupFileName} = req.body;
        if (!backupFileName) return res.status(400).json({message: "error", clientMessage: 'Ошибка. Точка восстановления не выбрана'})
        res.sendFile(path.resolve('./backups/'+backupFileName))
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении данных',
        });
    }
}

export const handleDeleteBackup = async (req, res) => {

    try{
        const {backupFileName} = req.body;
        if (!backupFileName) return res.status(400).json({message: "error", clientMessage: 'Ошибка. Точка восстановления не выбрана'})
        fs.unlink(path.resolve('./backups/'+backupFileName), (err) => {
            if (err) return res.status(400).json({message: 'error', clientMessage: 'Ошибка при удалении точки восстановления'})
            return res.json({message: 'deleted', clientMessage: 'Точка восстаноления успешно удалена'})
            })
    } catch (error) {
        console.log(error);
        res.status(500)
        .json({
            message: 'server side error', 
            clientMessage: 'Ошибка сервера при получении данных',
        });
    }
}




