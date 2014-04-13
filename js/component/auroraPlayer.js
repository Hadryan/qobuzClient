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
    this.defaultAttrs({

    });

    this.after('initialize', function () {


        var player, onplay;
        var url = 'http://localhost:8080/reference/test.flac';
        if (player) player.stop();

        player = AV.Player.fromURL(url);
        player.on('error', function(e) { throw e });

        player.play();

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

            // Show the album art
//            if (data.coverArt)
//                document.querySelector("img").src = data.coverArt.toBlobURL();
        });
    });



//      console.log("on('file', function(file) {
//          if (file) {
//              if (player)
//                  player.disconnect();
//
//              player = new DGAuroraPlayer(AV.Player.fromFile(file), DGPlayer);
//              console.log("off('play', onplay);
//          }
//      });
  }

});
