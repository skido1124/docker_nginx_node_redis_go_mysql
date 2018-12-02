var express = require('express');
var app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 7000;

server.listen(PORT, function(){
  console.log('server listening. Port:' + PORT);
});

const redis = require('redis');
const subscriber = redis.createClient(6379, 'redis');
const publisher = redis.createClient(6379, 'redis');

// redis の subscribe channel 名
const channelName = 'test';

// ルーティング
app.use(express.static(__dirname + '/public'));

// socket
io.on('connection', function (socket) {
  console.log('connection!!');

  // socket 経由で受け取ったデータを redis publish
  socket.on('message',function(msg){
    console.log('from socket message: "' + msg + '" to publish');
    // io.emit('message', msg);
    publisher.publish(channelName, msg);
  });

  // socket からの redis unsubscribe リクエスト
  socket.on('unsubscribe', function(channel) {
    console.log('unsubscribe channel: "' + channel + '"');
    subscriber.unsubscribe(channel);
  });
});

// redis subscribe
subscriber.subscribe(channelName);

// publish されたメッセージを受け取って emit
subscriber.on('message', function(channel, message) {
  console.log('subscribe channel: "' + channel + '", publish message: "' + message + '" to socket');
  io.emit('message', message);
});
// redis 再起動時、error イベントを貼っておけば自動で reconnect する
// イベント貼っていないと Exception 発生して落ちる
subscriber.on("error", function (err) {
  console.log("Error " + err);
});

// watch テスト
subscriber.set('testkey', 'testvalue', 'EX', 20);
