const RoomConfig = require("../../Const/Room.js");
const config = require("../../app");

class Room_Model
{
    id = null;
    admin = null;

    messages = [];
    constructor(_user, _maxUsers=4, _title = "client ##")
    {
        this.id = Date.now();
        this.maxUsers = _maxUsers;
        this.title = _title;
        this.admin = _user.userid;

        RoomConfig.Room.Team.map(team=>{
            this[team] = [];
        })

        this.addUser(_user);
    }

    addUser(_user)
    {
        const team = this.getDefaultTeam();

        _user.setRoomID(this.id);
        this[team].push(_user);

        this.sendMsg({method:"roomRender", room:this});
        return this;
    }

    getDefaultTeam()
    {
        let count = this.maxUsers;
        let team_selected = RoomConfig.Room.Team[0];

        RoomConfig.Room.Team.map(team=>{
            if(this[team].length < count)
            {
                count = this[team].length
                team_selected = team;
            }
        })

        return team_selected;
    }

    setAdmin(_admin)
    {
        this.admin = _admin.userid;
        this.sendMsg({method:"roomRender", room: this})
    }

    setRandomAdmin()
    {
        const newAdmin = (this[RoomConfig.Room.Team[0]].length) ? this[RoomConfig.Room.Team[0]][0]  : this[RoomConfig.Room.Team[1]][0];
        this.setAdmin(newAdmin);
    }

    sendMsg(_msg)
    {
        RoomConfig.Room.Team.map(team=>{
            this[team].map(user=>{
                user.send(_msg)
            })
        })
    }

    getCountOfPlayers()
    {
        let count = 0;
        RoomConfig.Room.Team.map(team=>{
            count = count + this[team].length;
        })

        return count;
    }

    removePlayer(_index)
    {
        this[_index.team][_index.index].setRoomID(false);
        this[_index.team].splice(_index.index,1);
        this.sendMsg({method:"roomRender", room:this});
    }

    startPlay()
    {
        RoomConfig.Room.Team.map(team=>{
            this[team].map(user=>{
                user.initPlayer();
            })
        })
        this.sendMsg({method:"renderGame",room:this})
    }
}

module.exports = Room_Model;