// Standard requirejs config
require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        jquery: 'libs/jquery.min',
        underscore: 'libs/underscore.min',
        backbone: 'libs/backbone.min',
        Handlebars: 'libs/Handlebars',
        templates: '../tmpl',
        text: 'libs/text',
        // hbars plugin to use Handlebars templates like modules
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

require(['backbone', 'modules/Player', 'modules/Search', 'modules/Track', 'modules/TracksList', 'modules/CurrentPlaylist'], function (Backbone, Player, Search, Track, TracksList, Playlist) {
    'use strict';

    // Global object for Application
    window.App = {};

    // Init SoundCloud API
    SC.initialize({
      client_id: '14d47315a9ec02e40f7710ce21b9637a',
      redirect_uri: 'http://ishornikov.ru/auth'
    });

    // Global events to communication between modules
    App.events = {};
    _.extend(App.events, Backbone.Events);

    $(function(){
        // player object
        App.player = {};
        App.player.model = new Player.Model();
        App.player.view = new Player.View({
            model: App.player.model,
            el: $('#player')
        });

        // object for searching/playing tracks
        App.search = {};
        App.search.model = new Search.Model();
        App.search.view = new Search.View({
            model: App.search.model,
            el: $('#search')
        });
        // tracks collection for search
        App.search.tracks = new Track.Collection();
        // view for tracks collection
        App.search.tracksView = new TracksList({
            el: $('.trackslist'),
            collection: App.search.tracks,
            itemView: Track.View
        });

        // local playlist object
        App.playlist = {};
        App.playlist.model = new Playlist.Model();
        App.playlist.view = new Playlist.View({
            model: App.playlist.model,
            el: $('#playlist')
        });

        // Found tracks
        App.events.on('searchTracks', function(tracks){
            App.search.tracks.reset(tracks);
        });

        // Someone wants to play track
        App.events.on('playTrack', function(track){
            App.player.model.set('track', track);
        });

        // Add track to local playlist
        App.events.on('addTrack', function(track){
            App.playlist.model.collection.add(track.toJSON());
        });

        // Someone want to play playlist
        App.events.on('playAll', function(collection){
            App.player.model.set('playlist', collection);
        });
    });
});