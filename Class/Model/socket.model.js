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
        let userRestart = false;

        if(this.params.userid)
        {
          if(!this.ws.userid)//first Time Connected
          {
            userRestart = true;
          }
          this.ws.userid = this.params.userid;
        }

        config.USERS.addUser(this);
        this.send({method:"pong", ping: new Date().getTime()});

        if(userRestart)
        {
          config.ROOMS.disconnectFromRooms(this.ws);
          config.ROOMS.sendRoomUpdated();
        }
    }

    send(_msg)
    {
      setTimeout(()=>{
        this.ws.send(JSON.stringify(_msg));
      },500)
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