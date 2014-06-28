'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var Throttle = require('throttle');

app.use(express.compress());
app.use(express.static(__dirname + '/../client'));

io.on('connection', function(socket) {
    var fileRequest;
    console.log('a user connected');
    socket.on('getFile', function(fileUri) {
        socket.on('command', function(command) {
            console.log(command);
            if (command === 'stop') {
                console.log('stop')
                fileRequest.abort();
            }
        });
        if (fileRequest) fileRequest.end();
        fileRequest = request(fileUri).on('response', function(response) {
            var throttledResponse = response.pipe(new Throttle(700 * 1024));

            socket.emit('fileSize', response.headers['content-length']);

            throttledResponse.on('data', function(data) {
                // console.log('sending: ' + fileUri);
                socket.emit('data', data);
            });
            throttledResponse.on('end', function() {
                socket.emit('end');
            });
        });
    });
});

http.listen(8888, function() {
    console.log('listening on *:8888');
});