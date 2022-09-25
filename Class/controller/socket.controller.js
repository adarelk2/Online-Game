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
        let model = new Socket_Model(this.ws);
        model.send({method:"pong"});
    }
    
    sendMessage()
    {
        const model = new Socket_Model(this.ws);
        model.addNewMsg(this.params.msg);

        if(model.errors.length)
        {
            this.errors = model.errors;
        }
    }

    nextRoom()
    {
        let model = new Socket_Model(this.ws);
        let roomID = model.getRoom();
        console.log(roomID);
        if(roomID !== false)
        {
            const ROOMS = new Room_Controller(config.CHAT_ROOM,this.ws);
            ROOMS.deleteRoom([roomID]);
        }
        else
        {
            this.errors.push("לא נמצא חדר");
        }
    }

    roomMatch()
    {
        let method = "matched";
        let room_controller = new Room_Controller(config.CHAT_ROOM,this.ws);
        let userRoom = room_controller.getRoomValid();
        if(!userRoom)
        {
            userRoom = room_controller.createRoom();
            method = "waiting";
        }
        else
        {
            userRoom = room_controller.createMatch(userRoom.id);
        }

        userRoom.users.map(User=>{
            User.send(JSON.stringify({method}));
        })
        config.CHAT_ROOM = room_controller.rooms;
    }

    addUser()
    {
        this.ws.date = Date.now();
        this.ws.userid = this.params.userid;
        return this.ws;
    }

    deleteUsers()
    {
        this.params.users.map(user=>{
            let model = new Socket_Model(this.ws);
            let roomID = model.getRoom();
            if(roomID !== false)
            {
                const ROOMS = new Room_Controller(config.CHAT_ROOM,this.ws);
                ROOMS.deleteRoom([roomID]);
            }

            delete config.SOCKETS[user];
        })
    }
}

module.exports = Socket_Controller;