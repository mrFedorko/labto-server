import fs from 'fs'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import  * as dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.CLIENT_PORT
let newBaseURL = `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`;
app.use('/', express.static(path.join(__dirname, '../../labto-app/build')))
app.get(/\/[A-Za-z0-9_\-]{7}/, function(request, response) {
  response.redirect(newBaseURL);
});

app.get('*', function(request, response) {
  response.redirect(newBaseURL);
});

app.listen(PORT, () => {
  console.log('front-end has been started on port '+ PORT);
})
