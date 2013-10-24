define(['backbone'], function(Backbone){
    'use strict';

    var View = Backbone.View.extend({
        events: {
            "mousedown .track": "startDrag"
        },

        /**
         * Dragging tracks in playlist if playlist supports
         */
        startDrag: function(evt){
            if (!this.collection.isDraggable || $(evt.target).hasClass('fa')) return true;

            // dragging mode flag
            this.isDragging = true;
            this.dragEl = $(evt.target).closest('.track');
            this.dragEl.addClass('dragging')
            var offset = this.dragEl.offset();
            
            // track property calculation for future operations
            this.dragElOpts = {
                x: evt.clientX - offset.left,
                y: evt.clientY - offset.top,
                w: this.dragEl.outerWidth(),
                h: this.dragEl.outerHeight()
            };

            // creating dummy track div if it isn't created before
            if (!this.dragDummy) {
                var d = $('<div class="dummy" />');
                $('body').append(d);
                this.dragDummy = d;
            }

            // refresh dummy property and position it above track
            this.dragDummy.removeClass('hidden').css({
                width: this.dragElOpts.w,
                height: this.dragElOpts.h,
                top: evt.clientY - this.dragElOpts.y,
                left: evt.clientX - this.dragElOpts.x
            });
        },

        // if we are in drag mode refresh dummy object and calculate its position
        // to highlight hovered tracks
        moveDrag: function(evt){
            if (this.isDragging) {
                evt.preventDefault();

                var top = evt.clientY - this.dragElOpts.y,
                    left = evt.clientX - this.dragElOpts.x;

                this.dragDummy.css({
                    top: top,
                    left: left
                });

                _.each(this.views, function(v){
                    v.view.$el.removeClass('hovered');
                });

                // find element that lies under dummy
                var a = _.find(this.views, function(v){
                    return v.top < evt.clientY && (v.top + v.height) > evt.clientY;
                });

                if (a) {
                    a.view.$el.addClass('hovered');
                    this.dragPlace = a.view;
                }
            }
        },

        // finishing dragging and change places of tracks
        endDrag: function(){
            if (this.isDragging) {
                this.isDragging = false;
                this.dragDummy.addClass('hidden');
                this.dragEl.removeClass('dragging');

                var oldPos = this.dragEl.prevAll('.track').length,
                    oldModel = this.collection.at(oldPos),
                    newPos = this.collection.indexOf(this.dragPlace.model);

                this.collection.remove(oldModel, {silent: true});
                this.collection.add(oldModel, {at: newPos});
            }
        },

        initialize: function(data){
            this.collection = data.collection;
            this.itemView = data.itemView;

            this.collection.on('reset', function(collection){
                this.destroyOld();
                this.render();
            }, this);

            $(window).on('mousemove', _.bind(function(evt){
                this.moveDrag(evt);
            }, this));

            $(window).on('mouseup', _.bind(function(evt){
                this.endDrag(evt);
            }, this));

            this.views = [];

            /**
             * when all tracks are rendered calculating offset and height of elements
             * I use setTimeout here to ensure that browser made all DOM operations and we are ready to mesure it
             */
            this.on('render', function(){
                setTimeout(_.bind(function(){
                    _.each(this.views, function(v){
                        var tmp = v.view.$el.offset();
                        v.top = tmp.top;
                        v.height = v.view.$el.outerHeight();
                    });
                }, this), 1);
            }, this);
        },

        // destroying old views
        destroyOld: function(){
            _.each(this.views, function(v){
                v.view.remove();
            });

            this.views = [];
        },

        // Delegate render to collection view
        render: function(){
            var tmp = $("<div/>");

            this.collection.each(function(m){
                var view = new this.itemView({model: m});
                tmp.append(view.render().$el);
                this.views.push({
                    view: view
                });
            }, this);

            this.$el.html(tmp);

            this.trigger('render');
        }
    });

    return View;
});