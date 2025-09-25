const path     = require('path');
const express  = require('express');
const http     = require('http');
const mongoose = require('mongoose');
const cors     = require('cors');

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

//This is what runs before the server accepts connection from a socket.
//The the following function sees if the handshake from 'client' has {auth:[<token>]}.
io.use((socket,next)=>{
    //See if the 'auth' object exists and 'auth.token' values exists:
    const token = socket.handshake.auth && socket.handshake.auth.token;
    //If no token is found send error:
    if (!token) return next(new Error('Auth error : token required'));

    //Try to verify the JWT:
    try {
        const payload = jwt.verify(token,process.env.SEC)
        //Attach the 'user' object to the socket. format : 
        socket.user   = payload
        //Go the the next middleware ie., the 'io.on(connection,.....)' shit you see below after this function
        return next();
    } catch (err) {
        console.error('socket auth fail: ',err.message);
        return next(new Error('Authentication error : invalid token'));
    }
});

//Tells everything you can do on 'connection':
io.on('connection',(socket)=>{
    //Console log that socket has connected and log his/her id and username:
    console.log('Socket connected',socket.id,'user: ',socket.user.username);

    //Auto join a default room : 
    const defaultRoom = 'general';
    socket.join(defaultRoom);

    //Add user to in-memory room set:
    let set = roomUsers.get(defaultRoom);
    
    //If the defaultRoom doesn't exist in in-memory roomUsers map, 
    // then, create a 'defaultRoom' value inside 'roomUsers' and set it to an empty set:
    if (!set) {
        set = new Set();
        roomUsers.set(defaultRoom,set);
    }

    set.add({socketId: socket.id, username: socket.user.username}); //* Remember we already attached 'user' to 'socket'.

    //Notify the defaultRoom that a user has joined : The following file will send everyone in 'defaultRoom' except the guy that just joined:
    socket.to(defaultRoom).emit('chat:message',{
        user:"Server", //This line tells the client that the event was from 'Server' not any 'user'.
        text:`${socket.user.username} joined ${defaultRoom}`,
        createdAt: new Date().toISOString()
    });

    //Join a room : This function is executed when 'joinRoom' event triggered by the client:
    socket.on('joinRoom',(roomName,cb)=>{
        try {
            //First see if the roomName exists. If not send the user to 'general' room
            roomName = String(roomName || 'general');
            //Join the room:
            socket.join(roomName);

            //Add user to in-memory room set:
            //See if the room with roomName exists in roomUsers:
            let set = roomUsers.get(roomName);
            //If not create one : 
            if (!set) {
                set = new Set();
                roomUsers.set(roomName,set);
            }

            //When values in sets are objects js can't compare them, they are only compared by reference. So, even if you try to save a duplicate it will 
            //save it as a new value. Bcoz the memory references are not the same even if the values are same. So to avoid duplicates to join a room we
            //need to save the info on user as a string:
            set.add({socket:id})

            //Notify room about joining of the user:
            socket.to(roomName).emit('chat:message',{
                user : 'Server',
                text : `${socket.user.username} joined ${roomName}`,
                createdAt: new Date().toISOString()
            });
            //send success acknowledgment : First, make sure the client sent a function as 'callback' not a string or any other shit:
            if (typeof cb == 'function') {
                cb({ok:true,room:roomName});
            }
            //Now emit the updated userlist to others in the room : 
            broadcaseRoomUserlist(roomName);
        }
        catch (err) {
            console.error('joinRoom error',err);
            if (typeof cb === 'function') {
                cb({ok:false,error:'join failed'})
            }
        }
    })

    //Leaving a room : This function is executed when 'leaveRoom' event is triggered by the client : 
    socket.on('leaveRoom',(roomName,cb) => {
        try {
            roomName = String(roomName || 'general');
            socket.leave(roomName);

            //remove from the in-memory set:
            const set = roomUsers.get(roomName);
            if (set) {
                //Remove the socket/ user that sent the 'leaveRoom' trigger:
                const newSet = new Set(Array.from(set).filter(obj => obj.socketId !== socket.id));
                if (newSet.size > 0) { //If the users are not zero update the set.
                    roomUsers.set(roomName, newSet); 
                } else { //If the users are zero use delete the room
                    roomUsers.delete(roomName);
                }
            }
            socket.to(roomName).emit('chat:message',{
                user:'Server',
                text:`${socket.user.username} left ${roomName}`,
                createdAt: new Date().toISOString()
            })
            if (typeof cb === 'function') {
                cb({ok:true,room:roomName})
            }
            broadcaseRoomUserlist(roomName);
        } catch (error) {
            console.error('leaveRoom error',error);
            if (typeof cb == 'function') {
                cb({ok:false,error:'leave failed'})
            }
        }
    });

    //Chat message -> expects {room,text}:
    socket.on('chat:message',(payload)=>{
        try {
            const room = String((payload && payload.room) || 'general');
            const text = String((payload && payload.text) || '').trim();

            //End this shit if no message is sent:
            if (!text) {
                return;
            }

            const msg = {
                user : socket.user.username,
                text,
                createdAt: new Date().toISOString()
            }

            //Emit the above msg obj to room only 
            io.to(room).emit('chat:message',msg);
        } catch (error){
            pass
        }
    })

    //Handle Disconnect : remove from all rooms tracked:
    socket.on('disconnect',(reason) => {
        console.log('Socket disconnected:',socket.id,'reason: ',reason);
        //Remove socket from all room sets : 
        for (const [room,set] of roomUsers.entries()) {
            const newSet = new Set(Array.from(set).filter(obj=>obj.socketId !== socket.id));
            if (newSet.size>0) {
                roomUsers.set(room,newSet);
            } else {
                roomUsers.delete(room);
            }
            broadcaseRoomUserlist(room);
        }
    })
});


mongoose.connect(process.env.MONGOURL).then(()=>{
    server.listen(process.env.PORT,()=>{
            console.log("Server listening on 4000")
        })
}).catch(error=>{console.log(
    'Server connection error:',error
)})



