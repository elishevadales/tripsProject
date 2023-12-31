
const express = require('express');
const path = require('path');
const http = require('http');
const cors = require("cors");

const socketIo = require('socket.io');

const { routesInit } = require("./routes/config_route");
require("./db/mongoConnect")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))

routesInit(app);

const server = http.createServer(app);
const io = socketIo(server);
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('join_event', (data) => {
      const eventId = data.eventId;
      socket.join(`event_${eventId}`);
    });
  
    socket.on('message', (data) => {
      const eventId = data.eventId;
      const message = data.message;
  
      io.to(`event_${eventId}`).emit('message', { userId: socket.id, message });
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
let port = process.env.PORT || 3000;
server.listen(port);