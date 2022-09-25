const config = require("../../app");

class Socket_Model
{
    userid = null;
    date = null
    constructor(_params,_ws)
    {   
      this.userid = _params.userid;
      this.date = Date.now();
      this.ws = _ws; 
    }

    ping()
    {
        if(this.userid)
        {
          config.USERS.addUser(this);
          this.send({method:"pong"});
        }
    }

    send(_msg)
    {
      this.ws.send(JSON.stringify(_msg));
    }

    findRoom()
    {
      let indexRoom = config.ROOMS.getRoomsValid(this);
      console.log(this);
    }
}

module.exports = Socket_Model;