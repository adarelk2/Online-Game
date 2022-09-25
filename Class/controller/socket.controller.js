const Socket_Model = require("../Model/socket.model");
const Room_Controller = require("../controller/room.controller");

class Socket_Controller
{
    ws = []
    constructor()
    {
        setInterval(()=>{

            const users = [];
            for (const [key] of Object.entries(this.ws)) 
            {
                let date = Date.now();
                if(date - this.ws[key].date > 10000)
                {
                    users.push(key);
                }  
            }
            this.deleteUsers(users);
        },3000)
    }

    addUser(_ws)
    {
       this.ws[_ws.userid] = _ws;
    }

    deleteUsers(_users)
    {
        _users.map(user=>{
            delete this.ws[user]
        })
    }
}

module.exports = Socket_Controller;