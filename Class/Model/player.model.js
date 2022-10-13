const config = require("../../app");
const Socket_Model = require("./socket.model");
const Attack = require("../Attack");
const Player = require('../Player');

class Player_Model extends Socket_Model
{
    constructor(_params, _ws)
    {        
      super(_params, _ws);
    }

    initPlayer()
    {
      this.ws.player = new Player();
    }

    left()
    {
      this.ws.player.left();
      let room = config.ROOMS.getRoomByID(this.getRoomID());
      room.sendMsg({method:"renderGame",room})
    }

    right()
    {
      this.ws.player.right();
      let room = config.ROOMS.getRoomByID(this.getRoomID());
      room.sendMsg({method:"renderGame",room})
    }

    up()
    {
      this.ws.player.up();
      let room = config.ROOMS.getRoomByID(this.getRoomID());
      room.sendMsg({method:"renderGame",room})
    }

    down()
    {
      this.ws.player.down();
      let room = config.ROOMS.getRoomByID(this.getRoomID());
      room.sendMsg({method:"renderGame",room})
    }

    shoot()
    {
      this.ws.player.shoot = new Attack(this);
      this.ws.player.shoot.shoot();
    }

    demage(_count = 10)
    {
      this.ws.player.life -= _count;
    }

    startPlay()
    {
      let room = config.ROOMS.getRoomByID(this.getRoomID());
      if(room.getCountOfPlayers() <=1)
      {
        this.errors.push("אין אפשרות להתחיל מתחת ל2 שחקנים");
      }

      if(!this.errors.length)
      {
        room.startPlay();
      }
    }
}

module.exports = Player_Model;