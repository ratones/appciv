    var Backbone = window.Backbone,
        Marionette = window.Marionette;
    app.module('appciv', function() {
        this.onStop = function() {
            app.container.reset();
            console.log('module stopped');
            this.app.module('appciv').loaded = false;
        };
        var Router = require('./router');
        var Controller = require('./controller');

        var controller = new Controller({
            app: app
        });
        var router = new Router('appciv', {
            controller: controller
        });
        this.controller = controller;
        this.router = router;
        this.modules = [];

        router.onRoute = function(route, action, params) {
            var fragmens = params[0].split('/');
            app.trigger('app:request', {
                app: 'appciv',
                page: fragmens[0],
                params: fragmens[1]
            });
        };

        this.openHelp = function() {
            controller.openHelp();
        };
    });

    //module.exports = AppCIV;
