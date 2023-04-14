var express = require('express');
const router = express.Router();

var roomRepo = require('../models/roomRepo') 

router.get("/", async (req, res) => {
    if(req.session.user) {
        var rooms = await roomRepo.getAll();
        res.render('rooms/rooms', {title:'Rooms', user:req.session.user, rooms:await rooms.rows});
    } else {
        res.redirect("/users/login");
    }
});

router.get("/rooms", async (req, res) => {
    if(req.session.user) {
        var rooms = await roomRepo.getAll();
        res.render('rooms/rooms', {title:'Rooms', user:req.session.user, rooms:await rooms.rows});
    } else {
        res.redirect("/users/login");
    }
});

router.get("/:id", async (req, res) => {
   if(req.session.user) {
        var room = await roomRepo.getById(req.path.split('/')[1]);
        res.render('rooms/room', {title:'Room' + room.rows[0].room_name, room:room.rows[0], user:req.session.user});
   } else {
        res.redirect("/users/login");
   }
});

module.exports = router;