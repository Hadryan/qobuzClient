#!/bin/env node
 //  OpenShift sample Node application
var express = require('express');
var fs = require('fs');
var WebSocketServer = require('ws').Server,
    http = require('http');
var request = require('request');


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8888;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function() {
        //  Process on exit and signals.
        process.on('exit', function() {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() {
                self.terminator(element);
            });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = {};

        //        self.routes['/asciimo'] = function(req, res) {
        //            var link = "http://i.imgur.com/kmbjB.png";
        //            res.send("<html><body><img src='" + link + "'></body></html>");
        //        };
        //
        //        self.routes['/'] = function(req, res) {
        //            res.setHeader('Content-Type', 'text/html');
        //            res.send(self.cache_get('index.html') );
        //        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();


        self.app.use(express.compress());

        self.app.use(express.static(__dirname + '/../client'));

        //        //  Add handlers for the app (from the routes).
        //        for (var r in self.routes) {
        //            self.app.get(r, self.routes[r]);
        //        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        var server = http.createServer(self.app);

        server.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
        var wss = new WebSocketServer({
            server: server
        });


        var Throttle, audioFolder, fs, path, port, theRequest;

        Throttle = require('throttle');

        wss.on('connection', function(ws) {
            var audioPath, audioStream, createFileStream, playing;
            var res = null;
            audioPath = '';
            playing = false;
            console.log('connected');
            ws.on('close', function() {
                return audioStream != null ? audioStream.removeAllListeners() : void 0;
            });
            ws.on('message', function(msg) {
                msg = JSON.parse(msg);
                console.log(msg)
                if (msg.fileName != null) {
                    audioPath = msg.fileName;
                    //                        console.log(audioPath);
                    //                        request({url: audioPath, method: 'head'}, function(err, res, body) {
                    //                            if (err) {
                    //                                console.log(err);
                    //                                return ws.send(JSON.stringify({
                    //                                    error: 'Could not retrieve file.'
                    //                                }));
                    //                            } else {


                    createFileStream();


                } else if (msg.resume) {
                    if (res != null) {
                        res.resume();
                    }
                    playing = true;
                } else if (msg.pause) {
                    if (res != null) {
                        res.pause();
                    }
                    playing = false;
                } else if (msg.reset) {
                    if (res != null) {
                        res.removeAllListeners();
                    }
                    playing = false;
                    createFileStream();
                } else if (msg.end) {

                    theRequest.abort();
                    res.removeAllListeners();
                    ws.close();
                    console.log('disconenct')
                }
            });
            createFileStream = function() {
                theRequest = request(audioPath).on('response', function(resp) {
                    res = resp.pipe(new Throttle(700 * 1024));
                    console.log(res.headers);

                    ws.send(JSON.stringify({
                        fileSize: resp.headers['content-length']
                    }));
                    res.on('data', function(data) {
                        console.log(data)
                        //                        console.log(data.toString())
                        return ws.send(data, {
                            binary: true
                        });
                    });
                    res.on('end', function() {
                        return ws.send(JSON.stringify({
                            end: true
                        }));
                    });


                    playing = true;

                    if (!playing) {
                        res.pause();
                    }
                });
                //                    audioStream = theRequest.pipe(new Throttle(700 * 1024));


            };
        });

        console.log("Serving WebSocket for Aurora.js on port " + port);


    };

}; /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();