import  * as dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'
import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import { Router } from 'express';

import cors from 'cors';

import connectDb from './sshTunel.js';
import { authRouter } from './routes/auth.route.js';
import { verifyJWT } from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import { refreshTokenRouter } from './routes/refresh.route.js';
import { logoutRouter } from './routes/logout.route.js';
import { corsOptions } from '../config/corsOptions.js';
import { credentials } from './middleware/credentials.js';
import { orderRouter } from './routes/order.route.js';
import https from 'https';
import http from 'http'
import { WebSocketServer } from 'ws';

import path from 'path';
import { fileURLToPath } from 'url';
import { handleChat } from './ws.js';
import { chatMessageRouter } from './routes/chat.route.js';
import { uploadRouter } from './routes/upload.route.js';
import { reagentRouter } from './routes/reagent.route.js';
import { projectRouter } from './routes/project.route.js';
import { draftRouter } from './routes/draft.route.js';
import { historyRouter } from './routes/history.route.js';
import { userRouter } from './routes/user.route.js';
import { optionRouter } from './routes/optins.route.js';
import { reportRouter } from './routes/report.route.js';
import { columnRouter } from './routes/column.route.js';
import { getUserIp } from './middleware/getUserIp.js';
import { backupRouter } from './routes/backup.route.js';
import { appService } from './middleware/appServises.js';
import { settingsRouter } from './routes/settings.route.js';
import { startRouter } from './routes/start.route.js';


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const privateKey  = fs.readFileSync(__dirname + '/ssl/key.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8');

const app = express();

const PORT = process.env.SERVER_PORT || 8000;

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: false}));

app.use(express.json({extended: true}));

//middleware for cookies

app.use(cookieParser());

//middleware for ip

app.use(getUserIp)

///////////////////ROUTES
app.use('/api/auth', authRouter);
app.use('/api/refresh', refreshTokenRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/start', startRouter);
/////ROUTES TO DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

///------protected routes
app.use(verifyJWT);
app.use(appService);
app.use('/api/options/', optionRouter);
app.use('/api/history/', historyRouter);
app.use('/api/reagent/', reagentRouter);
app.use('/api/column/', columnRouter);
app.use('/api/draft/', draftRouter);
app.use('/api/project/', projectRouter);
app.use('/api/order/',orderRouter);
app.use('/api/users/', userRouter);
app.use('/api/chat/', chatMessageRouter);
app.use('/api/settings/', settingsRouter);
app.use('/api/', uploadRouter);
app.use('/api/report/', reportRouter);
app.use('/api/', backupRouter);


// create server for ws integretion
const sslCrt = {key: privateKey, cert: certificate}
const server = http.createServer(app);

//webSocket server

export const wsServer = new WebSocketServer({server});
handleChat();


//////////////////SATRTING APP
const mongoConnection  = async () => {
    process.env.MODE === 'prod' && await mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.DB_NAME}`);
    process.env.MODE === 'dev' && await mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27000/${process.env.DB_NAME}`);

    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });

   
    server.listen(PORT, () => {
        console.log('App has been started on port ' + PORT);
    });
  
}
connectDb(mongoConnection);