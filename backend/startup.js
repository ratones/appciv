/**
 * Before we load aor main app we have to create a session object
 * After the session is created we load our main app file
 */
//node modules

// requireNode('getmac').getMac(function(err, macAddress) {
//     if (err) throw err;
//     console.log(macAddress);
// })

//localize application
var lang = localStorage.getItem('locale');
if(!lang) lang = 'ro'; 
var localeRO = require('./../common/ro');
var localeEN = require('./../common/en');

if(lang == 'ro')
w2utils.locale(localeRO);
if(lang == 'en')
w2utils.locale(localeEN);

var gui = requireNode('nw.gui');


var low = requireNode('lowdb')
var FileSync = requireNode('lowdb/adapters/FileSync')



var adapter = new FileSync('db.json')
var db = low(adapter)
/**
 * Database tests
 */

db.defaults({ posts: [], user: {}, count: 0 })
.write()

// Add a post
db.get('posts')
.push({ id: 1, title: 'lowdb is awesome'})
.write()

// Set a user using Lodash shorthand syntax
db.set('user.name', 'typicode')
.write()

// Increment count
db.update('count', n => n + 1)
.write()

//intercomm module
var ipc = requireNode('ipc');
ipc.init(); //reinitialize module on window reload...
var Util = require('./util');
var Event = require('./event');
var Config = require('./config');



//reference globals
var Globals = require('./globals');
//reference user
var User = require('./user');
var Updater = requireNode('./tools/updater');
//set enviorement
var env = String(gui.App.argv[0]);
Globals.enviroment = env;

//update session storage for compatibility
var regex = /([0-9]*)\.([0-9]*)\.([0-9]*)/;
var match = regex.exec(nw.App.manifest.version);
if (match) {
    var major, minor, mod;
    major = Number(match[1]);
    minor = Number(match[2]);
    mod = Number(match[3]);
}

function utildecrypt(value, plain, cod) {
    var key = cod || localStorage.getItem('appcivappid');
    var result = '';
    if (value && key) {
        for (var i = 0; i < value.length; i += 1) {
            result += String.fromCharCode(key.charCodeAt(i % key.length) ^ value.charCodeAt(i));
        }
    }
    if (!plain) {
        var json = JSON.parse(result);
        return json;
    }
    return result;
}

if (major <= 1 && minor <= 0 && mod <= 12) {
    //localStorage.removeItem('session');
    var users = localStorage.getItem('user_list');
    if (users) {
        try{
        //convert pass to base64
        var jsonUsers = JSON.parse(users);
        var newUsers = {};
        for (var u in jsonUsers) {
            var user = jsonUsers[u];
            try{
                    Util.decrypt(user.pass,true);
                    // user.pass = Util.encrypt(clearpass,true);
                    newUsers[u] = user;
                }catch(err){
                    var clearpass = utildecrypt(user.pass,true,'23');
                    console.log(clearpass);
                    user.pass = Util.encrypt(clearpass,true);
                    newUsers[u] = user;
                }      
        }
        localStorage.setItem('user_list', JSON.stringify(newUsers));
        }catch(err){
            console.log('no users to convert');
        }
    }
    var proxy = localStorage.getItem('proxy');
    if (proxy) {
        try {
            var jsonProxy = JSON.parse(proxy);
            localStorage.setItem('proxy', Util.encrypt(jsonProxy, false));
        } catch (err) {
            console.info('proxy not found');
        }
    }
}

//set proxy
var currproxy = localStorage.getItem('proxy');
if(currproxy){
    try{
        var newproxy = JSON.parse(Util.decrypt(currproxy,true));
        if(newproxy.enabled){
            nw.App.setProxyConfig(newproxy.proxy_protocol+'='+newproxy.proxy_address+':'+newproxy.proxy_port);
        }
    }catch(err){
        console.log('could not set proxy from settings');
    }
}

var main = '';
switch (env) {
    case 'dev':
        main = 'bootstrap';
        break;
    case 'prod_ext':
        main = 'bootstrap';
        break;
}

var os = requireNode('os');
User.set('computername', os.hostname());

// var screen = gui.Screen.screens[0];
// Globals.screenSize = screen.bounds;

//we get a refernce to main window
var mainWindow = gui.Window.get();
//reset session on app quit
// mainWindow.on('close', function() {
//     localStorage.removeItem('session');
//     localStorage.removeItem('appid');
//     // Util.closeNotifications();
//     this.close(true);
// });

// mainWindow.on('closed', function() {
//     gui.App.quit();
// });

/**
 * *********************USER EVENTS***************************
 */
Globals.User = User;
//user is requested from previous session
ipc.on('user:request:fromcache', function (event, appname) {
    event.returnValue = User.get('data');
});

ipc.on('user:request:host', function (event, data, callback) {
    event.returnValue = User.get('data').display + '#' + User.get('computername');
    callback(event.returnValue);
});

ipc.on('app:notification:show', function (event, data, callback) {
    Util.showNotification(data);
});

//return current user to application
ipc.on('user:request:logout', function (event, appname, callback) {
    User.logout(appname, function () {
        event.returnValue = User.get('data');
        callback(event.returnValue);
    });

});

// login form sent data for login
ipc.on('user:request:login', function (event, data, callback) {
    User.login(data, function (errors) {
        // we have to handle server errors and push them back as event on login window
        if (User.data.auth) {
            event.returnValue = User.get('data');
        } else {
            event.returnValue = errors;
        }
        callback(event.returnValue);
    });
});


// login form requested plain password
ipc.on('pass:request:decrypt', function (event, pass) {
    event.returnValue = Util.decrypt(pass, true, '23');
});

//roles
ipc.on('user:request:roles', function (event) {
    event.returnValue = User.get('roles');
});
ipc.on('user:request:isinrole', function (event, roles) {
    event.returnValue = User.isInRole(roles);
});
ipc.on('user:request:reprezentanta', function (event) {
    event.returnValue = User.getReprezentanta();
});
//is in role based on current app
ipc.on('user:request:isuserinrole', function (event, data) {
    event.returnValue = User.isUserInRole(data[0], data[1]);
});
ipc.on('user:isAuthenticated', function (event, appname) {
    event.returnValue = User.isUserAuthenticated(appname);
});
ipc.on('user:request:userlist', function (event) {
    if (localStorage.getItem('user_list'))
        event.returnValue = localStorage.getItem('user_list');
    else
        event.returnValue = [];
});

/**
 * ********************END USER EVENTS***************************
 */

/**
 * ************************APP EVENTS*******************************
 */

ipc.on('app:proxy:reset', function (event) {
    event.returnValue = User.resetProxy();
});

ipc.on('app:request:pdf', function (event, param) {
    var url, cb;
    if (typeof param === 'object') {
        url = param[0];
        cb = param[1];
    } else {
        url = param;
    }
    Util.printPDF(url, function (win) {
        if (cb) {
            cb(win);
        }
    });
});

ipc.on('app:request:downloadpdf', function (event, url) {
    Util.downloadPDF(url);
});

ipc.on('app:request:file', function (event, data) {
    Util.downloadFile(data.url, data.method, data.data, data.filename);
});

// ipc.on('app:request:excel',function(event,data){
//     var xls = new Excel();
//     xls.export(data.filename,data.options);
// });

ipc.on('app:error:show', function (event, data) {
    Util.showError(data);
});


ipc.on('app:request:decrypt', function (event, word) {
    event.returnValue = Util.decrypt(word, true, '23');
});



ipc.on('app:request:encrypt', function (event, word) {
    event.returnValue = Util.encrypt(word, true, '23');
});

ipc.on('app:request:path', function (event) {
    event.returnValue = Util.getAppPath();
});

//add proxy check and transport login
var tries;
//TODO : Get proxy credentials if needed
chrome.webRequest.onAuthRequired.removeListener();
chrome.webRequest.onAuthRequired.addListener(
    function (details, callbackFn) {
        console.log(details);
        if (details.isProxy) {
            var proxystr = localStorage.getItem('proxy');
            var proxyuser, proxypass;
            if (proxystr && !tries) {
                var proxyCredentials = JSON.parse(Util.decrypt(proxystr,true));
                proxyuser = proxyCredentials.proxy_user;
                proxypass = proxyCredentials.proxy_pass;
                tries = true;
                callbackFn({
                    authCredentials: {
                        username: proxyuser || 'proxyuser',
                        password: proxypass || 'proxypass'
                    }
                });
            } else {
                var ProxyWin = require('./proxy');
                ProxyWin.requestCredentials().done(function (response) {
                    callbackFn({
                        authCredentials: {
                            username: response.proxy_user,
                            password: response.proxy_pass
                        }
                    });
                });
            }

        } else {
            if (details.url.indexOf('logoff') > 0) {
                callbackFn({
                    authCredentials: {
                        username: 'anonim',
                        password: 'notset'
                    }
                });
            } else {
                app.controller.login('').done(function (response) {
                    callbackFn({
                        authCredentials: {
                            username: response.username,
                            password: response.password
                        }
                    });
                });
            }
        }

    }, {
        urls: ["<all_urls>"]
    }, ['asyncBlocking']
);

/**
 * startup
    Check for update and update automatically
 */

var start = function (error) {
    if (error) {
        w2confirm(error.message)
            .yes(function () {
                require('./../frontend/main').start({
                    callback: function () {
                        w2utils.unlock('body');
                        User.checkSession(function () {
                            //app.controller.start();
                            // w2utils.lock('body', 'Va rugam asteptati!', true);
                        });
                    }
                });
            })
            .no(function () {
                nw.App.quit();
            })
    } else {
        require('./../frontend/main').start({
            callback: function () {
                w2utils.unlock('body');
                User.checkSession(function () {
                    app.controller.login('')
                    //app.controller.start();
                    // w2utils.lock('body', 'Va rugam asteptati!', true);
                });
            }
        });
    }


}

function writeProgressBar() {
    var html = '<div id="updateStatus" style="width:500px;margin:300px auto; z-index:50000; display:none">' +
        '<p style="text-align:center">Va rugam asteptati, aplicatia se actualizeaza...</p>' +
        '<p id="statusText" style="text-align:center"></p>' +
        '<div id="myProgress" style="width: 100%;background-color: grey;">' +
        '<div id="myBar" style="width: 0%; height: 30px; background-color: green;"></div>' +
        '</div>' +
        '</div>';
    $(html).appendTo('#mainLayout')
}

function update() {
    var updater = new Updater(function () {
        $('#updateStatus').css({
            display: 'block'
        });
    });
    writeProgressBar();
    updater.update(start, document.getElementById('statusText'), document.getElementById('myBar'));
    updater = null;
}


update();