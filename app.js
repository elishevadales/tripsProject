const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const cors = require("cors");
const socketIo = require('socket.io');
const { routesInit } = require("./routes/config_route");
require("./db/mongoConnect")
const { initSocket } = require('./utility/socket');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))

routesInit(app);

const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('a user connected');
  });


initSocket(io)

let port = process.env.PORT || 3000;
server.listen(port);
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`)
});