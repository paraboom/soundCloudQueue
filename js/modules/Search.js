define(['backbone'], function(Backbone){
    'use strict';

    var Model = Backbone.Model.extend({
        /**
         * Using SoundCloud API search we fetch tracks with current query and notify about this
         */
        fetch: function(){
            var that = this;

            SC.get('/tracks', {q: this.get('q')}, function(tracks){
                App.events.trigger('searchTracks', tracks);
                that.trigger('searchEnd')
            });
        }
    });

    var View = Backbone.View.extend({
        events: {
            "click .search-button": "search",
            "input .search-input": "checkInput",
            "keyup .search-input": "checkEnter"
        },
        initialize: function(){
            // DOM elements for future operations
            this.searchButton = this.$el.find('.search-button');
            this.searchInput = this.$el.find('.search-input');

            // User comfort :)
            this.searchInput.focus();

            this.model.on('searchEnd', function(){
                this.$el.removeClass('search-searching');
            }, this);
        },
        // Catch enter key
        checkEnter: function(evt){
            if (evt.which == 13) this.search();
        },
        // Set query for each input event
        checkInput: function(evt){
            var val = this.searchInput.val();
            this.searchButton.toggleClass('disabled', !val);
            this.model.set('q', val);
        },
        // Fetch results
        search: function(evt){
            if (this.searchButton.hasClass('disabled')) return false;

            this.$el.addClass('search-searching');
            this.model.fetch();
        }
    });

    return {
        Model: Model,
        View: View
    }
});