/**
 * @author cristian_mar
 */

var Router = window.Marionette.SubAppRouter.extend({
    appRoutes: {
        '*action': 'request'
    }
});
module.exports = Router;
