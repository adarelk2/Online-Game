class Room_Model
{
    id = null;
    users = [];
    messages = [];

    constructor(_users)
    {
        this.users.push(_users);
        this.id = Date.now();

        return this;
    }

    addUser(_userID)
    {
        this.users.push(_userID);
        return this;
    }

    pushMsg(_msg,_userid)
    {
        this.messages.push({userid:_userid,msg:_msg});

        this.users.map(user=>{
            user.send(JSON.stringify({method:"msg",messages:this.messages}));
        })
    }
}

module.exports = Room_Model;