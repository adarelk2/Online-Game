const config = require("../../app");


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
                if(date - this.ws[key].date > 7000)
                {
                    users.push(key);
                }  
            }
            this.deleteUsers(users);
        },2000)
    }

    addUser(_ws)
    {
        this.ws[_ws.ws.userid] = _ws;
    }

    deleteUsers(_users)
    {
        _users.map(user=>{
            config.ROOMS.disconnectFromRooms(this.ws[user]);
            delete this.ws[user]
        })
        if(_users.length)
        {
            config.ROOMS.sendRoomUpdated();
        }
    }

    sendGlobal(_msg)
    {
        for (const [key, value] of Object.entries(this.ws)) 
        {
            value.send(_msg);
        }
    }
}

module.exports = Socket_Controller;