const express = require('express');
const app = express();
const ExpressPeerServer = require('peer').ExpressPeerServer;

app.get('/', function (req, res, next) {
  res.send('Hello world!');
});

const server = app.listen(9000, function () {
  console.log('Start server listening on port 9000');
});

const options = {
  debug: true,
  allow_discovery: true,
}

const peerserver = ExpressPeerServer(server, options);

peerserver.on('connection', function (peerId) {
  console.log(`connected peer ${peerId}`);
  console.log(peerserver._clients)
});

peerserver.on('disconnect', function (peerId) {
  console.log(`disconnect peer ${peerId}`);
});

app.use('/peerjs', peerserver);