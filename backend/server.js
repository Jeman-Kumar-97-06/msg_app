const path     = require('path');
const express  = require('express');
const http     = require('http');
const mongoose = require('mongoose');

require('dotenv').config();



//Creates an instance of 'express'
const app      = express(); 

//Creates a Raw HTTP server and integrating express to it by sending 'app' as an argument.
const server   = http.createServer(app); 

//middlewares:
app.use(cors()); //Used to escape cors errors
app.use(express.json()); //Enables parsing of incoming request bodies in JSON format.

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

const {Server} = require('socket.io');

const io       = new Server(server,{
    cors:{origin:'*'}
})

//In-memory map : roomName -> set of {socketId, username}
const roomUsers = new Map();





