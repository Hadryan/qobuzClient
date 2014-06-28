define(function(require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(login);

    /**
     * Module function
     */

    function login() {
        this.defaultAttrs({

        });

        this.submit = function(ev) {
            ev.preventDefault();
            this.$node.find('button[type="submit"]')[0].disabled = true;
            this.trigger(document, 'login', {
                user: this.$node.find('#username')[0].value,
                password: this.$node.find('#password')[0].value
            });
        };

        this.afterLogin = function() {
            this.$node.find('button[type="submit"]')[0].disabled = false;
        };

        this.loginFailed = function(ev, data) {
            this.$node.find('#loginError')[0].innerHTML = data.err.jsonBody.message;
        };

        this.loginComplete = function() {
            this.$node.removeClass('in');
            this.$node.addClass('out');
        };

        this.after('initialize', function() {
            this.on('submit', this.submit);
            this.on(document, 'loginComplete', this.afterLogin);
            this.on(document, 'loginFailed', this.afterLogin);
            this.on(document, 'loginComplete', this.loginComplete);
            this.on(document, 'loginFailed', this.loginFailed);

            this.$node.find('#username').focus();
        });

    }

});