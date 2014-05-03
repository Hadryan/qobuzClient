define(function (require) {

    'use strict';

    /**
     * Module dependencies
     */

    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */

    return defineComponent(list);

    /**
     * Module function
     */

    function list() {
        var tableBody;

        var templateString = '<table class="pure-table pure-table-horizontal">\
            <thead>\
            <tr>\
                <th>Track</th>\
                <th>Artist</th>\
                <th>Time</th>\
                <th>Album</th>\
            </tr>\
            </thead>\
        <tbody id="list">\
        </tbody>\
        </table>';

        var templateRowString = '<tr id="{{id}}">\
                <td>{{track}}</td>\
                <td>{{artist}}</td>\
                <td>{{time}}</td>\
                <td>{{album}}</td>\
            </tr>';

        var templateRow = Hogan.compile(templateRowString);

        function formatDuration(duration){
            var minutes = Math.floor(duration / 60),
                seconds = duration - minutes * 60;
            seconds = ("0" + Number(seconds)).slice(-2);

            return minutes.toString() + ':' + seconds.toString();
        }

        this.defaultAttrs({
            itemSelector: 'tr'
        });


        this.handleItem = function(ev, data){
            var artist;

            if(data.artist && data.artist.name){
                artist = data.artist.name;
            }else if(data.performer && data.performer.name){
                artist = data.performer.name;
            }else{
                artist = data.album.artist.name;
            }

            var item = {
                id: 'track_' + data.id,
                track: data.title,
                artist: artist,
                time: formatDuration(data.duration),
                album: data.album.title
            };

            tableBody.append(templateRow.render(item));
        };

        this.handleRowClicked = function(ev, data){
            var el = data.el,
                id = el.id.substr(6);
            this.trigger('playTrack', {track_id: id});
        };

        this.after('initialize', function () {
            this.node.innerHTML = templateString;
            tableBody = $(this.$node.find('#list')[0]);

            this.on(document, 'item', this.handleItem);

            this.on('click', {
                'itemSelector': this.handleRowClicked
            });
        });

    }

});
