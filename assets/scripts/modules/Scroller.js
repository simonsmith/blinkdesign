define(function(require) {
    'use strict';
    var $        = require('jquery');
    var mediator = require('mediator-js');

    var Scroller = function(events) {
        this.attachEvents(events.contentLoad);
    };

    Scroller.prototype = {

        constructor: Scroller,

        scrollable: $('html, body'),

        attachEvents: function(contentLoadEvent) {
            mediator.subscribe(contentLoadEvent, this.scrollToTop, null, this);
        },

        scrollToTop: function(data) {
            if (data.navType == 'ajax') {
                this.scrollable.animate({
                    scrollTop: 0
                });
            }
        }

    };

    return Scroller;
});
