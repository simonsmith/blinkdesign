
    define(function(require) {
        var $ = require('jquery');
        var Handlebars = require('handlebars');
        var registerTemplates = require('modules/registerTemplates');
        registerTemplates();

        var ContentLoader = function(elements) {
            this.container = $(elements.container);
            this.links = elements.links;
            this.injectTarget = $(elements.injectTarget);
            this.nav = $(elements.nav);

            this.body = $('body');

            this.setInitialPage();
            this.attachEvents();
        };

        ContentLoader.prototype = {

            setInitialPage: function() {
                $.getJSON(location.href, {ajax: true}, function(json) {
                    history.replaceState(json, json.page_meta.page_title, location.href);
                });
            },

            attachEvents: function() {
                this.container.on('click', this.links, this.getPageContent.bind(this));

                window.addEventListener('popstate', function(event) {
                    var json = event.state;

                    if (!json) {
                        return;
                    }

                    this.renderTemplate(json.template, json);
                    this.updateBodyClass(json);
                    this.updatePageNavigation(json);
                    this.updatePageTitle(json);

                    event.preventDefault();
                }.bind(this));
            },

            getPageContent: function(event) {
                var $elem = $(event.currentTarget);
                var ajaxReq = $.ajax({
                    dataType: 'json',
                    context: this,
                    url: $elem.attr('href'),
                    type: 'get',
                    data: {
                        ajax: true
                    }
                });
                
                ajaxReq.done(this.updatePageContent.bind(this, $elem));
                ajaxReq.done(this.updateBodyClass);
                ajaxReq.done(this.updatePageNavigation);
                ajaxReq.done(this.updatePageTitle);

                event.preventDefault();
            },
            
            updatePageTitle:  function(json) {
                var newTitle = json.page_meta.page_title;
                var titleParts = document.title.split('|');
                document.title = [newTitle, ' | ', $.trim(titleParts[1])].join('');
            },

            updatePageNavigation: function(json) {
                this.nav.html(json.page_meta.nav_menu);
            },

            updateBodyClass: function(json) {
                this.body.removeClass().addClass(json.page_meta.body_class);
            },

            updatePageContent: function(clickedElem, json) {
                this.renderTemplate(json.template, json);
                history.pushState(json, json.page_meta.page_title, clickedElem.attr('href'));
            },

            renderTemplate: function(tplName, data) {
                var tpl = Handlebars.templates[tplName];
                this.injectTarget.html(tpl(data));
            }

        };

        return ContentLoader;
    });