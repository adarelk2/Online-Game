
class Player  
{
    x = 0;
    y = 0;
    life = 100;
    speed = 100;
    stepsX = 0;
    constructor()
    {        
      this.x = Math.floor(Math.random()*350);
      this.y = Math.floor(Math.random()*50);
    }

    right()
    {
      if(this.x + 15 <= 346)
      {
        this.x +=15;
      }
    }

    left()
    {
      if(this.x - 15 > 0)
      {
        this.stepsX--;
        this.x -=15;
      }
    }

    up()
    {
      if(this.y - 15 > 0)
      {
        this.y -=15;
      }

    }

    down()
    {
      if(this.y + 15 <= 345)
      {
        this.y +=15;
      }
    }
}

module.exports = Player;