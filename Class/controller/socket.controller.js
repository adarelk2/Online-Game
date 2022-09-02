const config = require("../../app");
const Socket_Model = require("../Model/socket.model");
const Room_Controller = require("../controller/room.controller");

class Socket_Controller
{
    params = null;
    ws = null;
    method = null;
    results = null;
    errors = [];
    constructor(_params,_ws)
    {
        this.params = _params;
        this.ws = _ws;
        this.method = _params.method;
    }

    ping()
    {
        config.SOCKETS[this.params.userid] = this.addUser();
        let model = new Socket_Model(config.SOCKETS[this.params.userid]);
        model.send({method:"pong"});
    }
    sendMessage()
    {
        const model = new Socket_Model(this.ws);
        model.addNewMsg(this.params.msg);
    }

    roomMatch()
    {
        let method = "matched";
        let room_model = new Room_Controller(config.CHAT_ROOM,this.ws);
        let userRoom = room_model.getRoomValid();
        if(!userRoom)
        {
            userRoom = room_model.createRoom();
            method = "waiting";
        }
        else
        {
            room_model.findMatch(userRoom.id);
        }

        config.CHAT_ROOM = room_model.rooms;
        console.log("____________");
        console.log(config.CHAT_ROOM);
    }

    addUser()
    {
        this.ws.date = Date.now();
        this.ws.userid = this.params.userid;
        return this.ws;
    }
}

module.exports = Socket_Controller;