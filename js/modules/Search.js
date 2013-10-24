define(['backbone'], function(Backbone){
    'use strict';

    var Model = Backbone.Model.extend({
        fetch: function(){
            SC.get('/tracks', {q: this.get('q')}, function(tracks){
                App.events.trigger('searchTracks', tracks);
            });
        }
    });

    var View = Backbone.View.extend({
        events: {
            "click .search-button": "search",
            "input .search-input": "checkInput"
        },
        initialize: function(){
            this.searchButton = this.$el.find('.search-button');
            this.searchInput = this.$el.find('.search-input');

            this.searchInput.focus();
        },
        checkInput: function(evt){
            var val = this.searchInput.val();
            this.searchButton.toggleClass('disabled', !val);
            this.model.set('q', val);
        },
        search: function(evt){
            if (this.searchButton.hasClass('disabled')) return false;
            this.model.fetch();
        }
    });

    return {
        Model: Model,
        View: View
    }
});