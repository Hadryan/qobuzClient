Qobuz Client
===========

A client for qobuz.com, the current website streams mp3's and the desktop app doesn't run on linux.

This is a solution:

Runs in modern browsers, uses a client side javascript library to decode flac streams from Qobuz.
The flac files are streamed over websocket due to xhr not emitting binary progress events.

Node.JS, Socket.IO, Twitter Flight, audiocogs/aurora.js, Oboe.JS, Bower.

Uses docker for CD


Build instructions are run the docker file and forward port 8888.

OR

Run the commands from the docker file on any platform.

```
cd client
bower install
cd ..\server
npm install
node server.js
```
