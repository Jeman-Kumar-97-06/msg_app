const path     = require('path');
const express  = require('express');
const http     = require('http');
const mongoose = require('mongoose');

require('dotenv').config();



//Creates an instance of 'express'
const app      = express(); 

//Creates a Raw HTTP server and integrating express to it by sending 'app' as an argument.
const server   = http.createServer(app); 

//app vs server : 
//Abstraction level:
    //'app' operates at higher level, providing a framework for defining application logic
    //'server' operates at lower level, handling fundamental network communication of HTTP protocol

//Responsibility : 
    //'app' defines what your application does with requests.
    //'server' handles how those reqs are received and dispatched to the 'app'

//Flexibility : 
    // with 'server' you get more control, especially when integrating other protocols (like Websockets) or when u 
    // need more granular control over server functions.
    // with 'app' you have less control compared to 'server'.
    
//Dependency (How app and server depend on each other.): 
    //'app' is just a function handler (ie., a function that responds to events) that knows how 
    // to respond to http requests.
    // Also, 'app' can't listen to reqs at a 'port' by itself. It needs a 'http server' underneath.

//middlewares:
app.use(cors()); //Used to escape cors errors
app.use(express.json()); //Enables parsing of incoming request bodies in JSON format.



const {Server} = require('socket.io');

//Initiate SocketIO:
//Creating a socketio server instance and attaching it to the existing http server : 'server'.
const io       = new Server(server,{
    cors:{origin:'*'}
})

//In-memory map : roomName -> set of {socketId, username}
const roomUsers = new Map();

//Helper to emit userlist for a room : 
function broadcaseRoomUserlist(room) {
    const set = roomUsers.get(room) || new Set();
    const users = Array.from(set).map(obj=>({id:obj.socketId,username:obj.username}));
    io.to(room).emit('room:userlist',{room,users});
}

io.use((socket,next)=>{
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Auth error : token required'));
    try {
        const payload = jwt.verify(token,process.env.SEC)
    }
})



