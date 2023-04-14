var express = require('express');
const router = express.Router();

const userRepo = require('../models/userRepo');
var saved_user = {};

router.get('/', (req, res) => {
    res.render("users/landing", { title : "Landing Page"});
});


router.get('/login', (req, res) => {
    res.render("users/login", { title : "Login"});
});

router.get('/register', (req, res) => {
    res.render("users/register", { title : "Register"});
});

router.post('/login', async function(req, res) {
    try {
        var user = (await userRepo.getUserByNameAndPassword(req.body.username, req.body.password)).rows[0];
        saved_user = user;
        if(user != undefined) {
            res.redirect('/users/'+ user.id);
        } else {
            res.redirect('/users/login');
        }
    } catch (error) {
        throw new Error;
    }
});

router.post('/register', async function(req, res) {
    try {
        await userRepo.create(req.body.username, req.body.password);
        res.redirect('/users/login');
    } catch (error) {
        throw new Error;
    }
});

router.get('/:id', (req, res) => {
    try {
        if(saved_user == undefined) {throw new Error;}
        req.session.user = saved_user;
        res.redirect('/rooms/rooms');
        saved_user = {};
    } catch (err) {
        throw new Error;
    }
});


module.exports = router;