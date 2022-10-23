const RoomConfig = require("../../Const/Room.js");
const Player_Model = require("../Model/player.model");

class Room_Model
{
    id = null;
    admin = null;
    Alpha = {
        coins:0,
        players:{}
    }
    Bravo = {
        coins:0,
        players:{}
    }
    gameStarted = false;
    messages = [];
    constructor(_user, _maxUsers=4, _title = "client ##")
    {
        this.id = Date.now();
        this.maxUsers = _maxUsers;
        this.title = _title;
        this.admin = _user.userid;

        this.addUser(_user);
    }

    addUser(_user)
    {
        let Player = new Player_Model(null, _user.ws);

        const team = this.getDefaultTeam();

        this[team].players[_user.userid] = Player;
        Player.setRoomID(this.id);

        Player.initPlayer();

        let method = (this.gameStarted) ? "renderGame" : "roomRender";
        this.sendMsg({method, room:this});
        return this;
    }

    getDefaultTeam()
    {
        let count = this.maxUsers;
        let team_selected = RoomConfig.Room.Team[0];

        RoomConfig.Room.Team.map(team=>{
            if(Object.keys(this[team].players).length < count)
            {
                count = Object.keys(this[team].players).length
                team_selected = team;
            }
        })

        return team_selected;
    }

    setAdmin(_admin)
    {
        this.admin = _admin.userid;

        let method = (this.gameStarted) ? "renderGame" : "roomRender";
        this.sendMsg({method, room:this});
    }

    setRandomAdmin()
    {
        const newAdmin = (Object.keys(this[RoomConfig.Room.Team[0]].players).length) ? Object.values(this[RoomConfig.Room.Team[0]].players)[0] : Object.values(this[RoomConfig.Room.Team[1]].players)[0];
        this.setAdmin(newAdmin);
    }

    sendMsg(_msg)
    {
        RoomConfig.Room.Team.map(team=>{
            for (const [key, value] of Object.entries(this[team].players)) 
            {
                value.send(_msg)
            }
        })
    }

    getCountOfPlayers()
    {
        let count = 0;
        RoomConfig.Room.Team.map(team=>{
            count = count + Object.keys(this[team].players).length;
        })

        return count;
    }

    removePlayer(_user)
    {
        this[_user.team].players[_user.userid].setRoomID(false);
        delete this[_user.team].players[_user.userid];

        let method = (this.gameStarted) ? "renderGame" : "roomRender";
        this.sendMsg({method, room:this});
    }

    startPlay()
    {
        this.gameStarted = true;

        this.sendMsg({method:"renderGame",room:this})
    }

    isUserExist(_user)
    {
        let response = (this.Bravo.players[_user.userid] || this.Alpha.players[_user.userid]) ? true : false;
        return response;
    }

    getPlayerTeam(_user)
    {
        let isUserExist = this.isUserExist(_user);
        let team = false;

        if(isUserExist)
        {
            team = (this.Bravo.players[_user.userid]) ? "Bravo" : "Alpha";
        }

        return team;
    }

    addCoin(_team)
    {
        this[_team].coins +=1;
    }
}

module.exports = Room_Model;