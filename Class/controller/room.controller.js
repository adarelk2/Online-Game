const config = require("../../app");
const Room_Model = require("../Model/room.model");

class Room_Controller
{
    rooms = [];
    ws = null;
    errors = [];
    constructor(_rooms,_ws)
    {
        this.rooms = _rooms;
        this.ws = _ws;
    }

    getRoomValid()
    {
        let response = false;
        this.rooms = this.rooms.filter((room,key)=>{
            let index = room.users.findIndex(User=>{
                return User.userid == this.ws.userid ? true : false;
            })

            if(index == -1)
            {
                return true;
            }
            else
            {
                this.deleteRoom([key]);
            }

        })
        this.rooms.map(room=>{
            if(room.users.length < 2)
            {
                response = room;
            }
        })

        return response;
    }

    deleteRoom(_rooms)
    {
        _rooms.map(room=>{
            this.rooms[room].users.map(User=>{
                if(User != this.ws.userid)
                {
                    User.send(JSON.stringify({method:"roomMatch"}));
                }
            })
            this.rooms.splice(room,1);
        })

        return this.rooms;
    }

    createMatch(_roomID)
    {
       let findRoom = this.rooms.findIndex(Element=>{
        return Element.id == _roomID ? true : false;
       })
        this.rooms[findRoom].addUser(this.ws);

        this.rooms[findRoom].users.map(User=>{
            this.rooms[findRoom].pushMsg(`Hey My Name is: ${User.userid}`,User.userid);
        })

        return this.rooms[findRoom];
    }

    createRoom()
    {
        const room = new Room_Model(this.ws);
        this.rooms.push(room);
        return room;
    }
}
module.exports = Room_Controller;