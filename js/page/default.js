define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var player = require('component/service/auroraPlayer');
  var service = require('component/service/qobuz');
  var login = require('component/visual/login');
  /**
   * Module exports
   */

  return initialize;

  /**
   * Module function
   */

  function initialize() {
      service.attachTo(document);
      loginPage();
  }

  function loginPage(){
      login.attachTo('#loginForm');
  }

  function mainPage() {
      player.attachTo(document);
  }

});
