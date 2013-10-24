define(['backbone', 'hbars!templates/track'], function(Backbone, tmpl){
    'use strict';

    var Model = Backbone.Model.extend({
        defaults: {
            genre: 'unknown'
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    var View = Backbone.View.extend({
        className: 'track',
        template: tmpl,
        events: {
            "click .track-button-play": "playSong",
            "click .track-button-add": "addSong",
            "click .track-button-remove": "removeSong"
        },
        initialize: function(){
        },
        render: function(){
            this.$el.html(
                this.template(
                    _.extend(this.model.toJSON(), this.model.defaults)
                )
            );
            return this;
        },
        playSong: function(){
            App.events.trigger('playTrack', this.model);
        },
        addSong: function(){
            App.events.trigger('addTrack', this.model);
        },
        removeSong: function(){
            this.model.collection && this.model.collection.remove(this.model);
        }
    });

    return {
        Collection: Collection,
        View: View
    }
});