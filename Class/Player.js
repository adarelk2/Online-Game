
class Player  
{
    x = 0;
    y = 0;
    life = 100;
    speed = 100;
    lastStep = null;

    constructor()
    {        
      this.x = Math.floor(Math.random()*550);
      this.y = Math.floor(Math.random()*100);
    }

    right()
    {
      if(this.x + 15 <= 815)
      {
        this.x +=15;
        this.lastStep = "right"
      }

    }

    left()
    {
      if(this.x - 15 > 0)
      {
        this.x -=15;
        this.lastStep = "left"
      }

    }

    up()
    {
      if(this.y - 15 > 0)
      {
        this.y -=15;
        this.lastStep = "up"
      }
    }

    down()
    {
      if(this.y + 15 <= 800)
      {
        this.y +=15;
        this.lastStep = "down"
      }
    }
}

module.exports = Player;