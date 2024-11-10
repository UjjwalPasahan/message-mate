import express from "express"
import http from "http"
import { Server } from "socket.io";
import dotenv from "dotenv"
import { addMsgToConversation } from "./controllers/msgController.js";
import cors from 'cors'


// dotenv library loads environment variables from .env file into process.env


dotenv.config();
const PORT = process.env.PORT || 5000;
// use the port specified in the environment variable PORT, or default to port 5000

let userSocketMap ={}
const app = express();
const server = http.createServer(app);
app.use(cors())

const io = new Server(server, {
   cors: {
       allowedHeaders: ["*"],
       origin: "*"
    // Replace with your frontend URL and port
      }
});


// io is an instance of the Socket.IO server class that is associated with and attached to the HTTP server


// Allow WebSocket connections from different origins to the Socket.IO server by relaxing the browser's same-origin policy


io.on('connection', (socket) => {
   const username = socket.handshake.query.username;
   console.log('Username of connected client:', username);


   userSocketMap[username] = socket;


   socket.on('chat msg', (msg) => {
       const receiverSocket = userSocketMap[msg.receiver];
       console.log(msg.sender)
       console.log(msg.text)
       console.log(msg.receiver)
       if(receiverSocket) {
         	receiverSocket.emit('chat msg', msg);
       }
       addMsgToConversation([msg.sender, msg.receiver],
         {
           text: msg.text,
           sender:msg.sender,
           receiver:msg.receiver
         });

   });
})

import msgsRouter from './routes/msgsRoutes.js'
import { connectionInstance } from "./db/connectToDB.js";


app.use('/msgs', msgsRouter);

// When a client connects to the Socket.IO server, a unique socket object is created to represent that client's connection. This socket object allows bidirectional communication between the server and the specific client that it represents.


app.get('/', (req, res) => {
   res.send("Welcome to HHLD Chat App!");
});


server.listen(PORT, (req, res) => {
   connectionInstance()
   console.log(`Server is running at ${PORT}`);
})
