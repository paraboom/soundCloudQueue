define(['backbone', 'hbars!templates/track'], function(Backbone, tmpl){
    'use strict';

    var Model = Backbone.Model.extend({
        // Many tracks without genre, so override it with default value
        defaults: {
            genre: 'unknown',
            isPlaying: false
        },

        toJSON: function(){
            return _.omit(_.clone(this.attributes), 'isPlaying');
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var View = Backbone.View.extend({
        className: function(){
            var str = 'track';

            if (this.model.get('isPlaying')) {
                str += ' playing';
            }

            return str;
        },
        template: tmpl,
        // bind actions for buttons-icons
        events: {
            "click .track-button-play": "playSong",
            "click .track-button-add": "addSong",
            "click .track-button-remove": "removeSong"
        },
        initialize: function(){
            this.model.on('change:isDraggable', function(){
                this.$el.toggleClass('draggable', this.model.get('isDraggable'));
            }, this);

            this.model.on('change:isPlaying', function(){
                this.$el.toggleClass('playing', this.model.get('isPlaying'));
            }, this);
        },
        /**
         * Render track with model attributes
         */
        render: function(){
            this.$el.html(
                this.template(
                    _.extend(this.model.toJSON(), this.model.defaults)
                )
            );
            return this;
        },
        // Notify that we want to play this track
        playSong: function(){
            App.events.trigger('playTrack', this.model);
        },
        // Notify that we want to add track to playlist
        addSong: function(){
            App.events.trigger('addTrack', this.model);
        },
        // Remove track from playlist
        removeSong: function(){
            this.model.collection && this.model.collection.remove(this.model);
        }
    });

    return {
        Collection: Collection,
        View: View
    }
});