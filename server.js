const fs = require('fs').promises;
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const data = {};

app.get('/', (req, res) => {
  res.send('no content');
});
// /put?temp=18.22&humm=22.70&key=room1
// /put?temp=18.22&humm=22.70&key=room2
// /put?temp=18.22&humm=22.70&key=room3
// /put?lux=1333&key=step1
// /put?lux=1333&key=lobby2
// /put?xxxxxxxxx
app.get('/put', function (req, res) {
  const { key, ...queries } = req.query;
  data[key] = {
    ...queries,
    updated: new Date(),
  };
  io.to(key).emit('data', data[key]);
  res.sendStatus(200);
});

// GET /なにか
// GET /ほげ
// GET /room1
app.get('/:key', async function (req, res) {
  res.set('content-type', 'text/html');
  //if (key.startsWith('temp.')) {
  //  const html = await fs.readFile(__dirname + '/temp.html', 'utf-8');
  //  res.send(html.replace());
  //}
  //else if (key.statsWith('lux.')) {
  //  const html = await fs.readFile(__dirname + '/lux.html');
  //  res.send(html.replace());
  //}
  const html = await fs.readFile(__dirname + '/index.html', 'utf-8');
   res.send(html.replace("%%key%%", req.params.key));
});

io.on('connection', (socket) => {
  socket.on('init',
    (key) => {
      socket.to(key).emit('data', data[key]);
    });
});

http.listen(process.env.PORT);
