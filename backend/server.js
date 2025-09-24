const path     = require('path');
const express  = require('express');
const http     = require('http');
const mongoose = require('mongoose');

require('dotenv').config();

const app      = express();
const server   = http.createServer(app);
const {Server} = require('socket.io');

const io       = new Server(server,{
    cors:{origin:'*'}
})

//middlewares:
app.use(cors()); //Used to escape cors errors
app.use(express.json()); //Enables parsing of incoming request bodies in JSON format.

