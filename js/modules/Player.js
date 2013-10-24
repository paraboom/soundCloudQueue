define(['backbone'], function(Backbone){
    'use strict';

    var Model = Backbone.Model.extend({

    });

    var View = Backbone.View.extend({
        events: {
            "click .player-play": "playpause"
        },
        initialize: function(){
            this.progressBar = this.$el.find('.player-progressbar');
            this.playBtn = this.$el.find('.player-play');
            this.nextBtn = this.$el.find('.player-next');
            this.prevBtn = this.$el.find('.player-prev');

            this.listenTo(this.model, "change:track", this.playTrack);
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
                    that.playBtn.addClass('active');
                },
                onpause: function(){
                    that.playBtn.removeClass('active');
                }
            }, _.bind(function(song){
                this.playerEvents(song);
            }, this));
        },
        playerEvents: function(song){
            this.currentPlayer = song;
            this.currentPlayer.play();
        },

        playpause: function(){
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