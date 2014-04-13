'use strict';

requirejs.config({
  baseUrl: 'bower_components',
  shim: {
    underscore: {
        exports: '_'
    }
  },
  paths: {
    'component': '../js/component',
    'page': '../js/page'
  }
});

require(
  [
    'flight/lib/compose',
    'flight/lib/registry',
    'flight/lib/advice',
    'flight/lib/logger',
    'flight/lib/debug'
  ],

  function(compose, registry, advice, withLogging, debug) {
    debug.enable(true);
    compose.mixin(registry, [advice.withAdvice]);

    require(['page/default'], function(initializeDefault) {
      initializeDefault();
    });
  }
);
