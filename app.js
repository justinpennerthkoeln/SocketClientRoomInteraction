const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var http = require("http");
var io = require('socket.io');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const defualt_config = require('./config/default.json');

var roomRepo = require("./models/roomRepo");

//Server Config
const app = express();
var server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: defualt_config.express_session.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));

//Controllers
var usersRouter = require("./routes/users");
var roomsRouter = require(".//routes/rooms");

app.get("/", (req, res) => {
    res.render('index', {title: defualt_config.server.name + " Landing"})
});

app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var io = new io.Server(server, {

});

io.on('connection', (socket) => {
    var room;

    socket.on('create-room', async (room_name) => {
        var room = await roomRepo.create(room_name);
        io.to(socket.id).emit('created-room', (room.rows[0]));
    });

    socket.on('join-room', (room_id, room_name) => {
        try {
            room = room_id;
            socket.join(room_id);
        } catch (error) {
            throw new Error;
        }
    });

    socket.on('leave-room', () => {
        try {
            socket.leave();
        } catch (error) {
            throw new Error;
        }
    });

    socket.on('message', (init_message) => {
        io.sockets.in(init_message.room_id).emit('message', (init_message));
    });

});

server.listen(defualt_config.server.port);
console.log(`Server listen to port: ${defualt_config.server.port}`)