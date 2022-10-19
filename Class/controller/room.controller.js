const config = require("../../app");
const RoomConfig = require("../../Const/Room.js");
const Room_Model = require("../Model/room.model");

class Room_Controller
{
    rooms = {};
    constructor()
    {
    }

    disconnectFromRooms(_ws)
    {
        for (const [key, room] of Object.entries(this.rooms)) 
        {
        let userExist = this.searchUserInRoom(_ws,room.id);
            if(userExist.state)
            {
                room.removePlayer(userExist);

                if(room.getCountOfPlayers() <= 1 && room.gameStarted)
                {
                    room.sendMsg({method:"EnterningLoby"})

                    this.deleteRooms([room.id])
                }
                else
                {
                    if(room.admin == _ws.userid)
                    {
                        room.setRandomAdmin();
                    }
                }
            }
        }
    }

    getRoomsValid(_ws)
    {        
        let currentRoom = false;
        this.disconnectFromRooms(_ws);

        for (const [key, value] of Object.entries(this.rooms)) 
        {
            if(this.roomIsValid(_ws, value.id))
            {
               currentRoom = value;
            }
        }

      return currentRoom
    }

    getRoomByID(_id)
    {
        let room = false;
        if(this.rooms[_id])
        {
            room = this.rooms[_id];
        }

        return room;
    }

    roomIsValid(_ws, _id)
    {
        return ((config.ROOMS.rooms[_id].getCountOfPlayers() < config.ROOMS.rooms[_id].maxUsers) && !this.searchUserInRoom(_ws, _id).state) ? config.ROOMS.rooms[_id] : false;
    }

    createNewRoom(_ws)
    {
        this.disconnectFromRooms(_ws);

        const Room = new Room_Model(_ws);
        this.rooms[Room.id] = Room;

        return Room;
    }

    searchUserInRoom(_ws, _id)
    {
       let result = {state:false,userid:_ws.userid, team:null};
       const TEAM = RoomConfig.Room.Team;
       TEAM.map(team=>{
        for (const [key, value] of Object.entries(this.rooms[_id][team].players)) 
        {
            if(value.userid == _ws.userid)
            {
                result.state = true;
                result.team = team;
            }
        }
    })
       return result;
    }

    deleteRooms(_rooms)
    {
      _rooms.map(id=>{
        delete this.rooms[id];
      })    
    }

    sendRoomUpdated()
    {
        setTimeout(()=>{    
            config.USERS.sendGlobal({method:"RoomList",rooms:JSON.stringify(this.rooms)});
        },1000)
    }
}
module.exports = Room_Controller;