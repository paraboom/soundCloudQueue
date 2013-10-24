define(['backbone'], function(Backbone){
    'use strict';

    var Model = Backbone.Model.extend({
        initialize: function(){
            this.on('change:track', function(m, t){
                this.unset('playlist');
            }, this);

            this.on('change:playlist', function(){
                this.set('trackNumber', 0);
            }, this);
        }
    });

    var View = Backbone.View.extend({
        events: {
            "click .player-play": "playpause",
            "click .player-next": "playNextTrack",
            "click .player-prev": "playPrevTrack"
        },
        initialize: function(){
            this.progressBar = this.$el.find('.player-progressbar');
            this.playBtn = this.$el.find('.player-play');
            this.nextBtn = this.$el.find('.player-next');
            this.prevBtn = this.$el.find('.player-prev');

            this.model.on('change:track', function(m, t){
                this.playTrack(m, t);
            }, this);

            this.model.on('change:playlist', function(m, p){
                this.playPlaylist(m, p);
            }, this);
        },
        playTrack: function(model, track){
            if (this.currentPlayer) {
                this.currentPlayer.stop();
                this.currentPlayer.destruct();
            }

            var that = this;

            SC.stream("/tracks/" + track.get('id'), {
                whileplaying: function(){
                    that.progressBar.css({
                        width: (this.position * 100) / this.duration + '%'
                    });
                },
                onplay: function(){
                    that.playBtn.removeClass('disabled');
                    that.playBtn.addClass('active');
                },
                onstop: function(){
                    that.progressBar.css({
                        width: 0 + '%'
                    });
                    that.playBtn.addClass('disabled');
                    that.playBtn.removeClass('active');
                },
                onpause: function(){
                    that.playBtn.removeClass('active');
                },
                onfinish: function(){
                    that.playNextTrack();
                }
            }, _.bind(function(song){
                this.playerEvents(song);
            }, this));
        },
        playPlaylist: function(model, playlist){
            this.playTrack(this, playlist.at(this.model.get('trackNumber')));
        },
        playerEvents: function(song){
            this.currentPlayer = song;
            this.currentPlayer.play();
        },
        playNextTrack: function(){
            var number = this.model.get('trackNumber') + 1,
                playlist = this.model.get('playlist');

            if (playlist) {
                if (number < playlist.length) {
                    this.model.set('trackNumber', number);
                    this.playTrack(this, playlist.at(this.model.get('trackNumber')));
                } else {
                    this.currentPlayer.stop();
                    this.currentPlayer.destruct();
                }
            }
        },
        playPrevTrack: function(){
            var number = this.model.get('trackNumber') - 1,
                playlist = this.model.get('playlist');

            if (playlist) {
                if (number >= 0) {
                    this.model.set('trackNumber', number);
                    this.playTrack(this, playlist.at(this.model.get('trackNumber')));
                } else {
                    this.currentPlayer.stop();
                    this.currentPlayer.destruct();
                }
            }
        },
        playpause: function(){
            if (this.playBtn.hasClass('disabled')) return false;

            if (this.playBtn.hasClass('active')) {
                this.currentPlayer.pause();
            } else {
                this.currentPlayer.resume();
            }
        }
    });

    return {
        Model: Model,
        View: View
    }
});