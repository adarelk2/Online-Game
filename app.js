const express = require('express'); // using express
const http = require('http')
const port = process.env.PORT||3000 // setting the port
let app = express();
let server = http.createServer(app);
const WebSocket = require('ws');
const Socket_Controller = require("./Class/controller/socket.controller");
const Wss = new WebSocket.Server({port:3001});

const SOCKETS = {};
exports.SOCKETS = SOCKETS;

const CHAT_ROOM = [];
exports.CHAT_ROOM = CHAT_ROOM;

Wss.on("connection",(ws)=>{
    ws.on("message",function incoming(message){
        const obj = JSON.parse(message);
        const socket = new Socket_Controller(obj,ws);
        const method = socket.method;
        socket[method]();
    })

    setInterval(()=>{
        for (const [key, value] of Object.entries(SOCKETS)) 
        {
            let date = Date.now();
            if(date - SOCKETS[key].date > 3000)
            {
                delete SOCKETS[key];
            }  
        }

        const users = [];
        for (const [key, value] of Object.entries(SOCKETS)) 
        {
            if(SOCKETS[key].userid)
            {
                users.push(SOCKETS[key].userid);
            }
        }

        users.filter(user=>{
            return user ? true : false;
        })
        ws.send(JSON.stringify({method:"users_online",users:users}));
    },3000)

})

app.get("/getOnlineUsers",((req,res)=>{
    const users = [];
    SOCKETS.map(row=>{
        if(row.userid)
        {
            users.push(row.userid);
        }
    })
    res.send(users);
}))

server.listen(port);