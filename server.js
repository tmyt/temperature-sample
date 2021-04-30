const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let temp = 0;
let humm = 0;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/put', function(req, res) {
  temp = req.query.t;
  humm = req.query.h;
  io.emit('data', {temp, humm});
});

io.on('connection', (socket) => {
  socket.emit('data', {temp, humm});
});

http.listen(process.env.PORT);