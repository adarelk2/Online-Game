const config = require("../../app");
const Response = require("../../Const/response");

class Socket_Model
{
    ws = null;
    errors = [];
    date = null;
    constructor(_ws)
    {   
        this.ws = _ws; 
    }

    send(_message)
    {
        this.ws.send(JSON.stringify(_message));
    }

    getRoom()
    {
      let roomID = false;

      config.CHAT_ROOM.map((room,key)=>{
        const findIndex = room.users.findIndex(User=>{
          return User.userid == this.ws.userid ? true : false;
        })
        if(findIndex >=0 && config.CHAT_ROOM[key].users.length > 1)
        {
          roomID = key;
        }
      })

      return roomID;
    }

    addNewMsg(_msg)
    {
      let roomID = this.getRoom();
      if(roomID !== false)
      {
        config.CHAT_ROOM[roomID].pushMsg(_msg,this.ws.userid);
      }
      else
      {
        this.errors.push(Response.ERRORS.roomDesntExist);
      }
    }
}

module.exports = Socket_Model;