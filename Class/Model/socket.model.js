const config = require("../../app");

class Socket_Model
{
    userid = false;
    date = null
    errors = [];
    constructor(_params,_ws)
    {   
      this.date = Date.now();
      this.ws = _ws; 
      this.params = _params;
      this.userid = this.ws.userid;
    }

    ping()
    { 
        if(this.params.userid)
        {
          this.ws.userid = this.params.userid;
        }

        config.USERS.addUser(this);
        this.send({method:"pong", ping: new Date().getTime()});
    }

    send(_msg)
    {
      this.ws.send(JSON.stringify(_msg));
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
          this.errors.push("התחברות לחדר נכשלה");
        }
        else
        {
          Room.addUser(this);
          this.send({method:"enteringTheRoom", roomID: Room.id});
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

    getRoomID()
    {
      return this.ws.roomID;
    }

    setRoomID(_id)
    {
      this.ws.roomID = _id;
    }
}

module.exports = Socket_Model;