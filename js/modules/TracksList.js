define(['backbone'], function(Backbone){
    'use strict';

    var View = Backbone.View.extend({
        initialize: function(data){
            this.collection = data.collection;
            this.itemView = data.itemView;

            this.collection.on('reset', function(collection){
                this.destroyOld();
                this.render();
            }, this);

            this.views = [];
        },

        destroyOld: function(){
            _.each(this.views, function(v){
                v.remove();
            });

            this.views = [];
        },

        render: function(){
            var tmp = $("<div/>");

            this.collection.each(function(m){
                var view = new this.itemView({model: m});
                tmp.append(view.render().$el);
                this.views.push(view);
            }, this);

            this.$el.html(tmp);
        }
    });

    return View;
});