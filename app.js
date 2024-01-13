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

const io = socketIo(server, {
  cors: {
    origin: '*'
  }
})

initSocket(io)

let port = process.env.PORT || 3000;
server.listen(port);
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});


const { updateEvents, emailRemainderForTomorrowEvents } = require('./utility/dailyTask');

setInterval(async () => {
    console.log("Running daily task update event...");
    try {
      updateEvents(); 
      emailRemainderForTomorrowEvents()
      console.log("Daily task completed.");
    } catch (error) {
      console.error("Error running daily task:", error);
    }
  
}, 1000 * 60 * 60 * 24); // Check every day