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
// /put?temp=18.22&humm=22.70&key=room3&type=temp
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
  console.log(data[key]);
  res.sendStatus(200);
});

// GET /なにか
// GET /ほげ
// GET /room1
// GET /room1
// GET /room1.temp
app.get('/:key.:type', async function (req, res) {
  const { key, type } = req.params;
  if (!type) return res.sendStatus(500);
  try {
    const html = await fs.readFile(`${__dirname}/${type}.html`, 'utf-8');
    res.set('content-type', 'text/html');
    res.send(html.replace("%%key%%", key));
  } catch (e) {
    res.sendStatus(404);
  }
});

io.on('connection', (socket) => {
  socket.on('init', (key) => {
    socket.join(key);
    socket.emit('data', data[key] || {});
  });
});

http.listen(process.env.PORT);
