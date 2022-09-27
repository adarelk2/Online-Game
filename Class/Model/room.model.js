const config = require("../../app");

class Room_Model
{
    id = null;
    users = [];
    admin = null;
    messages = [];
    constructor(_user, _maxUsers=2, _title = "client ##")
    {
        this.id = Date.now();
        this.maxUsers = _maxUsers;
        this.title = _title;
        this.admin = _user.userid;
        this.addUser(_user);
    }

    addUser(_user)
    {
        _user.setRoomID(this.id);
        this.users.push(_user);
        return this;
    }

    pushMsg(_msg,_userid)
    {
        this.messages.push({userid:_userid,msg:_msg});

        this.users.map(user=>{
            user.send(JSON.stringify({method:"msg",messages:this.messages}));
        })
    }

    setAdmin(_admin)
    {
        this.admin = _admin;
    }
}

module.exports = Room_Model;