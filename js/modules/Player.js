define(['backbone'], function(Backbone){
    'use strict';

    var Model = Backbone.Model.extend({
        initialize: function(){
            // When we playing track, we should unset playlist
            this.on('change:track', function(m, t){
                this.unset('playlist');
            }, this);

            // When we playing playlist, we should start it from beginning
            this.on('change:playlist', function(){
                this.set('trackNumber', 0);
            }, this);
        }
    });

    var View = Backbone.View.extend({
        // Player controls
        // play/pause track
        // next track
        // prev track
        events: {
            "click .player-play": "playpause",
            "click .player-next": "playNextTrack",
            "click .player-prev": "playPrevTrack"
        },
        initialize: function(){
            // Caching DOM element for future operations
            this.progressBar = this.$el.find('.player-progressbar');
            this.playBtn = this.$el.find('.player-play');
            this.nextBtn = this.$el.find('.player-next');
            this.prevBtn = this.$el.find('.player-prev');

            // Let's play track when it is set
            this.model.on('change:track', function(m, t){
                this.playTrack(m, t);
            }, this);

            // Playing playlist
            this.model.on('change:playlist', function(m, p){
                if (p) {
                    this.playPlaylist(m, p);
                }
            }, this);
        },
        /**
         * Playing track
         */
        playTrack: function(model, track){

            // Stop and destruct old song (not very good decision)
            if (this.currentPlayer) {
                this.currentPlayer.stop();
                this.currentPlayer.destruct();
            }

            var that = this;

            // Using SoundCloud API to stream our track
            SC.stream("/tracks/" + track.get('id'), {
                /**
                 * refresh progress bar when track is playing
                 */
                whileplaying: function(){
                    that.progressBar.css({
                        width: (this.position * 100) / this.duration + '%'
                    });
                },
                /**
                 * Activating control buttons
                 */
                onplay: function(){
                    that.playBtn.removeClass('disabled');
                    that.playBtn.addClass('active');
                },
                /**
                 * Reset defaults
                 */
                onstop: function(){
                    that.progressBar.css({
                        width: 0 + '%'
                    });
                    that.playBtn.addClass('disabled');
                    that.playBtn.removeClass('active');
                },
                /**
                 * Play/pause logic
                 */
                onpause: function(){
                    that.playBtn.removeClass('active');
                },
                /**
                 * Let's try to play next track
                 */
                onfinish: function(){
                    that.playNextTrack();
                }
            }, _.bind(function(song){
                this.currentPlayer = song;
                this.currentPlayer.play();

                if (this.currentPlayingTrack) {
                    this.currentPlayingTrack.set('isPlaying', false);
                }

                track.set('isPlaying', true);
                this.currentPlayingTrack = track;
            }, this));
        },
        /**
         * Playing playlist from 'trackNumber' number track
         */
        playPlaylist: function(model, playlist){
            this.playTrack(this, playlist.at(this.model.get('trackNumber')));
        },
        /**
         * If we have playlist and track isn't last, play next track
         */
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
        /**
         * If we have playlist and track isn't first, play previous track
         */
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
        /**
         * Play/pause buttons logic
         */
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