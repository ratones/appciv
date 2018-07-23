var ipc = requireNode('ipc'); //intercomm module
var HomeView = require('./views/index'),
    FooterView = require('./views/footer'),
    Menu = require('./views/menu'),
    controller = Marionette.Controller.extend({
        /**
         * render home and footer view
         * @return {[type]} [description]
         */
        start: function() {
            app.container.show(new HomeView({
                message: 'Welcome to application!'
            }));
            app.footer.show(new FooterView());
            app.filemenu = new Menu();
            app.menu.show(app.filemenu);
        },
        /**
         * handles all routes except home
         * we do nothing here - routes are handled in child applications
         * @return {[type]} [description]
         */
        request: function() {
            console.log('route requested');
        },
        /**
         * navigate to home page
         * we have to unset app User,since we are now in the main app, that doesn't have a user
         * we also unset current app adn current app name
         */
        home: function() {
            app.User = {
                display: '',
                auth: false,
                uid: 0
            };
            app.currentApp = null;
            app.currentAppName = null;
            app.trigger('user:updated');
            app.container.show(new HomeView({
                message: 'Welcome to application!'
            }));
        },
        /**
         * open profile page
         * @return {[type]} [description]
         */
        profile: function() {
            var View = require('./views/profile');
            app.container.show(new View());
        },
        settings: function() {
            var View = require('./views/settings');
            app.container.show(new View());
        },
        info: function() {
            var View = require('./views/info');
            app.modal.show(new View(), {
                preventDestroy: true
            });
        },

        /**
         * open login window
         * @param  {string}   appname  [current app name]
         * @param  {Function} callback [sent from xhr - waits for result to resend request with new credentials]
         * @return {[type]}            [description]
         */
        login: function(appname, callback) {
            var User = require('./models/user');
            var LoginView = require('./views/login');
            var view = new LoginView({
                model: new User(),
                callback: callback
            });
            if(!w2ui.panels || _.where(w2ui.panels,{name:'modal-'}).length === 0) {
                app.modal.show(view, {
                    preventDestroy: true
                });
            }
            return view.promise();
        },
        logout: function() {
            ipc.sendSync('user:request:logout', app.currentAppName, function(user) {
                app.User = user;
                app.trigger('user:updated');
                app.router.navigate('home', true);
            });

        },

        autorizareUser:function(){
            alert('usr');
        }
    });

module.exports = controller;
