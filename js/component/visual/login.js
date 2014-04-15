define(function (require) {

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

        this.submit = function(ev){
            ev.preventDefault();
            this.trigger(document, 'login', {
                user: this.$node.find('#username')[0].value,
                password: this.$node.find('#password')[0].value
            });
        }


        this.after('initialize', function () {
            this.on('submit', this.submit);
        });

    }

});
