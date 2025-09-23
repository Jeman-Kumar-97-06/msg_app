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

//When a client connects : 
io.on('connection',(socket)=>{
    console.log('A user connected : '+ socket._id);

    //Listen for events from client : 
    socket.on('chat message',(msg) => {
        console.log('Message' + msg);
        //Send to all clients : 
        io.emit('chat message',msg)
    })
})