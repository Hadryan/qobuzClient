define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var player = require('component/auroraPlayer');
  var service = require('component/service/qobuz');
  /**
   * Module exports
   */

  return initialize;

  /**
   * Module function
   */

  function initialize() {
      player.attachTo(document);
      service.attachTo(document);
  }

});
