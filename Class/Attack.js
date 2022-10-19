const config = require("../app");

class Attack  
{
    x = 0;
    y = 0;
    #player = {};
    #usersDemage = {};
    constructor(_player)
    {        
      this.range = 80;
      this.#player = _player;

      let room = config.ROOMS.rooms[this.#player.getRoomID()];

      let team = room.getPlayerTeam(this.#player.ws);
      const Enemy = {
        "Bravo" : "Alpha",
        "Alpha" : "Bravo"
      };
       this.myEnemy = Enemy[team];
    }
  
    init()
    {
      this.x = this.#player.ws.player.x
      this.y = this.#player.ws.player.y
      this.#usersDemage = [];
    }

    shoot()
    {
      this.init();

      let room = config.ROOMS.rooms[this.#player.getRoomID()];

      const direction = this.#player.ws.player.lastStep;

      let count = 0;
      let timer = setInterval(()=>{
          if(count < this.range)
          {
            switch(direction)
            {
              default:
              case "right":
                this.x +=10;
                break;
              case "left":
                this.x -=10;
                break;
              case "up":
                this.y -=10;
                break;
              case "down":
                this.y +=10;
                break;
            }
            count++;

            this.checkDemage();
          }
          else
          {
            clearInterval(timer);
            this.x = 0;
            this.makeDamage();            
          }

            room.sendMsg({method:"renderGame", room})

      },15)
    }

    checkDemage()
    {
      let room = config.ROOMS.rooms[this.#player.getRoomID()];
      for (const [key, user] of Object.entries(room[this.myEnemy].players)) 
      {
        let y = user.ws.player.x - this.x;
        let x = user.ws.player.y - this.y;
        
        let d = Math.sqrt(x * x + y * y);
        if(d <=35)
        {
          this.#usersDemage[user.userid] = user;
        }
      }
    }

    makeDamage()
    {
      for (const [key, user] of Object.entries(this.#usersDemage)) 
      {
        user.demage();
        if(user.ws.player.life <=0)
        {
          let room = config.ROOMS.rooms[user.getRoomID()];
          let team = room.getPlayerTeam(this.#player.ws);
          room.addCoin(team);

          user.initPlayer();
        }
      }
    }
}

module.exports = Attack;