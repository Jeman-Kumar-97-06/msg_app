const path     = require('path');
const express  = require('express');
const http     = require('http');
const mongoose = require('mongoose');

require('dotenv').config();

const app      = express();
const server   = http.createServer(app);
const {Server} = require('socket.io');

