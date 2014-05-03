define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var player = require('component/service/auroraPlayer');
  var service = require('component/service/qobuz');
  var login = require('component/visual/login');
  var list = require('component/visual/list');
  /**
   * Module exports
   */

  return initialize;

  /**
   * Module function
   */

  function initialize() {
      service.attachTo(document);
      login.attachTo('#loginFormModal');
      player.attachTo(document);
      list.attachTo('#main');
  }
});
