
define(function(require) {
                     require('templates/partials/excerpt');
    var $          = require('jquery');
    var Handlebars = require('handlebars');
    var mediator   = require('mediator');
    var template   = Handlebars.templates['excerpt.mustache'];

    var MorePosts = function(container, postList, events) {
        this.container = $(container);
        this.postList = $(postList);
        this.postListSelector = this.postList.selector;

        this.offset = 5;
        this.incrementBy = 5;

        this.loadBtn = $('<button></button>', {
            'class': 'load-posts js-load-posts',
            text: 'Load more posts'
        });

        this.container.on('click', '.js-load-posts', this.btnPress.bind(this));
        mediator.subscribe(events.render, this.checkPage, null, this);
        mediator.subscribe('posts:get:done', this.addPostsToPage, null, this);
    };

    MorePosts.prototype = {

        checkPage: function(bodyClass) {
            if (bodyClass.match(/home/)) {
                this.addBtn();
            } else {
                this.resetIncrement();
                this.removeBtn();
            }
        },

        addBtn: function() {
            this.loadBtn.appendTo(this.postListSelector);
        },

        removeBtn: function() {
            this.loadBtn.detach();
        },
        
        btnPress: function(event) {
            this.getPosts();
            event && event.preventDefault();
        },

        getPosts: function() {
            $.getJSON('/more-posts/?limit=5&offset=' + this.offset, function(response) {
                mediator.publish('posts:get:done', response);
            });
        },

        addPostsToPage: function(response) {
            if (response.length == 0) {
                this.removeBtn();
                this.resetIncrement();
                return;
            }

            var html = '';
            $.each(response, function(key, value) {
                html += template(value);
            });

            this.offset += this.incrementBy;
            this.loadBtn.before(html);
        },

        resetIncrement: function() {
            this.offset = 5;
        }

    };

    return MorePosts;
});
