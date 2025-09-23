const express  = require('express');
const http     = require('http');
const {Server} = require('socket.io');

const app      = express();
const server   = http.createServer(app);

//Initiate Socket.io:
const io       = new Server(server,{
    cors : {
        origin : '*',
    }
});

