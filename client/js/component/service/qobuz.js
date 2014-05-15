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
        var apiParameter = {
            limit: 500,
            endPoint: "http://www.qobuz.com/api.json/0.2/",
                userLogin: "user/login",
                search: "search/getResults",
                getFileUrl: "track/getFileUrl",
                app_id: "546568742",
                secret: "6e3e4f6d46c15303c618f474eb7962c3"
        };

        var userAuthToken = false;

        this.defaultAttrs({

        });

        function signRequest(methodName, args) {
            // Step 1
            var payload = methodName.replace('/','');

            // Step 2
            var paramsAsArray = [];

            for(var key in args)
            {
                if(args.hasOwnProperty(key))
                {
                    paramsAsArray.push(key+args[key]);
                }
            }

            payload += paramsAsArray.sort().join('');

            // Step 3
            var ts = Math.round((new Date()).getTime() / 1000);
            payload += ts;

            // Step 4
            payload += apiParameter.secret;

            // Hashing Parmentier
            var md5Payload = md5(payload);

            // Creating the new arguments
            var newArgs = args;

            newArgs["request_ts"] = ts;
            newArgs["request_sig"] = md5Payload;
            newArgs["app_id"] = apiParameter.app_id;
            if (userAuthToken && userAuthToken !== ""){
                newArgs["user_auth_token"] = userAuthToken;
            }

            return newArgs;

        }

        function http_build_query(url, parameters){
            var qs = "";
            for(var key in parameters) {
                var value = parameters[key];
                qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
            }
            if (qs.length > 0){
                qs = qs.substring(0, qs.length-1); //chop off last "&"
                url = url + "?" + qs;
            }
            return url;
        }

        function getApiCallUrl(methodName, args, callback, forceSync) {
            // Adding the payload / requests to the args (including app_id)
            args = signRequest(methodName,args);
            var url = apiParameter.endPoint + methodName;

            return http_build_query(url, args);
        }

        function getStreamUrl(track_id, callback){
            var params = {
                track_id: track_id,
                format_id: 6
            };

            oboe(getApiCallUrl(apiParameter.getFileUrl, params))
                .done(function(ret){
                    if (ret.status && ret.status == "error") {
                        console.log("error");
                    } else {
                        callback(ret.url);
                    }
                }).fail(function(err){
                    console.log(err);
                });
        }

        function search(query, type){
            var params = {
                query: query,
                type: type,
                limit: apiParameter.limit
            };
            return getApiCallUrl(apiParameter.search, params);
        }

        function auth(username, password, callback, errCallback){
            if(window.localStorage['userAuthToken']){
                userAuthToken = window.localStorage['userAuthToken'];
                callback();
            }else{
                var params;
                if (username.indexOf('@') != -1) {
                    params = { // User provided us with a username
                        email: username,
                        password: md5(password)
                    };
                } else {
                    params = { // User provided us with an email
                        username: username,
                        password: md5(password)
                    };
                }
                oboe(getApiCallUrl(apiParameter.userLogin, params))
                    .done(function(ret){
                        if (ret.user_auth_token && ret.user_auth_token !== "" && ret.user_auth_token !== null  ) {
                            userAuthToken = ret.user_auth_token;
                            window.localStorage['userAuthToken'] = userAuthToken;

                            // Is user premium ?
                            //                    that.hasFullTracks = (ret.user.credential.parameters.lossy_streaming === true) ;
                            //                    window.localStorage['hasFullTracks'] = that.hasFullTracks;

                            // Is user hifi ?
                            if (ret.user.credential.parameters.lossless_streaming) {
                                //                        that.formatId = 6;
//                                window.localStorage['formatId'] = 6;
//                                console.log('Lossless')
                                callback();
                            }
                        } else {
                            userAuthToken = false;
                            console.log('fail   ')
                            //                    that.hasFullTracks = false;
                            //                    that.formatId = 5;
                            //                    window.localStorage['userAuthToken'] = false;
                            //                    window.localStorage['hasFullTracks'] = false;
                            //                    window.localStorage['formatId'] = 5;
                        }
                    }).fail(function(err){
                        errCallback(err);
                    });
            }

        }


        this.after('initialize', function () {
            var hitch = this;

            this.on('login', function(ev, data){
                auth(data.user, data.password, function(){
                    hitch.trigger('loginComplete');
//                    hitch.trigger('playTrack', {track_id: '11412223'});
//                    window.alert('new')
                    hitch.trigger('search', {query: 'thriller', type: 'tracks'});
                }, function(err){
                    hitch.trigger('loginFailed', {err: err});
                });
            });

            this.on('search', function(ev, data){
                oboe(search(data.query, data.type))
                    .node(data.type + '.items.*', function(track){
                        hitch.trigger('item', track);
                    })
                    .done(function(ret){
                        console.log(ret);
                    }).fail(function(err){
                        throw(err.thrown);
                    }
                );

            });


            this.on('playTrack', function(ev, data){
                getStreamUrl(data.track_id, function(url){
                    hitch.trigger('playTrackFromUrl', {url: url});
                });
            });
        });
    }

});
