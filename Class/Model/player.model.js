const config = require("../../app");
const Socket_Model = require("./socket.model");
const Attack = require("../Attack");

class Player_Model extends Socket_Model
{
    constructor(_params, _ws)
    {        
      super(_params, _ws);
    }

    left()
    {
      this.ws.player.left();
      let room = config.ROOMS.getRoomByID(this.getRoomID()).room;
      room.sendMsg({method:"renderGame",room})
    }

    right()
    {
      this.ws.player.right();
      let room = config.ROOMS.getRoomByID(this.getRoomID()).room;
      room.sendMsg({method:"renderGame",room})
    }

    up()
    {
      this.ws.player.up();
      let room = config.ROOMS.getRoomByID(this.getRoomID()).room;
      room.sendMsg({method:"renderGame",room})
    }

    down()
    {
      this.ws.player.down();
      let room = config.ROOMS.getRoomByID(this.getRoomID()).room;
      room.sendMsg({method:"renderGame",room})
    }

    shoot()
    {
      this.ws.shoot = new Attack(this.ws.player,this);
      this.ws.shoot.shoot();
    }

    getMyTeamKey()
    {
      let room_config = config.ROOMS.getRoomByID(this.getRoomID()).room;
      console.log(room_config);
    }

}

module.exports = Player_Model;