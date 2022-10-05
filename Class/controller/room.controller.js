const config = require("../../app");
const RoomConfig = require("../../Const/Room.js");
const Room_Model = require("../Model/room.model");

class Room_Controller
{
    rooms = [];
    constructor()
    {
    }

    disconnectFromRooms(_ws, _callback=false)
    {
        this.rooms.map((room,index)=>{
            let userExist = this.searchUserInRoom(_ws,index);
            console.log(userExist);
            if(userExist.state)
            {
                if(room.getCountOfPlayers() <= 1)
                {
                    this.deleteRooms([index])
                }
                else
                {
                    room.removePlayer(userExist);
                    if(room.admin == _ws.userid)
                    {
                        room.setRandomAdmin();
                    }
                }
            }
        })

        if(_callback)
        {
            _callback(_ws);
        }
    }

    getRoomsValid(_ws)
    {        
        let currentRoom = false;
        this.disconnectFromRooms(_ws);
        this.rooms.map((room, index)=>{
            if(this.roomIsValid(_ws, index))
            {
               currentRoom = room;
            }
        })

      return currentRoom
    }

    getRoomByID(_id)
    {
        let index = this.rooms.findIndex(room=>room.id == _id);
        let room = (index >=0) ? this.rooms[index] : false;

        return {index,room};
    }

    roomIsValid(_ws, _index)
    {
        return ((config.ROOMS.rooms[_index].getCountOfPlayers() < config.ROOMS.rooms[_index].maxUsers) && !this.searchUserInRoom(_ws, _index).state) ? config.ROOMS.rooms[_index] : false;
    }

    createNewRoom(_ws)
    {
        this.disconnectFromRooms(_ws);

        const Room = new Room_Model(_ws);
        this.rooms.push(Room);

        return Room;
    }

    searchUserInRoom(_ws, _index)
    {
       let result = {state:false, index:false, team:null};
       const TEAM = RoomConfig.Room.Team;
       TEAM.map(team=>{
        this.rooms[_index][team].map((user,_indexPlayer)=>{
            if(user.userid == _ws.userid)
            {
                result.state = true;
                result.index = _indexPlayer;
                result.team = team;
            }
           })
       })

       return result;
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
            config.USERS.sendGlobal({method:"RoomList",rooms:JSON.stringify(this.rooms)});
        },1000)
    }
}
module.exports = Room_Controller;