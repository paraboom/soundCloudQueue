define(['backbone', 'hbars!templates/song'], function(Backbone, tmpl){
    'use strict';

    return Backbone.View.extend({
        template: tmpl,
        initialize: function(){
            console.log(this);
        },
        render: function(){
            this.$el.html(this.template({title: 'asdf'}))
            return this;
        }
    });
});