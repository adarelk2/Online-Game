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
        this.rooms = this.rooms.filter(room=>{
            let index = room.users.findIndex(User=>{
                return User.userid == this.ws.userid ? true : false;
            })

            if(index == -1)
            {
                return true;
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
            const index = this.rooms.findIndex(Room=>{
                return Room.id == room ? true : false;
            })

            if(index >=0)
            {
                this.rooms.splice(index,1);
            }
        })
    }

    findMatch(_roomID)
    {
       let findRoom = this.rooms.findIndex(Element=>{
        return Element.id == _roomID ? true : false;
       })
        this.rooms[findRoom].addUser(this.ws);

        return this;
    }

    createRoom()
    {
        const room = new Room_Model(this.ws);
        this.rooms.push(room);
        return room;
    }
}
module.exports = Room_Controller;