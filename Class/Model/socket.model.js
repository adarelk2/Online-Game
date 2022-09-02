const config = require("../../app");
const Room_Model = require("../Model/room.model");

class Socket_Model
{
    params = null;
    date = null;
    constructor(_ws)
    {
        for (const [key, value] of Object.entries(_ws)) 
        {
          if(this[key])
          {
            this[key] = value;
          }
        }
        
        this.params = _ws; 
    }

    send(_message)
    {
        this.params.send(JSON.stringify(_message));
    }

    addNewMsg(_msg)
    {
      let roomID = false;

      config.CHAT_ROOM.map((room,key)=>{
        const findIndex = room.users.findIndex(User=>{
          return User.userid == this.params.userid ? true : false;
        })

        if(findIndex >=0)
        {
          roomID = key;
        }
      })

      if(roomID !== false)
      {
        config.CHAT_ROOM[roomID].pushMsg(_msg,this.params.userid);
      }

    }
}

module.exports = Socket_Model;