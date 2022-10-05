const config = require("../../app");
const Socket_Model = require("./socket.model");

class Lobby_Model extends Socket_Model
{
    constructor(_params, _ws)
    {        
      super(_params, _ws);
    }

    findRoom()
    {
      let room = config.ROOMS.getRoomsValid(this);
      if(!room)
      {
        this.errors.push("לא נמצא חדר");
      }
      else
      {
        room.addUser(this);
        config.ROOMS.sendRoomUpdated();
      }

    }

    createNewRoom()
    {
      config.ROOMS.createNewRoom(this);
      config.ROOMS.sendRoomUpdated();
    }

    backToLobdy()
    {
      config.ROOMS.disconnectFromRooms(this);      
      this.send({method:"EnterningLoby"})
      config.ROOMS.sendRoomUpdated();
    }

    sendRequestForRoomEntering()
    {
      if(this.getRoomID())
      {
        config.ROOMS.disconnectFromRooms(this);
      }

      let index = config.ROOMS.rooms.findIndex(room=>room.id == this.params.id);
      if(index >=0)
      {
        let Room = config.ROOMS.roomIsValid(this, index);
        if(!Room)
        {
          this.errors.push("החדר המלא יש לחפש חדר אחר");
        }
        else
        {
          Room.addUser(this);
        }

          config.ROOMS.sendRoomUpdated();
      }
      else
      {
        this.errors.push("התחברות לחדר נכשלה");
      }
    }

    getRooms()
    {
      this.send({method:"RoomList", rooms:config.ROOMS.rooms});
    }

}

module.exports = Lobby_Model;