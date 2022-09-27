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
const Socket_Model = require('./Class/Model/socket.model');
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

const ROOMS = new Room_Controller()
exports.ROOMS = ROOMS;

const USERS = new Socket_Controller()
exports.USERS = USERS;

Wss.on("connection",(ws)=>{
    console.log("conneciton");
    ws.on("message",function incoming(message){
        const obj = JSON.parse(message);

        const socket = new Socket_Model(obj,ws);
        
        const method = obj.method;
        socket[method]();

        if(socket.errors.length)
        {
            ws.send(JSON.stringify({method:"errors",msg:socket.errors.join("<br>")}))
        }
    })
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

    const users = [];
    for (const [key, value] of Object.entries(USERS.ws)) 
    {
         users.push(key);
    }
    res.send(users);
}))

app.get("/getUnixTime",((req,res)=>{
    let time = Date.now();
    res.send(JSON.stringify(time));
}))

server.listen(port);
