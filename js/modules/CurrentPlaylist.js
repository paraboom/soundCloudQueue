define(['backbone', 'modules/Track', 'modules/TracksList'], function(Backbone, Track, TracksList){
    'use strict';

    var Model = Backbone.Model.extend({
        initialize: function(){
            this.collection = new Track.Collection(this.fetch());

            this.collection.on('add', function(){
                this.save();
            }, this);

            this.collection.on('remove', function(){
                this.save();
            }, this);
        },

        fetch: function(){
            if (localStorage.getItem('SCPlaylist')) {
                return JSON.parse(localStorage.getItem('SCPlaylist'));
            } else {
                return [];
            }
        },

        save: function(){
            localStorage.setItem('SCPlaylist', JSON.stringify(this.collection.toJSON()));
        }
    });

    var View = Backbone.View.extend({
        events: {
            "click .fa-play": "playAll"
        },
        initialize: function(){
            this.tracksView = new TracksList({
                el: this.$el.find('.playlist-container'),
                collection: this.model.collection,
                itemView: Track.View
            });

            this.model.collection.on('add remove', this.renderCollection, this);
            this.renderCollection();
        },
        renderCollection: function(){
            if (this.model.collection.length) {
                this.tracksView.render();
                this.$el.addClass('active');
            } else {
                this.$el.removeClass('active');
            }
        },
        playAll: function(){
            App.events.trigger('playAll', this.model.collection);
        }
    });

    return {
        View: View,
        Model: Model
    }
});