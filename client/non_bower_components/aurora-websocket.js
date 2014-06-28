var socket = io();
(function() {
    'use strict';
    var __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    AV.WebSocketSource = (function(_super) {
        __extends(WebSocketSource, _super);

        function WebSocketSource(fileUri) {
            var _this = this;
            socket.emit('getFile', fileUri);
            _this.bytesLoaded = 0;

            socket.on('fileSize', function(data) {
                _this.length = data;
            });
            socket.on('data', function(data) {
                _this._incomingData(data, _this);
            });
            socket.on('end', function() {
                _this.emit('end');
            });
        }

        WebSocketSource.prototype._incomingData = function(data, _this) {
            var buf = new AV.Buffer(new Uint8Array(data));
            _this.bytesLoaded += buf.length;
            if (_this.length) {
                _this.emit('progress', _this.bytesLoaded / _this.length * 100);
            }
            _this.emit('data', buf);
        };


        WebSocketSource.prototype.start = function() {
            socket.emit('command', 'start');
        };

        WebSocketSource.prototype.stop = function() {
            console.log('stop')
            socket.emit('command', 'stop');
        };

        WebSocketSource.prototype.pause = function() {
            socket.emit('command', 'pause');
        };

        WebSocketSource.prototype.reset = function() {
            socket.emit('command', 'reset');
        };

        return WebSocketSource;

    })(AV.EventEmitter);

    AV.Asset.fromWebSocket = function(fileUri) {
        var source;
        source = new AV.WebSocketSource(fileUri);
        return new AV.Asset(source);
    };

    AV.Player.fromWebSocket = function(fileUri) {
        var asset;
        asset = AV.Asset.fromWebSocket(fileUri);
        return new AV.Player(asset);
    };

}).call(this);

/*
//@ sourceMappingURL=aurora-websocket.map
*/