const express = require('express'); // using express
const http = require('http')
const port = process.env.PORT||3000 // setting the port
let app = express();
let server = http.createServer(app);
const WebSocket = require('ws');
const Socket_Controller = require("./Class/controller/socket.controller");
const Room_Controller = require("./Class/controller/room.controller");
const Wss = new WebSocket.Server({port:3001});
const bodyParser = require('body-parser');
const { log } = require('console');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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

        if(socket.errors.length)
        {
            ws.send(JSON.stringify({method:"errors",msg:socket.errors.join("<br>")}))
        }
    })

    setInterval(()=>{

        const users = [];
        for (const [key] of Object.entries(SOCKETS)) 
        {
            let date = Date.now();
            if(date - SOCKETS[key].date > 10000)
            {
               users.push(key);
            }  
        }
        const socket = new Socket_Controller({users},ws);
        socket.deleteUsers();
    },3000)

})

app.post("/API",((req,res)=>{
    const userName  = req.body.userName;
    if(SOCKETS[userName])
    {
        res.send({state:false,msg:"userName already Exist"});
    }
    else
    {
        res.send({state:true});
    }
}))

app.get("/getOnlineUsers",((req,res)=>{
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
    res.send(users);
}))

server.listen(port);