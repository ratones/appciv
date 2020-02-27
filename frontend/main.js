

var Config = require('./../backend/config');
//
var ipc = requireNode('ipc'); //intercomm module

//istance of main application - make it global
var app = window.app = global.app = new Marionette.Application();


//create main controller - will handle application level commands
var Controller = require('./controller');
var controller = new Controller();
//create main router - will handle app level routes and redirects to ceresponding action in controller
var Router = require('./router');
var router = new Router({
    controller: controller
});

//set app router and controller
app.controller = controller;
app.router = router;

app.Settings = Config;

//namespace to hold various info at main application level
app.data = {
    User: {},
    currentApp: null,
    currentAppName: null
};

function normalizeTitle(title) {
    return title.replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str) {
            return str.toUpperCase();
        });
}
/******************MAIN LAYOUT****************************/

var pstyle = 'border: thin solid #c0c0c0; padding: 5px;';
var mainStyle = 'overflow-y:scroll;';
$('#mainLayout').w2layout({
    name: 'layout',
    panels: [{
            type: 'top',
            content: '',
            size: 24
        }, {
            type: 'right',
            content: '<div id="modalContainer"></div>',
            hidden: true
        }, {
            type: 'main',
            //title: 'Aplicatie RAR',

            content: '<div id="main"></div>'
        }, {
            type: 'bottom',
            size: 30,
            content: '<div id="footer"></div>'
        }

    ]
});

//create application regions
app.addRegions({
    'menu': '#topmenu',
    'container': '#main',
    'modal': '#modalContainer',
    'footer': '#footer'
});

/******************END MAIN LAYOUT************************/




var env = String(nw.App.argv[0]);
switch(env){
    case 'dev':
    app.baseUrl = Config.modules.appciv.dev_server;
    break;
    case 'prod_int':
    app.baseUrl = Config.modules.appciv.intranet_server;
    break;
    case 'prod_ext':
    app.baseUrl = Config.modules.appciv.external_server;
    break;
    default:
    app.baseUrl = Config.modules.appciv.dev_server;
    break;
}
app.dotUrl = app.baseUrl.replace('civapi','dotapi');
app.civUrl = Config.modules.appciv.civ_server;
app.domain = app.baseUrl.substr(0,app.baseUrl.lastIndexOf(':'));


/*************************LOAD CHILD APPLICATIONS*****************************/
////get config
var config = require('./../backend/config');
//load applications
// for (var m in config.modules) {
//     var application = config.modules[m];
//     if (application.active) { //check if application is active
//         require('./applications/' + m + '/' + m);
//     }
// }

require('./applications/appciv/appciv');
// require('./applications/appdot/appdot');
/**
 * ***************************APPLICATION COMMANDS*******************************
 */

app.commands.setHandler('app:user:login', function(appname) {
    if (appname !== app.currentAppName) {
        var currentApp = require('./applications/' + appname + '/' + appname);
        app.currentApp = app.module(appname);
        app.currentAppName = appname;
    }
    // call the requested resource
    //try {
    app.controller.login(appname, function() {
        app.router.navigate('home', true);
    });
});

app.commands.setHandler('app:page:configciv', function(appname) {
    if (appname !== app.currentAppName) {
        var currentApp = require('./applications/' + appname + '/' + appname);
        app.currentApp = app.module(appname);
        app.currentAppName = appname;
    }
    // cal the requested resource
    //try {
    app.currentApp.controller.configTiparCIV();
});

app.commands.setHandler('app:user:logout', function(appname) {
    if (appname !== app.currentAppName) {
        var currentApp = require('./applications/' + appname + '/' + appname);
        app.currentApp = app.module(appname);
        app.currentAppName = appname;
    }
    // cal the requested resource
    //try {
    app.controller.logout(appname, function() {
        app.currentApp.router.navigate(appname + '/home', true);
    });
});

app.commands.setHandler('registru:search:nrreg', function() {
    var SearchFormView = require('./applications/appciv/views/registru/searchView');
    app.modal.show(new SearchFormView(), {
            preventDestroy: true
    });
});

app.commands.setHandler('app:set:pagetitle', function(page) {
    $('#lblPageTitle').html(normalizeTitle(page.page));
});

app.commands.setHandler('app:request:info', function() {
    app.controller.info();
});

app.commands.setHandler('registru:cerereomologare', function() {
    var CerereOmologare = require('./applications/appciv/views/registru/selectieCerere')
    app.modal.show(new CerereOmologare(),{
        preventDestroy:true,
        modal:true
    })
})

/**
 * ***************************END APPLICATION COMMANDS**************************
 */

/******************************APPLICATION LEVEL EVENTS**************************/
//event handlers application level

//nice to have some busy indicator on main region, but we have to unlock it when view is ready
app.container.on("show", function(view) {
    w2utils.unlock('#main');
});

app.on('app:request', function(data) {
    //upon request we check if requested application matches the current application
    // if not, we request the new application and set the nedeed data in the current app instances
    // we need the name and the module instance
    $('#main').html('');
    w2utils.lock('#main', 'Va rugam asteptati...', true);
    if (data.app !== app.currentAppName) {
        var currentApp = require('./applications/' + data.app + '/' + data.app);
        app.currentApp = app.module(data.app);
        app.currentAppName = data.app;
        app.User = ipc.sendSync('user:request:fromcache', data.app);
        app.trigger('user:updated');
    }
    // cal the requested resource
    //try {
    console.log(data)
    app.currentApp.controller[data.page].call(this, data.params);
    app.execute('app:set:pagetitle', {
        page: data.page
    });
    //} catch (e) {
    //    console.warn('There is no method named ' + data.page + ' defined on ' +
    //       data.app + ' controller!');
    //}


});


/**
 * Models updated/added from grids using modal windows trigger coresponding events
 * We catch here the event dispatch and refresh/add grid row with updated/new data
 */

app.listenTo(app, 'grid:edited', function(options) {
    var opt = {
        text: 'Inregistrarea a fost salvata!',
        title:'Notificare',
        type: 'success-template'
    };
    ipc.send('app:notification:show', opt);
    if (w2ui.hasOwnProperty(options.grid))
        w2ui[options.grid].set(options.model.recid, options.model);
});
app.listenTo(app, 'grid:added', function(options) {
    var opt = {
        text: 'Inregistrarea a fost salvata!',
        title:'Notificare',
        type: 'success-template'
    };
    ipc.send('app:notification:show', opt);
    if (w2ui.hasOwnProperty(options.grid))
        w2ui[options.grid].add(options.model);
});

/***********************************USER LEVEL EVENTS***************************************/


/**
 * User has been updated from server.
 * Updates footer User menu with current app user menu and enables/disables profile button
 * @param  {[type]} ) {               w2ui.footerToolbar.    set('btnMenuUser', {        caption: this.User.display    });    w2ui.footerToolbar.    get('btnMenuUser').items[0].text [description]
 * @return {[type]}   [description]
 */
app.on('user:updated', function() {
    app.filemenu.refresh();
    // w2ui.footerToolbar.
    // set('btnMenuUser', {
    //     caption: this.User.display
    // });
    // w2ui.footerToolbar.
    // get('btnMenuUser').items[0].text = this.User.auth ? 'Inchide sesiunea' : 'Autentificare';
    // w2ui.footerToolbar.
    // get('btnMenuUser').items[1].disabled = !this.User.auth;
    // w2ui.footerToolbar.
    // get('btnMenuUser').items[0].disabled = !this.currentAppName;
});

/************************************ON START MAIN APPLICATION***********************/
app.on('start', function(cb) {
    // var cookie = localStorage.getItem('session');
    // if (cookie) {
    //     var cookienew = JSON.parse(cookie);
    //     cookienew.url = app.domain;
    //     delete cookienew.hostOnly;
    //     delete cookienew.session;
    //     nw.Window.get().cookies.set(cookienew);
    // }
    controller.start();
    console.info('Application started!');
    //start routing
    window.Backbone.history.start({
        pushState: false
    });
    if(cb.callback) cb.callback.call();
});

//export app
module.exports = app;
