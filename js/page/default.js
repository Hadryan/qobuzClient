define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var player = require('component/auroraPlayer');

  /**
   * Module exports
   */

  return initialize;

  /**
   * Module function
   */

  function initialize() {
      player.attachTo(document);
  }

});
