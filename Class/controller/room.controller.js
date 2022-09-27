const config = require("../../app");
const Room_Model = require("../Model/room.model");

class Room_Controller
{
    rooms = [];
    constructor()
    {
    }

    returnToLoby(_ws)
    {
      this.rooms.map((room,index)=>{
        let userExist = this.searchUserInRoom(_ws,index);
        if(userExist >=0)
        {
            if(room.users.length <= 1)
            {
                this.deleteRooms([index])
            }
            else
            {
                this.rooms[index].users.splice(userExist,1);
                room.setAdmin(room.users[0].userid);
            }
        }
      })
    }

    getRoomsValid(_ws)
    {        
        let currentRoom = false;
        this.returnToLoby(_ws);
        this.rooms.map((room, index)=>{
            if(this.roomIsValid(_ws, index))
            {
               currentRoom = room;
            }
        })

      return currentRoom
    }

    roomIsValid(_ws, _index)
    {
        return ((config.ROOMS.rooms[_index].users.length >= 0 &&config.ROOMS.rooms[_index].users.length < config.ROOMS.rooms[_index].maxUsers) && this.searchUserInRoom(_ws, _index)) ? config.ROOMS.rooms[_index] : false;
    }

    createNewRoom(_ws)
    {
        this.returnToLoby(_ws);

        const Room = new Room_Model(_ws);
        this.rooms.push(Room);

        return Room;
    }

    searchUserInRoom(_ws, _index)
    {
        return this.rooms[_index].users.findIndex(User=>User.userid == _ws.userid);
    }

    deleteRooms(_rooms)
    {
      _rooms.map(room=>{
        this.rooms.splice(room,1);
        })
    }

    sendRoomUpdated()
    {
        setTimeout(()=>{
            let rooms = [];
            this.rooms.map(room=>{
                rooms.push({id: room.id, users: JSON.stringify(room.users), maxUsers:room.maxUsers, title:room.title, admin:room.admin});
            })
    
            config.USERS.sendGlobal({method:"RoomList",rooms:rooms});
        },1000)
    }
}
module.exports = Room_Controller;