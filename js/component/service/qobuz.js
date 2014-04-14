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
            // Setp 1
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
            if (userAuthToken && userAuthToken !== "")
                newArgs["user_auth_token"] = userAuthToken;

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

//            return Tomahawk.asyncRequest(http_build_query(url, args), callback);

        }

        function search(){
            var params = {
                query: 'lund quartet',
                type: "tracks"
            };
            getApiCallUrl(apiParameter.search, params);
        }

        function auth(username, password){
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

//            var that = this;
            oboe(getApiCallUrl(apiParameter.userLogin, params))
                .done(function(ret){
                    if (ret.user_auth_token && ret.user_auth_token !== "" && ret.user_auth_token !== null  ) {
                        userAuthToken = ret.user_auth_token;
    //                    window.localStorage['userAuthToken'] = ret.user_auth_token;

                        // Is user premium ?
    //                    that.hasFullTracks = (ret.user.credential.parameters.lossy_streaming === true) ;
    //                    window.localStorage['hasFullTracks'] = that.hasFullTracks;

                        // Is user hifi ?
                        if (ret.user.credential.parameters.lossless_streaming) {
    //                        that.formatId = 6;
    //                        window.localStorage['formatId'] = 6;
                            console.log('Lossless')
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
                    console.log(err);
                });
        }


        this.after('initialize', function () {
            var hitch = this;
            auth('user', 'password');
//            oboe('http://www.qobuz.com/api.json/0.2/album/get?app_id=100000000&album_id=5060091552784')
//                .node('tracks.items.*', function(track){
//                    console.log(track.title);
//                })
//                .done(function(things) {
//                    console.log(things);
//                    hitch.trigger(document, 'playTrackFromUrl' , {url: 'http://localhost:8080/reference/test.flac'});
//                })
//                .fail(function(err) {
//                    console.log(err);
//                });
        });
    }

});
