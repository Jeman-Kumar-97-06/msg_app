// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

const User = require('./models/User');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socketio_jwt_rooms';
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

// --- Express + HTTP server ---
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error', err));

// --- Helper: create JWT ---
function createToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
}

// --- Auth middleware for HTTP routes ---
function httpAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid Authorization header' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Signup ---
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = createToken(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Login ---
app.post('/api/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Protected route example ---
app.get('/api/me', httpAuth, (req, res) => {
  res.json({ user: req.user });
});

// --- Socket.io server + JWT middleware ---
const io = new Server(server, {
  cors: { origin: '*' }, // change origin in production
});

// In-memory map: roomName -> Set of { socketId, username }
const roomsUsers = new Map();

// helper to emit userlist for a room
function broadcastRoomUserlist(room) {
  const set = roomsUsers.get(room) || new Set();
  const users = Array.from(set).map(obj => ({ id: obj.socketId, username: obj.username }));
  io.to(room).emit('room:userlist', { room, users });
}

io.use((socket, next) => {
  // client must send token in handshake auth: { token }
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error: token required'));
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = payload; // { id, username }
    return next();
  } catch (err) {
    console.error('socket auth fail', err.message);
    return next(new Error('Authentication error: invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id, 'user:', socket.user.username);

  // Optionally join a default room (e.g., 'general') on connect:
  // const defaultRoom = 'general';
  // socket.join(defaultRoom);
  // addToRoomMap(defaultRoom, socket);

  // Join a room
  socket.on('joinRoom', (roomName, cb) => {
    try {
      roomName = String(roomName || 'general');
      socket.join(roomName);

      // Add user to in-memory room set
      let set = roomsUsers.get(roomName);
      if (!set) {
        set = new Set();
        roomsUsers.set(roomName, set);
      }
      // store as JSON string in Set? we store objects but Set equality is by reference, so store by socketId uniqueness:
      set.add({ socketId: socket.id, username: socket.user.username });

      // notify room
      socket.to(roomName).emit('chat:message', {
        user: 'Server',
        text: `${socket.user.username} joined ${roomName}`,
        createdAt: new Date().toISOString()
      });

      // send success ack
      if (typeof cb === 'function') cb({ ok: true, room: roomName });

      // emit updated userlist for room
      broadcastRoomUserlist(roomName);
    } catch (err) {
      console.error('joinRoom error', err);
      if (typeof cb === 'function') cb({ ok: false, error: 'join failed' });
    }
  });

  // Leave a room
  socket.on('leaveRoom', (roomName, cb) => {
    try {
      roomName = String(roomName || 'general');
      socket.leave(roomName);

      // remove from in-memory set
      const set = roomsUsers.get(roomName);
      if (set) {
        // rebuild set excluding this socket
        const newSet = new Set(Array.from(set).filter(obj => obj.socketId !== socket.id));
        if (newSet.size > 0) roomsUsers.set(roomName, newSet);
        else roomsUsers.delete(roomName);
      }

      socket.to(roomName).emit('chat:message', {
        user: 'Server',
        text: `${socket.user.username} left ${roomName}`,
        createdAt: new Date().toISOString()
      });

      if (typeof cb === 'function') cb({ ok: true, room: roomName });
      broadcastRoomUserlist(roomName);
    } catch (err) {
      console.error('leaveRoom error', err);
      if (typeof cb === 'function') cb({ ok: false, error: 'leave failed' });
    }
  });

  // Chat message -> expects { room, text }
  socket.on('chat:message', (payload) => {
    try {
      const room = String((payload && payload.room) || 'general');
      const text = String((payload && payload.text) || '').trim();
      if (!text) return;

      const msg = {
        user: socket.user.username,
        text,
        createdAt: new Date().toISOString(),
      };

      // emit only to room
      io.to(room).emit('chat:message', msg);
    } catch (err) {
      console.error('chat message error', err);
    }
  });

  // Optional: request active rooms (simple)
  socket.on('rooms:list', (cb) => {
    try {
      const rooms = Array.from(roomsUsers.keys());
      if (typeof cb === 'function') cb({ ok: true, rooms });
    } catch (err) {
      if (typeof cb === 'function') cb({ ok: false, error: 'failed' });
    }
  });

  // Handle disconnect: remove from all rooms tracked
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected', socket.id, 'reason:', reason);
    // Remove socket from all room sets
    for (const [room, set] of roomsUsers.entries()) {
      const newSet = new Set(Array.from(set).filter(obj => obj.socketId !== socket.id));
      if (newSet.size > 0) roomsUsers.set(room, newSet);
      else roomsUsers.delete(room);

      // Broadcast updated userlist
      broadcastRoomUserlist(room);
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
