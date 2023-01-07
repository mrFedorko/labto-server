
import async_hooks from 'node:async_hooks';
import fs from 'fs'
import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import { Router } from 'express';

import cors from 'cors';

import connectDb from './sshTunel.js';
import { registerRouter } from './routes/register.route.js';
import { authRouter } from './routes/auth.route.js';
import { settingsRouter } from './routes/settings.route.js';
import { verifyJWT } from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import { refreshTokenRouter } from './routes/refresh.route.js';
import { logoutRouter } from './routes/logout.route.js';
import { corsOptions } from '../config/corsOptions.js';
import { credentials } from './middleware/credentials.js';
import { newOrderRouter } from './routes/order.route.js';
import https from 'https';
import http from 'http'
import { notesRouter } from './routes/note.route.js';
import { WebSocketServer } from 'ws';

import path from 'path';
import { fileURLToPath } from 'url';
import { handleChat } from './ws.js';
import { handleGetAllReviews } from './controllers/reviewController.js';
import { chatMessageRouter } from './routes/chat.route.js';
import { casesRouter } from './routes/cases.route.js';
import { verifyRouter } from './routes/verify.route.js';
import { uploadRouter } from './routes/upload.route.js';
import { reviewRouter } from './routes/review.route.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const privateKey  = fs.readFileSync(__dirname + '/ssl/key.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/cert.pem', 'utf8');

const app = express();

const PORT = config.get('port') || 8000;

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json({extended: true}));

//middleware for cookies

app.use(cookieParser());


///////////////////ROUTES
app.use('/api/register', registerRouter);
app.use('/api/auth', authRouter);
app.use('/api/refresh', refreshTokenRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/cases', casesRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/review', Router().get(
    '/getall/',
    handleGetAllReviews
))

///------protected routes
app.use(verifyJWT);

app.use('/api/settings/', settingsRouter);
app.use('/api/order/', newOrderRouter);
app.use('/api/notes/', notesRouter);
app.use('/api/chat', chatMessageRouter);
app.use('/api/review', reviewRouter);
app.use('/api/', uploadRouter)

// create server for ws integretion
const sslCrt = {key: privateKey, cert: certificate}
const server = http.createServer(app);

//webSocket server

export const wsServer = new WebSocketServer({server});
handleChat();


//////////////////SATRTING APP
const mongoConnection  = async () => {
    config.get('mode') === 'prod' && await mongoose.connect(config.get('mongoUriProd'));
    config.get('mode') === 'dev' && await mongoose.connect(config.get('mongoUriDev'));

    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });

   
    server.listen(PORT, () => {
        console.log('App has been started on port ' + PORT);
    });
  
}
connectDb(mongoConnection);