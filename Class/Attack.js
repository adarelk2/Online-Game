const config = require("../app");

class Attack  
{
    x = 0;
    y = 0;
    #player = {};
    constructor({x,y},_player)
    {        
      this.x = x
      this.y = y
      this.range = 200;
      this.#player = _player;
    }

   shoot()
   {
      let room = config.ROOMS.getRoomByID(this.#player.getRoomID()).room;
      let count = 0;
      let timer = setInterval(()=>{
          if(count < this.range)
          {
            this.x -=5;
            room.sendMsg({method:"renderGame", room})
            count++;
          }
          else
          {
            clearInterval(timer);
          }

      },10)
      
   }

   getMyRoom()
   {
      return config.ROOMS.getRoomByID(this.player.roomID).room;
   }
}

module.exports = Attack;