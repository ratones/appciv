var Router = Marionette.AppRouter.extend({
    appRoutes: {
        'home': 'home',
        'profile': 'profile',
        'settings':'settings',
        'info': 'info',
        'autorizareUser':'autorizareUser',
        '*action': 'home'
    }
});
module.exports = Router;
