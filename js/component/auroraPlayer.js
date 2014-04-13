define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(auroraPlayer);

  /**
   * Module function
   */

  function auroraPlayer() {
    var player;
    this.defaultAttrs({

    });

    this.playTrack = function(ev, data){
        var url = data.url;
        if (player) player.stop();
        player = AV.Player.fromURL(url);
        player.play();

        player.on('error', function(e) { throw e; });

        player.on('buffer', function(percent) {
            console.log("bufferProgress " +  percent);
        });

        player.on('progress',   function(time) {
            console.log("seekTime " +  time);
        });

        player.on('duration', function(duration) {
            console.log("duration " +  duration);
        });

        player.on('metadata', function(data) {
            console.log(data);
        });
    };

    this.after('initialize', function () {
        this.on(document, 'playTrackFromUrl', this.playTrack);
    });

  }

});
