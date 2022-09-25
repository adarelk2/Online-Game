const config = require("../../app");
const Room_Model = require("../Model/room.model");

class Room_Controller
{
    rooms = [];
    ws = null;
    errors = [];
    constructor(_rooms)
    {
        this.rooms = _rooms;
    }

    getRoomsValid()
    {
      return this.rooms
    }

    
}
module.exports = Room_Controller;