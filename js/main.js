require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore.min',
        backbone: 'libs/backbone.min',
        Handlebars: 'libs/Handlebars',
        templates: '../tmpl',
        text: 'libs/text',
        hbars: 'libs/hbars'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        Handlebars: {
            exports: 'Handlebars'
        }
    }
});

require(['backbone', 'modules/CurrentPlaylist'], function (Backbone, CurrentPlaylist) {
    'use strict';

    window.APP = {};

    // SC.initialize({
    //   client_id: '14d47315a9ec02e40f7710ce21b9637a',
    //   redirect_uri: 'http://127.0.0.1:3000/auth'
    // });

        // // initiate auth popup
        // SC.connect(function() {
        //   SC.get('/me', function(me) {
        //     alert('Hello, ' + me.username);
        //   });
        // });

    // SC.stream("/tracks/293", {
    //   autoPlay: true
    // }, function(song){
    //     window.song = song;
    // });

    APP.events = {};
    _.extend(APP.events, Backbone.Events);

    $(function(){
        APP.currentPlaylist = new CurrentPlaylist({
            el: $('.playlistContainer')
        });

        APP.currentPlaylist.render();
    });
});