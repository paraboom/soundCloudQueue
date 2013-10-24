define(['backbone', 'modules/Track', 'modules/TracksList'], function(Backbone, Track, TracksList){
    'use strict';

    
    var Model = Backbone.Model.extend({
        /**
         * Init function for playlist model
         */
        initialize: function(){
            /**
             * Tracks collection
             */
            this.collection = new Track.Collection(this.fetch());

            // This flag notify that tracks in collection can be dragged to sort
            this.collection.isDraggable = true;

            // Saving our local playlist when tracks are added/removed from collection
            this.collection.on('add remove', function(){
                this.save();
            }, this);
        },

        /**
         * Override fetch method to get playlist from localStorage or return empty list
         */
        fetch: function(){
            if (localStorage.getItem('SCPlaylist')) {
                // JSON.parse coz we store our playlist in string form
                return JSON.parse(localStorage.getItem('SCPlaylist'));
            } else {
                return [];
            }
        },

        /**
         * Saving playlist to localStorage
         */
        save: function(){
            // Saving playlist using stringify method to store properly all data
            localStorage.setItem('SCPlaylist', JSON.stringify(this.collection.toJSON()));
        }
    });

    var View = Backbone.View.extend({
        events: {
            "click .fa-play": "playAll"
        },
        initialize: function(){
            // Inner collection view for rendering tracks
            this.tracksView = new TracksList({
                el: this.$el.find('.playlist-container'),
                collection: this.model.collection,
                itemView: Track.View
            });

            // Let's re-render our collection when add/remove event occurs
            this.model.collection.on('add remove', this.renderCollection, this);
            this.renderCollection();
        },
        // Delegating render process to collection view
        renderCollection: function(){
            if (this.model.collection.length) {
                this.tracksView.render();
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }
        },
        // We want to play entire playlist
        playAll: function(){
            App.events.trigger('playAll', this.model.collection);
        }
    });

    return {
        View: View,
        Model: Model
    }
});