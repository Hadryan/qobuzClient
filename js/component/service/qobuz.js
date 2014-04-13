define(function (require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(qobuzService);

    /**
     * Module function
     */

    function qobuzService() {
        this.defaultAttrs({

        });

        this.after('initialize', function () {
            var hitch = this;
            oboe('http://www.qobuz.com/api.json/0.2/album/get?app_id=100000000&album_id=5060091552784')
                .node('tracks.items.*', function(track){
                    console.log(track.title);
                })
                .done(function(things) {
                    console.log(things);
                    hitch.trigger(document, 'playTrackFromUrl' , {url: 'http://localhost:8080/reference/test.flac'});
                })
                .fail(function(err) {
                    console.log(err);
                });
        });
    }

});
