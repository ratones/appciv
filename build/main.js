(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ipc = requireNode('ipc');
var Util = require('./util');
var gui = requireNode('nw.gui');
var config = {
    modules: {
        user: {
            active: false
        },
        // common:{
        //     active:true,
        //     name:'common',
        //     external_server: 'https://prog.rarom.ro:446/common/',
        //     intranet_server: 'http://10.1.0.32:8083/common/',
        //     dev_server: 'http://localhost:8083/common/',
        // },
        appciv: {
            name: 'appciv',
            title: 'Cereri C.I.V.',
            active: true,
            external_server: 'https://prog.rarom.ro:446/civapi/',
            intranet_server: 'http://10.1.0.32:8083/civapi/',
            dev_server: 'http://10.2.2.10:8083/civapi/',
            civ_server: 'http://10.1.0.32:8104/restservice/api/printciv/',// //10.2.2.84

            'menuDescriptor': [{
                label: w2utils.lang('Comenzi C.I.V.'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:isAuthenticated', 'appciv') && !ipc.sendSync('user:request:isuserinrole', [
                        [15, 16, 18], 'appciv'
                    ]);
                },
                submenu: [{
                    icon: 'w2ui-icon-plus',
                    type: 'normal',
                    label: w2utils.lang('Comanda noua'),
                    click: function () {
                        window.location.hash = '#appciv/editCerere';
                    }
                }, {
                    label: w2utils.lang('Lista comenzi Grivita'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri/grivita';
                    }
                },
                {
                    label:  w2utils.lang('Lista comenzi Voluntari'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri/voluntari';
                    }
                },
                {
                    label:  w2utils.lang('Lista comenzi Pitesti'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri/pitesti';
                    }
                },
                {
                    label:  w2utils.lang('Toata lista'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri';
                    }
                },
                {
                    label:  w2utils.lang('Situatie plati'),
                    type: 'normal',
                    icon: 'w2ui-icon-money',
                    click: function () {
                        window.location.hash = '#appciv/plati';
                    }
                }, {
                    label:  w2utils.lang('Situatie CIV-uri'),
                    type: 'normal',
                    icon: 'w2ui-icon-list',
                    click: function () {
                        window.location.hash = '#appciv/situatie';
                    }
                }]
            }, {
                label:  w2utils.lang('Sfarsit serie'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:isAuthenticated', 'appciv') && !ipc.sendSync('user:request:isuserinrole', [
                        [15, 16, 18], 'appciv'
                    ]);
                },
                submenu: [{
                    label:  w2utils.lang('Lista vehicule'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/listVins';
                    }
                }]
            }, {
                label:  w2utils.lang('CIV Individual'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:request:isuserinrole', [
                        [1, 14, 15, 18], 'appciv'
                    ]);
                },
                submenu: [{
                    label:  w2utils.lang('Lista comenzi'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/listCIVIndividual';
                    },
                    show: function () {
                        return !ipc.sendSync('user:request:isuserinrole', [
                            [18], 'appciv'
                        ]);
                    },
                }, {
                    label:  w2utils.lang('Situatie CIV'),
                    type: 'normal',
                    icon: 'w2ui-icon-list',
                    click: function () {
                        window.location.hash = '#appciv/situatieCIVIndividual';
                    },
                    show: function () {
                        return !ipc.sendSync('user:request:isuserinrole', [
                            [18], 'appciv'
                        ]);
                    },
                }, {
                    label: w2utils.lang('Cauta VIN'),
                    type: 'normal',
                    icon: 'w2ui-icon-search',
                    click: function () {
                        window.location.hash = '#appciv/listaOperator';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1, 18], 'appciv'
                        ]);
                    },
                }]
            }, {
                label: w2utils.lang('Operatii CIV'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:request:isuserinrole', [
                        [1, 17, 16, 99], 'appciv'
                    ]);
                },
                submenu: [{
                    label: w2utils.lang('Arhivare'),
                    type: 'normal',
                    icon: 'w2ui-icon-check',
                    click: function () {
                        window.location.hash = '#appciv/arhivareCIVNou';
                    }
                },
                {
                    label: w2utils.lang('Anulare'),
                    type: 'normal',
                    icon: 'w2ui-icon-ban',
                    click: function () {
                        window.location.hash = '#appciv/anulareCIVNou';
                    }
                }]
            },
            {
                label: w2utils.lang('Cereri Nr. Omologare'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:isAuthenticated', 'appciv') && ipc.sendSync('user:request:isuserinrole', [
                        [999], 'appciv'
                    ]);
                },
                submenu: [{
                    icon: 'w2ui-icon-plus',
                    type: 'normal',
                    label: w2utils.lang('Cerere noua'),
                    click: function () {
                        window.location.hash = '#appciv/newCerereOmol';
                    }
                },
                {
                    icon: 'w2ui-icon-list',
                    type: 'normal',
                    label: w2utils.lang('Lista'),
                    click: function () {
                        window.location.hash = '#appciv/listaCereriOmologare';
                    }
                }]
            }, {
                label: w2utils.lang('Utilizator'),
                type: 'normal',
                enabled: true,
                submenu: [{
                    label: w2utils.lang('Autentificare'),
                    icon: 'w2ui-icon-lock',
                    show: function () {
                        return !ipc.sendSync('user:isAuthenticated', 'appciv');
                    },
                    click: function () {
                        app.execute('app:user:login', 'appciv');
                    }
                }, {
                    type: 'separator'
                }, {
                    label: w2utils.lang('Profil'),
                    show: function () {
                        return ipc.sendSync('user:isAuthenticated', 'appciv');
                    },
                    click: function () {
                        // app.execute('app:user:profile', 'appciv');
                        window.location.hash = '#profile'
                    },
                    icon: 'w2ui-icon-user'
                }, {
                    label: w2utils.lang('Inchide sesiunea'),
                    icon: 'w2ui-icon-lock',
                    show: function () {
                        return ipc.sendSync('user:isAuthenticated', 'appciv');
                    },
                    click: function () {
                        app.execute('app:user:logout', 'appciv');
                    }
                },
                {
                    label: w2utils.lang('Setari proxy'),
                    click: function () {
                        // app.execute('app:user:profile', 'appciv');
                        window.location.hash = '#settings'
                    },
                    icon: 'w2ui-icon-settings'
                }]
            }, {
                label: w2utils.lang('Ajutor'),
                type: 'normal',
                enabled: true,
                submenu: [{
                    label: w2utils.lang('Manual utilizare'),
                    type: 'normal',
                    icon: 'w2ui-icon-question-circle',
                    click: function () {
                        gui.Window.open(Util.getAppPath() + 'ManualCIV.pdf')
                    }
                }, {
                    label: 'Info',
                    type: 'normal',
                    icon: 'w2ui-icon-info',
                    enabled: true,
                    click: function () {
                        app.execute('app:request:info');
                    }
                },]
            }, {
                label: 'Administrare',
                show: function () {
                    return ipc.sendSync('user:request:isuserinrole', [
                        [1], 'appciv'
                    ]);
                },
                type: 'normal',
                enabled: true,
                submenu: [{
                    label: 'Users',
                    icon: 'w2ui-icon-users',
                    click: function () {
                        window.location.hash = '#appciv/listaUseri';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1], 'appciv'
                        ]);
                    },
                }, {
                    label: 'Actualizare aplicatie',
                    icon: 'w2ui-icon-upload',
                    click: function () {
                        window.location.hash = '#appciv/updateApp';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1], 'appciv'
                        ]);
                    }
                }, {
                    label: 'Autorizare utilizator',
                    icon: 'w2ui-icon-lock',
                    click: function () {
                        window.location.hash = '#appciv/autorizareUser';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1, 33], 'appciv'
                        ]);
                    }
                }/*,{
                    label: 'Config Tipar CIV',
                    icon: 'w2ui-icon-settings',
                    click: function() {
                        app.execute('app:page:configciv','appciv');
                    },
                    show: function() {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1,33], 'appciv'
                        ]);
                    }
                }*/]
            }]
        }

    },
    serverURL: '',
    "fileinputDefaults": function () {
        return {
            "allowedFileExtensions": [
                "pdf",
                "xml",
                "jpg",
                "gif",
                "png"
            ],
            "allowedPreviewTypes": [
                "image",
                "pdf"
            ],
            "fileActionSettings": {
                "removeTitle": w2utils.lang("Sterge fisier"),
                "uploadTitle": w2utils.lang("Incarca fisier"),
                "indicatorNewTitle": w2utils.lang("Fisier neincarcat inca..."),
                "indicatorSuccessTitle": w2utils.lang("Incarcat"),
                "indicatorErrorTitle": w2utils.lang("Eroare incarcare"),
                "indicatorLoadingTitle": w2utils.lang("Se incarca ...")
            },
            "uploadTitle": w2utils.lang("Incarca"),
            "uploadLabel": w2utils.lang(" Incarca"),
            "browseTitle": w2utils.lang("Alege fisiere"),
            "browseLabel": w2utils.lang(" Alege..."),
            "removeTitle": w2utils.lang("Reset"),
            "removeLabel": w2utils.lang(" Reset"),
            "dropZoneTitle": w2utils.lang("Trageti fisiere aici"),
            "previewTemplates": {
                "other": "<div class=\"file-preview-frame\" id=\"{previewId}\" data-fileindex=\"{fileindex}\"><div class=\"file-preview-other\"><i class=\"w2ui-icon-file\"></i>\n</div>\n{footer}</div>"
            }
        }
    }
};
module.exports = config;

},{"./util":7}],2:[function(require,module,exports){
var Evented = {

    off: function(event) {
        if (this.events.hasOwnProperty(event))(this.events[event] = []);
    },
    on: function(event, callback, context) {
        this.hasOwnProperty('events') || (this.events = {});
        this.events.hasOwnProperty(event) || (this.events[event] = []);
        this.events[event].push([callback, context]);
    },
    fire: function(event) {
        var tail = Array.prototype.slice.call(arguments, 1),
            callbacks = this.events[event];
        for (var i = 0, l = callbacks.length; i < l; i++) {
            var callback = callbacks[i][0],
                context = callbacks[i][1] === undefined ? this : callbacks[i][1];
            callback.apply(context, tail);
        }
    }
};

module.exports = Evented;

},{}],3:[function(require,module,exports){
var globals = {

    syncLoop: function(iterations, process, exit) {
        var self = this;
        var index = 0,
            done = false;
        var loop = {
            // Loop structure
            next: function() {
                if (done) {
                    if (shouldExit && exit) {
                        return exit(); // Exit if we're done
                    }
                }
                // If we're not finished
                if (index < iterations) {
                    index++; // Increment our index
                    process(loop); // Run our process, pass in the loop
                    // Otherwise we're done
                } else {
                    done = true; // Make sure we say we're done
                    if (exit) exit(); // Call the callback on exit
                }
            },
            iteration: function() {
                return index - 1; // Return the loop number we're on
            },
            break: function(end) {
                done = true; // End the loop
                shouldExit = end; // Passing end as true means we still call the exit callback
            }
        };
        loop.next();
        return loop;
    }
};
module.exports = globals;

},{}],4:[function(require,module,exports){
var Util = require('./util');
var ConnProxy = function(){
}
ConnProxy.prototype.requestCredentials = function() {
        var deferred = $.Deferred();

        console.log('proxy req');
        var content =
            '<div>'+
        '<p style="text-align:center">Serverul proxy necesita autentificare!</p>'+
        '<div class="w2ui-field">'+
          '<label>Username:</label>'+
          '<div>'+
            '<input type="text" id="uname" value="" />'+
          '</div>'+
        '</div>'+
        '<div class="w2ui-field">'+
         '<label>Password:</label>'+
          '<div>'+
            '<input type="password" id="pwd" />'+
          '</div>'+
        '</div>'+
    '</div>';
        $(content).w2popup({
            modal: true,
            width: '400px',
            height: '300px',
            buttons: '<button class="w2ui-btn" onclick="w2popup.close();">Ok</button> ',
            onClose: function() {
                var data = {
                    proxy_user: $('#uname').val(),
                    proxy_pass: $('#pwd').val()
                };
                deferred.resolve(data);
                var currproxy = localStorage.getItem('proxy');
                if(currproxy){
                    try{
                        var newproxy = JSON.parse(Util.decrypt(currproxy,true));
                        newproxy.proxy_user = data.proxy_user;
                        newproxy.proxy_pass = data.proxy_pass;
                        newproxy.enabled = true;
                        localStorage.setItem('proxy', Util.encrypt(JSON.stringify(newproxy)));
                    }catch(err){
                        localStorage.setItem('proxy', Util.encrypt(JSON.stringify(data)));
                    }
                }else{
                    localStorage.setItem('proxy', Util.encrypt(JSON.stringify(data)));
                }
                
            }
        });
        return deferred.promise();
    };


module.exports = new ConnProxy();

},{"./util":7}],5:[function(require,module,exports){
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
},{"./../common/en":8,"./../common/ro":9,"./../frontend/main":128,"./config":1,"./event":2,"./globals":3,"./proxy":4,"./user":6,"./util":7}],6:[function(require,module,exports){
var Config = require('./config');
var Util = require('./util');
var Globals = require('./globals');
var Event = require('./event');

//temp object to handle async login
var tempsession = {
    apps: []
};

// serial.preferUUID = true;

// localStorage.initSync({
//     dir: __dirname + '/store'
// });
var User = function() {
    this.defaults = {
        auth: false,
        display: '',
        username: '',
        api: 'unauthorized',
        uid: 0,
        reprezentanta:''
    };
    this.data = {
        auth: false,
        display: 'Anonim',
        username: '',
        api: 'unauthorized',
        uid: 0,
        reprezentanta:''
    };
    this.profile = {};
    this.preferences = {
        autologin: false //if set, application will try to login based on computer id mapped to current user
    };
    this.roles = [];
    this.ipdomain = undefined;
    this.ip = this.getNetworkIP();
    var env = String(nw.App.argv[0]);
    switch (env) {
        case 'dev':
            this.baseUrl = Config.modules.appciv.dev_server;
            break;
        case 'prod_int':
            this.baseUrl = Config.modules.appciv.intranet_server;
            break;
        case 'prod_ext':
            this.baseUrl = Config.modules.appciv.external_server;
            break;
        default:
            this.baseUrl = Config.modules.appciv.dev_server;
            break;
    }
    var cachedUser = localStorage.getItem('user');
    if(cachedUser){
        try{
            this.data = Util.decrypt(cachedUser,false);
        }catch(err){

        }
    }
    var cachedRoles = localStorage.getItem('roles');
    if(cachedRoles){
        try{
            this.roles = Util.decrypt(cachedRoles,false);
        }catch(err){

        }
    }
};

User.prototype.getNetworkIP = function() {
    var os = requireNode('os');
    var ifaces = os.networkInterfaces();
    var ip;

    Object.keys(ifaces).forEach(function(ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function(iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            // if (alias >= 1) {
            //     // this single interface has multiple ipv4 addresses
            //     console.log(ifname + ':' + alias, iface.address);
            // } else {
            //     // this interface has only one ipv4 adress
            //     console.log(ifname, iface.address);
            // }
            iparr = iface.address.split('.');
            if(parseInt(iparr[0]) === 10)
              ip = iface.address;
            ++alias;
        });
    });
    return ip;
};

User.prototype.getIpDomain = function() {
    try {
        return parseInt(this.ip.split('.')[1]);
    } catch (err) {
        return 0;
    }
}

User.prototype.resetProxy = function() {
    return true;
};
User.prototype.get = function(name) {
    return this[name];
};
User.prototype.set = function(name, value) {
    this[name] = value;
};

/**
 * Various methods to set page permissions
 * @param appname
 * @returns {boolean}
 */

User.prototype.isAdmin = function(appname) {
    return this.isInRole([4]);
};
User.prototype.getReprezentanta = function() {
    return this.data.reprezentanta;
};
User.prototype.isClient = function(appname) {
    return this.isInRole([9]);
};

User.prototype.isSecretar = function(appname) {
    return this.isInRole([6]);
};
User.prototype.isCoordonator = function(appname) {
    return this.isInRole([3]);
};

User.prototype.isSefComp = function(appname) {
    return this.isInRole([9]);
};

User.prototype.isFullData = function(appname) {
    return this.isInRole([9]);
};

//TODO: encrypt session
User.prototype.isUserAuthenticated = function(appname) {
    return this.data.auth;
};
User.prototype.isUserInRole = function(roles, appname) {
    var result = false;
    if (_.intersection(roles, this.roles).length > 0) {
        result = true;
    }
    return result;
};
User.prototype.isInRole = function(roles, appname) {
    var self = this;
    var result = false;
    if (_.intersection(roles, self.roles).length > 0) {
        result = true;
    }
    return result;
};

User.prototype.login = function(data, callback) {
    var self = this;
    var user = {};
    var roles = [];
    var session;
    $.ajax({
        url: self.baseUrl + 'civaccount/login',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(body) {
            user.display = body.displayname;
            user.auth = true;
            user.api = body.apikey;
            user.expert = body.expert;
            user.id_beneficiar = body.id_benef;
            user.uid = body.uid;
            user.reprezentanta = body.reprezentanta;
            roles = body.roles;
            //try to get session if set previously
             localStorage.setItem('user',Util.encrypt(user,false));
            localStorage.setItem('roles',Util.encrypt(roles,false));
            nw.Window.get().cookies.get({
                url: app.domain,
                name: '.authDOT'
            }, function (cookie) {
                if (cookie) {
                    localStorage.setItem('session', JSON.stringify(cookie));
                }
            });

            self.set('data', user);
            self.set('roles', roles);
            //if login came from start script we don't have to set session here
            //if (!tempsession)

            //set user list
            if (data.rememberme) {
                var ul = localStorage.getItem('user_list');
                var usrlist = ul ? JSON.parse(ul) : {};
                usrlist[data.username] = {
                    pass: Util.encrypt(data.password, true, '23'),
                    active: true
                };
                localStorage.setItem('user_list', JSON.stringify(usrlist));
            }
            callback();
        },
        error: function(body) {
            self.set('data', user);
            self.set('roles', roles);
            localStorage.setItem('session', '');
            callback(body.responseJSON.errors);
        }
    });
}


User.prototype.logout = function(appname, callback) {
    var self = this;
    var user = {};
     nw.Window.get().cookies.get({
        url: app.domain,
        name: '.authDOT'
    }, function (cookie) {
        if (cookie) {
            localStorage.setItem('session', cookie);
        }
    });
    $.ajax({
        url: self.baseUrl + 'civaccount/logoff',
        type: 'POST',
        success: function() {
            user.uid = 0;
            user.display = 'Anonim';
            user.auth = false;
            user.api = 'unauthorized';
            user.expert = null;
            user.id_beneficiar = null;
            user.reprezentanta = '';
            self.set('data', user);
            self.set('roles', []);

            app.user = {};
            app.roles = [];
             localStorage.setItem('user',self.defaults);
            localStorage.setItem('roles',[]);
            localStorage.setItem('session', '');
            callback();
        },
        error: function () {
            user.uid = 0;
            user.display = 'Anonim';
            user.auth = false;
            user.api = 'unauthorized';
            user.expert = null;
            user.id_beneficiar = null;
            user.reprezentanta = '';
            self.set('data', user);
            self.set('roles', []);
            app.User = {};
            localStorage.setItem('session', '');
            callback();

        }
    });
};
/**
// set user data from persistent data
    TODO: encrypt session
*/
User.prototype.setFromCache = function(appname) {
   var cachedUser = localStorage.getItem('user');
    if(cachedUser){
        try{
            this.data = Util.decrypt(cachedUser,false);
        }catch(err){

        }
    }
    var cachedRoles = localStorage.getItem('roles');
    if(cachedRoles){
        try{
            this.roles = Util.decrypt(cachedRoles,false);
        }catch(err){

        }
    }
    app.User = this.data;
    return this.data;
};

User.prototype.checkSession = function (callback) {
    var self = this;
    var user = {};
    $.ajax({
        url: self.baseUrl + 'civaccount/checksession',
        success: function(body) {
            user.display = body.displayname;
            user.auth = true;
            user.api = body.apikey;
            user.expert = body.expert;
            user.id_beneficiar = body.id_benef;
            user.uid = body.uid;
            user.reprezentanta = body.reprezentanta;
            roles = body.roles;

            self.set('data', user);
            self.set('roles', roles);
             localStorage.setItem('user',Util.encrypt(user,false));
            localStorage.setItem('roles',Util.encrypt(roles,false));
            if (callback) callback.call();
        },
        error: function() {
            user.uid = 0;
            user.display = 'Anonim';
            user.auth = false;
            user.api = 'unauthorized';
            user.expert = null;
            user.id_beneficiar = null;
            user.reprezentanta = '';
            self.set('data', user);
            self.set('roles', []);
            if (callback) callback.call();
        }
    });
};
//make User class member of global object, since we need it in multiple places
// we cannot make user class global, since it depends on other classes - may be a bad dependency design
// Globals.User = new User();
module.exports = new User();

},{"./config":1,"./event":2,"./globals":3,"./util":7}],7:[function(require,module,exports){
// var nwNotify = requireNode('nw-notify');
var Globals = require('./globals');
var gui = requireNode('nw.gui');
var path = requireNode('path');
var fs = requireNode('fs');
// nwNotify.setConfig({
//     defaultStyleImage: {
//         overflow: 'hidden',
//         float: 'left',
//         height: 40,
//         width: 40,
//         marginRight: 10,
//     },
//     displayTime: 6000
// });
var util = {
    encrypt: function (json, plain, cod) {
        var value;
        if (!plain) {
            value = JSON.stringify(json);
        } else {
            value = json;
        }
        var result = '';
        if (value) {
            result = btoa(value);
        }
        return result;
    },
    decrypt: function (value, plain, cod) {
        var result = '';
        if (value) {
            result = atob(value);
        }
        if (!plain && value) {
            var json = JSON.parse(result);
            return json;
        }
        return result;
    },
    authorize: function (app) {
        var session = this.decrypt(localStorage.getItem(app + 'session'));
        var applic = _.find(session.apps, function (a) {
            return a.name === app;
        });
        if (applic) {
            return applic.authorized;
        }
        return false;

    },

    closeNotifications: function () {
        nwNotify.closeAll();
    },

    showNotificationNode: function (data) {
        switch (data.type) {
            case 'error-template':
                data.image = nwNotify.getAppPath() + 'assets/alert-error.png';
                break;
            case 'info-template':
                data.image = nwNotify.getAppPath() + 'assets/alert-info.png';
                break;
            case 'success-template':
                data.image = nwNotify.getAppPath() + 'assets/alert-success.png';
                break;
            case 'warning-template':
                data.image = nwNotify.getAppPath() + 'assets/alert-warning.png';
                break;
            default:
                data.image = nwNotify.getAppPath() + 'assets/alert-info.png';
                break;
        }
        nwNotify.notify(data);
    },
    showNotification: function (data) {
        var options = {};
        switch (data.type) {
            case 'error-template':
                options.icon = this.getAppPath() + 'assets/alert-error.png';
                break;
            case 'info-template':
                options.icon = this.getAppPath() + 'assets/alert-info.png';
                break;
            case 'success-template':
                options.icon = this.getAppPath() + 'assets/alert-success.png';
                break;
            case 'warning-template':
                options.icon = this.getAppPath() + 'assets/alert-warning.png';
                break;
            default:
                options.icon = this.getAppPath() + 'assets/alert-info.png';
                break;
        }
        options.body = data.text;
        var notification = new Notification(data.title, options);
        notification.onclick = function () {
            // document.getElementById("output").innerHTML += "Notification clicked";
        }

        notification.onshow = function () {
            // play sound on show
            // myAud = document.getElementById("audio1");
            // myAud.play();

            // auto close after 1 second
            setTimeout(function () {
                notification.close();
            }, 5000);
        };
    },
    downloadFile: function (url, method, data, filename) {
        w2utils.lock('#main', 'Se exporta datele....');
        chrome.downloads.download({
            url: url,
            saveAs: true,
            headers: [{
                name: 'Content-Type',
                value: 'application/json'
            }],
            method: method,
            body: JSON.stringify(data),
            //filename: filename
        }, function () {
            w2utils.unlock('#main');
            w2alert('Fiserul a fost descarcat!');
        });
    },
    downloadPDF: function (url) {
        var iframe = document.getElementById('download_iframe');
        var userdata = Globals.User.get('data');
        var apiKey = userdata.api;
        var strURL = url + '&api=' + apiKey;
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = "download_iframe";
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        iframe.src = strURL;
        iframe.addEventListener("load", function () {
            console.log("FILE LOAD DONE.. Download should start now");
        });
    },

    printPDF: function (url, cb) {
        var self = this;
        this.getRequestCookie().then(function (cookienew) {
            var strURL = escape(url);
            // nw.Window.open(url, {
            //     width: 800,
            //     height: 600
            // }, 
            nw.Window.open(self.getAppPath() + '/pdfviewer/index.html', {
                width: 800,
                height: 600
            }, 
            function (win) {
                if (cb) {
                    cb(win);
                }
                win.data = {
                    file: strURL,
                    cookie: cookienew
                };

            });
        });
    },

    getRequestCookie: function () {
        var deferred = $.Deferred();
        var cookie = localStorage.getItem('session');
        if (cookie) {
            var cookienew = JSON.parse(cookie);
            cookienew.url = app.domain;
            delete cookienew.hostOnly;
            delete cookienew.session;
            deferred.resolve(cookienew);
        } else {
            nw.Window.get().cookies.get({
                url: app.domain,
                name: '.authDOT'
            }, function (c) {
                c.url = app.domain;
                delete c.hostOnly;
                delete c.session;
                deferred.resolve(c);
            });
        }
        return deferred.promise();
    },

    getAppPath: function () {
        // Get path to node_modules
        var a = window.document.createElement('a');
        a.href = window.location.href;
        var pathToAppIndex = a.pathname;

        var pathSegemnts = pathToAppIndex.split('/');
        // Remove last part (index.html of app)
        pathSegemnts.pop();
        var appPath = a.origin + pathSegemnts.join('/') + '/';
        a = null;
        return appPath;
    },

    showError: function (data) {
        $.each(data, function (i, err) {
            $('#' + err.name).w2tag(err.message, {
                'class': 'w2ui-error'
            });
        });
    },

    getCivNou:function(){
        var civnou = localStorage.getItem('civnou');
        return civnou;
    },

    setCIVNou:function(flag){
        localStorage.setItem('civnou',flag);
    }

};
module.exports = util;
},{"./globals":3}],8:[function(require,module,exports){
var locale = {
    "locale": "en-US",
    "dateFormat"    : "m/d/yyyy",
    "dateDisplay"   : "m/d/yyyy",
    "timeFormat"    : "h12",
    "currency"       : "^[\\$]?[-+]?[0-9]*[\\.]?[0-9]+$",
    "currencyPrefix" : "$",
    "currencySuffix" : "",
    "groupSymbol"    : "",
    "float"          : "^[-]?[0-9]*[\\.]?[0-9]+$",
    "shortmonths"    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "fullmonths"     : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "shortdays"      : ["M", "T", "W", "T", "F", "S","S"],
    "fulldays"       : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "dataType": "JSON",
    "phrases" : {
        "Detalii":"Details",
        "Salveaza":"Save",
        "Sterge":"Delete",
        "Renunta":"Cancel",
        "Vizualizare":"View",
        "Descarca":"Download",
        "Adaugare TVV Nou la Extensie Noua":"Add TVV to New Extension",
        "Adaugare TVV Nou la Extensie Existenta":"Add TVV to Existing Extension",
        "Modificare TVV existent":"Modification of Existing TVV",
        "Actualizare TVV la Extensie Noua":"Update TVV to New Extension",
        "Extinderea omologarii de tip":"Extension of Type Approval",
        "Omologare CE/CEE-ONU de tip Serie nelimitata":"CE/CEE-ONU Type Approval Unlimited Series",
        "Omologare CE/National de tip Serie mica":"CE/National Type Approval Limited Series",
        "CEC":"CEC",
        "Dispozitie plata":"Payment Order",
        "Numerar":"Cache",
        "Tip activitate:":"Activity:",
        "Tip completare date:":"Data Completion Method:",
        "Data WVTA:":"WVTA Release Date:",
        "Solicitati eliberare cerificat?":"Demand Certificate?",
        "Solicitati incercari?":"With tests?",
        "Nr. omologare baza:":"Base Type Approval Nr.:",
        "Metoda plata:":"Payment method:",
        "Responsabil cerere:":"Application responsible:"  ,
        "Reprezentant legal:":"Legal Representative:",
        "Observatii:":"Observations:",  
        " Salveaza":" Save",
        " Renunta":" Cancel",  
        "Tip actiune:":"Action Type:",  
        "Grupa:":"Group:",
        "Categorie:":"Category:",
        "Categorie folosinta:":"Category of Use:",
        "Caroserie:":"Body:",
        "Tip Motor:":"Engine Type:",
        "Tip conf. producator:":"Type according prod.:",
        "Producator:":"Manufacturer:",
        "Marca:":"Make:",
        "Tip:":"Type:",
        "Versiune:":"Version:",
        "Varianta:":"Variant:",
        "Denumire Comerciala:":"Commercial Name:",
        "Marca":"Make",
        "Tip":"Type",
        "Versiune":"Version",
        "Varianta":"Variant",
        "Denumire Comerciala":"Commercial Name",
        "Caroserie:":"Body:",
        "Categorie:":"Category:",
        "Categorie Folosinta:":"Category of Use:",
        "Act Normativ:":"Regulatory act:",
        "Tip Act Normativ:":"Type of Regulatory Act:",
        "Solicitare act echivalent:":"Require equivalent:",
        "Amendament":"Amendament",
        "Amendament:":"Amendament",
        "REGULAMENTE":"REGULATIONS",
        "REGULAMENTE UE":"UE REGULATIONS",
        "DIRECTIVE":"DIRECTIVES",
        "Nr. Omologare nou":"New Type Approval",
        "Extindere":"Extension",
        "Revizie":"Revision",
        "Corectie":"Corection",
        "--Alegeti din lista--":"--Select from list--",

        "Sterge fisier":"Delete file",
        "Incarca fisier":"Upload file",
        "Fisier neincarcat inca...":"File not uploaded yet...",
        "Incarcat":"Uploaded",
        "Eroare incarcare":"Error uploading",
        "Se incarca ...":"Uploading...",
        "Incarca":"Upload",
        " Incarca":" Upload",
        "Alege fisiere":"Choose files",
        " Alege...":" Browse...",
        "Reset":"Reset",
        " Reset":" Reset",
        "Trageti fisiere aici":"Drag files here",

        //menu
        "Program":"Program",
        // "Inchide":"Exit",
        "Reincarca":"Reload",
        "Fereastra":"Window",
        "Formular CIV":"VIC Form",
        "Aplicatia tipareste pe formularul ":"Printing on ",
        "CIV Nou":"New Form",
        "CIV vechi":"Old Form",
        "! Doriti schimbarea formularului?":"! Do you want to change this?",

        "Comenzi C.I.V.":"V.I.C. Orders",
        "Comanda noua":"New order",
        "Lista comenzi Grivita":"Order list Grivita",
        "Lista comenzi Voluntari":"Order list Voluntari",
        "Lista comenzi Pitesti":"Order list Pitesti",
        "Toata lista":"All",
        "Situatie plati":"Payments status",
        "Situatie CIV-uri":"VIC's status",
        "Sfarsit serie":"End of series",
        "Lista vehicule":"Vehicle list",
        "CIV Individual":"Individual VIC",
        "Lista comenzi":"Orders list",
        "Situatie CIV":"VIC's status",
        "Cauta VIN":"Search VIN",
        "Operatii CIV":"VIC Operations",
        "Arhivare":"Archive",
        "Anulare":"Cancel",
        "Cereri Nr. Omologare":"Type Approval No. Requests",
        'Cerere noua':"New Request",
        "Lista":"List",
        "Utilizator":"User",
        "Autentificare":"Login",
        "Profil":"Profile",
        "Inchide sesiunea":"Logoff",
        "Setari proxy":"Proxy settings",
        "Ajutor":"Help",
        "Manual utilizare": "User Manual",


        //comenzi
        "Nr. inregistrare RAR":"RAR Registration No.",
        "Data Inregistrare":"Registration Date",
        "Nr. registru client":"Client Registration No.",
        "Data registru client":"Client Registration Date",
        "Inchide":"Close",
        "Salveaza":"Save",
        "Editare":"Edit",
        "Instiintare plata":"Payment notification",
        "Raport":"Report",
        "Raport XLS":"xls Report",
        "Transmite comanda!":"Post order!",
        "Sigur finalizati aceasta comanda?":"Are you sure you want to finalize this order?",
        "Tipar":"Print",
        "Verificare":"Verify",
        "Arhivare":"Archive",
        "Anulare":"Cancel",
        "Nr.Comanda":"Order No.",
        "Nr. Vehicule":"Vehicles",
        "Data":"Date",
        "Nr client":"Client order no.",
        "Data client":"Client order date",
        "Serie CIV":"VIC serial",
        "Finalizata":"Completed",
        "Depusa":"Posted",
        "Prelucrata":"Processed",
        "FACTURAT-NEINCASAT":"NOT CASHED YET",
        "NEPRELUCRAT":"NOT PROCESSED YET",
        "Adaugati vehicule":"Add vehicles",
        "In lucru - OK":"In progress - OK",
        "In lucru - Vehicule invalide":"In progress - invalid vehicles",
        "In curs de transmitere":"Sending",
        "Depusa - asteapta prelucrare":"Posted - wait for processing",
        "Prelucrata - OK":"Processed - OK",
        "Verificat - OK":"Verified - OK",
        "Tiparit":"Printed",
        "In prelucrare":"Processing",
        "Alege fisier":"Choose file",
        "Data tipar":"Print date",
        "Punct de lucru":"Issued from",
        "Numar bucati":"Items",
        "Data factura":"Invoice date",
        "Suma incasata":"Amount",
        "Serie factura":"Invoice serial",
        "Nr factura":"Invoice no",
        " Beneficiari:":"Clients",
        "Nr. Identificare":"VIN No.",
        "Serie Motor":"Engine Serial",
        "Cat. EU":"EU Category",
        " Incarca vehicule":"Load vehicles",
        "Eroare la transmitere! Verificati fisierul!":"Error sending file!",
        "Fata(Anvelopa/Janta):":"Front(Tyre/Rim)",
        "Spate(Anvelopa/Janta):":"Back(Tyre/Rim)",
        "Anvelope echipare standard":"Standard equipment",
        "Anvelope echipare optionala":"Optional equipment",




        //anvelope
        "Anvelopa:":"Wheel tyre:",
        "Anvelopa":"Wheel tyre",
        "Janta":"Wheel rim",
        "Axa:":"Axle:",
        "Axa":"Axle",
        "Axa fata:":"Front axle:",
        "Axa spate:":"Rear axle:",
        "Idem spate:":"Same on rear:",
        "Fata":"Front",
        "Spate":"Rear",
        
        //registru
        "Nr. Extensie:":"Extension no.:",
        "Data Extensie:":"Extension Date:",
        "Date lucru cerere":"Work area",
        "Date existente TVV":"Existing data",
        "Date TVV":"TVV data",
        "Varianta noua":"Add variant",
        "Versiune noua":"Add version",
        "Notificare":"Notification",
        "Inregistrarile au fost sterse!":"Records deleted!",
        "Activitate":"Activity",
        "Modificare extensie":"Extension update",
        "Date incomplete!":"Incomplete data!",
        "Adaugare varianta":"New variant",
        "Adaugare versiune":"New version",
        "Numar registru":"Register No.",
        "Transfera TVV selectat":"Transfer selected TVV",
        "Acest TVV exista deja la extensia selectata!":"This TVV already exists on selected extension!",
        "Va rog sa selectati o extensie in tabelul de mai sus!":"Please select an extension from above table!",
        "Extensie":"Extension",
        "Date existente WVTA":"Existing WVTA data",
        "Transfera extensia":"Transfer extension",
        "Extensia selectata exista deja!":"Selected extension already exists!",
        "Adauga extensie":"Add extension",
        "Sterge extensia":"Delete extension",
        "Extensia nr. ":"Extension no. ",
        "Nr. Registru": "Register No.",
        "Se asteapta generarea...":"Waiting...",
        "Categorie CE:":"EC Category:",
        "Denumire:":"Commercial Name:",
        "Mod omologare:":"Approval type:",
        "Numar axe:":"Axles:",
        "Acest TVV exista in baza de date la acest WVTA!<br>Doriti sa continuati cu datele introduse?":"This TVV already exists in the database!<br>Do you wish to continue with existing data?",

        //date tehnice
        //mase
        "Masa proprie (kg)":"Mass in running order (kg)",
        "Masa tehnica totala (kg)":"Tech. perm. max. laden mass (kg):",
        "Masa tehnica axa (kg) 1":"Tech. perm. max. axle (kg) 1",
        "Masa tehnica axa (kg) 2":"Tech. perm. max. axle (kg) 2",
        "Masa tehnica axa (kg) 3":"Tech. perm. max. axle (kg) 3",
        "Masa tehnica axa (kg) 4":"Tech. perm. max. axle (kg) 4",
        "Masa tehnica axa (kg) 5":"Tech. perm. max. axle (kg) 5",
        "Masa ansamblu (kg)":"Tech. perm. max. comb. (kg)",
        "Remorcabila cu disp (kg)":"Tech. perm. max. towable braking (kg)",
        "Remorcabila fara disp (kg)":"Tech. perm. max. towable non braking (kg)",
        "Masa utila (kg)":"Load mass (kg)",
        "Masa plafon (kg)":"Ceiling mass (kg)",
        "Masa pe carlig (kg)":"Tech. perm. max. coupling point (kg)",
        //dimensiuni
        "Lungime (mm)":"Length (mm)",
        "Latime (mm)":"Width (mm)",
        "Inaltime (mm)":"Height (mm)",
        "Ampatament (mm) 1":"Wheel base (mm) 1",
        "Ampatament (mm) 2":"Wheel base (mm) 2",
        "Ampatament (mm) 3":"Wheel base (mm) 3",
        "Ampatament (mm) 4":"Wheel base (mm) 4",
        "Ecartament (mm) 1":"Axle spacing (mm) 1",
        "Ecartament (mm) 2":"Axle spacing (mm) 2",
        "Ecartament (mm) 3":"Axle spacing (mm) 3",
        "Ecartament (mm) 4":"Axle spacing (mm) 4",
        "Ecartament (mm) 5":"Axle spacing (mm) 5",
        "Consola spate (mm)":"Rear overhang (mm)",
        //poluare
        "Doc. Omologare":"Approval doc.",
        "Particule":"Particulates",
        "Combustibil alternativ":"Alternate fuel",
        "Nr Omologare GPL":"LPG Approval No.",
        "CO2 combinat alternativ (g/km)":"Alternate CO2 mass (g/km)",
        "Poluare":"National emission code",
        "Filtru particule":"Particulates filter",
        "Zgomot mers (dbA)":"Sound level drive-by (dbA)",
        "Zgomot stationare (dbA)":"Sound level stationary (dbA)",
        "Turatie zgomot stationare":"Sound level engine speed",
        "CO2 combinat (g/km)":"CO2 comb. emission",
        "Cod general ecoinovatie":"Ecoinovation code",
        "Total reduceri CO2(g/km)":"CO2 emission reduction(g/km)",
        "Consum urban (l/100km)":"Fuel consumption urban (l/100km)",
        "Consum extraurban (l/100km)":"Fuel consumption extraurban (l/100km)",
        "Consum mixt (l/100km)":"Fuel consumption mixt (l/100km)",
        "CO2 WLTP combinat (g/km)":"CO2 WLTP combined (g/km)",
        "CO2 NEDC combinat (g/km)":"CO2 NEDC combined (g/km)",
        "Consum faza joasa (l/100km)":"Fuel consumption low phase (l/100km)",
        "Consum faza inalta (l/100km)":"Fuel consumption high phase (l/100km)",
        "Consum faza medium (l/100km)":"Fuel consumption medium phase (l/100km)",
        "Consum combinat (l/100km)":"Fuel consumption combined (l/100km)",
        "Masa test (kg)":"Test mass (kg)",
        "Cod general ecoinovatie WLTP":"Ecoinovation code WLTP",
        "Total reduceri CO2 WLTP":"CO2 emission reduction WLTP",
        "Consum energie electrica":"Energy consumption",
        "Factor deviere":"Deviation factor",
        "Factor verificare":"Verification factor",
        //transmisie
        "Tip tractiune":"Power train",
        "Tip transmisie":"Gearbox type",
        "Nr. trepte inainte":"Forward gear no.",
        "Nr. trepte inapoi":"Backward gear no.",
        "Viteza maxima (km/h)":"Maximum speed(km/h)",
        //axe
        "Tip axa 1":"Axle type 1",
        "Tip axa 2":"Axle type 2",
        "Tip axa 3":"Axle type 3",
        "Tip axa 4":"Axle type 4",
        "Tip axa 5":"Axle type 5",
        "Tip suspensie axa 1":"Suspension type axle 1",
        "Tip suspensie axa 2":"Suspension type axle 2",
        "Tip suspensie axa 3":"Suspension type axle 3",
        "Tip suspensie axa 4":"Suspension type axle 4",
        "Tip suspensie axa 5":"Suspension type axle 5",
        "Grup axa 1":"Axle group 1",
        "Grup axa 2":"Axle group 2",
        "Grup axa 3":"Axle group 3",
        "Grup axa 4":"Axle group 4",
        "Grup axa 5":"Axle group 5",
        //alte date
        "Locuri in fata":"Front seats",
        "Locuri scaune":"Seated places",
        "Locuri picioare":"Standing places",
        "Locuri total":"Total places",
        "Capacitate rezervor 1 (l)":"Fuel tank capacity 1 (l)",
        "Capacitate rezervor 2 (l)":"Fuel tank capacity 2 (l)",
        "Sistem propulsie":"Propulsion",
        "Tip franare":"Braking system",
        "Tip asistare directie":"Steering assist type",
        "Echipare ADR":"ADR Equipment",
        "Putere 30min electric (kW)":"Max 30 min power (kW)",
        "Putere neta electric (kW)":"Max net power (kW)",
        "Putere orara electric (kW)":"Max houtly output (kW)",
        "Consum WH/km":"Energy consumption WH/km",
        "Raport putere/masa (moto)":"Power/mass ratio (moto)",
        //tabs
        "Date TVV":"TVV Data",
        "Date generale":"General info",
        "Mase":"Masses",
        "Dimensiuni":"Dimensions",
        "Axe":"Axles",
        "Alte Date":"Others",
        "Anvelope":"Wheels",
        "Motor":"Engine",
        "Transmisie":"Power train",
        "Poluare":"Emissions",
        "Componente/Sisteme":"Syst./Components",
        "Mentiuni":"Mentions",
        "Importa datele de la extensia anterioara":"Import data from previous extension",
        "Inchide":"Close",
        "Va rugam asteptati":"Please wait",
        "Inregistrarea a fost salvata!":"Record saved!",
        "Inregistrarea nu a fost salvata!":"Error saving record!",
        "Sigur doriti aducerea datelor de la extensia anterioara?<br>Datele existente se vor sterge!":"Are you sure you want to import data?<br>Existing data will be erased!",
        "Inregistrarea contine erori! Verificati datele generale!":"Record has errors! Check General info tab!",
        "Eroare":"Error",
        //motor
        "Cod motor":"Engine code",
        "Putere(kW)":"Net power(kw)",
        "Putere(CP)":"Net power(HP)",
        "Cilindree":"Capacity",
        "Tip motor":"Engine type",
        "Transfera selectia":"Transfer selected row",
        "Motorul selectat exista deja!":"Selected engine already exists",
        "Cod poansonat":"Engine code as marked",
        //comanda
        "Text comanda":"Order text",
        "Text subsol":"Footer text",
        "FINALIZATA":"COMPLETED",
        "EMISA":"ISSUED",
        "Stare Comanda":"Order satus",
        "Obiect comanda":"Order object",
        //deviz
        "Autovehicule":"Vehicles",
        "Remorci":"Towed vehicles",
        "Regulamente CEE-ONU":"EEC Regulations",
        "Directive-Regulamente CE":"EC Directives-Regulations",
        //dosare
        "Omologare Tip":"Type Approval",
        "Inregistrare Nationala":"National Registration",
        "FINALIZAT":"COMPLETED",
        "IN LUCRU":"IN PROGRESS",
        "ANULAT":"CANCELED",
        "Sigur stergeti aceasta inregistrare?":"Delete this record?",
        "Generare Nr.":"Generate No.",
        "Nr Omologare generat!":"Type Approval No. Generated!",
        "TIP":"TYPE",
        "NR. ACT":"NORM. NO.",
        "NR. AMENDAMENT":"AMENDAMENT NO.",
        "Nr. Omologare Baza":"Base Type App. No.",
        "Nr. Omologare":"Type App. No.",
        "Fisier":"File",
        "Nume fisier":"File name",
        "Data depunere":"Submission date",
        "Nr. Raport":"Report No.",
        "Data Raport":"Report Date",
        "Stare Raport":"Report Status",
        "Raport incarcat":"Report loaded",
        "Nr. comanda":"Order no.",
        "Data comanda":"Order date",
        "Stare comanda":"Order status",
        "Raport Incercari Incarcat!":"Test Report loaded!",
        "Eroare la incarcare!":"Error loading report!",
        //email
        "De la":"From",
        "Data":"Date",
        "Catre":"To",
        "Subiect":"Subject",
        "Nou":"New",
        "Mesaj corespondenta":"Mail message",
        "Nu s-a putut incarca agenda de adrese pentru acest dosar!":"Contacts could not be loaded!",
        "Trimite":"Send",
        "Anuleaza":"Cancel",
        "Email trimis cu success!":"Email sent!",
        "Eroare la transmitere!":"Error sending mail!",
        "Numar deviz":"Payment estimate no.",
        "Comanda":"Order",
        "Data deviz":"Payment estimate date",
        "Valoare deviz":"Ammount to pay",
        "Stare deviz":"Payment status",
        'ACHITAT':"PAYED",
        "NEACHITAT":"NOT PAYED",
        "ANULAT":"CANCELED",
        "Data achitarii":"Payment date",
        "Data acceptare":"Accept date",
        "Aprobat":"Approved",
        "APROBAT":"APPROVED",
        "NEAPROBAT":"NOT APPROVED YET",
        "Date factura":"Invoice date",
        "Descriere":"Description",
        //dosar
        "Valoare incorecta!":"Incorrect value!",
        "Nr. Dosar":"File No.",
        "Data Dosar":"File Date",
        "Data Finalizare":"Completion Date",
        "Stare":"Status",
        "Beneficiar":"Client",
        "Coordonator":"Coordinator",
        "Tip dosar":"File Type",
        "Stare plata":"Payment status",
        "FARA DEVIZ":"NO PAYMENT",
        "Vechi":"Old",
        "Achitat":"Payed",
        "Neachitat":"Not payed",
        "Finalizat":"Completed",
        "In lucru":"In progress",
        "Anulat":"Canceled",
        "Nr. DOT":"DOT No.",
        "Data DOT":"DOT Date",
        "Numar act":"Normative no.",
        "Nr. Registru(RAR)":"Register No.(RAR)",
        "Nr. Deviz":"Estimate No.",
        "Date principale":"Main informations",
        "Documentatie":"Documentation",
        "Devize":"Payments",
        "Corespondenta":'Email',
        "Obiect":"Object",
        "Acte normative":"Regulatory acts",
        "Comenzi":"Orders",
        "Certificate":"Certificates",
        //registru dosare
        "Ordine CIV":"CIV Order",
        "Date lucru dosar":"Work area",
        "Meniu":"Menu",
        "Extensia are TVV-uri atasate! Va rugam stergeti mai intai TVV-urile si apoi extensia!":"This extension has TVV attached and cannot be deleted!",
        "Adauga mentiunea":"Add mention",
        "Componenta selectata exista deja":"Selected component already exists!",
        "Turatie putere":"Engine speed",
        "Act normativ":"Regulatory act",
        "Aplicare":"Applies to",
        "Cerinta":"Demand",
        "Data Aplicarii":"Applies staring",
        "Data Expirarii":"Expires",
        "Coloana":"Column",
        "CERINTA SE SELECTEAZA DIN LISTA DACA E CAZUL!":"DEMAND IS SELECTED FROM LIST IF APPLICABLE",
        "Categorii":"Categories",
        "Va rog selectati o valoare in coloana CERINTA":"Please select a value in DEMAND column",
        "Valideaza datele!":"Validate data!",
        "Certificat":"Communication",
        "Atestat":"Certificate",
        "Fisa":"Record",
        "Sigur validati acest numar?":"Validate this data?",
        "ATENTIE!<br>TVV-ul nu este valid deoarece nu indeplineste cerintele ":"WARNING!<br>This TVV is not valid as it does not meet the requirements of ",
        " intrate in vigoare la data ":" mandatory begining with ",
        "Sigur validati?":"Are you sure you want to validate?",
        "Datele au fost validate!":"Data has been validated!",
        "Datele existente se vor sterge! Sigur doriti inlocuirea datelor?":"Existing data will be deleted! Are you sure?",

        "Intrare:":"Entry No.:",
        "Tip dosar:":"File type:",
        "Mod deschidere:":"Opening mode:",
        "Data intrare DOT:":"Date of entry:",
        "Nr. cerere client:":"Client application no.:",
        "Data cerere client:":"Client application date:",
        "Nr. intrare RAR:":"RAR submission no.:",
        "Data intrare RAR:":"RAR submission date:",
        "Stare dosar:":"File status:",
        "Coordonator:":"Coordinator:",
        "Beneficiar:":"Client:",
        "Data finalizare:":"Completion date:",
        "Observatii":"Observations",
        "Inapoi la lista":"Back to list",
        "Data finalizare":"Completion date",
        "Stare dosar":"File status",
        "Nr. cerere client":"Client application no.",
        "Data deschidere":"Opening date",
        "Nr. dosar":"File no.",
        "Mesaj":"Message",
        "Trimise":"Sent",
        "Primite":"Received",
        "Tip motor:":"Engine type:",
        "Dosar":"File"
        
    }
};
module.exports = locale;

},{}],9:[function(require,module,exports){
var locale = {
    "locale": "ro-RO",
    "date_format": "dd.mm.yyyy",
    "date_display": "dd.mm.yyyy",
    "time_format": "h12",
    "currency": "^[\\$]?[-+]?[0-9]*[\\.]?[0-9]+$",
    "currencyPrefix": "RON",
    "currencySuffix": "",
    "groupSymbol": "",
    "float": "^[-]?[0-9]*[\\.]?[0-9]+$",
    "shortmonths": ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "fullmonths": ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
    "shortdays": ["L", "M", "M", "J", "V", "S", "D"],
    "fulldays": ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"],
    "dataType": "JSON",
    "phrases": {
        "Add new record": "Adauga un element",
        "Add New": "Adauga",
        "All Fields": "Toate campurile",
        "Are you sure you want to delete selected records?": "Sigur stergeti integistrarile selectate?",
        "Attach files by dragging and dropping or Click to Select": "Trageti fisiere aici sau apasati pentru a selecta",
        "begins with": "incepand cu",
        "begins": "incepe",
        "between": "intre",
        "in": "in",
        "not in": "nu este in",
        "Confirmation": "Confirmare",
        "contains": "contine",
        "Delete Confirmation": "Confirmare stergere",
        "Delete selected records": "Sterge randurile selectate",
        "Delete": "Sterge",
        "ends with": "se termina in",
        "ends": "se termina",
        "Hide": "Ascunde",
        "is": "este",
        "Line #": "Rand #",
        "Multi Fields": "Multi campo",
        "No items found": "Niciun rezultat",
        "No": "Nu",
        "none": "niciun",
        "Not a float": "Numarul nu este decimal",
        "Not a hex number": "Numarul nu este in format hexadecimal",
        "Not a valid date": "Data invalida",
        "Not a valid email": "Email in format invalid",
        "Not alpha-numeric": "Valorea nu este alfa-numerica",
        "Not an integer": "Numerul nu este intreg",
        "Not in money format": "Format neacceptat",
        "Notification": "Notificare",
        "of": "din",
        "Ok": "Ok",
        "Open Search Fields": "Vizualizare campuri de cautare",
        "Records": "Inregistrari",
        "Refreshing...": "Reincarcare...",
        "Reload data in the list": "Reincarcare lista",
        "Remove": "Renunta",
        "Required field": "Camp obbligatoriu",
        "Reset": "Reset",
        "Restore Default State": "Stare initiala",
        "Return data is not in JSON format. See console for more information.": "Eroare incarcare date - vezi consola pentru informatii",
        "Ripristina": "Inregistrare",
        "Save changed records": "Salveaza inregistrarile modificate",
        "Save Grid State": "Memoreaza starea gridului",
        "Save": "Salveaza",
        "Saving...": "Se salveaza...",
        "Search": "Cauta",
        "Search...": "Cautare...",
        "Select Search Field": "Selectare camp de cautare",
        "Show": "Arata",
        "Show/hide columns": "Arata/Ascunde coloane",
        "Skip": "Sari",
        "Yes": "Da",
        "yesterday": "ieri",
        "No matches": "Niciun rezultat",
        "Type to search....": "Scrieti pentru a cauta..."
    }
};
module.exports = locale;

},{}],10:[function(require,module,exports){
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

},{"./controller":23,"./router":43}],11:[function(require,module,exports){
 var AnvelopaModel = require('./../models/anvelopa'),
     AnvelopeCollection = window.Backbone.SCollection.extend({
         model: AnvelopaModel,
         id_vehicul: undefined,
         initialize: function(models, options) {
             if (options !== undefined) {
                 this.id_vehicul = options.id_vehicul;
             }
         },
         url: function() {
             return app.baseUrl + 'vehicule/getanvelopevehicul/' + this.id_vehicul;
         },

         byEchipare: function(echip) {
             var filtered = this.filter(function(anvelopa) {
                 return anvelopa.get('echip') === 1;
             });
             return new AnvelopeCollection(filtered);
         },
         undeleted: function() {
             var filtered = this.filter(function(anvelopa) {
                 return anvelopa.get('EntityState') !== 2;
             });
             return new AnvelopeCollection(filtered);
         }
     });
 module.exports = AnvelopeCollection;

},{"./../models/anvelopa":25}],12:[function(require,module,exports){
var AtributModel = require('./../models/atribut'),
    AtributeCollection = window.Backbone.SCollection.extend({
        model: AtributModel,
        id_vehicul: undefined,

        initialize: function(models, options) {
            if (options !== undefined) {
                this.id_vehicul = options.id_vehicul;
            }

        },

        url: function() {
            return app.baseUrl + 'vehicule/getatributevehicul/' + this.id_vehicul;
        },

        byGroup: function(grupa) {
            filtered = this.filter(function(box) {
                return box.get('grupa') === grupa;
            });
            return new AtributeCollection(filtered);
        }

    });

module.exports = AtributeCollection;

},{"./../models/atribut":26}],13:[function(require,module,exports){
var FisierModel = require('./../models/fisier'),
    FisiereCollection = window.Backbone.SCollection.extend({
        model: FisierModel,
        id_vehicul: undefined,

        initialize: function(models, options) {
            if (options !== undefined) {
                this.id_vehicul = options.id_vehicul;
            }

        },

        url: function() {
            return app.baseUrl + 'individuale/getfisierevehicul/' + this.id_vehicul;
        },

        byGroup: function(grupa) {
            filtered = this.filter(function(box) {
                return box.get('grupa') === grupa;
            });
            return new FisiereCollection(filtered);
        }

    });

module.exports = FisiereCollection;
},{"./../models/fisier":29}],14:[function(require,module,exports){
var MentiuneModel = require('./../models/mentiune'),
    MentiuniCollection = window.Backbone.SCollection.extend({
        model: MentiuneModel,
        id_vehicul: undefined,

        initialize: function(models, options) {
            if (options !== undefined) {
                this.id_vehicul = options.id_vehicul;
            }

        },

        url: function() {
            return app.baseUrl + 'vehicule/getatributevehicul/' + this.id_vehicul;
        },
    });

module.exports = MentiuniCollection;
},{"./../models/mentiune":30}],15:[function(require,module,exports){
 var NAnvelopaModel = require('./../models/nanvelopa'),
     NAnvelopeCollection = window.Backbone.SCollection.extend({
         model: NAnvelopaModel,
         initialize: function(models, options) {},
         url: function() {},
         active: function() {
             var filtered = this.filter(function(anvelopa) {
                 return anvelopa.get('disabled') !== true;
             });
             return new NAnvelopeCollection(filtered);
         }
     });
 module.exports = NAnvelopeCollection;

},{"./../models/nanvelopa":31}],16:[function(require,module,exports){
var Model = require('./../../models/registru/anvelopa');
var Anvelope = Backbone.SCollection.extend({
    model: Model,
    // byGroup: function(group) {
    //     var filtered = this.filter(function(m) {
    //         return m.get('grupa') === group;
    //     });
    //     return new DateTehnice(filtered);
    // }
});
module.exports = Anvelope;

},{"./../../models/registru/anvelopa":32}],17:[function(require,module,exports){
var Model = require('./../../models/registru/datetehnice');
var DateTehnice = Backbone.SCollection.extend({
    model: Model,
    initialize:function(){
        var self = this;
        // this.listenTo(this,'change',function(){
        //     var mt,mp,mu_model;
        //     self.models.map(function(m){
        //         if(m.get('id_nom')===6)
        //             mp = m.get('val_min');
        //         else if(m.get('id_nom')=== 7)
        //             mt = m.get('val')
        //         else if(m.get('id_nom')===13)
        //             mu_model = m;
        //     });
        //     if(mu_model)
        //         mu_model.set('val',Number(mt)-Number(mp));
        // });
    },
    comparator: function(item) {
        return item.get('ord');
    },
    byGroup: function(group) {
        var filtered = this.filter(function(m) {
            return m.get('grupa') === group;
        });
        return new DateTehnice(filtered);
    }
});
module.exports = DateTehnice;

},{"./../../models/registru/datetehnice":33}],18:[function(require,module,exports){
var Model = require('./../../models/registru/mentiune');
var Mentiuni = Backbone.SCollection.extend({
    model: Model
});
module.exports = Mentiuni;

},{"./../../models/registru/mentiune":34}],19:[function(require,module,exports){
var Model = require('./../../models/registru/motor');
var Motoare = Backbone.SCollection.extend({
    model: Model,
    // byGroup: function(group) {
    //     var filtered = this.filter(function(m) {
    //         return m.get('grupa') === group;
    //     });
    //     return new DateTehnice(filtered);
    // }
});
module.exports = Motoare;

},{"./../../models/registru/motor":35}],20:[function(require,module,exports){
var Model = require('./../../models/registru/sistem');
var Sisteme = Backbone.SCollection.extend({
    model: Model,
    // byGroup: function(group) {
    //     var filtered = this.filter(function(m) {
    //         return m.get('grupa') === group;
    //     });
    //     return new DateTehnice(filtered);
    // }
});
module.exports = Sisteme;

},{"./../../models/registru/sistem":37}],21:[function(require,module,exports){
 var VehiculModel = require('./../models/vehicul'),
     VehiculeCollection = window.Backbone.SCollection.extend({
         model: VehiculModel,
         //url: 'vehicule/getvehicule/'+this.id_comanda,
         meta: function(prop, value) {
             if (value === undefined) {
                 return this._meta[prop];
             } else {
                 this._meta[prop] = value;
             }
         },
         url: function() {
             var url = app.baseUrl + 'vehicule/getvehicule';
             if (this.id_comanda) {
                 url += '/' + this.id_comanda;
             }
             return url;
         },
         initialize: function(models, options) {
             //this.listenTo(this,'destroy',function(model){});
             if (options) {
                 if (options.fk) {
                     this.id_comanda = (options.fk);
                 }
             }
             this._meta = {};

         },
         parse: function(response) {
             this.meta('totalSize', response.iTotalRecords);
             this.meta('filteredSize', response.iTotalDisplayRecords);
             return response.aaData;
         },
         setFilter: function(filter) {
             this.url = app.baseUrl + App.Settings.modules.vehicul.collection_path + '/' + this.id_comanda;
             this.url = this.url + '?' + filter;
         },

         addFilter: function(filter) {
             this.url = app.baseUrl + this.url + filter;
         }

     });


 module.exports = VehiculeCollection;

},{"./../models/vehicul":40}],22:[function(require,module,exports){
var ModelCIV = require('./../models/vehiculciv');
module.exports = Backbone.Collection.extend({
	model:ModelCIV
});
},{"./../models/vehiculciv":42}],23:[function(require,module,exports){
/**
 * @author cristian_mar
 */
/**
 * Application controller
 * @type:{Marionette.Controller}
 * Handles public methods
 */
var ipc = requireNode('ipc');
var HomeView = require('./views/home');
var gui = requireNode('nw.gui');
var controller = window.Marionette.Controller.extend({
    initialize: function (options) {
        this.app = options.app;
    },
    closeapp: function () {
        this.app.execute('activeModule:stop');
    },
    openHelp: function () {
        //app.Util.printPDF(application.paths.staticFiles + '/Manuale/Manual.pdf', true);
    },
    request: function () {
        console.info('Action requested on appciv controller');
    },
    /**
     * navigate to home page
     */
    home: function () {
        app.container.show(new HomeView());
    },
    cereri: function (options) {
        console.log(options);
        var IndexView = require('./views/cereri/index');
        app.container.show(new IndexView({
            location: options
        }));
    },
    plati: function (options) {
        var IndexView = require('./views/cereri/plati');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    situatie: function (options) {
        var IndexView = require('./views/cereri/situatie');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    editCerere: function (id) {
        var EditorView = require('./views/cereri/editor');
        var Model = require('./models/cerere');
        var m = new Model({
            id: id
        });
        app.modal.show(new EditorView({
            model: m
        }), {
            preventDestroy: true
        });
    },

    arhivareComanda: function (id) {
        var Coll = require('./collections/vehicule');
        var EditorView = require('./views/reports/arhivare');
        $.get(app.baseUrl + 'vehicule/getvehiculecomanda/' + id, function (data) {
            //var collection = new Coll(data);
            var view = new EditorView({
                data: data,
                controller:'vehicule'
            });
            app.modal.show(view, {
                preventDestroy: true
            });
            //var doc = view.buildDoc();//new jsPDF();
            //doc.output('dataurlnewwindow');
            // var pdfWindow = gui.Window.open('pdfviewer/index.html', {
            //     width: 800,
            //     height: 600,
            //     },function(win){
            //         win.data={file:doc.output('datauristring')};
            //     });
        });
        // var Model = require('./models/cerere');
        // var m = new Model({
        //     id: id
        // });
        // app.modal.show(new EditorView({
        //     model: m
        // }), {
        //     preventDestroy: true
        // });

        // var view = new EditorView(id);
        // var doc = view.buildDoc();//new jsPDF();

        //doc.output('dataurlnewwindow');
    },
    anulareComanda: function (id, callback) {
        w2confirm('Sigur doriti anularea comenzii?').yes(function () {
            $.post(app.baseUrl + 'comenzi/anulare/' + id, function () {
                callback();
            });
        })
    },

    configTiparCIV: function () {
        var EditorView = require('./views/reports/civdesign');
        app.modal.show(new EditorView(), {
            preventDestroy: true
        });
    },

    updateApp: function () {
        var View = require('./views/update');
        app.container.show(new View());
    },
    /**
     * open payment view
     * @param  {[type]} argument id comanda
     * @return {[type]}          [description]
     */
    detaliiPlataCerere: function (argument) {
        // var u = ipc.sendSync('user:request:isinrole', [4]);
        // if (u) {
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/getplatacomanda/?id=' + argument);
        // } else {
        //     var Model = require('./models/plata');
        //     var plata = new Model({
        //         'id_comanda': argument
        //     });
        //     plata.fetch({
        //         data: {
        //             id_comanda: argument
        //         }
        //     }).then(function() {
        //         var PlataLayout = require('./views/cereri/plataLayout');
        //         app.modal.show(new PlataLayout({
        //             model: plata
        //         }));
        //     });
        // }
    },
    listVehicule: function (gridRowid, options) {
        var elem = '#' + gridRowid;
        var IndexView = require('./views/vehicule/vehicule');
        var mainView = new IndexView({
            element: elem,
            parentID: options.pid,
            canadd: options.canadd,
            totalItems: options.totalVehicule
        });
        mainView.render();
    },

    spreadsheetVehicule: function (id) {
        var View = require('./views/vehicule/spreadsheet');
        app.container.show(new View({
            id_comanda: id
        }));
    },

    detaliiVehicul: function (id) {
        var Model = require('./models/vehicul');
        var View = require('./views/vehicule/vehicul');
        var m = new Model({
            id: id
        });
        m.fetch().then(function () {
            $.get(app.baseUrl + 'vehicule/getRelatedVehicles/' + m.get('id_comanda'), null, function (ids) {
                app.container.show(new View({
                    model: m,
                    relatedVehicles: ids
                }));
            });
        });

    },
    addVehicul: function (id_comanda) {
        var Model = require('./models/vehicul');
        var View = require('./views/vehicule/vehicul');
        var m = new Model({
            id_comanda: id_comanda
        });
        app.container.show(new View({
            model: m
        }));
    },
    renderAtributes: function (argument) {
        var AtributeAccordionView = require('./views/vehicule/atribute');
        var atrView = new AtributeAccordionView({
            collection: argument.atributes,
            iswltp : argument.iswltp
        });
        $(argument.element).html(atrView.render().el);
    },
    renderAnvelope: function (argument) {
        AnvelopeAccordionView = require('./views/vehicule/anvelope');
        var anvView = new AnvelopeAccordionView({
            collection: argument.anvelope
        });
        var el = anvView.render().el;
        $(argument.element).html(el);
        app.module('appciv').trigger('anvelopeView:setSelect');
    },
    loadListeAnvelope: function (model, callback) {
        var NAnvelopeCollection = require('./collections/nanvelope');
        var Globals = require('./globals');
        var self = this;
        $.ajax({
            url: self.app.baseUrl + 'vehicule/GetListaAvelope',
            data: {
                id_tvv: model.get('id_tvv'),
                id_extensie: model.get('id_extensie')
            },
            success: function (response) {
                //source = response;
                var n_anv_fata = new NAnvelopeCollection(response.anvelopef),
                    n_anv_spate = new NAnvelopeCollection(response.anvelopes);

                Globals.anvelopefata = n_anv_fata;
                Globals.anvelopespate = n_anv_spate;

                //dezactivam optiunile existente, pentru a nu mai putea fi alese
                // var existingf = _.pluck(model.get('Anvelope').undeleted().toJSON(), 'id_roataf');
                // var availablef = _.pluck(n_anv_fata.toJSON(), 'id');
                // var todisable = _.intersection(existingf, availablef);
                // for (var id in todisable) {
                //     Globals.anvelopefata.get(todisable[id]).set('disabled', true);
                // }
                // var existings = _.pluck(model.get('Anvelope').undeleted().toJSON(), 'id_roatas');
                // var availables = _.pluck(n_anv_spate.toJSON(), 'id');
                // var todisables = _.intersection(existings, availables);
                // for (var x in todisables) {
                //     Globals.anvelopespate.get(todisables[x]).set('disabled', true);
                // }
                if (callback) {
                    callback();
                }
            }
        });
    },
    listVins: function () {
        var IndexView = require('./views/vehicule/sfarsitSerie');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    transmitComanda: function (id, callback) {
        $.ajax({
            type: 'POST',
            url: app.baseUrl + 'comenzi/processcomanda/' + id,
            success: function (response) {
                if (response.stare_comanda === 'Erori la depunere') {
                    w2alert('Eroare la transmitere, va rugam incercati din nou!<br>Daca eroarea persista contactati personalul RAR!')
                }
                callback();
            },
            error: function (response) {
                callback();
            }
        });
    },


    /**
     * CIV INDIVIDUAL
     */

    listCIVIndividual: function () {
        var IndexView = require('./views/individuale/index');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },


    editIndividuale: function (id) {
        var EditorView = require('./views/individuale/editor');
        var Model = require('./models/cerereIndividuale');
        var m = new Model({
            id: id
        });
        app.modal.show(new EditorView({
            model: m
        }), {
            preventDestroy: true
        });
    },

    listVehiculeIndividuale: function (gridRowid, options) {
        var elem = '#' + gridRowid;
        var IndexView = require('./views/individuale/vehicule');
        var mainView = new IndexView({
            element: elem,
            parentID: options.pid,
            canadd: options.canadd,
            totalItems: options.totalVehicule
        });
        mainView.render();
    },
    detaliiVehiculIndividuale: function (id) {
        var Model = require('./models/vehiculIndividuale');
        var View = require('./views/individuale/vehicul1');
        var m = new Model({
            id: id
        });
        m.fetch().then(function () {
            $.get(app.baseUrl + 'individuale/getRelatedVehicles/' + m.get('id_comanda'), null, function (ids) {
                app.container.show(new View({
                    model: m,
                    relatedVehicles: ids
                }));
            });
        });

    },
    addVehiculIndividuale: function (id_comanda) {
        var Model = require('./models/vehiculIndividuale');
        var View = require('./views/individuale/vehicul1');
        var m = new Model({
            id_comanda: id_comanda,
            stare:1
        });
        app.container.show(new View({
            model: m
        }));
    },
    renderFiles: function (options) {
        var FisiereView = require('./views/individuale/fisiere');
        var Fisiere = require('./collections/fisiere');
        var files = new Fisiere();
        $.ajax({
            url: app.baseUrl + 'individuale/getVehiculFiles/' + options.id_vehicul,
            success: function (data) {
                if (data.length > 0) {
                    files.reset(data);
                    if (!files.findWhere({
                            slot: 'placuta'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'placuta'
                    });
                    if (!files.findWhere({
                            slot: 'vin'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'vin'
                    });
                    if (!files.findWhere({
                            slot: 'semiprofil'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'semiprofil'
                    });
                    if (!files.findWhere({
                            slot: 'coc'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'coc'
                    });
                } else {
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'placuta'
                    });
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'vin'
                    });
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'semiprofil'
                    });
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'coc'
                    });
                }
                var atrView = new FisiereView({
                    collection: files,
                    editable:options.editable
                });
                $(options.element).html(atrView.render().el);
            }
        });
    },
    renderMentiuni: function (options) {
        var MentiuniView = require('./views/individuale/mentiuni');
        var atrView = new MentiuniView({
                    collection: options.mentiuni,
                    editable:options.editable,
                    vin:options.vin
                });
        
        $(options.element).html(atrView.render().el);
    },
    transmitIndividuale:function(id,cb){
        $.post(app.baseUrl + 'individuale/postcomanda/' + id,null,cb);
    },
    arhivareComandaIndividuale: function (id) {
        //var Coll = require('./collections/vehicule');
        var EditorView = require('./views/reports/arhivare');
        $.get(app.baseUrl + 'individuale/getvehiculecomanda/' + id, function (data) {
            //var collection = new Coll(data);
            var view = new EditorView({
                data: data,
                controller:'individuale'
            });
            app.modal.show(view, {
                preventDestroy: true
            });
            //var doc = view.buildDoc();//new jsPDF();
            //doc.output('dataurlnewwindow');
            // var pdfWindow = gui.Window.open('pdfviewer/index.html', {
            //     width: 800,
            //     height: 600,
            //     },function(win){
            //         win.data={file:doc.output('datauristring')};
            //     });
        });
        // var Model = require('./models/cerere');
        // var m = new Model({
        //     id: id
        // });
        // app.modal.show(new EditorView({
        //     model: m
        // }), {
        //     preventDestroy: true
        // });

        // var view = new EditorView(id);
        // var doc = view.buildDoc();//new jsPDF();

        //doc.output('dataurlnewwindow');
    },
    arhivareCIVIndividuale: function (id,vin) {
        //var Coll = require('./collections/vehicule');
        var EditorView = require('./views/reports/arhivare');
        $.get(app.baseUrl + 'individuale/getvehiculecomanda/' + id + '?vin=' + vin, function (data) {
            //var collection = new Coll(data);
            var view = new EditorView({
                data: data,
                controller:'individuale'
            });
            app.modal.show(view, {
                preventDestroy: true
            });
            //var doc = view.buildDoc();//new jsPDF();
            //doc.output('dataurlnewwindow');
            // var pdfWindow = gui.Window.open('pdfviewer/index.html', {
            //     width: 800,
            //     height: 600,
            //     },function(win){
            //         win.data={file:doc.output('datauristring')};
            //     });
        });
        // var Model = require('./models/cerere');
        // var m = new Model({
        //     id: id
        // });
        // app.modal.show(new EditorView({
        //     model: m
        // }), {
        //     preventDestroy: true
        // });

        // var view = new EditorView(id);
        // var doc = view.buildDoc();//new jsPDF();

        //doc.output('dataurlnewwindow');
    },
    arhivareCIVNou:function(){
        var EditorView = require('./views/reports/operatiiciv');
        // $.get(app.baseUrl + 'vins/getvehiculedearhivat', function (data) {
        //     //var collection = new Coll(data);
            var view = new EditorView({
                isArhivare:true
            });
            app.container.show(view);
        //});
    },
    anulareCIVNou:function(){
        var EditorView = require('./views/reports/operatiiciv');
        // $.get(app.baseUrl + 'vins/getvehiculedeanulat', function (data) {
        //     //var collection = new Coll(data);
            var view = new EditorView({
                isAnulare:true
            });
            app.container.show(view);
        //});
    },
    situatieCIVIndividual:function(){
        var IndexView = require('./views/individuale/situatie');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    listaOperator:function(){
        var IndexView = require('./views/individuale/operator');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },

    /**
     * *****************CERERI NR. OMOLOGARE
     */
    newCerereOmol:function(){

    },

    listaCereriOmologare:function(){
        var IndexView = require('./views/registru/cereri');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    editCerereOmologare:function(id){
        var IndexView = require('./views/registru/index');
        app.container.show(new IndexView({
            message: 'Hello new module!',
            id:id
        }));
    }
});
module.exports = controller;
},{"./collections/fisiere":13,"./collections/nanvelope":15,"./collections/vehicule":21,"./globals":24,"./models/cerere":27,"./models/cerereIndividuale":28,"./models/vehicul":40,"./models/vehiculIndividuale":41,"./views/cereri/editor":84,"./views/cereri/index":85,"./views/cereri/plati":86,"./views/cereri/situatie":87,"./views/home":88,"./views/individuale/editor":90,"./views/individuale/fisiere":92,"./views/individuale/index":93,"./views/individuale/mentiuni":95,"./views/individuale/operator":96,"./views/individuale/situatie":97,"./views/individuale/vehicul1":98,"./views/individuale/vehicule":99,"./views/registru/cereri":103,"./views/registru/index":107,"./views/reports/arhivare":114,"./views/reports/civdesign":115,"./views/reports/operatiiciv":116,"./views/update":117,"./views/vehicule/anvelope":119,"./views/vehicule/atribute":121,"./views/vehicule/sfarsitSerie":122,"./views/vehicule/spreadsheet":123,"./views/vehicule/vehicul":124,"./views/vehicule/vehicule":125}],24:[function(require,module,exports){
var globals = {
    clipboard:null,
    getClipboard:function(){
        return this.clipboard;
    },
    setClipboard:function(value){
        this.clipboard = value;
    },
    clearClipboard:function(){
        this.clipboard = undefined;
    }
};
module.exports = globals;

},{}],25:[function(require,module,exports){
Globals = require('./../globals');
var AnvelopaModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + 'vehicule/anvelope';
    },
    defaults: {},
    fields: function() {
        var self = this;
        return [{
            el: '#Anvelope_' + self.get('index') + '__id_roataf',
            name: 'id_roataf',
            required: Globals.anvelopefata.models.length > 0,
            type:'int'
        }, {
            el: '#Anvelope_' + self.get('index') + '__id_roatas',
            name: 'id_roatas',
            required: Globals.anvelopespate.models.length > 0,
            type:'int'
        }];
    }
});
module.exports = AnvelopaModel;

},{"./../globals":24}],26:[function(require,module,exports){
var AtributModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + 'vehicule/atribute';
    },
    defaults: {
        //val:''
    },
    fields: function() {
        var self = this;
        var notrequired = [28,290,291,292,293,294,295,296,297,298,299,300,301,141,142,246,247,248];
        return [{
            name: 'val',
            el: '#Atribute_' + self.get('index') + '__val',
            type: 'text',
            required: notrequired.indexOf(Number(self.get('id_nomenclator'))) < 0
        }];
    },
    initialize: function() {}
});
module.exports = AtributModel;

},{}],27:[function(require,module,exports){
var CerereModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + 'comenzi/edit';
    },
    fields: [{
        name: 'id',
        el: '#id',
        type: 'int'
    }, {
        name: 'data_comanda',
        el: '#data_comanda',
        type: 'date'
    }, {
        name: 'data_inreg',
        el: '#data_inreg',
        type: 'date',
        required: true
    }, {
        name: 'id_beneficiar',
        el: '#id_beneficiar',
        type: 'int',
        required: true
    }, {
        name: 'nr_inreg_soc',
        el: '#nr_inreg_soc',
        type: 'text',
        required: true
    }, {
        name: 'societate',
        el: '#societate',
        type: 'text',
        required: true
    }],

    addRelated: function(rel) {
        this.attributes.Vehicule.add(rel);
    },
    removeRelated: function(rel) {
        this.attributes.Vehicule.remove(rel);
    },

    initialize: function() {}
});
module.exports = CerereModel;

},{}],28:[function(require,module,exports){
var CerereModel = window.Backbone.SModel.extend({
    urlRoot: function () {
        return app.baseUrl + 'individuale/edit';
    },
    fields: [{
            name: 'id',
            el: '#id',
            type: 'int'
        }, {
            name: 'data_comanda',
            el: '#data_comanda',
            type: 'date'
        }, {
            name: 'data_inreg',
            el: '#data_inreg',
            type: 'date',
            required: true
        }, {
            name: 'id_beneficiar',
            el: '#id_beneficiar',
            type: 'int',
            required: true
        }, {
            name: 'nr_inreg_soc',
            el: '#nr_inreg_soc',
            type: 'text',
            required: true
        },
        {
            name: 'cod_judet',
            el: '#cod_judet',
            type: 'text',
            required: true
        }, {
            name: 'societate',
            el: '#societate',
            type: 'text',
            required: true
        }
    ],

    addRelated: function (rel) {
        this.attributes.Vehicule.add(rel);
    },
    removeRelated: function (rel) {
        this.attributes.Vehicule.remove(rel);
    },

    initialize: function () {}
});
module.exports = CerereModel;
},{}],29:[function(require,module,exports){
var FisierModel = window.Backbone.Model.extend({
    urlRoot: function() {
        return app.baseUrl + 'individuale/fisier';
    },
    defaults: {
        //val:''
        EntityState:3
    },
    fields: function() {
        var self = this;
    },
    initialize: function() {}
});
module.exports = FisierModel;
},{}],30:[function(require,module,exports){
module.exports = Backbone.SModel.extend({
        defaults:{EntityState:3}
});
},{}],31:[function(require,module,exports){
var N_AnvelopaModel = window.Backbone.SModel.extend({ /*  ***  */ });
module.exports = N_AnvelopaModel;

},{}],32:[function(require,module,exports){
module.exports = Backbone.SModel.extend({
    fields: function() {
        var self = this;
        return [{
            el: '#axa',
            name: 'axa',
            type: 'combo',
            options: {
                items: [{
                    id: 1,
                    text: 'Fata'
                }, {
                    id: 2,
                    text: 'Spate'
                }],
                selected: self.get('axa')
            },
            idField: 'axa',
            txtField: 'axaTxt'
        }, {
            el: '#id_roata',
            name: 'id_roata',
            type: 'combo',
            options: {
                url: app.dotUrl + '/nrom/getAnvelope',
                selected: {
                    id: self.get('id_roata'),
                    text: self.get('valoare')
                },
                renderDrop: function(e) {
                    console.log(e);
                    return '<td>' + e.janta + '</td><td>' + e.text + '</td>';
                },
            },
            change:function(){
                var selected = $('#id_roata').data('selected');
                self.set('janta',selected.janta);
            },
            idField: 'id_roata',
            txtField: 'valoare'
        }];
    }
});

},{}],33:[function(require,module,exports){
module.exports = Backbone.SModel.extend({
    defaults: {
        canBeDirty: true
    },
    fields: function() {
        var self = this;
        var notrequired = [28,286];
        var nedcAtrs = [24, 141, 142, 246, 247, 248];
        var wltpAtrs = [290,291,292,293,294,295,296,297,298,299,300,301];
        var isRequired = notrequired.indexOf(Number(self.get('id_nom'))) < 0;
        if(isRequired){
            if(wltpAtrs.indexOf(Number(self.get('id_nom'))) != -1 && !self.get('iswltp')){
                isRequired = false;
            }
            if(nedcAtrs.indexOf(Number(self.get('id_nom'))) != -1 && self.get('iswltp')){
                isRequired = false;
            }
        }
        var fields = [{
                el: '#DateTehnice_' + this.cid + '__suggested_val',
                name: 'suggested_val'
            }];
        if (this.get('tip') === 'interval') {
            fields.push({
                el: '#DateTehnice_' + this.cid + '__val_max',
                name: 'val_max',
                //required: true
            });
            fields.push({
                el: '#DateTehnice_' + this.cid + '__val_min',
                name: 'val_min',
                required: isRequired
            });
        } else {
            fields.push({
                el: '#DateTehnice_' + this.cid + '__val',
                name: 'val',
                required: isRequired
            });
        }
        return fields;
    }
});

},{}],34:[function(require,module,exports){
module.exports = Backbone.SModel.extend({
    // fields: function() {
    //     var self = this;
    //     return [{
    //         el: '[name="mentiune"]',
    //         name: 'mentiune'
    //     }, {
    //         el: '[name="val_sup"]',
    //         name: 'val_sup'
    //     }];
    // }
});

},{}],35:[function(require,module,exports){
module.exports = Backbone.SModel.extend({});

},{}],36:[function(require,module,exports){
var DateTehnice = require('./../../collections/registru/datetehnice')
var Anvelope = require('./../../collections/registru/anvelope')
var Motoare = require('./../../collections/registru/motoare')
var Sisteme = require('./../../collections/registru/sisteme')
var Mentiuni = require('./../../collections/registru/mentiuni')

var SetDateTehnice = Backbone.SModel.extend({
    fields: [{
        name: 'DateTehnice',
        type: 'collection'
    }]
});

Backbone.associate(SetDateTehnice, {
    DateTehnice: {
        type: DateTehnice
    },
    Anvelope: {
        type: Anvelope
    },
    Motoare: {
        type: Motoare
    },
    Sisteme: {
        type: Sisteme
    },
    Mentiuni: {
        type: Mentiuni
    }
});

module.exports = SetDateTehnice;

},{"./../../collections/registru/anvelope":16,"./../../collections/registru/datetehnice":17,"./../../collections/registru/mentiuni":18,"./../../collections/registru/motoare":19,"./../../collections/registru/sisteme":20}],37:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],38:[function(require,module,exports){
module.exports = Backbone.SModel.extend({
    urlRoot: app.dotUrl + '/nrom/getDateTVV',
    defaults: {
        cod_tip_omologare: 'W',
        tip_omologare: 'INREGISTRARE DE TIP',
        canBeDirty:true,
        isViewInitialized:false
    },
    initialize:function(){
        if(this.get('isViewInitialized')){

        }
        // $('#marca').w2field().reinit();
        //     $('#tip').w2field().reinit();
        //     $('#varianta').w2field().reinit();
        //     $('#versiune').w2field().reinit();
        //     $('#denumire_comerciala').w2field().reinit();
    },
    bindEvents:function(){
        var self = this;
        this.listenTo(this,'change:cod_tip_omologare',function(){
            self.unset('cod_caroserie').unset('caroserie');
            $('#cod_caroserie').w2field().reinit();
        });
        this.listenTo(this,'change:categorie',function(e){
            if(!self.get('nr_registru')){
                self.unset('cod_categorie').unset('categorie_folosinta');
                $('#cod_categorie').w2field().reinit();
            }
        });
        this.listenTo(this,'change:cod_categorie',function(){
            self.unset('cod_caroserie').unset('caroserie');
            $('#cod_caroserie').w2field().reinit();
            $('#id_clasa').w2field().reinit();
        });
        // this.listenTo(this,'change:cod_caroserie',function(){
        //     self.unset('marca').unset('cod_marca');
        //     $('#marca').w2field().reinit();
        // });
        this.listenTo(this,'change:marca',function(){
            self.unset('tip').unset('cod_tip');
            $('#tip').w2field().reinit();
        });
        this.listenTo(this,'change:tip',function(){
            self.unset('varianta').unset('cod_varianta');
            $('#varianta').w2field().reinit();
        });
        this.listenTo(this,'change:varianta',function(){
            self.unset('versiune').unset('cod_versiune');
            $('#versiune').w2field().reinit();
        });
        this.listenTo(this,'change:versiune',function(){
            self.unset('denumire_comerciala');
            $('#denumire_comerciala').w2field().reinit();
        });
    },
    fields: function() {
        var self = this;
        var tipomol = [
            {id:'W',text:'INREGISTRARE DE TIP'},
            {id:'Y',text:'INREGISTRARE DE TIP(TIP NOU)'}
        ];
        var fields = [
            // {
            //     el: '#mod_omologare',
            //     name: 'mod_omologare',
            //     type: 'list',
            //     options: {
            //         items: [{
            //             id: 'Omologare de tip nou',
            //             text: 'Omologare de tip nou'
            //         }, {
            //             id: 'Omologare de tip vechi',
            //             text: 'Omologare de tip vechi'
            //         }],
            //         cascadeTo: ['#tip_omologare']
            //     },
            //     selected: self.get('mod_omologare')
            // },
            /* {
                 el: '#tip_omologare',
                 name: 'tip_omologare',
                 type: 'list',
                 options: {
                     url: function() {
                         return app.dotUrl + '/nrom/gettipomol';
                     },
                     postData: function() {
                         return {
                             mod: 'Omologare de tip nou'
                         };
                     },
                     minLength: 0,
                 },
                 selected: {
                     id: self.get('cod_tip_omologare'),
                     text: self.get('tip_omologare')
                 },
                 change: function() {
                     var selected = $('#tip_omologare').data('selected');
                     self.set('cod_tip_omologare', selected.id);
                 }
             },*/
            {
                name: 'cod_tip_omologare',
                el: '#cod_tip_omologare',
                type: 'list',
                options: {
                    items:tipomol,
                    minLength: 0,
                    onChange: function(e) {
                        var selected = e.item;
                        self.set('cod_tip_omologare', selected.id);
                        self.set('tip_omologare', selected.text);
                    },
                    selected: {
                        id: self.get('cod_tip_omologare'),
                        text: self.get('tip_omologare')
                    }
                }
            },
            {
                name: 'nr_registru',
                el: '#nr_registru',
                type: 'text'
            }, {
                name: 'wvta',
                el: '#wvta',
                type: 'text'
            }, {
                name: 'cnot',
                el: '#cnot',
                type: 'text'
            }, {
                name: 'observatii',
                el: '#observatii',
                type: 'text'
            }, {
                name: 'extensie',
                el: '#extensie',
                type: 'text'
            }, {
                name: 'categorie',
                el: '#categorie',
                type: 'enum',
                required: true,
                options: {
                    url: function() {
                        return app.dotUrl + '/nrom/getcategeu';
                    },
                    minLength: 0,
                    // selected:self.get('categorie'),
                    selected: self.get('categorie')?self.get('categorie').split('|'):'',
                    onChange:function(e){
                        var selected = $(e.target).data('selected');
                        console.log(selected);
                        if(selected.length <= 0 && !self.get('categorie')) return;
                        var val = '';
                        selected.map(function(el){
                            val += '|' + el.text;
                        });
                        self.set('categorie', val.substr(1,val.length));
                    }
                }
            }, {
                name: 'cod_categorie',
                el: '#cod_categorie',
                type: 'list',
                options: {
                    url: app.dotUrl + '/nrom/getcategfol',
                    postData: function() {
                        return {
                            cateu: self.get('categorie').split('|')[0]
                        };
                    },
                    minLength: 0,
                    selected: {
                        id: self.get('cod_categorie'),
                        text: self.get('categorie_folosinta')
                    },
                    onChange:function(e){
                        self.set('cod_categorie',e.item.id).set('categorie_folosinta', e.item.text);
                    }
                },
                required: true
            }, {
                name: 'id_clasa',
                el: '#id_clasa',
                type: 'list',
                options: {
                    url: app.dotUrl + '/nrom/getclase',
                    minLength: 0,
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie')
                        };
                    },
                    selected: {
                        id: self.get('id_clasa'),
                        text: self.get('clasa')
                    },
                    onChange:function(e){
                        self.set('id_clasa',e.item.id).set('clasa', e.item.text);
                    }
                }
            }, {
                name: 'cod_caroserie',
                el: '#cod_caroserie',
                type: 'list',
                options: {
                    url: app.dotUrl + '/nrom/getcaroserii',
                    postData: function() {
                        return {
                            tip_omol:self.get('cod_tip_omologare'),
                            cat_fol: self.get('cod_categorie')
                        };
                    },
                    minLength: 0,
                    //cascadeTo: ['#marca' /*, '#tip', '#varianta', '#versiune'*/ ]
                    selected: {
                        id: self.get('cod_caroserie'),
                        text: self.get('caroserie')
                    },
                    onChange:function(e){
                        self.set('cod_caroserie',e.item.id).set('caroserie', e.item.text);
                    }
                },
                required: true
            }, {
                name: 'marca',
                el: '#marca',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/getmarci',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie')
                        };
                    },
                    minLength: 0,
                    selected: {
                        id: self.get('cod_marca'),
                        text: self.get('marca')
                    }
                },
                // change:function(e){
                //         var selected = $(e.currentTarget).data('selected');
                //         self.set('cod_marca',selected.id).set('marca', selected.text);
                // },
                required: true,
                idField:'cod_marca',
                txtField:'marca'
            }, {
                name: 'tip',
                el: '#tip',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/gettipuri',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca')
                        };
                    },
                    renderDrop: function(e) {
                        return '<td>' + e.id + '</td><td>' + e.text + '</td>';
                    },
                    minLength: 0,
                    // cascadeTo: ['#varianta' /*, '#versiune'*/ ]
                    selected: {
                        id: self.get('cod_tip'),
                        text: self.get('tip')
                    }
                },
                // change:function(e){
                //     var selected = $(e.currentTarget).data('selected');
                //     self.set('cod_tip',selected.id).set('tip', selected.text);
                // },
                required: true,
                idField:'cod_tip',
                txtField:'tip'
            }, {
                name: 'varianta',
                el: '#varianta',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/getvariante',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca'),
                            cod_tip: self.get('cod_tip')
                        };
                    },
                    renderDrop: function(e) {
                        return '<td>' + e.id + '</td><td>' + e.text + '</td>';
                    },
                    minLength: 0,
                    // cascadeTo: ['#versiune']
                    selected: {
                        id: self.get('cod_varianta'),
                        text: self.get('varianta')
                    }
                },
                // change:function(e){
                //     var selected = $(e.currentTarget).data('selected');
                //     self.set('cod_varianta',selected.id).set('varianta', selected.text);
                // },
                required: true,
                idField:'cod_varianta',
                txtField:'varianta'
            }, {
                name: 'versiune',
                el: '#versiune',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/getversiuni',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca'),
                            cod_tip: self.get('cod_tip'),
                            cod_varianta: self.get('cod_varianta')
                        };
                    },
                    renderDrop: function(e) {
                        return '<td>' + e.id + '</td><td>' + e.text + '</td>';
                    },
                    minLength: 1,
                    // cascadeTo: ['#denumire']
                    selected: {
                        id: self.get('cod_versiune'),
                        text: self.get('versiune')
                    }
                },
                change:function(e){
                    var selected = $(e.currentTarget).data('selected');
                    // self.set('cod_versiune', selected.id).set('versiune',selected.text);
                    $.post(app.dotUrl + '/nrom/checktvv', {
                        tip: self.get('tip'),
                        varianta: self.get('varianta'),
                        versiune: self.get('versiune'),
                        wvta: self.get('wvta')
                    }, function(response) {
                        if (response !== 0) {
                            w2confirm('Acest TVV exista in baza de date la acest WVTA!<br>Doriti sa continuati cu datele introduse?')
                                .yes(function() {
                                    $.get(app.dotUrl + '/nrom/getTvvExistent/' + response, null, function(tvv) {
                                        if(tvv.nr_registru){
                                            app.trigger('dosare:reloadTVV',tvv);
                                        }else{
                                            app.trigger('dosare:reloadTVV',tvv);
                                            //  self.set('id',tvv.id)
                                            //         .set('denumire_comerciala',tvv.denumire_comerciala)
                                            //         .set('nr_axe',tvv.nr_axe)
                                            //         .set('producator',tvv.producator);
                                        }
                                    });
                                })
                                .no(function() {
                                    self.unset('varianta').unset('cod_varianta').unset('versiune').unset('cod_versiune');
                                    $('#varianta').w2field().reinit();
                                    $('#varianta').w2field().reinit();
                                });
                        }
                    });
                },
                idField:'cod_versiune',
                txtField:'versiune',
                required: true
            }, {
                name: 'denumire_comerciala',
                el: '#denumire_comerciala',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/gettipcom',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca'),
                            cod_tip: self.get('cod_tip'),
                            cod_varianta: self.get('varianta'),
                            cod_versiune: self.get('versiune')
                        };
                    },
                    minLength: 1,
                    selected: {
                        id: self.get('denumire_comerciala'),
                        text: self.get('denumire_comerciala')
                    },
                    onChange:function(){
                        self.set('denumire_comerciala', e.item.id).set('denumire_comerciala',e.item.text);
                    }
                },
                required: true
            }, {
                name: 'nr_axe',
                el: '#nr_axe',
                type: 'int',
                options: {
                    min: 1,
                    max: 10
                }
            },
            /* {
                            name: 'antipoluare',
                            el: '#antipoluare',
                            type: 'list',
                            options: {
                                url: app.dotUrl + '/nrom/getPoluare',
                                minLength: 0
                            },
                            required: true,
                            selected: {
                                id: self.get('antipoluare'),
                                text: self.get('antipoluare')
                            }
                        }, */
           // {
           //     name: 'producator',
           //     el: '#producator',
           //     type: 'text',
                // options: {
                //     url: app.dotUrl + '/nrom/getProducatori',
                //     postData: function() {
                //         return {
                //             categorie: self.get('categorie')
                //         };
                //     },
                //     minLength: 1,
                //     selected: {
                //         id: self.get('producator'),
                //         text: self.get('producator')
                //     }
                // },
            //    required: true
           // }
            /* {
                            el: '#abs',
                            name: 'abs',
                            type: 'list',
                            options: {
                                items: [{
                                    id: 'DA',
                                    text: 'DA'
                                }, {
                                    id: 'NU',
                                    text: 'NU'
                                }]
                            },
                            selected: self.get('abs')
                        }, {
                            el: '#obd',
                            name: 'obd',
                            type: 'list',
                            options: {
                                items: [{
                                    id: 'DA',
                                    text: 'DA'
                                }, {
                                    id: 'NU',
                                    text: 'NU'
                                }]
                            },
                            selected: self.get('obd')
                        }*/
        ];
        self.bindEvents();
        return fields;

    }
});

},{}],39:[function(require,module,exports){
var TVVModel = require('./tvv')
var SetDateTVVModel = require('./setdatetehnice')

var TVVExtensieCerere =  Backbone.SModel.extend({
    urlRoot: app.baseUrl + '/doiit/GetTVVExtensieCerere',
    fields: function() {
        return [{
            name: 'SetDateTVV',
            type: 'model'
        }, {
            name: 'TVV',
            type: 'model'
        }];
    }
});

Backbone.associate(TVVExtensieCerere, {
    TVV: {
        type: TVVModel
    },
    SetDateTVV: {
        type: SetDateTVVModel
    }
});

module.exports = TVVExtensieCerere;

},{"./setdatetehnice":36,"./tvv":38}],40:[function(require,module,exports){
var VehiculModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + 'vehicule/edit';
    },
    defaults: {
        canBeDirty:true,
        categ_euro:''
    },
    fields: function() {
        var self = this;
        var data = [];
        if (self.get('culoare')) {
            $(self.get('culoare').split('-')).each(function() {
                data.push({
                    id: this,
                    text: this
                });
            });
        }
        return [{
            name: 'Atribute',
            type: 'collection'
        }, {
            name: 'Anvelope',
            type: 'collection'
        }, {
            el: '#vin',
            name: 'vin',
            type: 'text',
            required: true

        }, {
            el: '#cnot',
            name: 'cnot',
            type: 'text'
        }, {
            el: '#nr_registru',
            name: 'nr_registru',
            type: 'text'
            // required: true,
            // options: {
            //     minLength: 0,
            //     url: function() {
            //         return app.baseUrl + '/vehicule/getNrOmologare';
            //     },
            //     cascadeTo: ['#id_extensie', '#culoare']
            // },
            // selected: {
            //     id: self.get('id_tvv'),
            //     text: self.get('nr_registru')
            // },
            // idField:'id_tvv',
            // txtField:'nr_registru',
            // change: function() {
            //     var selected = $('#id_tvv').data('selected');
            //      self.set('nr_registru',selected.text);
            //      self.set('id_tvv',selected.id);
            //    $().w2tag();
            // }
        }, {
            el: '#wvta',
            name: 'wvta',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getWVTA';
                },
                postData:{
                    idcom:self.get('id_comanda')
                },
                cascadeTo: ['#id_extensie','#tip','#varianta','#versiune']
            },
            selected: {
                id: self.get('id_wvta'),
                text: self.get('wvta')
            },
            idField:'id_wvta',
            txtField:'wvta',
            change: function() {
                var selected = $('#wvta').data('selected');
                 self.set('wvta',selected.text);
                 self.set('id_wvta',selected.id);
               $().w2tag();
            }

        }, {
            el: '#id_extensie',
            name: 'id_extensie',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getExtensiiWVTA';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#tip','#varianta','#versiune']
            },
            selected: {
                id: self.get('id_extensie'),
                text: self.get('extensie')
            },
            change: function() {
                var selected = $('#id_extensie').data('selected');
                self.set('extensie',selected.text);
                self.set('id_extensie',selected.id);
            },
            idField:'id_extensie',
            txtField:'extensie'
        },  {
            el: '#tip',
            name: 'tip',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getTipuri';
                },
                postData: function() {
                    return {
                        id_extensie: self.get('id_extensie') || '0',
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#varianta','#versiune']
            },
            selected: {
                id: self.get('tip'),
                text: self.get('tip')
            }
        }, {
            el: '#varianta',
            name: 'varianta',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getVariante';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        tip:self.get('tip'),
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#versiune']
            },
            selected: {
                id: self.get('varianta'),
                text: self.get('varianta')
            }
        }, {
            el: '#versiune',
            name: 'versiune',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getVersiuni';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        tip:self.get('tip'),
                        varianta:self.get('varianta'),
                        idcom:self.get('id_comanda')
                    };
                }
            },
            selected: {
                id: self.get('id_tvv'),
                text: self.get('versiune')
            },
            change: function() {
                var selected = $('#versiune').data('selected');
                self.set('versiune',selected.text);
                self.set('id_tvv',selected.id);
            },
            idField:'id_tvv',
            txtField:'versiune'
        },{
            el: '#an_fabr',
            name: 'an_fabr',
            type: 'int',
            required: true,
            options: {
                min: 1960,
                max: Number(new Date().getFullYear()) + 1
            }
        }, {
            el: '#motor',
            name: 'motor',
            type: 'list',
            required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R',
            options: {
                url: function() {
                    return app.baseUrl + '/vehicule/getMotoare';
                },
                postData: function() {
                    return {
                        id_tvv: self.get('id_tvv'),
                        id_extensie: self.get('id_extensie')
                    };
                },
                minLength: 0
            },
            selected: {
                id: self.get('motor'),
                text: self.get('cod_motor')
            },
            idField: 'motor',
            txtField: 'cod_motor',
            change: function(event) {
                var selected = $(event.data.field.el).data('selected');
                self.set('motor', selected.id);
                self.set('cod_motor', selected.text);
            }
        }, /*{
            el: '#serie_motor',
            name: 'serie_motor',
            type: 'text',
            required: true

        },*/ {
            el: '#culoare',
            name: 'culoare',
            type: 'enum',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/vehicule/getcolors';
                },
                postData: function() {
                    return {
                        nr_registru: self.get('nr_registru'),
                        ext: self.get('extensie')
                    };
                },
                openOnFocus: true,
                max: 3
            },
            selected: data,
            change: function(event) {
                var color = [];
                var els = $(event.target).data('selected');
                for (var index in els) {
                    var el = els[index];
                    color.push(el.id);
                }
                self.set('culoare', color.join('-'));
            }
        }, {
            el: '#serie_motor',
            name: 'serie_motor',
            type: 'text',
            required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R'
        }];
    }
});
var Anvelope = require('./../collections/anvelope');
var Atribute = require('./../collections/atribute');
window.Backbone.associate(VehiculModel, {
    Atribute: {
        type: Atribute
    },
    Anvelope: {
        type: Anvelope
    }
});
module.exports = VehiculModel;

},{"./../collections/anvelope":11,"./../collections/atribute":12}],41:[function(require,module,exports){
var VehiculModel = window.Backbone.SModel.extend({
    urlRoot: function () {
        return app.baseUrl + 'individuale/editvehicul';
    },
    defaults: {
        canBeDirty: true
    },
    fields: function () {
        var self = this;
        var data = [];
        if (self.get('culoare')) {
            $(self.get('culoare').split('-')).each(function () {
                data.push({
                    id: this,
                    text: this
                });
            });
        }
        return [{
            el: '#vin',
            name: 'vin',
            type: 'text',
            required: true

        }, {
            el: '#nr_registru',
            name: 'nr_registru',
            type: 'text'
        }, {
            el: '#wvta',
            name: 'wvta',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function () {
                    return app.baseUrl + '/doiit/getWVTA';
                },
                postData: {
                    idcom: self.get('id_comanda')
                },
                cascadeTo: ['#extensie', '#tip', '#varianta', '#versiune']
            },
            selected: {
                id: self.get('id_wvta'),
                text: self.get('wvta')
            },
            // idField: 'id_wvta',
            // txtField: 'wvta',
            // change: function () {
            //     var selected = $('#wvta').data('selected');
            //     self.set('wvta', selected.text);
            //     self.set('id_wvta', selected.id);
            //     $().w2tag();
            // }

        }, {
            el: '#extensie',
            name: 'extensie',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getExtensiiWVTA';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#tip','#varianta','#versiune']
            },
            selected: {
                id: self.get('extensie'),
                text: self.get('extensie')
            },
            // change: function() {
            //     var selected = $('#extensie').data('selected');
            //     self.set('extensie',selected.text);
            //     if(selected.id)
            //         self.set('id_extensie',selected.id);
            // },
            // idField:'id_extensie',
            // txtField:'extensie'
        },  {
            el: '#tip',
            name: 'tip',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getTipuri';
                },
                postData: function() {
                    return {
                        id_extensie: self.get('id_extensie') || '0',
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#varianta','#versiune']
            },
            selected: {
                id: self.get('tip'),
                text: self.get('tip')
            }
        }, {
            el: '#varianta',
            name: 'varianta',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getVariante';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        tip:self.get('tip'),
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#versiune']
            },
            selected: {
                id: self.get('varianta'),
                text: self.get('varianta')
            }
        }, {
            el: '#versiune',
            name: 'versiune',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getVersiuni';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        tip:self.get('tip'),
                        varianta:self.get('varianta'),
                        idcom:self.get('id_comanda')
                    };
                }
            },
            selected: {
                id: self.get('id_tvv'),
                text: self.get('versiune')
            },
            // change: function() {
            //     var selected = $('#versiune').data('selected');
            //     self.set('versiune',selected.text);
            //     if(selected.id)
            //         self.set('id_tvv',selected.id);
            //     else
            //         self.set('id_tvv',0);

            // },
            // idField:'id_tvv',
            // txtField:'versiune'
        }, {
            el: '#an_fabr',
            name: 'an_fabr',
            type: 'int',
            required: true,
            options: {
                min: 1960,
                max: Number(new Date().getFullYear()) + 1
            }
        }, {
            el: '#observatii',
            name: 'observatii',
            type: 'memo'
        }, {
            el: '#motiv_respingere',
            name: 'motiv_respingere',
            type: 'memo'
        }, {
            el: '#cod_motor',
            name: 'cod_motor',
            type: 'combo',
            required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R',
            options: {
                url: function() {
                    return app.baseUrl + '/doiit/getMotoare';
                },
                postData: function() {
                    return {
                        id_tvv: self.get('id_tvv'),
                        id_extensie: self.get('id_extensie')
                    };
                },
                minLength: 0
            },
            selected: {
                id: self.get('motor'),
                text: self.get('cod_motor')
            },
            // idField: 'motor',
            // txtField: 'cod_motor',
            // change: function(event) {
            //     var selected = $(event.data.field.el).data('selected');
            //     self.set('motor', selected.id);
            //     self.set('cod_motor', selected.text);
            // }
        },
        // {
        //     el: '#cod_motor',
        //     name: 'cod_motor',
        //     type: 'text'
        // }, 
        {
            el: '#co2_wltp',
            name: 'co2_wltp',
            type: 'text'
        },
        {
            el: '#co2_wltp_alt',
            name: 'co2_wltp_alt',
            type: 'text'
        },
        {
            el: '#masa_reala',
            name: 'masa_reala',
            type: 'text'
        }, {
            el: '#putere_kw',
            name: 'putere_kw',
            type: 'text'
        }, {
            el: '#cilindree',
            name: 'cilindree',
            type: 'text'
        }, {
            el: '#culoare',
            name: 'culoare',
            type: 'enum',
            required: true,
            options: {
                minLength: 0,
                url: function () {
                    return app.baseUrl + '/vehicule/getcolors';
                },
                postData: function () {
                    return {
                        nr_registru: self.get('nr_registru'),
                        ext: self.get('extensie')
                    };
                },
                openOnFocus: true,
                max: 3
            },
            selected: data,
            change: function (event) {
                var color = [];
                var els = $(event.target).data('selected');
                for (var index in els) {
                    var el = els[index];
                    color.push(el.id);
                }
                self.set('culoare', color.join('-'));
            }
        }, {
            el: '#serie_motor',
            name: 'serie_motor',
            type: 'text'
        }];
    }
});
var Mentiuni = require('./../collections/mentiuni');
var Atribute = require('./../collections/atribute');
var Anvelope = require('./../collections/anvelope');
window.Backbone.associate(VehiculModel, {
    Mentiuni: {
        type: Mentiuni
    },
    Atribute: {
        type: Atribute
    },
    Anvelope: {
        type: Anvelope
    }
});
module.exports = VehiculModel;

},{"./../collections/anvelope":11,"./../collections/atribute":12,"./../collections/mentiuni":14}],42:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	idAttribute:'nr_identif'
});
},{}],43:[function(require,module,exports){
/**
 * @author cristian_mar
 */

var Router = window.Marionette.SubAppRouter.extend({
    appRoutes: {
        '*action': 'request'
    }
});
module.exports = Router;

},{}],44:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"w2ui-page page-0 modalContent big-form\" style=\"min-width: 1000px;\">\r\n    <fieldset class=\"date-civ\">\r\n        <legend>Date vehicul</legend>\r\n    	<div class=\"w2ui-field\" style=\"float:left\">\r\n            <label>Categorie:</label>\r\n            <div><input type=\"text\"  id=\"cat\" readonly/></div>\r\n        </div>\r\n        <div class=\"w2ui-field\" >\r\n            <label>Caroserie:</label>\r\n            <div><input type=\"text\"  id=\"tip_caros\" readonly/></div>\r\n        </div>\r\n        <div class=\"w2ui-field\" style=\"float:left\">\r\n            <label>Marca:</label>\r\n            <div><input type=\"text\"  id=\"marca\" readonly/></div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Tip/Varianta/Versiune:</label>\r\n            <div><input type=\"text\"  id=\"tip_compus\" readonly/></div>\r\n        </div>\r\n         <div class=\"w2ui-field\" style=\"float:left\">\r\n            <label>Nr. Registru:</label>\r\n            <div><input type=\"text\"  id=\"nr_registr\" readonly/></div>\r\n        </div>\r\n         <div class=\"w2ui-field\">\r\n            <label>WVTA:</label>\r\n            <div><input type=\"text\"  id=\"wvta\" readonly/></div>\r\n        </div>\r\n        <fieldset class=\"tehnic-civ\">\r\n        	<legend>Mase</legend>\r\n        	<table>\r\n        		<tr>\r\n        			<td>Proprie:</td><td><input readonly type=\"text\" id=\"masa\"></td>\r\n        			<td>Utila:</td><td><input readonly type=\"text\" id=\"masutil\"></td>\r\n        			<td>Carlig:</td><td><input readonly type=\"text\" id=\"mascr\"></td>\r\n        			<td>Totala:</td><td><input readonly type=\"text\" id=\"masa_total\"></td>\r\n        			<td>Axa fata:</td><td><input readonly type=\"text\" id=\"masf\"></td>\r\n        			<td>Axa spate:</td><td><input readonly type=\"text\" id=\"mass\"></td>\r\n        		</tr>\r\n        		<tr>\r\n        			<td colspan=\"3\">Remorcabila cu franare:</td><td colspan=\"3\"><input readonly type=\"text\" id=\"masrecf\"></td>\r\n        			<td colspan=\"3\">Remorcabila fara franare:</td><td colspan=\"3\"><input readonly type=\"text\" id=\"masrec\"></td>\r\n        		</tr>\r\n        	</table>\r\n        </fieldset>\r\n        <fieldset class=\"tehnic-civ\">\r\n        	<legend>Locuri</legend>\r\n        	<table>\r\n        		<tr>\r\n        			<td>Total:</td><td><input readonly type=\"text\" id=\"locuri\"></td>\r\n        			<td>Fata:</td><td><input readonly type=\"text\" id=\"focurif\"></td>\r\n        			<td>Scaune:</td><td><input readonly type=\"text\" id=\"locurisc\"></td>\r\n        			<td>Picioare:</td><td><input readonly type=\"text\" id=\"locuripi\"></td>\r\n        		</tr>\r\n        	</table>\r\n        </fieldset>\r\n         <fieldset class=\"tehnic-civ\">\r\n        	<legend>Dimensiuni</legend>\r\n        	<table>\r\n        		<tr>\r\n        			<td>Lungime:</td><td><input readonly type=\"text\" id=\"lungmax\"></td>\r\n        			<td>Latime:</td><td><input readonly type=\"text\" id=\"latmax\"></td>\r\n        			<td>Inaltime:</td><td><input readonly type=\"text\" id=\"hmax\"></td>\r\n        		</tr>\r\n        	</table>\r\n        </fieldset>\r\n        <fieldset class=\"tehnic-civ\">\r\n        	<legend>Motor</legend>\r\n        	<table>\r\n        		<tr>\r\n        			<td>Cod:</td><td><input readonly type=\"text\" id=\"cod\" class=\"large\"></td>\r\n        			<td>Cilindree:</td><td><input readonly type=\"text\" id=\"cilindree\"></td>\r\n        			<td>Putere(kW):</td><td><input readonly type=\"text\" id=\"p_max_kw\"></td>\r\n        			<td>Turatie:</td><td><input readonly type=\"text\" id=\"rot_p_max\"></td>\r\n        		</tr>\r\n        		<tr>\r\n        			<td>Combustibil:</td><td><input readonly type=\"text\" id=\"combustib\" class=\"large\"></td>\r\n        			<td>Vit. max:</td><td><input readonly type=\"text\" id=\"vitezamax\"></td>\r\n        			<td>Zgomot mers:</td><td><input readonly type=\"text\" id=\"sonext\"></td>\r\n        			<td>Zgomot stat.:</td><td><input readonly type=\"text\" id=\"sonexts\"></td>\r\n        		</tr>\r\n        	</table>\r\n        </fieldset>\r\n        <fieldset class=\"tehnic-civ\">\r\n        	<legend>Alte date</legend>\r\n        	<table>\r\n        		<tr>\r\n        			<td>Rezervor:</td><td><input readonly type=\"text\" id=\"rezervor\"></td>\r\n        			<td>Tractiune:</td><td><input readonly type=\"text\" id=\"tractiune\" class=\"large\"</td>\r\n        		</tr>\r\n        	</table>\r\n        </fieldset>\r\n        <fieldset class=\"tehnic-civ\">\r\n        	<legend>Anvelope</legend>\r\n        	<table>\r\n        		<tr>\r\n        			<td>Axa fata:</td><td><input readonly type=\"text\" id=\"anvelopa\" class=\"large\"></td>\r\n        			<td>Axa spate:</td><td><input readonly type=\"text\" id=\"roatas\" class=\"large\"></td>\r\n        		</tr>\r\n        		<tr>\r\n        			<td>Tolerate fata:</td><td><input readonly type=\"text\" id=\"anvel_toler_fata\" class=\"large\"></td>\r\n        			<td>Tolerate spate:</td><td><input readonly type=\"text\" id=\"anvel_toler_spate\" class=\"large\"></td>\r\n        		</tr>\r\n        	</table>\r\n        </fieldset>\r\n    </fieldset>\r\n    <fieldset class=\"date-civ\">\r\n    	<legend>Date identificare</legend>\r\n    	<table>\r\n    		<tr>\r\n    			<td>\r\n	    			<div class=\"w2ui-field\">\r\n			            <label>Nr. Identificare:</label>\r\n			            <div><input type=\"text\"  id=\"vin1\"/><input type=\"text\"  id=\"nr_identif\" style=\"display:none\"/></div>\r\n	         		</div>\r\n         		</td>\r\n         		<td rowspan=\"3\">\r\n    				<div class=\"w2ui-field\">\r\n			            <label>Mentiuni:</label>\r\n			            <div><textarea readonly id=\"mentiuni\"></textarea></div>\r\n			        </div>\r\n    			</td>\r\n         	</tr>\r\n         	<tr>\r\n    			<td>\r\n			         <div class=\"w2ui-field\">\r\n			            <label>Serie motor:</label>\r\n			            <div><input readonly type=\"text\"  id=\"serie_mot\" style=\"width:150px\"/></div>\r\n			        </div>    				\r\n    			</td>\r\n    		</tr>\r\n    		<tr>\r\n    			<td>\r\n			        <div class=\"w2ui-field\">\r\n			            <label>Culoare:</label>\r\n			            <div><input readonly type=\"text\"  id=\"cul\"/></div>\r\n			        </div>\r\n    			</td>\r\n    		</tr>\r\n    	</table>  \r\n    </fieldset>\r\n    <fieldset class=\"date-civ\">\r\n    	<legend>Arhivare CIV si Folie</legend>\r\n    	<div class=\"w2ui-field\">\r\n            <label>Serie CIV:</label>\r\n            <div><input type=\"text\"  id=\"serieciv\" tabindex=\"1\" autofocus /><input type=\"text\"  id=\"serie_civ\" style=\"display:none\"/></div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Serie Folie:</label>\r\n            <div><input type=\"text\"  id=\"folie_civ\" tabindex=\"2\" /></div>\r\n        </div>\r\n    </fieldset>\r\n</div>\r\n<div class=\"w2ui-buttons\" id=\"buttons_container\">\r\n    <div  id=\"operation_container\">\r\n        <button title=\"Salvare\" class=\"btn btn-green\" id=\"btnSave\"><i class=\"w2ui-icon-save\" tabindex=\"3\"></i> Salveaza\r\n        </button>\r\n        <button title=\"Inchide\" class=\"btn btn-default\" id=\"btnClose\"><i class=\"w2ui-icon-cross\"></i> Inchide\r\n        </button>\r\n    </div>\r\n    <div  id=\"supervize_container\" style=\"margin-top:5px;\">\r\n        <button id=\"btnFirst\">|<</button>\r\n        <button id=\"btnPrev\"><</button>\r\n        <label id=\"currentIndex\" style=\"width:50px\"></label> din <label id=\"totalciv\" style=\"width:50px\"></label>\r\n        <button id=\"btnNext\">></button>\r\n        <button id=\"btnLast\">>|</button>\r\n    </div>\r\n</div>";
  });

},{"hbsfy/runtime":153}],45:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "    <div class=\"w2ui-page page-0 modalContent\" >\r\n    <div id=\"daterar_container\">\r\n        <div class=\"w2ui-field\">\r\n            <label>Nr. inregistrare RAR</label>\r\n            <div>\r\n                <input type=\"text\" id=\"id\" name=\"id\" readonly size=\"30\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Data Inregistrare</label>\r\n            <div>\r\n                <input type=\"text\" id=\"data_comanda\" name=\"data_comanda\" class=\"datepicker\" readonly size=\"30\"/>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div id=\"date_beneficiar_container\">\r\n        <div class=\"w2ui-field\">\r\n            <label>Beneficiar</label>\r\n            <div>\r\n                <input type=\"text\" id=\"societate\" name=\"societate\" size=\"30\" readonly/>\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field form-group form-select3\" id=\"addBeneficiar\" style=\"display: none\">\r\n            <label>Beneficiar</label>\r\n            <div>\r\n                <input type=\"text\" id=\"id_beneficiar\" name=\"id_beneficiar\" size=\"30\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Nr. registru client</label>\r\n            <div>\r\n                <input type=\"text\" id=\"nr_inreg_soc\" name=\"nr_inreg_soc\" size=\"30\" placeholder=\"Cerere client...\" required />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Data registru client</label>\r\n            <div>\r\n                <input type=\"text\" id=\"data_inreg\" name=\"data_inreg\" size=\"30\" class=\"datepicker\" placeholder=\"Data Cerere client...\" />\r\n            </div>\r\n        </div>\r\n\r\n\r\n    </div>\r\n    <div class=\"w2ui-buttons button-translate\">\r\n        <button title=\"Renunta\"  name=\"cancel\" id=\"btnCancelEdit\" class=\"btn btn-red\" >Inchide</button>\r\n        <button title=\"Salvare\" id=\"btnSaveComanda\" class=\"btn btn-blue\" name=\"save\">Salveaza</button>\r\n    </div>";
  });

},{"hbsfy/runtime":153}],46:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div style=\"display:none\">\r\n	<input id=\"fileupload\" type=\"file\" class=\"file\" name=\"files[]\" multiple  accept=\".xml\">\r\n</div>\r\n<div id=\"grid\" class=\"page\"></div>";
  });

},{"hbsfy/runtime":153}],47:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"grid\" class=\"page\"></div>\r\n<input style=\"display:none;\" id=\"dialog\" type=\"file\" nwsaveas=\"plati.xls\" />";
  });

},{"hbsfy/runtime":153}],48:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"grid\" class=\"page\"></div>\r\n<input style=\"display:none;\" id=\"dialog\" type=\"file\" nwsaveas=\"situatie.xls\" />\r\n";
  });

},{"hbsfy/runtime":153}],49:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div style=\"text-align:center\">\r\n<img src=\"";
  if (helper = helpers.img) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.img); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" style=\"width:1000px\" />\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],50:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"w2ui-page page-0  modalContent\">\r\n    <div class=\"w2ui-field\" >\r\n        <label>Axa fata:</label>\r\n        <div><input type=\"text\" id=\"id_roataf\"></div>\r\n    </div>\r\n    <div class=\"w2ui-field\" >\r\n         <label>Idem spate:</label>\r\n        <div><input type=\"checkbox\"   id=\"idemspate\"></div>\r\n    </div>\r\n\r\n    <div class=\"w2ui-field\" >\r\n        <label>Axa spate:</label>\r\n        <div><input type=\"text\" id=\"id_roatas\"></div>\r\n    </div>\r\n</div>\r\n <hr>\r\n    <div class=\"w2ui-buttons button-translate\">\r\n        <button class=\"btn btn-blue save-anvelopa\"><i class=\"fa fa-save\"></i> Salveaza</button>\r\n        <button class=\"btn btn-red cancel-anvelopa\"><i class=\"fa fa-times\"></i> Renunta</button>\r\n    </div>";
  });

},{"hbsfy/runtime":153}],51:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "    <div class=\"w2ui-page page-0 modalContent\" >\r\n    <div id=\"daterar_container\">\r\n        <div class=\"w2ui-field\">\r\n            <label>Nr. inregistrare RAR</label>\r\n            <div>\r\n                <input type=\"text\" id=\"id\" name=\"id\" readonly size=\"30\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Data Inregistrare</label>\r\n            <div>\r\n                <input type=\"text\" id=\"data_comanda\" name=\"data_comanda\" class=\"datepicker\" readonly size=\"30\"/>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div id=\"date_beneficiar_container\">\r\n        <div class=\"w2ui-field\">\r\n            <label>Beneficiar</label>\r\n            <div>\r\n                <input type=\"text\" id=\"societate\" name=\"societate\" size=\"30\" readonly/>\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field form-group form-select3\" id=\"addBeneficiar\" style=\"display: none\">\r\n            <label>Beneficiar</label>\r\n            <div>\r\n                <input type=\"text\" id=\"id_beneficiar\" name=\"id_beneficiar\" size=\"30\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Reprezentanta judet:</label>\r\n            <div>\r\n                <input type=\"text\" id=\"cod_judet\" name=\"cod_judet\" size=\"30\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Nr. registru client</label>\r\n            <div>\r\n                <input type=\"text\" id=\"nr_inreg_soc\" name=\"nr_inreg_soc\" size=\"30\" placeholder=\"Cerere client...\" required />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Data registru client</label>\r\n            <div>\r\n                <input type=\"text\" id=\"data_inreg\" name=\"data_inreg\" size=\"30\" class=\"datepicker\" placeholder=\"Data Cerere client...\" />\r\n            </div>\r\n        </div>\r\n\r\n\r\n    </div>\r\n    <div class=\"w2ui-buttons button-translate\">\r\n        <button title=\"Renunta\"  name=\"cancel\" id=\"btnCancelEdit\" class=\"btn btn-red\" >Inchide</button>\r\n        <button title=\"Salvare\" id=\"btnSaveComanda\" class=\"btn btn-blue\" name=\"save\">Salveaza</button>\r\n    </div>";
  });

},{"hbsfy/runtime":153}],52:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div style=\"text-align: center; width:125px;float:left;cursor:pointer\">\r\n    <label>";
  if (helper = helpers.slotName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.slotName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n    <img name=\"slot\" width=\"100px\" height=\"100px\" style=\"border:thin solid #ccc\" src=\"";
  if (helper = helpers.preview) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.preview); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"Click pentru a incarca un fisier in acest slot\" />\r\n    <button style=\"display:none\" class=\"btn btn-red\" name=\"delBtn\"><i class=\"w2ui-icon-cross\"></i></button>\r\n</div>\r\n<input style=\"display:none;\" name=\"fileDialog\" accept=\".jpg,.png,.pdf\" type=\"file\" />";
  return buffer;
  });

},{"hbsfy/runtime":153}],53:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"grid\" class=\"page\"></div>";
  });

},{"hbsfy/runtime":153}],54:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div style=\"display:flex\">\r\n    <input  type=\"text\" name=\"text\" maxlength=\"50\"  />\r\n    <button name=\"delMentiune\" class=\"btn btn-red\"><i class=\"w2ui-icon-cross\"></i></button>\r\n    <button name=\"anvMentiune\" class=\"btn btn-green\"><i class=\"w2ui-icon-columns\"></i></button>\r\n</div>";
  });

},{"hbsfy/runtime":153}],55:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  buffer += "<div id=\"vehiculTemplate\" class=\"form-model\" style=\"width:100%;margin:0 auto;height:100%\">\r\n    <input type='hidden' name=\"id\" id=\"id\" data-bind=\"value:id\" />\r\n    <input type=\"hidden\" name=\"id_comanda\" data-bind=\"value:id_comanda\" />\r\n        <div style=\"height:100%;min-width: 500px\" id=\"date_principale\">\r\n        <fieldset>\r\n            <legend>Date vehicul</legend>\r\n            <div class=\"w2ui-field\">\r\n                <label>VIN:</label>\r\n                <div><input type='text'  id=\"vin\" maxlength=\"17\" style=\"text-transform: uppercase\"/></div>\r\n            </div>\r\n            \r\n            <div class=\"w2ui-field\">\r\n                <label >WVTA:</label>\r\n                <div><input type=\"text\"  id=\"wvta\" /></div> \r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label >Extensie WVTA:</label>\r\n                <div><input type=\"text\"  id=\"extensie\" /></div>\r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label >Tip:</label>\r\n                <div><input type=\"text\"  id=\"tip\" /></div>\r\n            </div><div class=\"w2ui-field\">\r\n                <label >Varianta:</label>\r\n                <div><input type=\"text\"  id=\"varianta\" /></div>\r\n            </div><div class=\"w2ui-field\">\r\n                <label >Versiune:</label>\r\n                <div><input type=\"text\"  id=\"versiune\" /></div>\r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label >An fabricatie:</label>\r\n                <div><input type=\"text\"  class=\"input-sm\" id=\"an_fabr\" maxlength=\"4\" /></div>\r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label >Masa reala(kg):</label>\r\n                <div><input type=\"text\"  class=\"input-sm\" id=\"masa_reala\" maxlength=\"6\" /></div>   \r\n            </div>\r\n            <div class=\"w2ui-field\" style=\"margin-bottom:5px\">\r\n                <label >Culoare:</label>\r\n                <div><input type=\"text\"  id=\"culoare\" class=\"select-control\" /></div>\r\n            </div>\r\n            <div id=\"engine_container\">\r\n                <div class=\"w2ui-field engine\">\r\n                    <label >Cod motor:</label>\r\n                    <div><input type=\"text\"  id=\"cod_motor\" /></div>\r\n                </div>\r\n                <div class=\"w2ui-field engine\">\r\n                    <label >Putere kW:</label>\r\n                    <div><input type=\"text\" class=\"input-sm\"  id=\"putere_kw\" /></div>\r\n                </div>\r\n                <div class=\"w2ui-field engine\">\r\n                    <label >Cilindree:</label>\r\n                    <div><input type=\"text\" class=\"input-sm\" id=\"cilindree\" /></div>\r\n                </div>\r\n                <div class=\"w2ui-field engine\">\r\n                    <label>Serie motor:</label>\r\n                    <div><input type=\"text\"  id=\"serie_motor\" /></div>  \r\n                </div>\r\n                <div class=\"w2ui-field\">\r\n                    <label>CO2 WLTP Comb.:</label>\r\n                    <div><input type=\"text\" class=\"input-sm\" id=\"co2_wltp\" /></div>  \r\n                </div>\r\n                <div class=\"w2ui-field\">\r\n                    <label>CO2 alt. WLTP Comb.:</label>\r\n                    <div><input type=\"text\" class=\"input-sm\" id=\"co2_wltp_alt\" /></div>  \r\n                </div>\r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label>Observatii:</label>\r\n                <div><textarea id=\"observatii\" style=\"box-sizing: border-box; margin: 0px; width: 400px; height: 70px;\"></textarea></div>  \r\n            </div>\r\n             <div class=\"w2ui-field\">\r\n                <label>Motiv anulare:</label>\r\n                <div><textarea id=\"motiv_respingere\" style=\"box-sizing: border-box; margin: 0px; width: 400px; height: 70px;\"></textarea></div>  \r\n            </div>\r\n            </fieldset>\r\n            <fieldset>\r\n                <legend>Nr. omologare RAR:</legend>\r\n             <div class=\"w2ui-field\">\r\n                <div><input type=\"text\" style=\"font-size: 18px;width:300px;text-transform:uppercase\"  id=\"nr_registru\" /></div>\r\n            </div>\r\n            </fieldset>\r\n        <!--</form>-->\r\n            <fieldset>\r\n            <legend>Mentiuni suplimentare:</legend>\r\n            <button class=\"btn btn-green\" id=\"btnAddMentiune\"><i class=\"w2ui-icon-plus\"></i></button>\r\n            <div class=\"mentiuni w2ui-field\" id=\"mentiuni_container\">\r\n                <!--<input  type=\"text\" id=\"ment1\" maxlength=\"50\"  />\r\n                <input type=\"text\"  id=\"ment2\" maxlength=\"50\"  />\r\n                <input type=\"text\"  id=\"ment3\" maxlength=\"50\"  />\r\n                <input type=\"text\"  id=\"ment4\" maxlength=\"50\"  />\r\n                <input type=\"text\"  id=\"ment5\" maxlength=\"50\"  />-->\r\n            </div>\r\n            </fieldset>\r\n        </div>\r\n        <div  style=\"height:100%\" id=\"date_tehnice\">\r\n            <div id=\"files_container\">\r\n                <div id=\"files_list_container\">\r\n                </div>\r\n                <br>\r\n                <button class=\"btn btn-green\" id=\"btnAddFile\" >\r\n                    <i class=\"w2ui-icon-plus\"></i>\r\n                </button>\r\n            </div>\r\n             <br style=\"clear:both\">\r\n             <hr>\r\n            <div id=\"date_tehnice_container\">\r\n                <!-- <div class=\"accordion\" id=\"date-accordion\"></div> -->\r\n            </div>\r\n            <br>\r\n            <hr>\r\n            <div id=\"anvelope_container\" style=\"margin-top: 35px\">\r\n                <!-- <div class=\"accordion\" id=\"anvelope-accordion\"></div> -->\r\n            </div>\r\n        </div>\r\n    <!--end vehicule container-->\r\n        <div id=\"buttons_container\">\r\n        <div class=\"col-md-9\" id=\"operation_container\">\r\n            <button title=\"Inchide\" class=\"btn btn-default\" id=\"btnBack\"><i class=\"w2ui-icon-back\"></i> Inchide\r\n            </button>\r\n            <button title=\"Salvare\" class=\"btn btn-green\" id=\"btnSaveVehicul\"><i class=\"w2ui-icon-save\"></i> Salveaza\r\n            </button>\r\n            <button disabled title=\"Copiere\" class=\"btn btn-orange\" id=\"btnCopyVehicul\"><i class=\"w2ui-icon-paste\" ></i> Copiaza\r\n            </button>\r\n            <button disabled title=\"Tipar CIV\" class=\"btn btn-blue\" id=\"btnVehiculComplet\"><i class=\"w2ui-icon-print\"></i> Tipar CIV\r\n            </button>\r\n            <button disabled title=\"Arhivare CIV\" class=\"btn btn-green\" id=\"btnArhivare\"><i class=\"w2ui-icon-columns\"></i> Arhivare CIV\r\n            </button>\r\n            <button  title=\"Anulare\" class=\"btn btn-red\" id=\"btnNewWindow\"><i class=\"w2ui-icon-cross\"></i> Anulare\r\n            </button>\r\n            <button  title=\"Deblocare\" class=\"btn btn-green\" id=\"btnUnlock\"><i class=\"w2ui-icon-check\"></i> Deblocare\r\n            </button>\r\n            <button disabled title=\"Transmite\" class=\"btn btn-orange\" id=\"btnSendVehicul\"><i class=\"w2ui-icon-mail\" ></i> Transmite\r\n            </button>\r\n            </button>\r\n            <button disabled title=\"Raport\" class=\"btn btn-blue\" id=\"btnFisaVehicul\"><i class=\"w2ui-icon-print\" ></i> Raport\r\n            </button>\r\n        </div>\r\n        <div class=\"col-md-3\" id=\"supervize_container\">\r\n            <button id=\"btnFirst\">|<</button>\r\n            <button id=\"btnPrev\"><</button>\r\n            <input type=\"text\" id=\"currentIndex\" style=\"width:50px\" readonly/>\r\n            <button id=\"btnNext\">></button>\r\n            <button id=\"btnLast\">>|</button>\r\n        </div>\r\n        </div>\r\n</div>\r\n";
  return buffer;
  });

},{"hbsfy/runtime":153}],56:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div></div>";
  });

},{"hbsfy/runtime":153}],57:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"w2ui-page page-0  modalContent\">\r\n    <div class=\"w2ui-field\" >\r\n        <label>Axa:</label>\r\n        <div><input type=\"text\" id=\"axa\"></div>\r\n    </div>\r\n    <div class=\"w2ui-field\" >\r\n        <label>Anvelopa:</label>\r\n        <div><input type=\"text\"   id=\"id_roata\"></div>\r\n    </div>\r\n</div>\r\n <hr>\r\n    <div class=\"w2ui-buttons\">\r\n        <button class=\"btn btn-blue save-anvelopa\"><i class=\"fa fa-save\"></i> Salveaza</button>\r\n        <button class=\"btn btn-red cancel-anvelopa\"><i class=\"fa fa-times\"></i> Renunta</button>\r\n    </div>";
  });

},{"hbsfy/runtime":153}],58:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"w2ui-page page-0  modalContent\">\r\n    <div class=\"w2ui-field\" >\r\n        <label>Axa fata:</label>\r\n        <div><input type=\"text\" id=\"id_roataf\"></div>\r\n    </div>\r\n    <div class=\"w2ui-field\" >\r\n         <label>Idem spate:</label>\r\n        <div><input type=\"checkbox\"   id=\"idemspate\"></div>\r\n    </div>\r\n\r\n    <div class=\"w2ui-field\" >\r\n        <label>Axa spate:</label>\r\n        <div><input type=\"text\" id=\"id_roatas\"></div>\r\n    </div>\r\n</div>\r\n <hr>\r\n    <div class=\"w2ui-buttons\">\r\n        <button class=\"btn btn-blue save-anvelopa\"><i class=\"fa fa-save\"></i> Salveaza</button>\r\n        <button class=\"btn btn-red cancel-anvelopa\"><i class=\"fa fa-times\"></i> Renunta</button>\r\n    </div>";
  });

},{"hbsfy/runtime":153}],59:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"gridAnvelope\" style=\"min-height: 350px\"></div>\r\n<!-- <div id=\"gridSursaAnvelope\" style=\"height: 350px\"></div> -->";
  });

},{"hbsfy/runtime":153}],60:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"cereriNrOmGrid\" class=\"page\">Cereri page</div>";
  });

},{"hbsfy/runtime":153}],61:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "\r\n<table class=\"tbl-detmotor\">\r\n	<tr>\r\n		<th>Info</th>\r\n		<th>Caracteristici</th>\r\n		<th>Cilindrii</th>\r\n		<th>Echipare</th>\r\n		<th>Poluare</th>\r\n	</tr>\r\n	<tr>\r\n		<td>\r\n			<p><div class=\"lbl-detmotor\">Tip: </div><span style=\"font-weight:bold\"><label id=\"tip\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Cod: </div><span style=\"font-weight:bold\"><label id=\"cod\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Combustibil: </div><span style=\"font-weight:bold\"><label id=\"combustib\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Tip Motor: </div><span style=\"font-weight:bold\"><label id=\"tip_mot\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Alimentare: </div><span style=\"font-weight:bold\"><label id=\"tip_alim\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Timpi: </div><span style=\"font-weight:bold\"><label id=\"timpi\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Racire: </div><span style=\"font-weight:bold\"><label id=\"tip_racire\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Depoluare: </div><span style=\"font-weight:bold\"><label id=\"tip_depol\"></label></span></p>\r\n		</td>\r\n		<td>\r\n			<p><div class=\"lbl-detmotor\">Putere(kW): </div><span style=\"font-weight:bold\"><label id=\"p_max_kw\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">P. net(kW): </div><span style=\"font-weight:bold\"><label id=\"kw_max_net\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">P orar(kW): </div><span style=\"font-weight:bold\"><label id=\"kw_max_h\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">P. 30m(kW): </div><span style=\"font-weight:bold\"><label id=\"kw_max_30\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Putere(CP): </div><span style=\"font-weight:bold\"><label id=\"p_max_cp\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Turatie Pmax: </div><span style=\"font-weight:bold\"><label id=\"rot_p_max\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Cuplu: </div><span style=\"font-weight:bold\"><label id=\"cuplu_max\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Turatie cuplu: </div><span style=\"font-weight:bold\"><label id=\"rot_c_max\"></label></span></p>\r\n		</td>\r\n		<td>\r\n			<p><div class=\"lbl-detmotor\">Cilindree: </div><span style=\"font-weight:bold\"><label id=\"cilindree\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Nr. cilindrii: </div><span style=\"font-weight:bold\"><label id=\"nr_cilindr\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Configuratie: </div><span style=\"font-weight:bold\"><label id=\"config\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Alezaj: </div><span style=\"font-weight:bold\"><label id=\"alezaj\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Cursa: </div><span style=\"font-weight:bold\"><label id=\"cursa\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Compresie: </div><span style=\"font-weight:bold\"><label id=\"compresie\"></label></span></p>\r\n		</td>\r\n		<td>\r\n			<p><div class=\"lbl-detmotor\">Echipare: </div><span style=\"font-weight:bold\"><label id=\"echipare\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Echipare1: </div><span style=\"font-weight:bold\"><label id=\"echipare1\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Echipare2: </div><span style=\"font-weight:bold\"><label id=\"echipare2\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Echipare3: </div><span style=\"font-weight:bold\"><label id=\"echipare3\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Echipare4: </div><span style=\"font-weight:bold\"><label id=\"echipare4\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Partic1: </div><span style=\"font-weight:bold\"><label id=\"partic1\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Partic2: </div><span style=\"font-weight:bold\"><label id=\"partic2\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Partic3: </div><span style=\"font-weight:bold\"><label id=\"partic3\"></label></span></p>\r\n		</td>\r\n		<td>\r\n			<p><div class=\"lbl-detmotor\">CO: </div><span style=\"font-weight:bold\"><label id=\"co\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">HC: </div><span style=\"font-weight:bold\"><label id=\"hc\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">NOX: </div><span style=\"font-weight:bold\"><label id=\"nox\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Particule: </div><span style=\"font-weight:bold\"><label id=\"particule\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Opacitate: </div><span style=\"font-weight:bold\"><label id=\"opacitate\"></label></span></p>\r\n			<p><div class=\"lbl-detmotor\">Doc Omol: </div><span style=\"font-weight:bold\"><label id=\"doc_omolog\"></label></span></p>\r\n		</td>\r\n	</tr>\r\n	<tr>\r\n		<td>Observatii:</td>\r\n		<td colspan=\"4\" id=\"observatii\"></td>\r\n	</tr>\r\n\r\n</table>";
  });

},{"hbsfy/runtime":153}],62:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  buffer += "<form role=\"form\" class=\"form-inline mid-form\" >\r\n	<fieldset style=\"padding: 10px\">\r\n		<legend>NR. REGISTRU: <label id=\"nr_registru\" style=\"color:blue;font-weight: bold\"></label></legend>\r\n		<div style=\"width:400px;float:left\">\r\n		<!-- <div> -->\r\n		<div class=\"w2ui-field\">\r\n			<label>Mod omologare:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"cod_tip_omologare\" >\r\n			</div>\r\n		</div>\r\n		<!-- <div class=\"w2ui-field\" style=\"display:none\">\r\n			<label>Tip omologare:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"cod_tip_omologare\"></label>\r\n			</div>\r\n		</div>\r\n\r\n		</div>-->\r\n		<div class=\"w2ui-field\">\r\n			<label>WVTA:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"wvta\" disabled=\"true\">\r\n				\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Categorie CE:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"categorie\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Categorie folosinta:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"cod_categorie\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field clasa\">\r\n			<label>Clasa:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"id_clasa\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Caroserie:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"cod_caroserie\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Marca:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"marca\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Tip:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"tip\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Varianta:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"varianta\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Versiune:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"versiune\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Denumire:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"denumire_comerciala\">\r\n			</div>\r\n		</div>\r\n		</div>\r\n\r\n		<div style=\"width:400px;float:left\">\r\n		<div class=\"w2ui-field\">\r\n			<label>Producator:</label>\r\n			<div>\r\n				<textarea id=\"producator\"></textarea>\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>Numar axe:</label>\r\n			<div>\r\n				<input type=\"number\" id=\"nr_axe\">\r\n			</div>\r\n		</div>\r\n		<!--<div class=\"w2ui-field\">\r\n			<label>Antipoluare:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"antipoluare\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>ABS:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"abs\">\r\n			</div>\r\n		</div>\r\n		<div class=\"w2ui-field\">\r\n			<label>OBD:</label>\r\n			<div>\r\n				<input type=\"text\" id=\"obd\">\r\n			</div>\r\n		</div>-->\r\n		<div class=\"w2ui-field\">\r\n			<label>Observatii:</label>\r\n			<div>\r\n				<textarea id=\"observatii\"></textarea>\r\n			</div>\r\n		</div>\r\n		</div>\r\n	</fieldset>\r\n</form>\r\n";
  return buffer;
  });

},{"hbsfy/runtime":153}],63:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  });

},{"hbsfy/runtime":153}],64:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"w2ui-field\">\r\n	<label style=\"width:160px\">";
  if (helper = helpers.nume) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nume); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n	<div>\r\n		<input type=\"number\" id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val_min\" name=\"val_min\" /> - <input type=\"number\" name=\"val_max\" id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val_max\" />\r\n		<span id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__suggested_valmin\" name=\"suggested_valmin\"></span>  <span id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__suggested_valmax\" name=\"suggested_valmax\"></span>\r\n	</div>\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],65:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n		<select name=\"pseudo\" size=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.multivalues)),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\r\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.multivalues), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</select>\r\n		<div name=\"btnAddValue\" class=\"btn btn-blue btnmark btnAddValue\" data-model=\"";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\"><i class=\"w2ui-icon-plus\" ></i></div>\r\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deletable), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n  			<option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n  		";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n		<div name=\"btnDelValue\" class=\"btn btn-red btnmark btnDelValue\" data-model=\"";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\"><i class=\"w2ui-icon-cross\" ></i></div>\r\n		";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n		<input type=\"text\" id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\" name=\"val\"/>\r\n		<span id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__suggested_val\" name=\"suggested_val\"></span>\r\n		</div>\r\n	";
  return buffer;
  }

  buffer += "<div class=\"w2ui-field\">\r\n	<label style=\"width:160px\">";
  if (helper = helpers.nume) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nume); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n	<div>\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.multiple), {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],66:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n		<select name=\"pseudo\" size=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.multivalues)),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" style=\"width:250px\">\r\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.multivalues), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</select>\r\n		<div name=\"btnAddValue\" class=\"btn btn-blue btnmark btnAddValue\" data-model=\"";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\"><i class=\"w2ui-icon-plus\" ></i></div>\r\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deletable), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n  			<option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\r\n  		";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n		<div name=\"btnDelValue\" class=\"btn btn-red btnmark btnDelValue\" data-model=\"";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" tabindex=\"-1\"><i class=\"w2ui-icon-cross\" ></i></div>\r\n		";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n		<input type=\"text\" id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\" name=\"val\" style=\"width:250px\" />\r\n	";
  return buffer;
  }

  buffer += "<div class=\"w2ui-field\">\r\n	<label style=\"width:160px\">";
  if (helper = helpers.nume) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nume); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n	<div>\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.multiple), {hash:{},inverse:self.program(6, program6, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</div>\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],67:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"w2ui-field\">\r\n    <label style=\"width:160px\">";
  if (helper = helpers.nume) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nume); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n<div>\r\n    <textarea id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\" name=\"val\" ></textarea>\r\n</div>\r\n\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],68:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<label name=\"mentiune\"></label><input maxlength=\"";
  if (helper = helpers.maxchar) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.maxchar); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" type=\"text\" name=\"val_sup\" /><button class=\"btnRemoveCollection\"><i class=\"w2ui-icon-cross\"></i></button>";
  return buffer;
  });

},{"hbsfy/runtime":153}],69:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"sursaMentiuni\" style=\"height:250px\"></div>\r\n<p>Preview:</p>\r\n<textarea id=\"preview\" style =\"height:145px;max-width:380px;min-width: 380px\" readonly>";
  if (helper = helpers.words) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.words); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea><br>\r\n<i>Nota: Mentiunile voa fi tiparite pe CIV exact in forma in care apar mai sus. Pentru modificari va rog sa folositi campul editabil al fiecarei mentiuni in parte pana ajungeti la forma dorita!</i>\r\n\r\n<p>Mentiuni:</p>";
  return buffer;
  });

},{"hbsfy/runtime":153}],70:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"gridMotoare\" style=\"height:250px\"></div>\r\n<div id=\"gridSursa\" style=\"height:350px\"></div>";
  });

},{"hbsfy/runtime":153}],71:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"gridSisteme\" style=\"height:350px\"></div>\r\n<div id=\"gridSursaSist\" style=\"height:350px\"></div>";
  });

},{"hbsfy/runtime":153}],72:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"w2ui-field\">\r\n    <label style=\"width:160px\">";
  if (helper = helpers.nume) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nume); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n<div>\r\n    <input type=\"text\" id=\"DateTehnice_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\" name=\"val\" style=\"min-width:250px\" />\r\n</div>\r\n\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],73:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"tvvForm\">\r\n<div class=\"w2ui-page page-0 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabTVV\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-1 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabDimensiuni\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-2 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabMase\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-3 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabMotor\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-4 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabPoluare\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-5 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabTransmisie\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-6 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabAxe\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-7 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabAnvelope\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-8 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabAltele\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-9 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabSisteme\"></div>\r\n</div>\r\n<div class=\"w2ui-page page-10 \" style=\"width:100%\">\r\n<div class=\"\" id=\"tabMentiuni\"></div>\r\n</div>\r\n<div class=\"w2ui-buttons\">\r\n    <div id=\"formButtons\" style=\"display:none; text-align:center\">\r\n        <span id=\"editButtons\">\r\n        <button class=\"btn btn-blue\" id=\"btnSave\"><i class=\"w2ui-icon-save\"></i> Salveaza</button>\r\n        <button class=\"btn btn-orange\" id=\"btnImportDate\"><i class=\"w2ui-icon-upload\"></i> Importa datele de la extensia anterioara</button>\r\n        <button class=\"btn btn-green\" id=\"btnValideaza\"><i class=\"w2ui-icon-check\"></i> Valideaza datele!</button>\r\n        </span>\r\n        \r\n        <button class=\"btn btn-green\" id=\"btnPrintFisa\"><i class=\"w2ui-icon-print\"></i> Fisa</button>\r\n\r\n        <button class=\"btn btn-orange\" id=\"copyButton\" style=\"display:none\"><i class=\"w2ui-icon-copy\"></i> Copy</button>\r\n        <button class=\"btn btn-orange\" id=\"pasteButton\" style=\"display:none\"><i class=\"w2ui-icon-copy\"></i> Paste</button>\r\n        </div>\r\n</div>\r\n</div>";
  });

},{"hbsfy/runtime":153}],74:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<section>\r\n<br>\r\n<hr>\r\n<div class=\"w2ui-field\">\r\n    <label>Alege fisiere:</label>\r\n    <div>\r\n        <input id=\"fileupload\" name=\"files[]\" type=\"file\" multiple=true class=\"file-loading\" >\r\n    </div>\r\n</div>\r\n</section>";
  });

},{"hbsfy/runtime":153}],75:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "    <div>\r\n    <div class=\"w2ui-field\" name=\"rfcontainer\">\r\n        <label>";
  if (helper = helpers.lblFata) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblFata); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n        <div>\r\n            <input type=\"text\"  name=\"id_roataf\" id=\"Anvelope_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__id_roataf\"/>\r\n        </div>\r\n    </div>\r\n    <div class=\"w2ui-field\" name=\"rscontainer\" >\r\n        <label>";
  if (helper = helpers.lblSpate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lblSpate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n        <div>\r\n            <input type=\"text\"  name=\"id_roatas\" id=\"Anvelope_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__id_roatas\"/>\r\n        </div>\r\n    </div>\r\n    </div>\r\n    <div style=\"float: right; margin-top: -50px;\">\r\n        <button class=\"btn btn-red btn-icon-only btnDelAnvelopa\" ><i class=\"w2ui-icon-cross\"></i></button>\r\n    </div>\r\n\r\n";
  return buffer;
  });

},{"hbsfy/runtime":153}],76:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<label name=\"label\"></label>\r\n<div><input type=\"text\" id=\"Atribute_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\"  name=\"val\"  /></div>\r\n";
  return buffer;
  });

},{"hbsfy/runtime":153}],77:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<label name=\"label\"></label>\r\n<div>\r\n	<input type=\"text\" name=\"val\" class=\"input-sm\"  id=\"Atribute_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\" />\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],78:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<label  name=\"label\"></label>\r\n<div><input type=\"number\" name=\"val\" class=\"input-sm\"  id=\"Atribute_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\" />\r\n\r\n\r\n<label class=\"lbl-desc-start\" name=\"min\"></label><label class=\"lbl-desc-end\" name=\"max\"></label>\r\n\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],79:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"dup":56,"hbsfy/runtime":153}],80:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<!-- <div style=\"overflow:auto;width:100%;height:100%;padding: 20px\">\r\n<p>\r\n	<div style=\"display:inline-block\"><label >WVTA:</label><div><input type=\"text\" id=\"wvta\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Extensie:</label><div><input type=\"text\" id=\"extensie\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Tip:</label><div><input type=\"text\" id=\"tip\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Varianta:</label><div><input type=\"text\" id=\"varianta\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Versiune:</label><div><input type=\"text\" id=\"versiune\" /></div></div>\r\n</p>\r\n\r\n<p>\r\n	<button name=\"back\" id=\"back\" class=\"btn\">Inapoi la lista</button>\r\n	<button name=\"load\" id=\"load\" class=\"btn btn-blue\">Incarca</button>\r\n	<button name=\"copy\" id=\"copy\" class=\"btn btn-orange\">Multiplica randuri</button>\r\n	<button name=\"save\" id=\"save\" class=\"btn btn-green\">Salveaza</button>\r\n</p>\r\n<p>Cauta: <input id=\"search_field\" type=\"text\"></input><p>\r\n<div id=\"vehicles\"></div>\r\n<div id=\"validationSummary\" style=\"color:red\"></div>\r\n</div> -->\r\n\r\n<div style=\"overflow:auto;width:100%;height:100%;padding: 20px\">\r\n	<p>Atentie! Anvelopele optionale se vor prelua la CIV in ordinea introducerii acestora si in limita numarului de mentiuni posibil.<br>\r\n		In cazul in care doriti sa configurati manual anvelopele optionale, apasati butonul \"Anvelope Optionale\".\r\n	</p>\r\n<p>\r\n	<div style=\"display:inline-block\"><label >WVTA:</label><div><input type=\"text\" id=\"wvta\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Extensie:</label><div><input type=\"text\" id=\"extensie\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Tip:</label><div><input type=\"text\" id=\"tip\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Varianta:</label><div><input type=\"text\" id=\"varianta\" /></div></div>\r\n	<div style=\"display:inline-block\"><label >Versiune:</label><div><input type=\"text\" id=\"versiune\" /></div></div>\r\n</p>\r\n\r\n<div id=\"vehicles\" style=\"height:500px\"></div>\r\n<div id=\"validationSummary\" style=\"color:red\"></div>\r\n<p>\r\n	<button name=\"back\" id=\"back\" class=\"w2ui-btn\"><i class=\"w2ui-icon-signout\"></i> Inapoi la lista</button>\r\n</p>\r\n</div>\r\n";
  });

},{"hbsfy/runtime":153}],81:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<label name=\"label\"></label>\r\n<div>\r\n    <input type=\"text\" id=\"Atribute_";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "__val\" name=\"val\" style=\"min-width:250px\" />\r\n</div>";
  return buffer;
  });

},{"hbsfy/runtime":153}],82:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"vehiculTemplate\" class=\"form-model\" style=\"width:100%;margin:0 auto;height:100%\">\r\n    <input type='hidden' name=\"id\" id=\"id\" data-bind=\"value:id\" />\r\n    <input type=\"hidden\" name=\"id_comanda\" data-bind=\"value:id_comanda\" />\r\n        <div style=\"height:100%;min-width: 500px\" id=\"date_principale\">\r\n            <div class=\"w2ui-field\">\r\n                <label>VIN:</label>\r\n                <div><input type='text'  id=\"vin\" maxlength=\"17\" style=\"text-transform: uppercase\"/></div>\r\n            </div>\r\n           <!--  <div class=\"w2ui-field\">\r\n                <label >Nr. registru:</label>\r\n                <div><input type=\"text\" id=\"cnot\" /></div>\r\n            </div> -->\r\n            <div class=\"w2ui-field\">\r\n                <label>Nr. omologare RAR:</label>\r\n                <div><input type=\"text\"  id=\"nr_registru\" disabled/></div>\r\n            </div>\r\n\r\n            <div class=\"w2ui-field\">\r\n                <label >WVTA:</label>\r\n                <div><input type=\"text\"  id=\"wvta\" /></div>\r\n                \r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label >Extensie WVTA:</label>\r\n                <div><input type=\"text\"  id=\"id_extensie\" /></div>\r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label >Tip:</label>\r\n                <div><input type=\"text\"  id=\"tip\" /></div>\r\n            </div><div class=\"w2ui-field\">\r\n                <label >Varianta:</label>\r\n                <div><input type=\"text\"  id=\"varianta\" /></div>\r\n            </div><div class=\"w2ui-field\">\r\n                <label >Versiune:</label>\r\n                <div><input type=\"text\"  id=\"versiune\" /></div>\r\n            </div>\r\n            <div class=\"w2ui-field\" id=\"categorie\">\r\n                <label >Categorie:</label>\r\n                <div><input type=\"text\"  id=\"categ_euro\" /></div>\r\n            </div>\r\n            <div class=\"w2ui-field\">\r\n                <label >An fabricatie:</label>\r\n                <div><input type=\"text\"  class=\"input-sm\" id=\"an_fabr\" maxlength=\"4\" /></div>\r\n                \r\n            </div>\r\n            <div class=\"w2ui-field\" style=\"margin-bottom:5px\">\r\n                <label >Culoare:</label>\r\n                <div><input type=\"text\"  id=\"culoare\" class=\"select-control\" /></div>\r\n            </div>\r\n            <div id=\"engine_container\">\r\n                <div class=\"w2ui-field engine\">\r\n                    <label >Cod motor / P(kW):</label>\r\n                    <div><input type=\"text\"  id=\"motor\" /></div>\r\n                    \r\n                </div>\r\n                <div class=\"w2ui-field engine\">\r\n                    <label>Serie motor:</label>\r\n                    <div><input type=\"text\"  id=\"serie_motor\" /></div>\r\n                    \r\n                </div>\r\n            </div>\r\n        <!--</form>-->\r\n            <label>Mentiuni suplimentare(se completeaza automat):</label>\r\n            <div class=\"mentiuni w2ui-field\">\r\n                <input  type=\"text\" id=\"ment1\" maxlength=\"50\" readonly=\"readonly\" />\r\n                <input type=\"text\"  id=\"ment2\" maxlength=\"50\" readonly=\"readonly\" />\r\n                <input type=\"text\"  id=\"ment3\" maxlength=\"50\" readonly=\"readonly\" />\r\n                <input type=\"text\"  id=\"ment4\" maxlength=\"50\" readonly=\"readonly\" />\r\n                <input type=\"text\"  id=\"ment5\" maxlength=\"50\" readonly=\"readonly\" />\r\n            </div>\r\n        </div>\r\n        <div  style=\"height:100%\" id=\"date_tehnice\">\r\n            <div id=\"date_tehnice_container\">\r\n                <!-- <div class=\"accordion\" id=\"date-accordion\"></div> -->\r\n            </div>\r\n            <br>\r\n            <hr>\r\n            <div id=\"anvelope_container\" style=\"margin-top: 35px\">\r\n                <!-- <div class=\"accordion\" id=\"anvelope-accordion\"></div> -->\r\n            </div>\r\n        </div>\r\n    <!--end vehicule container-->\r\n        <div id=\"buttons_container\">\r\n        <div class=\"col-md-9\" id=\"operation_container\">\r\n            <button title=\"Inchide\" class=\"btn btn-default\" id=\"btnBack\"><i class=\"w2ui-icon-back\"></i> Inchide\r\n            </button>\r\n            <button title=\"Salvare\" class=\"btn btn-green\" id=\"btnSaveVehicul\"><i class=\"w2ui-icon-save\"></i> Salveaza\r\n            </button>\r\n            <button disabled title=\"Copiere\" class=\"btn btn-orange\" id=\"btnCopyVehicul\"><i class=\"w2ui-icon-paste\" ></i> Copiaza\r\n            </button>\r\n            <button disabled title=\"Date complete\" class=\"btn btn-blue\" id=\"btnVehiculComplet\"><i class=\"w2ui-icon-info\"></i> Fisa\r\n            </button>\r\n            <button  title=\"Fereastra noua\" class=\"btn btn-default\" id=\"btnNewWindow\"><i class=\"w2ui-icon-newwindow\"></i> Fereastra noua\r\n            </button>\r\n        </div>\r\n        <div class=\"col-md-3\" id=\"supervize_container\">\r\n            <button id=\"btnFirst\">|<</button>\r\n            <button id=\"btnPrev\"><</button>\r\n            <input type=\"text\" id=\"currentIndex\" style=\"width:50px\" readonly/>\r\n            <button id=\"btnNext\">></button>\r\n            <button id=\"btnLast\">>|</button>\r\n        </div>\r\n        </div>\r\n</div>\r\n";
  });

},{"hbsfy/runtime":153}],83:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div style=\"display:none\">\r\n	<input id=\"fileupload\" type=\"file\" class=\"file\" name=\"files[]\" multiple  accept=\".xls\">\r\n</div>\r\n<div id=\"grid\" class=\"page\"></div>";
  });

},{"hbsfy/runtime":153}],84:[function(require,module,exports){
var beneficiari;
var ipc = requireNode('ipc');
EditorView = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/editor.hts'),
    attributes: function() {
        return {
            id: 'cerere' + this.cid
        };
    },
    className: 'windowContent w2ui-reset w2ui-form',
    control: undefined,
    events: {
        'click #btnSaveComanda': 'save',
        'click #btnCancelEdit': 'closeView'
    },
    initialize: function() {
        _.bindAll(this, 'closeView');
    },
    bindings: {
        '#daterar_container':{
            observe:'id',
            visible:function(val){
                return val?true:false;
            }
        },
        '#data_comanda':{
            observe:'data_comanda',
            onGet:function(val){
                return val ? w2utils.formatDate(w2utils.isDate(val,'dd.MM.yyyy',true)) : null
            }
        },
        '#data_inreg':{
            observe:'data_inreg',
            onGet:function(val){
                return val? w2utils.formatDate(w2utils.isDate(val,'dd.MM.yyyy',true)):null
            },
            onSet:function(val){

            }
        }
    },
    onShow: function() {
        var self = this;

        if (this.model.id) {
            this.model.fetch().then(function() {
                self.cachedModel = self.model.toJSON();
                self.open();
            });
        } else {
            self.isNew = true;
            self.open();
        }

        for (var f in this.model.fields) {
            var field = this.model.fields[f];
            self.bindings[field.el] = field.name;
        }
        $(this.$el).find('.w2ui-field').each(function(i,el){
            var label = $(el).find('label');
            label.text(w2utils.lang(label.text()));
        });
        this.$el.find('.button-translate button').each(function(i,b){
            b.textContent = w2utils.lang(b.textContent)
        });
        self.stickit();
    },

    open: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'mailForm' + self.cid,
            title: 'Editor',
            width: '600px',
            showMin: true,
            showMax: true,
            height: '650px',
            resizable: true,
            onOpen: function(event) {
                self.setupView();
            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },

    setupView: function() {
        var self = this;
        this.$el.find('.datepicker').w2field('date');
        if (!ipc.sendSync('user:request:isinrole', [4]) && !this.model.id) {
            self.$el.find('#id_beneficiar').w2field('list', {
                width: '200px',
                url: app.baseUrl + 'civutils/GetBeneficiari',
                selected: {
                    id: self.model.get('id_beneficiar'),
                    text: self.model.get('societate')
                }
            }).on('change', function() {
                var selected = $('#id_beneficiar').data('selected');
                self.model.set('id_beneficiar', selected.id);
                self.model.set('societate', selected.text);
            });
            self.$el.find('#addBeneficiar').show();
        }else if(!this.model.id){//cerere noua depusa de beneficiar, trebuie sa setam beneficiarul
            var beneficiar = {};
            $.get(app.baseUrl + 'beneficiari/edit/'+app.User.id_beneficiar,null,function(response){
                self.model.set('societate',response.denumire_beneficiar)
                            .set('id_beneficiar',app.User.id_beneficiar);
            });
        }
    },
    save: function(event) {
        var self = this,
            options;
        options = {
            success: function(model) {
                model.set('recid', model.id);
                if (self.isNew) {
                    app.trigger('grid:added', {
                        grid: 'gridCereri',
                        model: model.toJSON()
                    });
                } else {
                    app.trigger('grid:edited', {
                        grid: 'gridCereri',
                        model: model.toJSON()
                    });
                }
                self.closeView();
                //success message is handled on app eventhandler
            },
            error: function(model, response) {
                var data, opt = {
                    text: w2utils.lang('Eroare la salvare!'),
                    title:w2utils.lang('Notificare'),
                    type: 'error-template'
                };
                ipc.send('app:notification:show', opt);
                data = eval('(' + response.responseText + ')');
                w2utils.validateRaw(self.$el, data.data);
            }
        };
        if (w2utils.validate(self.model, self.$el)) {
            var fields = self.model.fields;
            for(var i = 0; i < fields.length; i++){
                field = fields[i];
                if(field.type =='date'){
                    var crt = self.model.get(field.name)
                    if(crt){
                        var dt = w2utils.isDate(self.model.get(field.name),null,true)
                        var fmt = w2utils.formatDate(dt,'dd.mm.yyyy')
                        self.model.set(field.name,fmt)
                        console.log(fmt)
                    }
                }
            }
            self.model.save({}, options);
        }

    },

    onBeforeDestroy: function() {
        //if grid page is not opened we go there
        if (!w2ui.hasOwnProperty('gridCereri'))
            app.module('appciv').router.navigate('appciv/cereri', {
                trigger: true
            });
    },
    closeView: function(e) {
        this.win.destroy();
    }
});
module.exports = EditorView;

},{"./../../templates/cereri/editor.hts":45}],85:[function(require,module,exports){
var ipc = requireNode('ipc');
var fs = requireNode('fs');

module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/index.hts'),
    className: 'page',
    attributes: function() {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    events: {},
    initialize: function(options) {
        var self = this;
        this.location = options.location;
        _.bindAll(this, 'refreshGrid');
        this.setPermissions();
    },
    setPermissions: function() {
        this.allowSuper = ipc.sendSync('user:request:isuserinrole', [
            [13,1], 'appciv'
        ]);
        this.allowDelete = ipc.sendSync('user:request:isuserinrole', [
            [1], 'appciv'
        ]);
        this.allowPrint = ipc.sendSync('user:request:isuserinrole', [
            [1, 10], 'appciv'
        ]);

    },
    onShow: function() {
        var self = this;
        this.buildUpload();
        this.renderGrid();
    },
    renderGrid: function() {
        var self = this;
        $('#grid').w2grid({
            name: 'gridCereri',
            url: app.baseUrl + 'comenzi/getComenzi',
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            fixedBody: true,
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
                toolbarDelete: self.allowDelete,
                //toolbarSave: true,
                //toolbarEdit: true,
                expandColumn: true
            },
            toolbar: {
                items: [
                    //{type: 'break'},
                    {
                        type: 'button',
                        id: 'btnEdit',
                        caption: w2utils.lang('Editare'),
                        icon: 'w2ui-icon-pencil',
                        onClick: function(event) {
                            app.module('appciv').controller.editCerere(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'button',
                        disabled: true,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                            app.module('appciv').router.navigate('appciv/spreadsheetVehicule/' + w2ui['gridCereri'].getSelection(), true);
                        }
                    }, {
                        type: 'break'
                    }, {
                        type: 'button',
                        id: 'btnJurnal',
                        caption: 'Jurnal',
                        icon: 'w2ui-icon-search',
                        onClick: function(e) {
                            self.getJurnal(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'button',
                        id: 'btnUpload',
                        caption: w2utils.lang('Alege fisier'),
                        icon: 'w2ui-icon-upload',
                        onClick: function(event) {
                            self.choosefile();
                        }
                    }, {
                        type: 'button',
                        id: 'btnPlata',
                        caption: w2utils.lang('Instiintare plata'),
                        icon: 'w2ui-icon-money',
                        onClick: function(e) {
                            app.module('appciv').controller.detaliiPlataCerere(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'menu',
                        id: 'btnRaport',
                        caption: w2utils.lang('Raport'),
                        icon: 'w2ui-icon-file',
                        disabled: true,
                        items: [{
                            type: 'button',
                            id: 'btnRaportSimple',
                            caption: w2utils.lang('Raport'),
                            icon: 'w2ui-icon-print',
                            onClick: function(e) {
                                self.getRaport(w2ui['gridCereri'].getSelection());
                            }
                        },{
                            type: 'button',
                            id: 'btnRaportXLS',
                            caption: w2utils.lang('Raport XLS'),
                            icon: 'w2ui-icon-file',
                            onClick: function(e) {
                                self.getRaportXLS(w2ui['gridCereri'].getSelection());
                            }
                        }]
                    }, {
                        type: 'break'
                    }, {
                        type: 'button',
                        id: 'btnPostComanda',
                        caption: w2utils.lang('Transmite comanda!'),
                        icon: 'w2ui-icon-send',
                        onClick: function(e) {
                            w2confirm(w2utils.lang('Sigur finalizati aceasta comanda?')).yes(function(response) {
                                w2ui.gridCereri.lock();
                                var id = w2ui.gridCereri.getSelection();
                                //alert('ok');
                                app.module('appciv').controller.transmitComanda(id, self.refreshGrid);
                            });
                        }
                    },
                    //(self.allowPrint ?{
                //      type: 'menu',
                //      id: 'btnMeniuCIV',
                //      caption: 'Meniu CIV',
                //      icon: 'w2ui-icon-file',
                //      items: [ (self.allowPrint ? {
                //         type: 'button',
                //         id: 'btnPrintCIV',
                //         caption: 'Tipar',
                //         icon: 'w2ui-icon-print',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.printRaport(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {}),
                //     (self.allowPrint ? {
                //         type: 'button',
                //         id: 'btnVerificCIV',
                //         caption: 'Verificare',
                //         icon: 'w2ui-icon-check',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.verificRaport(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {}),
                //     (self.allowPrint ? {
                //         type: 'button',
                //         id: 'btnArhivareCIV',
                //         caption: 'Arhivare',
                //         icon: 'w2ui-icon-file',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.arhivareCIV(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {}),
                //     (self.allowSuper ? {
                //         type: 'button',
                //         id: 'btnAnulareCIV',
                //         caption: 'Anulare',
                //         icon: 'w2ui-icon-ban',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.anulareCIV(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {})]
                //  }:{})
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnPrintCIV',
                        caption: w2utils.lang('Tipar'),
                        icon: 'w2ui-icon-print',
                        disabled: true,
                        onClick: function(e) {
                            self.printRaport(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnVerificCIV',
                        caption: w2utils.lang('Verificare'),
                        icon: 'w2ui-icon-check',
                        disabled: true,
                        onClick: function(e) {
                            self.verificRaport(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnArhivareCIV',
                        caption: w2utils.lang('Arhivare'),
                        icon: 'w2ui-icon-file',
                        disabled: true,
                        onClick: function(e) {
                            self.arhivareCIV(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowSuper ? {
                        type: 'button',
                        id: 'btnAnulareCIV',
                        caption: w2utils.lang('Anulare'),
                        icon: 'w2ui-icon-ban',
                        disabled: true,
                        onClick: function(e) {
                            self.anulareCIV(w2ui['gridCereri'].getSelection());
                        }
                    } : {})
                ],
                onClick: function(event) {
                         //alert();
                        if (event.target === 'btnRaport:btnRaportSimple') {
                            self.getRaport(w2ui['gridCereri'].getSelection());
                        }else if(event.target === 'btnRaport:btnRaportXLS'){
                            self.getRaportXLS(w2ui['gridCereri'].getSelection());
                        }else if(event.target === 'btnMeniuCIV:btnArhivareCIV'){
                            self.arhivareCIV(w2ui['gridCereri'].getSelection());
                        }else if(event.target === 'btnMeniuCIV:btnAnulareCIV'){
                            self.anulareCIV(w2ui['gridCereri'].getSelection());
                        }
                    }
            },
            onDblClick: function(event) {
                var record = w2ui['gridCereri'].get(event.recid);
                if (record.depusa < 10) {
                    app.module('appciv').controller.editCerere(event.recid);
                }
            },
            multiSearch: true,
            searches: [{
                field: 'id',
                caption: w2utils.lang('Nr.Comanda'),
                type: 'text'
            }, {
                field: 'data_comanda',
                caption: w2utils.lang('Data'),
                type: 'date'
            }, {
                field: 'nr_inreg_soc',
                caption: w2utils.lang('Nr client'),
                type: 'text'
            }, {
                field: 'data_inreg',
                caption: w2utils.lang('Data client'),
                type: 'date'
            }, {
                field: 'societate',
                caption: w2utils.lang('Beneficiar'),
                type: 'text'
            }, {
                field: 'stare_comanda',
                caption: w2utils.lang('Stare'),
                type: 'list',
                options: {
                    items: [{id:'Finalizata',text:w2utils.lang("Finalizata")},{id:'In lucru',text:w2utils.lang("In lucru")}, {id:'Prelucrata',text:w2utils.lang("Prelucrata")}, {id:'Depusa',text:w2utils.lang("Depusa")}]
                }
            }, {
                field: 'vin',
                caption: w2utils.lang('V.I.N.'),
                type: 'text'
            }, {
                field: 'serie_civ',
                caption: w2utils.lang('Serie CIV'),
                type: 'text'
            },{
              field:'nr_registru',
              caption:w2utils.lang('Nr registru'),
              type:'text'
            }],
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
                    // sf['oper'] = sf['operator'];
                    // delete sf['operator'];
                    if (sf.field === 'stare_comanda') {
                        sf.field = 'depusa';
                        switch (sf.value) {
                            case 'In lucru':
                                sf.value = '(0,1,2,3,4)';
                                break;
                            case 'Finalizata':
                                sf.value = '15';
                                break;
                            case 'Depusa':
                                sf.value = '(10,11,12,15)';
                                break;
                            case 'Prelucrata':
                                sf.value = '11';
                                break;
                            default:
                                break;
                        }
                        sf.operator = 'isin';
                    }
                    if(sf.type=='date'){
                        if(sf.operator == 'between'){
                            sf.value[0]=w2utils.formatDate(w2utils.isDate(sf.value[0],null,true),'dd.MM.yyyy')
                            sf.value[1]=w2utils.formatDate(w2utils.isDate(sf.value[1],null,true),'dd.MM.yyyy')
                        }else{
                            sf.value=w2utils.formatDate(w2utils.isDate(sf.value,null,true),'dd.MM.yyyy')
                        }
                    }
                }

            },
            columns: [{
                    field: 'id',
                    caption: w2utils.lang('Nr.Comanda'),
                    size: '150px',
                    sortable: true
                }, {
                    field: 'data_comanda',
                    caption: w2utils.lang('Data'),
                    size: '220px',
                    render:function(rec){
                        return rec.data_comanda?w2utils.formatDate(w2utils.isDate(rec.data_comanda,'dd.MM.yyyy',true)):''
                    },
                    sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_comanda).format('DD.MM.YYYY');
                        //                        }
                }, {
                    field: 'data_transmitere',
                    caption: w2utils.lang('Data transmitere'),
                    size: '220px',
                    render:function(rec){
                        return rec.data_transmitere?w2utils.formatDate(w2utils.isDate(rec.data_transmitere,'dd.MM.yyyy',true)):''
                    },
                    sortable: true
                }, {
                    field: 'nr_inreg_soc',
                    caption: w2utils.lang('Nr client'),
                    size: '100px',
                    sortable: true
                }, {
                    field: 'societate',
                    caption: w2utils.lang('Beneficiar'),
                    size: '30%',
                    sortable: true
                }, {
                    field: 'data_inreg',
                    caption: w2utils.lang('Data client'),
                    size: '120px',
                    render:function(rec){
                        return rec.data_inreg?w2utils.formatDate(w2utils.isDate(rec.data_inreg,'dd.MM.yyyy',true)):''
                    },
                    sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_inreg).format('DD.MM.YYYY');
                        //                        }
                }, {
                    field: 'stare_plata',
                    caption: w2utils.lang('Stare plata'),
                    size: '150px',
                    sortable: true,
                    render: function(record) {
                        switch (record.stare_plata) {
                            case 1:
                                return '<b style="color:green">'+w2utils.lang('ACHITAT')+'</b>';
                            case 2:
                                return '<b style="color:red">'+w2utils.lang('NEACHITAT')+'</b>';
                            case 5:
                                return '<b style="color:blue">'+w2utils.lang('FACTURAT-NEINCASAT')+'</b>';
                            default:
                                return '<b>'+w2utils.lang('NEPRELUCRAT')+'</b>';
                        }
                    }
                }, {
                    field: 'stare_comanda',
                    caption: w2utils.lang('Stare'),
                    size: '25%',
                    sortable: true,
                    render: function(record) {
                        var cls = '',
                            stare = '';
                        switch (record.depusa) {
                            case 0:
                            case 90:
                                cls = 'label label-default';
                                stare = w2utils.lang('Adaugati vehicule');
                                break;
                            case 1:
                            case 91:
                                stare = w2utils.lang('In lucru - OK');
                                cls = 'label label-primary';
                                break;
                            case 2:
                            case 92:
                            case 3:
                            case 93:
                                stare = w2utils.lang('In lucru - Vehicule invalide');
                                cls = 'label label-warning';
                                break;
                            case 4:
                            case 94:
                                stare = w2utils.lang('In lucru - Vehicule invalide');
                                cls = 'label label-danger';
                                break;
                            case 55:
                                stare = w2utils.lang('In curs de transmitere');
                                cls = 'label label-waiting';
                                break;
                            case 10:
                                stare = w2utils.lang('Depusa - asteapta prelucrare');
                                cls = 'label label-waiting';
                                break;
                            case 11:
                                stare = w2utils.lang('Prelucrata - OK');
                                cls = 'label label-ready';
                                break;
                            case 18:
                                stare = '<b style="color:green">'+w2utils.lang('Verificat - OK')+'</b>';
                                cls = 'label label-checked';
                                break;
                            case 19:
                                stare = '<b style="color:green">'+w2utils.lang('Tiparit')+'</b>';
                                cls = 'label label-ready';
                                break;
                            case 12:
                                stare = w2utils.lang('In prelucrare');
                                cls = 'label label-waiting';
                                break;
                            case 9:
                                stare = w2utils.lang('In eroare - vehicule netransmise');
                                cls = 'label label-warning';
                                break;
                            case 15:
                                stare = w2utils.lang('Finalizata');
                                cls = 'label label-success';
                                break;

                        }
                        return '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="' + cls + '">&nbsp;&nbsp;&nbsp;</label>';

                    }
                }, {
                    field: 'countvehicule',
                    caption: w2utils.lang('Nr. Vehicule'),
                    size: '100px',
                    sortable: true
                }

            ],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onAdd: function(event) {
                app.module('appciv').controller.editCerere();
            },
            onSelect: function(e) {
                e.onComplete = function() {
                    var record = w2ui['gridCereri'].get(e.recid);
                    if (record.stare_plata === 2) {
                        w2ui['gridCereri'].toolbar.enable('btnPlata');
                    }
                    if (record.depusa !== 0) {
                        w2ui['gridCereri'].toolbar.enable('btnJurnal');
                    }
                    if (record.depusa === 15 && record.stare_plata === 1) {
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = false;//*/enable('btnArhivareCIV');
                    }
                    if (record.depusa === 15) {
                        w2ui['gridCereri'].toolbar.enable('btnRaport');
                        w2ui['gridCereri'].toolbar.enable('btnRaportXLS');
                    }
                    if (record.depusa == 11) {
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = false;//*/enable('btnPrintCIV');
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[1].disabled = false;//*/enable('btnVerificCIV');
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = false;//*/enable('btnAnulareCIV');

                    }
                    if(record.depusa == 18){
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = false;//*/disable('btnAnulareCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = false;//*/enable('btnPrintCIV');
                    }
                    if(record.depusa == 19){
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = false;//*/disable('btnAnulareCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = false;//*/disable('btnPrintCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[1].disabled = false;//*/disable('btnVerificCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = false;//*/enable('btnArhivareCIV');
                    }
                    if (record.depusa == 11 || record.depusa === 15) {
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = false;//*/enable('btnArhivareCIV');
                    }
                    //comanda nu este depusa, putem face unele actiuni
                    if (record.depusa < 10) {
                        w2ui['gridCereri'].toolbar.enable('btnEdit');
                        w2ui['gridCereri'].toolbar.enable('w2ui-delete');
                        w2ui['gridCereri'].toolbar.enable('btnUpload');
                        w2ui['gridCereri'].toolbar.enable('btnExcel');
                    } else {
                        w2ui['gridCereri'].toolbar.disable('btnEdit');
                        w2ui['gridCereri'].toolbar.disable('w2ui-delete');
                    }
                     if (record.depusa === 1 || record.depusa === 91) {
                        w2ui['gridCereri'].toolbar.enable('btnPostComanda');
                    }
                };
            },
            onLoad: self.disableGridButtons,
            onUnselect: self.disableGridButtons,
            onCollapse: function(event) {
                if (w2ui.hasOwnProperty('gridVehicule_' + event.recid)) {
                    w2ui['gridVehicule_' + event.recid].destroy();
                }
            },
            onExpand: function(event) {
                if (w2ui.hasOwnProperty('gridVehicule_' + event.recid)) {
                    w2ui['gridVehicule_' + event.recid].destroy();
                }
                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '505px'
                }, {
                    duration: 10,
                    complete: function() {
                        var record = w2ui['gridCereri'].get(event.recid);
                        app.module('appciv').controller.listVehicule(event.box_id, {
                            pid: event.recid,
                            canadd: record.depusa < 10 || (record.depusa >=90 && record.depusa<=93),
                            totalVehicule: record.countvehicule
                        });
                        w2ui.layout.resize();
                    }
                });
            },
            onRender: function(event) {
                event.onComplete = function() {
                    //                        onRender: function () {

                    //                        },
                };
            },
            onLoad:function(event){
              event.onComplete = function(){
                if(!self.refreshInterval){
                  self.refreshInterval = setInterval(function(){
                    $.ajax({
                      url:app.baseUrl + 'civutils/getStareComenzi',
                      type:'GET',
                      success:function(data){
                        data.response.map(function(stare){
                          w2ui.gridCereri.set(stare.id,{depusa:stare.depusa,countvehicule:stare.countvehicule,stare_plata:stare.stare_plata});
                        });
                      },
                      error:function(){
                          clearInterval(self.refreshInterval);
                      }
                    });
                  },60000);
                }
              };
            },
            postData:{location:self.location}
        });
        this.disableGridButtons();
        w2ui['gridCereri'].stateRestore();

    },
    raportMenuClick:function(e){
        console.log(e)
    },
    buildUpload: function() {
        var self = this;
        $('#fileupload').fileinput({
            uploadUrl: app.baseUrl + 'CIVFiles/uploadComanda',
            uploadClass: 'btn btn-toolbar',
            uploadTitle: w2utils.lang('Trimite fisier'),
            uploadLabel: w2utils.lang(' Trimite'),
            uploadIcon: '<i class="w2ui-icon-upload"></i>',
            showPreview: false,
            showRemove: false,
            showUpload: false,
            showCaption: false,
            progressClass: 'hide',
            uploadExtraData: function() {
                var id_comanda = w2ui['gridCereri'].getSelection() || null;
                if (id_comanda) {
                    return {
                        id_comanda: id_comanda
                    };
                }
            },
            browseClass: 'btn disabled btn-toolbar',
            browseTitle: w2utils.lang('Alege fisiere'),
            browseLabel: w2utils.lang(' Incarca vehicule'),
            browseIcon: '<i class="w2ui-icon-folder"></i>',
            removeClass: 'btn btn-toolbar',
            removeTitle: 'Reset',
            removeLabel: ' Reset',
            removeIcon: '<i class="w2ui-icon-cross"></i>'
        });

        $('#fileupload')
            .off('fileloaded').on('fileloaded', function() {
                w2ui['gridCereri'].lock();
                $('#fileupload').fileinput('upload');
            })
            .off('filebatchuploadsuccess').on('filebatchuploadsuccess', self.uploadComplete)
            .off('filebatchuploaderror').on('filebatchuploaderror', self.uploadError);
    },
    choosefile: function() {
        var chooser = this.$el.find('#fileupload');
        chooser.trigger('click');
    },
    onBeforeDestroy: function() {
        w2ui['gridCereri'].stateSave();
        for (var i in w2ui['gridCereri'].records) {
            var recid = w2ui['gridCereri'].records[i].recid;
            if (w2ui.hasOwnProperty('gridVehicule_' + recid)) {
                w2ui['gridVehicule_' + recid].destroy();
            }
        }
        w2ui.gridCereri.destroy();
        clearInterval(this.refreshInterval);
    },
    disableGridButtons: function() {
        w2ui['gridCereri'].toolbar.disable('btnPlata');
        w2ui['gridCereri'].toolbar.disable('btnEdit');
        w2ui['gridCereri'].toolbar.disable('w2ui-delete');
        w2ui['gridCereri'].toolbar.disable('btnUpload');
        w2ui['gridCereri'].toolbar.disable('btnJurnal');
        w2ui['gridCereri'].toolbar.disable('btnRaport');
        w2ui['gridCereri'].toolbar.disable('btnRaportXLS');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = true;//*/disable('btnPrintCIV');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[1].disabled = true;//*/disable('btnArhivareCIV');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = true;//*/disable('btnAnulareCIV');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = true;//*/disable('btnVerificCIV');
        w2ui['gridCereri'].toolbar.disable('btnPostComanda');
        w2ui['gridCereri'].toolbar.disable('btnExcel');
    },
    getJurnal: function(id) {
        var self = this;
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetJurnalComanda?id=' + id);
    },
    getRaport: function(id) {
        var self = this;
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetRaportComanda?id=' + id);
    },
    getRaportXLS: function(id) {
        chrome.downloads.download({
            url: app.baseUrl + 'civfiles/GetRaportComandaXLS?id=' + id,
            saveAs: true,
            headers: [{
                name: 'Content-Type',
                value: 'application/json'
            }],
            method: 'GET',
        }, function () {
            w2utils.unlock('#main');
            w2alert('Fiserul a fost descarcat!');
        });
        // var self = this;
        // ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetRaportComanda?id=' + id);
    },
    arhivareCIV: function(id) {
        app.module('appciv').controller.arhivareComanda(id);
    },
    anulareCIV: function(id) {
        app.module('appciv').controller.anulareComanda(id,this.refreshGrid);
    },
    verificRaport: function(id){
        var path = app.baseUrl + 'civfiles/GetRaportVerificareCIV?id=' + id;
        ipc.send('app:request:pdf', [path, function(win) {
            win.on('closed', function() {
                w2confirm({msg:'Finalizati verificarea comenzii?',opt:false,no_class:'btn-red',yes_class:'btn-blue'}).no(function() {
                    win.close(true);
                }).yes(function(){
                  $.post(app.baseUrl + 'vehicule/verificatComanda/' + id,{},function(){
                    w2ui.gridCereri.set(id[0],{depusa:18});
                  });
                  win.close(true);
                });
            });
        }]);
    },
    printRaport: function(id) {
        //
        var civnou = localStorage.getItem('civnou') && localStorage.getItem('civnou')=='true';
        var tipciv = civnou?'N':'V';
        var x= 0;
        var y = 0;
        try{
          var configPrinter = JSON.parse(fs.readFileSync( 'configPrinters.json'));
          var active = _.findWhere(configPrinter,{default:true});
          x = active.x;
          y = -active.y;
        }catch(ex){

        }
        var self = this;
        var reprez = ipc.sendSync('user:request:reprezentanta');
        var path = civnou ? app.civUrl + id+'?org=dot&reprez='+reprez + ' - D.O.T.&x=' + x + '&y=' + y : app.baseUrl + 'civfiles/GetTiparCIVComanda?id=' + id+'&x='+x+'&y='+y;
        ipc.send('app:request:pdf', [path, function(win) {
            win.on('closed', function() {
                w2confirm({msg:'Finalizati tiparirea comenzii?',opt:true,opt_text:'Verificat!',no_class:'btn-red',yes_class:'btn-blue' ,opt_class:'btn-orange'}).yes(function() {
                    $.post(app.baseUrl + 'vehicule/finalizeComanda/' + id + '?tipciv=' + tipciv,{},function(){
                      w2ui.gridCereri.set(id[0],{depusa:19});
                    });
                    win.close(true);
                }).no(function() {
                    win.close(true);
                }).opt(function(){
                  $.post(app.baseUrl + 'vehicule/verificatComanda/' + id,{},function(){
                    w2ui.gridCereri.set(id[0],{depusa:18});
                  });
                  win.close(true);
                });
            });
        }]);
    },
    uploadComplete: function(e, data) {
        var response = data.response; //(data.result);
        w2ui['gridCereri'].unlock();
        switch (response.code) {
            case 1: // comanda ok
                ipc.send('app:notification:show', {
                    type: 'success-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 2: //comanda ok, veh in eroare
            case 3:
                ipc.send('app:notification:show', {
                    type: 'warning-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 4: //comanda not ok
                ipc.send('app:notification:show', {
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 6: //comanda not ok
                ipc.send('app:notification:show', {
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            default:
                ipc.send('app:notification:show', {
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
        }
        if (response.comanda) {
            if (response.isNew) {
                w2ui['gridCereri']('add', response.comanda);
            } else {
                w2ui['gridCereri'].set(response.comanda.id, response.comanda);
                if (w2ui.hasOwnProperty('gridVehicule_' + response.comanda.id)) {
                    w2ui['gridVehicule_' + response.comanda.id].reload();
                }
            }

        }
        //app.module('cerere').trigger('vehicule:load', model.id);
    },
    uploadError: function(e, data) {
        $('#fileupload').fileinput('reset');
        w2ui['gridCereri'].unlock();
        ipc.send('app:notification:show', {
            type: 'error-template',
            text: 'Eroare la transmitere! Verificati fisierul!',
            title: 'Notificare'
        });
    },
    refreshGrid: function(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui['gridCereri'].reload();
        }
    }
});

},{"./../../templates/cereri/index.hts":46}],86:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/plati.hts'),
    className: 'page',
    attributes: function() {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    events: {},
    initialize: function(options) {
        var self = this;
        _.bindAll(this,'refreshGrid');
        this.setPermissions();
    },
    setPermissions:function(){

    },
    onShow: function() {
        var self = this;
        this.renderGrid();
    },
    renderGrid: function() {
        var self = this;
        var dt = new Date();
       
        dt.setDate(1); // going to 1st of the month
        dt.setHours(-1);
        var lDay = dt.getDate().pad();
        var prevMonth = Number((dt.getMonth()+1)).pad();
        var year = dt.getFullYear();

        var fDate = self.fdate = '01.'+ prevMonth +'.'+ year;
        var lDate = self.lDate = lDay + '.' + prevMonth + '.' + year;
        
        
        $('#grid').w2grid({
            name: 'gridPlati',
            url: app.baseUrl + 'comenzi/getPlati',
            method: 'POST', 
            recid: 'id',

            fixedBody: true,
            groupData: ['locatie'],
            show: {
                toolbar: true,
                footer: true,
                rowExpand:true
            },
            toolbar: {

                items: [
                    {
                        type: 'button',
                        disabled: false,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                           self.exportxls();
                        }
                    },
                    {
                        type: 'break'
                    }, 
                    {
                        type: 'button',
                        id: 'btnRaport',
                        caption: w2utils.lang('Raport'),
                        icon: 'w2ui-icon-print',
                        disabled:false,
                        onClick: function(e) {
                            self.printRaport();
                        }
                    }
                ]
            },
            summaryData: {
                gridSummary: [
                     {
                        field: 'locatie',
                        summary: 'count'
                    },
                     {
                        field: 'suma',
                        summary: 'sum'
                    }, {
                        field: 'nrbuc',
                        summary: 'sum'
                    }                   
                ]
            },
            multiSearch: true,
            searches: [
                 {
                    field: 'client',
                    caption: w2utils.lang('Beneficiar'),
                    type: 'text'
                },{
                    field: 'locatie',
                    caption: w2utils.lang('Punct de lucru'),
                    type: 'text'
                }, {
                    field: 'id',
                    caption: w2utils.lang('Nr.Comanda'),
                    type: 'int'
                }, 
                {
                    field: 'data_factura',
                    caption: w2utils.lang('Data factura'),
                    type: 'date'
                }
            ],
            summaryTemplates: [
                 {
                field: 'locatie',
                render: function(record) {
                    return '<b>Total Facturi: ' + record.locatie + ' buc</b>';
                }
            },
               {
                field: 'suma',
                render: function(record) {
                    return '<b>Total Incasari: ' + record.suma + ' Lei</b>';
                }
            }, {
                field: 'nrbuc',
                render: function(record) {
                    return '<b>Total CIV: ' + record.nrbuc + ' buc</b>';
                }
            }],
            searchData : [              
                 {field: "data_factura", type: "date", operator: "between", value: [fDate, lDate]}
            ],
            groupTemplates: [{
                field: 'beneficiar',
                render: function(record) {
                    return '<b >' + record.beneficiar + ' Total(' + record.grpcnt + ')</b>';
                }
            },
             {
                field: 'locatie',
                render: function(record) {
                    return '<b >' + record.locatie + ' Total(' + record.grpcnt + ')</b>';
                }
            },
             {
                field: 'id',
                render: function(record) {
                    return '<b >' + record.id + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'data_factura',
                render: function(record) {
                    return '<b >' + record.data_factura + ' Total(' + record.grpcnt + ')</b>';
                }
            }],
            hasInitialSearchData:true,
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
                    if(sf.type=='date'){
                        if(sf.operator == 'between'){
                            sf.value[0]=w2utils.formatDate(w2utils.isDate(sf.value[0],null,true),'dd.MM.yyyy')
                            sf.value[1]=w2utils.formatDate(w2utils.isDate(sf.value[1],null,true),'dd.MM.yyyy')
                        }else{
                            sf.value=w2utils.formatDate(w2utils.isDate(sf.value,null,true),'dd.MM.yyyy')
                        }
                    }
                }
            },
            columns: [
            {
                field: 'client',
                caption: w2utils.lang('Beneficiar'),
                size: '350px',
                sortable: true
            }, {
                field: 'id',
                caption: w2utils.lang('Nr.Comanda'),
                size: '150px',
                sortable: true
            }, {
                field: 'nr_factura',
                caption: w2utils.lang('Nr factura'),
                size: '220px',
                sortable: true
            },
            {
                field: 'serie_factura',
                caption: w2utils.lang('Serie factura'),
                size: '120px',
                sortable: true
            },
            {
                field: 'data_factura',
                caption: w2utils.lang('Data factura'),
                size: '120px',
                sortable: true
            }, {
                field: 'nrbuc',
                caption: w2utils.lang('Numar bucati'),
                size: '200px',
                sortable: true
            }, {
                field: 'suma',
                caption: w2utils.lang('Suma incasata'),
                size:'200px',
                sortable: true
            },
            {
                field: 'locatie',
                caption: w2utils.lang('Punct de lucru'),
                size: '150px',
                sortable: true
            }

            ],
            postData:{
                summaryData: {
                    gridSummary: [
                        {
                            field: 'suma',
                            summary: 'sum'
                        }, {
                            field: 'nrbuc',
                            summary: 'sum'
                        },
                        {
                        field: 'locatie',
                        summary: 'count'
                    }
                    ]
                },
            },
            enableGrouping: true,
            groupData: ['locatie'],
             parser: function(response) {
                var data = JSON.parse(response);
                var result = {
                    status: 'success',
                    records: data.rows,
                    summary: data.summary || [],
                    total: data.records
                };
                // if (data.summary) {
                //     data.summary[0].summary = true;
                //     result.records.push(data.summary[0]);
                // }
                return result;
            },
        });
        // w2ui['gridPlati'].stateRestore();
    },
    exportxls:function(){
        var grid = w2ui['gridPlati'];
        var post = {
            cmd:'get-xls',
            limit:35000,
            offset:0,
            search:grid.searchData,
            searchLogic:"AND"
        };
        
        // $('#dialog').trigger('click');
        //   $('#dialog').off('change').on('change', function (event) {
            ipc.send('app:request:file',{url:grid.url,method:'POST',data:post,filename:'export.xls'});
        //     $(this).val('');
        //   });
     },
     printRaport:function(id){
        var self = this;
        var grid = w2ui['gridPlati'];
        var post = {
            cmd:'get-xls',
            limit:35000,
            offset:0,
            search:grid.searchData,
            searchLogic:"AND"
        };
        ipc.send('app:request:pdf', [app.baseUrl + 'comenzi/GetRaportPlati?data='+JSON.stringify(post), function(win){}]);
    },
    serialize :function(obj) {
      var str = [];
      for(var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    },
    onBeforeDestroy: function() {
        w2ui['gridPlati'].stateSave();
        w2ui.gridPlati.destroy();
    },   
    refreshGrid: function(error) {
        if(error){
            w2alert(error);
        }
        else{
            w2ui['gridPlati'].reload();
        }
    }
});

},{"./../../templates/cereri/plati.hts":47}],87:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/situatie.hts'),
    className: 'page',
    attributes: function() {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    initialize: function(options) {
        var self = this;
        _.bindAll(this, 'refreshGrid');
        // this.setPermissions();
    },
    onShow: function() {
        this.renderGrid();
    },
    renderGrid: function() {
        var self = this;
        var dt = new Date();

        dt.setDate(1); // going to 1st of the month
        dt.setHours(-1);
        var lDay = dt.getDate().pad();
        var prevMonth = Number((dt.getMonth() + 1)).pad();
        var year = dt.getFullYear();

        var fDate = self.fdate = '01.' + prevMonth + '.' + year;
        var lDate = self.lDate = lDay + '.' + prevMonth + '.' + year;

        $('#grid').w2grid({
            name: 'gridSituatie',
            url: app.baseUrl + 'vehicule/getSituatieVehicule',
            method: 'POST',
            recid: 'id',
            fixedBody: true,
            enableGrouping: true,
            recid: 'vin',
            show: {
                toolbar: true,
                footer: true
            },
            toolbar: {

                items: [{
                        type: 'button',
                        disabled: false,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                            self.exportxls();
                        }
                    },
                    // {
                    //     type: 'break'
                    // },
                    // {
                    //     type: 'button',
                    //     id: 'btnRaport',
                    //     caption: 'Raport',
                    //     icon: 'w2ui-icon-print',
                    //     disabled: false,
                    //     onClick: function(e) {
                    //         self.printRaport();
                    //     }
                    // }
                ]
            },
            summaryData: {
                gridSummary: [{
                    field: 'vin',
                    summary: 'count'
                }]
            },
            groupData: ['ptlucru'],
            multiSearch: true,
            searches: [{
                    field: 'client',
                    caption: w2utils.lang('Beneficiar'),
                    type: 'text'
                },
                {
                    field: 'comanda',
                    caption: w2utils.lang('Nr.Comanda'),
                    type: 'int'
                },
                {
                    field: 'data_tipar',
                    caption: w2utils.lang('Data tipar'),
                    type: 'date'
                },
                {
                    field: 'ptlucru',
                    caption: w2utils.lang('Punct de lucru'),
                    type: 'text'
                }
            ],
            summaryTemplates: [{
                field: 'vin',
                render: function(record) {
                    return '<b>Total CIV-uri: ' + record.vin + '</b>';
                }
            }],
            groupTemplates: [{
                field: 'ptlucru',
                render: function(record) {
                    return '<b >' + record.ptlucru + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'comanda',
                render: function(record) {
                    return '<b >' + record.comanda + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'client',
                render: function(record) {
                    return '<b >' + record.client + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'data_tipar',
                render: function(record) {
                    return '<b >' + record.data_tipar + ' Total(' + record.grpcnt + ')</b>';
                }
            }],
            searchData: [{
                field: "data_tipar",
                type: "date",
                operator: "between",
                value: [fDate, lDate]
            }],
            hasInitialSearchData: true,
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
                    if(sf.type=='date'){
                        if(sf.operator == 'between'){
                            sf.value[0]=w2utils.formatDate(w2utils.isDate(sf.value[0],null,true),'dd.MM.yyyy')
                            sf.value[1]=w2utils.formatDate(w2utils.isDate(sf.value[1],null,true),'dd.MM.yyyy')
                        }else{
                            sf.value=w2utils.formatDate(w2utils.isDate(sf.value,null,true),'dd.MM.yyyy')
                        }
                    }
                }
            },
            columns: [{
                    field: 'client',
                    caption: w2utils.lang('Beneficiar'),
                    size: '350px',
                    sortable: true
                }, {
                    field: 'comanda',
                    caption: w2utils.lang('Nr.Comanda'),
                    size: '150px',
                    sortable: true
                }, {
                    field: 'vin',
                    caption: w2utils.lang('Cod VIN'),
                    size: '220px',
                    sortable: true
                },
                {
                    field: 'serie_civ',
                    caption: w2utils.lang('Serie CIV'),
                    size: '120px',
                    sortable: true
                },
                {
                    field: 'data_tipar',
                    caption: w2utils.lang('Data tipar'),
                    size: '120px',
                    sortable: true
                }, {
                    field: 'ptlucru',
                    caption: w2utils.lang('Punct de lucru'),
                    size: '200px',
                    sortable: true
                }

            ],
            postData: {
                summaryData: {
                    gridSummary: [{
                        field: 'vin',
                        summary: 'count'
                    }]
                },
            },
            // enableGrouping: true,
            // groupData: ['client'],
            parser: function(response) {
                var data = JSON.parse(response);
                var result = {
                    status: 'success',
                    records: data.rows,
                    summary: data.summary || [],
                    total: data.records
                };
                // if (data.summary) {
                //     data.summary[0].summary = true;
                //     result.records.push(data.summary[0]);
                // }
                return result;
            }
        });
        w2ui['gridSituatie'].stateRestore();
    },
    exportxls: function() {
        var grid = w2ui['gridSituatie'];
        var post = {
            cmd: 'get-xls',
            limit: 35000,
            offset: 0,
            search: grid.searchData,
            searchLogic: "AND"
        };

        $('#dialog').trigger('click');
        $('#dialog').off('change').on('change', function(event) {
            ipc.send('app:request:file', {
                url: grid.url,
                method: 'POST',
                data: post,
                filename: $(this).val()
            });
            $(this).val('');
        });
    },
    printRaport: function(id) {
        var self = this;
        var grid = w2ui['gridSituatie'];
        var post = {
            cmd: 'get-xls',
            limit: 35000,
            offset: 0,
            search: grid.searchData,
            searchLogic: "AND"
        };
        ipc.send('app:request:pdf', [app.baseUrl + 'vevicule/GetRaporSituatie?data=' + JSON.stringify(post), function(win) {}]);
    },
    serialize: function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    },
    onBeforeDestroy: function() {
        w2ui['gridSituatie'].stateSave();
        w2ui.gridSituatie.destroy();
    },
    refreshGrid: function(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui['gridSituatie'].reload();
        }
    }
});

},{"./../../templates/cereri/situatie.hts":48}],88:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = window.Marionette.ItemView.extend({
    template: require('./../templates/index.hts'),
    serializeData: function() {
        return {
            img: ipc.sendSync('app:request:path') + 'images/app-civ.gif'
        };
    }
});

},{"./../templates/index.hts":49}],89:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/individuale/anvelopaEditor.hbs'),
    attributes: function() {
        return {
            id: 'anvelopa' + this.cid
        };
    },
    roatafata:undefined,
    roataspate:undefined,
    initialize:function(){
        
    },
    className: 'windowContent w2ui-reset w2ui-form',
    ui: {
        'save': '.save-anvelopa',
        'cancel': '.cancel-anvelopa'
    },
    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'closeView',
        'change #idemspate':'setIdemSpate'
    },
    onShow: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'anvelopaEditor' + self.cid,
            title: 'Editor',
            width: '400px',
            showMin: true,
            showMax: false,
            height: '300px',
            startZ: 1200,
            resizable: false,
            onOpen: function(event) {
                self.setupView();
                event.onComplete = function() {
                    w2panel.setActive('anvelopaEditor' + self.cid);
                };

            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },
    save: function() {
        var self = this;
        app.trigger('app:mentiuni:addanvelope',{model:self.model,roatafata:self.roatafata,roataspate:self.roataspate});
        self.closeView();
        //}
    },
    setupView:function(){
        console.log('here');
        var self = this;
        this.$el.find('#id_roataf').w2field('list',{
            url: app.baseUrl + '/individuale/getAnvelope',
            minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.roatafata = e.item.text;
            }
        });
         this.$el.find('#id_roatas').w2field('list',{
            url: app.baseUrl + '/individuale/getAnvelope',
             minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.roataspate = e.item.text;
            }
        });
         this.$el.find('#id_roataf').parent().find('.w2ui-field-helper').width('300px');
         this.$el.find('#id_roatas').parent().find('.w2ui-field-helper').width('300px');
         $(this.$el).find('.w2ui-field').each(function(i,el){
            var label = $(el).find('label');
            label.text(w2utils.lang(label.text()));
        });
        this.$el.find('.button-translate button').each(function(i,b){
            b.textContent = w2utils.lang(b.textContent)
        });
    },
    setIdemSpate:function(){
        if($('#idemspate').is(':checked')){
            this.roataspate = this.roatafata;
            this.$el.find('#id_roatas').data('selected',this.$el.find('#id_roataf').data('selected')).trigger('change');
        }
    },
    closeView: function(e) {
        this.win.destroy();
        this.destroy();
    }
});

},{"./../../templates/individuale/anvelopaEditor.hbs":50}],90:[function(require,module,exports){
var beneficiari;
var ipc = requireNode('ipc');
EditorView = window.Marionette.ItemView.extend({
    template: require('./../../templates/individuale/editor.hts'),
    attributes: function() {
        return {
            id: 'cerere' + this.cid
        };
    },
    className: 'windowContent w2ui-reset w2ui-form',
    control: undefined,
    events: {
        'click #btnSaveComanda': 'save',
        'click #btnCancelEdit': 'closeView'
    },
    initialize: function() {
        _.bindAll(this, 'closeView');
    },
    bindings: {
        '#daterar_container':{
            observe:'id',
            visible:function(val){
                return val?true:false;
            }
        }
    },
    onShow: function() {
        var self = this;

        if (this.model.id) {
            this.model.fetch().then(function() {
                self.cachedModel = self.model.toJSON();
                self.open();
            });
        } else {
            self.isNew = true;
            self.open();
        }

        

        
    },

    open: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'mailForm' + self.cid,
            title: 'Editor',
            width: '600px',
            showMin: true,
            showMax: true,
            height: '650px',
            resizable: true,
            onOpen: function(event) {
                event.onComplete = self.setupView.bind(self);
            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },

    setupView: function() {
        var self = this;
        this.$el.find('.datepicker').w2field('date');
        if (!ipc.sendSync('user:request:isinrole', [4]) && !this.model.id ) {
            self.$el.find('#id_beneficiar').w2field('list', {
                width: '200px',
                url: app.baseUrl + 'civutils/GetBeneficiari',
                selected: {
                    id: self.model.get('id_beneficiar'),
                    text: self.model.get('societate')
                }
            }).on('change', function() {
                var selected = $('#id_beneficiar').data('selected');
                self.model.set('id_beneficiar', selected.id);
                self.model.set('societate', selected.text);
            });
            self.$el.find('#addBeneficiar').show();
        }else if(!this.model.id){//cerere noua depusa de beneficiar, trebuie sa setam beneficiarul
            var beneficiar = {};
            $.get(app.baseUrl + 'beneficiari/edit/'+app.User.id_beneficiar,null,function(response){
                self.model.set('societate',response.denumire_beneficiar)
                            .set('id_beneficiar',app.User.id_beneficiar);
            });
        }
        self.$el.find('#cod_judet').w2field('list', {
                width: '200px',
                minLength:0,
                url: app.baseUrl + 'individuale/GetJudete',
                selected: {
                    id: self.model.get('cod_judet'),
                    text: self.model.get('judet')
                }
            }).on('change', function() {
                var selected = $('#cod_judet').data('selected');
                self.model.set('cod_judet', selected.id);
                self.model.set('judet', selected.text);
            });
            for (var f in this.model.fields) {
            var field = this.model.fields[f];
            self.bindings[field.el] = field.name;
        }
            self.stickit();
    },
    save: function(event) {
        var self = this,
            options;
        options = {
            success: function(model) {
                model.set('recid', model.id);
                if (self.isNew) {
                    app.trigger('grid:added', {
                        grid: 'gridIndividuale',
                        model: model.toJSON()
                    });
                    if(w2ui.hasOwnProperty('gridIndividuale')) w2ui.gridIndividuale.reload();
                } else {
                    app.trigger('grid:edited', {
                        grid: 'gridIndividuale',
                        model: model.toJSON()
                    });
                }
                self.closeView();
                //success message is handled on app eventhandler
            },
            error: function(model, response) {
                var data, opt = {
                    text: 'Eroare la salvare!',
                    title:'Notificare',
                    type: 'error-template'
                };
                ipc.send('app:notification:show', opt);
                data = eval('(' + response.responseText + ')');
                w2utils.validateRaw(self.$el, data.data);
            }
        };
        if (w2utils.validate(self.model, self.$el)) {
            self.model.save({}, options);
        }

    },

    onBeforeDestroy: function() {
        //if grid page is not opened we go there
        if (!w2ui.hasOwnProperty('gridIndividuale'))
            app.module('appciv').router.navigate('appciv/cereri', {
                trigger: true
            });
    },
    closeView: function(e) {
        this.win.destroy();
    }
});
module.exports = EditorView;

},{"./../../templates/individuale/editor.hts":51}],91:[function(require,module,exports){
var ipc = requireNode('ipc');
var FisierItemView = window.Marionette.ItemView.extend({
    template:require('./../../templates/individuale/fisier.hts'),
    bindings:{
        '[name="nume_fisier"]':'nume_fisier',
        '[name="slot"]':'slot',
        '[name="preview"]':'preview'
    },
    onRender:function(){
        this.stickit();
        this.$el.find('[name="slot"]').on('click',this.executeFileAction.bind(this));
        if(this.model.get('preview') && this.options.editable){
             this.$el.find('[name="delBtn"]').show();
        }else{
            if(this.options.editable){
                this.$el.on('drop',this.executeFileDrop.bind(this));
                window.ondragover = function(e) { e.preventDefault(); return false };
                // NOTE: ondrop events WILL NOT WORK if you do not "preventDefault" in the ondragover event!!
                window.ondrop = function(e) { e.preventDefault(); return false };
            }
        }
        this.$el.find('[name="delBtn"]').on('click',this.executeDeleteFile.bind(this));
        
    },
    executeFileAction:function(){
        var self = this;
        if(!this.model.get('preview')){
            if(this.options.editable){
            var chooser = this.$el.find('[name="fileDialog"]')
            chooser.unbind('change');
            chooser.change(self.doUpload.bind(self,this));

            chooser.trigger('click');
            }
        }else{
            ipc.send('app:request:pdf', [app.baseUrl + '/individuale/getfullfile/'+self.model.get('id'), function (win) {
                // win.on('closed', function () {
                //     w2confirm({
                //         msg: 'Finalizati tiparirea CIV?',
                //         opt: false,
                //         opt_text: 'Verificat!',
                //         no_class: 'btn-red',
                //         yes_class: 'btn-blue',
                //         opt_class: 'btn-orange'
                //     }).yes(function () {
                //         $.post(app.baseUrl + 'individuale/finalizeCIV/' + id+'?tipciv='+tipciv, {}, function (stare) {
                //             self.model.set('stare',stare);
                //         });
                //         win.close(true);
                //     }).no(function () {
                //         win.close(true);
                //     }).opt(function () {
                //         $.post(app.baseUrl + 'individuale/verificatCIV/' + id, {}, function () {
                //             // w2ui.gridCereri.set(id[0], {
                //             //     depusa: 18
                //             // });
                //         });
                //         win.close(true);
                //     });
                // });
            }]);
            // $.ajax({
            //     url:app.baseUrl + '/individuale/getfullfile/'+self.model.get('id'),
            //     success:function(data){
            //         var template;
            //         if(self.model.get('tip_fisier')=== 'application/pdf'){
            //             template = '<div class="centered"><iframe style="display: block;margin-left: auto;margin-right: auto; width:100%; height:100% ;text-align:center" src="data:'+self.model.get('tip_fisier') +';base64,'+data+'"></iframe></div>';
            //         }else{
            //             template = '<div class="centered"><img style="display: block;margin-left: auto;margin-right: auto;" src="data:'+self.model.get('tip_fisier') +';base64,'+data+'"></img></div>'
            //         }
            //         w2popup.open({
            //             title: self.model.get('nume_fisier'),
            //             body: template ,
            //             showMax: true,
            //             width:800,
            //             height:600
            //         });
            //     }
            // });
        }
        // if(!this.model.get('preview')){
        //     
        // }
    },
    doUpload:function(view,event){
        var el = $(event.target);
        var filePath =  el.val();
        if(filePath){
            var file = el[0].files[0];
            var formData = new FormData();

            // add assoc key values, this will be posts values
            formData.append("file", file, file.name);
            formData.append("id_vehicul", this.model.get('id_vehicul'));
            formData.append('slot',this.model.get('slot'));
            formData.append('tip_fisier', file.type);
            console.log(file);

            $.ajax({
                type: "POST",
                url: app.baseUrl + "/individuale/uploadFile/" + view.model.id,
                // xhr: function () {
                //     var myXhr = $.ajaxSettings.xhr();
                //     if (myXhr.upload) {
                //         myXhr.upload.addEventListener('progress', view.progressHandling, false);
                //     }
                //     return myXhr;
                // },
                success: function (data) {
                    view.$el.find('[name="slot"]').attr('src','data:'+file.type+';base64,'+data.preview);
                    view.model.set(data);
                    view.$el.find('[name="delBtn"]').show();
                },
                error: function (error) {
                    // handle error
                },
                async: true,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            });            
        }
    },
    serializeData: function() {
         var slot;
         switch(this.model.get('slot')){
             case 'placuta':
                slot = 'Placuta constructor'
             break;
             case 'vin':
                slot = 'VIN'
             break;
             case 'semiprofil':
                slot = 'Vedere ansamblu'
             break;
             case 'coc':
                slot = 'COC'
             break;
             default:
                slot = 'Imagine suplimentara'
             break;
         }
         return {
             index: this.options.index,
             slotName:slot,
             preview:this.model.get('preview')? 'data:'+this.model.get('tip_fisier')+';base64,'+this.model.get('preview'):''
         };
     },

     executeDeleteFile:function(){
         var self = this;
         if(self.model.get('slot') == 'suplimentar'){
            self.model.destroy();               
        }else{
            $.ajax({
                type:'POST',
                url:app.baseUrl + 'individuale/deleteFile/' + self.model.id,
                success:function(){
                    self.model.unset('preview');
                    self.$el.find('[name="slot"]').attr('src','');
                    self.$el.find('[name="delBtn"]').hide();
                }
            });
        }
     },

     _arrayBufferToBase64:function( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    },

    executeFileDrop:function(e){
        var view = this;
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        if(file.type !== 'application/pdf' && file.type !=='image/jpeg' && file.type !== 'image/png')
         return;
        if(file.path){
            var formData = new FormData();

            // add assoc key values, this will be posts values
            formData.append("file", file, file.name);
            formData.append("id_vehicul", view.model.get('id_vehicul'));
            formData.append('slot',view.model.get('slot'));
            formData.append('tip_fisier', file.type);
            console.log(file);

            $.ajax({
                type: "POST",
                url: app.baseUrl + "/individuale/uploadFile/" + view.model.id,
                // xhr: function () {
                //     var myXhr = $.ajaxSettings.xhr();
                //     if (myXhr.upload) {
                //         myXhr.upload.addEventListener('progress', view.progressHandling, false);
                //     }
                //     return myXhr;
                // },
                success: function (data) {
                    view.$el.find('[name="slot"]').attr('src','data:'+file.type+';base64,'+data.preview);
                    view.model.set(data);
                    view.$el.find('[name="delBtn"]').show();
                },
                error: function (error) {
                    // handle error
                },
                async: true,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            });            
        }
        console.log(file);
        // reader.readAsDataURL(file);

        return false;
    }

});
module.exports = FisierItemView;
},{"./../../templates/individuale/fisier.hts":52}],92:[function(require,module,exports){
 var FisierItemView = require('./fisier'),
     FisereView = window.Marionette.CompositeView.extend({
         className: 'accordion',
         childView: FisierItemView,
         getTemplate: function() {
            var html = '<div></div>';
             return html;
         },
         childViewOptions: function(model) {
             return {
                 index: this.collection.indexOf(model),
                 editable:this.options.editable
             };
         },
         onRender:function(){
             var self = this;
             this.listenTo(app,'vehicul:add:file',function(options){
                self.collection.add({
                    id_vehicul:options.id_vehicul,
                    slot:'suplimentar'
                });
             });
         }
        //  attachHtml: function(collectionView, itemView, index) {
             
        //  }
     });
 module.exports = FisereView;
},{"./fisier":91}],93:[function(require,module,exports){
var ipc = requireNode('ipc');
var fs = requireNode('fs');

module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/individuale/index.hts'),
    className: 'page',
    attributes: function () {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    events: {},
    initialize: function (options) {
        var self = this;
        //this.location = options.location;
        this.gridName = 'gridIndividuale';
        _.bindAll(this, 'refreshGrid');
        this.setPermissions();
    },
    setPermissions: function () {
        this.allowSuper = ipc.sendSync('user:request:isuserinrole', [
            [16, 1], 'appciv'
        ]);
        this.allowDelete = ipc.sendSync('user:request:isuserinrole', [
            [1], 'appciv'
        ]);
        this.allowPrint = ipc.sendSync('user:request:isuserinrole', [
            [1, 15], 'appciv'
        ]);

    },
    onShow: function () {
        var self = this;
        this.renderGrid();
    },
    renderGrid: function () {
        if (w2ui.hasOwnProperty(this.gridName)) {
            w2ui[this.gridName].render($('#grid'));
        } else {
            var self = this;
            $('#grid').w2grid({
                name: self.gridName,
                url: app.baseUrl + 'individuale/getComenzi',
                method: 'POST', // need this to avoid 412 error on Safari
                recid: 'id',
                fixedBody: true,
                show: {
                    toolbar: true,
                    footer: true,
                    toolbarAdd: true,
                    toolbarDelete: self.allowDelete,
                    //toolbarSave: true,
                    //toolbarEdit: true,
                    expandColumn: true
                },
                toolbar: {
                    items: [
                        //{type: 'break'},
                        {
                            type: 'button',
                            id: 'btnEdit',
                            caption: 'Editare',
                            icon: 'w2ui-icon-pencil',
                            onClick: function (event) {
                                app.module('appciv').controller.editIndividuale(w2ui[self.gridName].getSelection());
                            }
                        }, {
                            type: 'break'
                        }, {
                            type: 'button',
                            id: 'btnJurnal',
                            caption: 'Jurnal',
                            icon: 'w2ui-icon-search',
                            onClick: function (e) {
                                self.getJurnal(w2ui[self.gridName].getSelection());
                            }
                        },{
                            type: 'button',
                            id: 'btnPlata',
                            caption: 'Instiintare plata',
                            icon: 'w2ui-icon-money',
                            onClick: function (e) {
                                app.module('appciv').controller.detaliiPlataIndividuale(w2ui[self.gridName].getSelection());
                            }
                        },/* {
                            type: 'button',
                            id: 'btnRaport',
                            caption: 'Raport',
                            icon: 'w2ui-icon-print',
                            disabled: true,
                            onClick: function (e) {
                                self.getRaport(w2ui[self.gridName].getSelection());
                            }
                        }, */{
                            type: 'break'
                        }, {
                            type: 'button',
                            id: 'btnPostComanda',
                            caption: 'Transmite comanda!',
                            icon: 'w2ui-icon-send',
                            onClick: function (e) {
                                w2confirm('Sigur finalizati aceasta comanda?').yes(function (response) {
                                    w2ui[self.gridName].lock();
                                    var id = w2ui[self.gridName].getSelection();
                                    //alert('ok');
                                    app.module('appciv').controller.transmitIndividuale(id, self.refreshGrid);
                                });
                            }
                        },
                        (self.allowPrint ? {
                            type: 'button',
                            id: 'btnPrintCIV',
                            caption: 'Tipar',
                            icon: 'w2ui-icon-print',
                            disabled: true,
                            onClick: function (e) {
                                self.printRaport(w2ui[self.gridName].getSelection());
                            }
                        } : {}),
                        (self.allowPrint ? {
                            type: 'button',
                            id: 'btnArhivareCIV',
                            caption: 'Arhivare',
                            icon: 'w2ui-icon-file',
                            disabled: true,
                            onClick: function (e) {
                                self.arhivareCIV(w2ui[self.gridName].getSelection());
                            }
                        } : {}),
                        (self.allowSuper ? {
                            type: 'button',
                            id: 'btnAnulareCIV',
                            caption: 'Anulare',
                            icon: 'w2ui-icon-ban',
                            disabled: true,
                            onClick: function (e) {
                                self.anulareCIV(w2ui[self.gridName].getSelection());
                            }
                        } : {})
                    ]
                },
                onDblClick: function (event) {
                    var record = w2ui[self.gridName].get(event.recid);
                    if (record.depusa < 10) {
                        app.module('appciv').controller.editIndividuale(event.recid);
                    }
                },
                multiSearch: true,
                searches: [{
                    field: 'id',
                    caption: 'Nr.Comanda ',
                    type: 'text'
                }, {
                    field: 'data_comanda',
                    caption: 'Data',
                    type: 'date'
                }, {
                    field: 'nr_inreg_soc',
                    caption: 'Nr client',
                    type: 'text'
                }, {
                    field: 'data_inreg',
                    caption: 'Data client',
                    type: 'date'
                }, {
                    field: 'societate',
                    caption: 'Beneficiar',
                    type: 'text'
                }, {
                    field: 'stare_comanda',
                    caption: 'Stare',
                    type: 'list',
                    options: {
                        items: ['Finalizata', 'In lucru', 'Prelucrata', 'Depusa']
                    }
                }, {
                    field: 'vin',
                    caption: 'V.I.N.',
                    type: 'text'
                }, {
                    field: 'serie_civ',
                    caption: 'Serie CIV',
                    type: 'text'
                }, {
                    field: 'nr_registru',
                    caption: 'Nr registru',
                    type: 'text'
                },{
                    field: 'cod_judet',
                    caption: 'Reprezentanta',
                    type: 'text'
                    //hidden:!self.allowSuper
                }],
                onSearch: function (event) {
                    for (var i in event.searchData) {
                        var sf = event.searchData[i];
                        // sf['oper'] = sf['operator'];
                        // delete sf['operator'];
                        if (sf.field === 'stare_comanda') {
                            sf.field = 'depusa';
                            switch (sf.value) {
                                case 'In lucru':
                                    sf.value = '(0,1,2,3,4)';
                                    break;
                                case 'Finalizata':
                                    sf.value = '15';
                                    break;
                                case 'Depusa':
                                    sf.value = '(10,11,12,15)';
                                    break;
                                case 'Prelucrata':
                                    sf.value = '11';
                                    break;
                                default:
                                    break;
                            }
                            sf.operator = 'isin';
                        }
                    }

                },
                columns: [{
                        field: 'id',
                        caption: 'Nr.Comanda',
                        size: '150px',
                        sortable: true
                    }, {
                        field: 'data_comanda',
                        caption: 'Data',
                        size: '220px',
                        sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_comanda).format('DD.MM.YYYY');
                        //                        }
                    }, {
                        field: 'data_transmitere',
                        caption: 'Data transmitere',
                        size: '220px',
                        sortable: true
                    }, {
                        field: 'nr_inreg_soc',
                        caption: 'Nr client',
                        size: '100px',
                        sortable: true
                    }, {
                        field: 'societate',
                        caption: 'Beneficiar',
                        size: '30%',
                        sortable: true
                    }, {
                        field: 'data_inreg',
                        caption: 'Data client',
                        size: '120px',
                        sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_inreg).format('DD.MM.YYYY');
                        //                        }
                    }, {
                        field: 'stare_plata',
                        caption: 'Stare plata',
                        size: '150px',
                        sortable: true,
                        render: function (record) {
                            switch (record.stare_plata) {
                                case 1:
                                    return '<b style="color:green">ACHITAT</b>';
                                case 2:
                                    return '<b style="color:red">NEACHITAT</b>';
                                case 5:
                                    return '<b style="color:blue">FACTURAT-NEINCASAT</b>';
                                default:
                                    return '<b>NEPRELUCRAT</b>';
                            }
                        }
                    }, {
                        field: 'stare_comanda',
                        caption: 'Stare',
                        size: '25%',
                        sortable: true,
                        render: function (record) {
                            var cls = '',
                                stare = '';
                            switch (record.depusa) {
                                case 0:
                                case 90:
                                    cls = 'label label-default';
                                    stare = 'Adaugati vehicule';
                                    break;
                                case 1:
                                case 91:
                                    stare = 'In lucru - OK';
                                    cls = 'label label-primary';
                                    break;
                                case 2:
                                case 92:
                                case 3:
                                case 93:
                                    stare = 'In lucru - Vehicule invalide';
                                    cls = 'label label-warning';
                                    break;
                                case 4:
                                case 94:
                                    stare = 'In lucru - Vehicule invalide';
                                    cls = 'label label-danger';
                                    break;
                                case 55:
                                case 5:
                                    stare = 'In curs de transmitere';
                                    cls = 'label label-waiting';
                                    break;
                                case 10:
                                    stare = 'Depusa - asteapta prelucrare';
                                    cls = 'label label-waiting';
                                    break;
                                case 11:
                                    stare = 'Prelucrata - OK';
                                    cls = 'label label-ready';
                                    break;
                                case 18:
                                    stare = '<b style="color:green">Verificat - OK</b>';
                                    cls = 'label label-checked';
                                    break;
                                case 19:
                                    stare = '<b style="color:green">Tiparit</b>';
                                    cls = 'label label-ready';
                                    break;
                                case 12:
                                    stare = 'In prelucrare';
                                    cls = 'label label-waiting';
                                    break;
                                case 9:
                                    stare = 'In eroare - vehicule netransmise';
                                    cls = 'label label-warning';
                                    break;
                                case 15:
                                    stare = 'Finalizata';
                                    cls = 'label label-success';
                                    break;

                            }
                            return '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="' + cls + '">&nbsp;&nbsp;&nbsp;</label>';

                        }
                    }, {
                        field: 'countvehicule',
                        caption: 'Nr. Vehicule',
                        size: '100px',
                        sortable: true
                    },{
                    field: 'cod_judet',
                    caption: 'Reprezentanta',
                    type: 'text',
                    size:'120px',
                    hidden:!self.allowSuper,
                    sortable:true
                }

                ],
                parser: function (responseText) {
                    var data = $.parseJSON(responseText);
                    // do other things
                    return {
                        status: 'success',
                        total: data.records,
                        records: data.rows
                    };
                },
                onAdd: function (event) {
                    app.module('appciv').controller.editIndividuale();
                },
                onSelect: function (e) {
                    e.onComplete = function () {
                        var record = w2ui[self.gridName].get(e.recid);
                        if (record.stare_plata === 2) {
                            w2ui[self.gridName].toolbar.enable('btnPlata');
                        }
                        if (record.depusa !== 0) {
                            w2ui[self.gridName].toolbar.enable('btnJurnal');
                        }
                        if (record.depusa === 15 && record.stare_plata === 1) {
                            w2ui[self.gridName].toolbar.enable('btnArhivareCIV');
                        }
                        // if (record.depusa === 15) {
                        //     w2ui[self.gridName].toolbar.enable('btnRaport');
                        // }
                        if (record.depusa == 11) {
                            w2ui[self.gridName].toolbar.enable('btnPrintCIV');
                            w2ui[self.gridName].toolbar.enable('btnAnulareCIV');

                        }
                        if (record.depusa == 18) {
                            w2ui[self.gridName].toolbar.disable('btnAnulareCIV');
                            w2ui[self.gridName].toolbar.enable('btnPrintCIV');
                        }
                        if (record.depusa == 19) {
                            w2ui[self.gridName].toolbar.disable('btnAnulareCIV');
                            w2ui[self.gridName].toolbar.disable('btnPrintCIV');
                            w2ui[self.gridName].toolbar.enable('btnArhivareCIV');
                        }
                        if (record.depusa == 11 || record.depusa === 15) {
                            w2ui[self.gridName].toolbar.enable('btnArhivareCIV');
                        }
                        //comanda nu este depusa, putem face unele actiuni
                        if (record.depusa < 10 || (record.depusa >30 && record.depusa < 100)) {
                            w2ui[self.gridName].toolbar.enable('btnEdit');
                            w2ui[self.gridName].toolbar.enable('w2ui-delete');
                            // w2ui[self.gridName].toolbar.enable('btnUpload');
                            // w2ui[self.gridName].toolbar.enable('btnExcel');
                        } else {
                            w2ui[self.gridName].toolbar.disable('btnEdit');
                            w2ui[self.gridName].toolbar.disable('w2ui-delete');
                        }
                        if (record.depusa === 1 || record.depusa === 91) {
                            w2ui[self.gridName].toolbar.enable('btnPostComanda');
                        }
                    };
                },
                onLoad: self.disableGridButtons.bind(self),
                onUnselect: self.disableGridButtons.bind(self),
                onCollapse: function (event) {
                    if (w2ui.hasOwnProperty('gridVehiculeIndividuale_' + event.recid)) {
                        w2ui['gridVehiculeIndividuale_' + event.recid].destroy();
                    }
                },
                onExpand: function (event) {
                    if (w2ui.hasOwnProperty('gridVehiculeIndividuale_' + event.recid)) {
                        w2ui['gridVehiculeIndividuale_' + event.recid].destroy();
                    }
                    $('#' + event.box_id).css({
                        margin: '0px',
                        padding: '0px',
                        width: '100%'
                    }).animate({
                        height: '505px'
                    }, {
                        duration: 10,
                        complete: function () {
                            var record = w2ui[self.gridName].get(event.recid);
                            app.module('appciv').controller.listVehiculeIndividuale(event.box_id, {
                                pid: event.recid,
                                canadd: record.depusa < 10 || (record.depusa >= 90 && record.depusa <= 93),
                                totalVehicule: record.countvehicule
                            });
                            w2ui.layout.resize();
                        }
                    });
                },
                onRender: function (event) {
                    event.onComplete = function () {
                        //                        onRender: function () {

                        //                        },
                    };
                },
                // onLoad: function (event) {
                //     event.onComplete = function () {
                //         if (!self.refreshInterval) {
                //             self.refreshInterval = setInterval(function () {
                //                 $.ajax({
                //                     url: app.baseUrl + 'civutils/getStareComenzi',
                //                     type: 'GET',
                //                     success: function (data) {
                //                         data.response.map(function (stare) {
                //                             w2ui[self.gridName].set(stare.id, {
                //                                 depusa: stare.depusa,
                //                                 countvehicule: stare.countvehicule,
                //                                 stare_plata: stare.stare_plata
                //                             });
                //                         });
                //                     },
                //                     error: function () {
                //                         clearInterval(self.refreshInterval);
                //                     }
                //                 });
                //             }, 60000);
                //         }
                //     };
                // }
            });
            this.disableGridButtons();
        }

    },
    disableGridButtons: function() {
        w2ui[this.gridName].toolbar.disable('btnPlata');
        w2ui[this.gridName].toolbar.disable('btnEdit');
        w2ui[this.gridName].toolbar.disable('w2ui-delete');
        // w2ui[this.gridName].toolbar.disable('btnUpload');
        w2ui[this.gridName].toolbar.disable('btnJurnal');
        w2ui[this.gridName].toolbar.disable('btnRaport');
        w2ui[this.gridName].toolbar.disable('btnPrintCIV');
        w2ui[this.gridName].toolbar.disable('btnArhivareCIV');
        // w2ui[this.gridName].toolbar.disable('btnExcel');
        w2ui[this.gridName].toolbar.disable('btnPostComanda');
        w2ui[this.gridName].toolbar.disable('btnAnulareCIV');
    },
    refreshGrid: function(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui[this.gridName].reload();
        }
    },
    onBeforeDestroy: function() {
        // for (var i in w2ui[this.gridName].records) {
        //     var recid = w2ui[this.gridName].records[i].recid;
        //     if (w2ui.hasOwnProperty('gridVehiculeIndividuale_' + recid)) {
        //         w2ui['gridVehiculeIndividuale_' + recid].destroy();
        //     }
        // }
        // w2ui[this.gridName].destroy();
    },
    printRaport: function(id) {
        var civnou = localStorage.getItem('civnou') && localStorage.getItem('civnou')=='true';
        var tipciv = civnou?'N':'V';
        //
        var x= 0;
        var y = 0;
        try{
          var configPrinter = JSON.parse(fs.readFileSync( 'configPrinters.json'));
          var active = _.findWhere(configPrinter,{default:true});
          x = active.x;
          y = -active.y;
        }catch(ex){

        }
        var self = this;
        var reprez = ipc.sendSync('user:request:reprezentanta');
        var path = civnou?app.civUrl + id + '?org=dot&reprez='+reprez + '&x=' + x + '&y=' + y:app.baseUrl + 'individuale/GetTiparCIVComanda?id=' + id+'&x='+x+'&y='+y;
        //civ nou http://10.2.2.84/restservice/api/printciv/1234?org=dot 
        ipc.send('app:request:pdf', [path, function(win) {
            win.on('closed', function() {
                w2confirm({msg:'Finalizati tiparirea comenzii?',no_class:'btn-red',yes_class:'btn-blue' ,opt_class:'btn-orange'}).yes(function() {
                    $.post(app.baseUrl + 'individuale/finalizeComanda/' + id + '?tipciv='+tipciv,{},function(){
                      w2ui[self.gridName].set(id[0],{depusa:19});
                    });
                    win.close(true);
                }).no(function() {
                    win.close(true);
                });
            });
        }]);
    },
    arhivareCIV: function(id) {
        app.module('appciv').controller.arhivareComandaIndividuale(id);
    },
});
},{"./../../templates/individuale/index.hts":53}],94:[function(require,module,exports){
var MentiuneItemView = window.Marionette.ItemView.extend({
    template:require('./../../templates/individuale/mentiune.hts'),
    events:{
        'click [name="delMentiune"]':'delMentiune',
        'click [name="anvMentiune"]':'anvMentiune'
    },
    bindings:{
        '[name="text"]':'text'
    },
    onRender:function(){
        this.model.set('nr_rand',this.options.index);
        this.stickit();
    },
    delMentiune:function(){
        this.model.set('EntityState',2);
        app.trigger('vehicul:remove:mentiune',this.model);
    },
    anvMentiune:function(){
        app.trigger('vehicul:add:anvelopa',this.model);
    }
});
module.exports = MentiuneItemView;
},{"./../../templates/individuale/mentiune.hts":54}],95:[function(require,module,exports){
    var AnvelopaEditor = require('./anvelopeEditor');
      var MentiuneItemView = require('./mentiune'),
     MentiuniView = window.Marionette.CompositeView.extend({
         className: 'accordion',
         childView: MentiuneItemView,
         getTemplate: function() {
            var html = '<div></div>';
             return html;
         },
         childViewOptions: function(model) {
             return {
                 index: this.collection.indexOf(model),
                 editable:this.options.editable
             };
         },
         onRender:function(){
             var self = this;
             if(this.options.editable){
               self.setViewEditable();
             }else{
                 this.listenTo(app,'vehicul:set:editable',function(options){
                    self.setViewEditable();
                    self.options.editable = true;
                });
             }
         },
         attachHtml: function(collectionView, itemView, index) {
             if(itemView.model.get('EntityState') != 2){
                 collectionView.$el.append(itemView.render().el);
             }
         },
         setViewEditable:function(){
             var self = this;
              this.listenTo(app,'vehicul:add:mentiune',function(options){
                    self.collection.add({
                        nr_identif:options.vin,
                        id_vehicul:options.id_vehicul,
                        EntityState:0
                    });
                });
                this.listenTo(app,'vehicul:remove:mentiune',function(model){
                    if (!model.id) {
                        this.collection.remove(model);
                    } else {
                        this.collection.trigger('remove', model);
                    }
                });
                
                 this.listenTo(app,'vehicul:add:anvelopa',function(options){
                    var view = new AnvelopaEditor({model:options});
                    app.modal.show(view, {
                        preventDestroy: true
                    });
                    // self.collection.add({
                    //     nr_identif:options.vin,
                    //     id_vehicul:options.id_vehicul,
                    //     EntityState:0
                    // });
                });
                this.listenTo(app,'app:mentiuni:addanvelope',function(opt){
                    if(opt.roatafata == opt.roataspate){
                        opt.model.set('text','Anv. Opt. ' + opt.roatafata);
                    }else{
                         opt.model.set('text','Anv. Opt. ' + opt.roatafata + '(fata) +');
                         self.collection.add({
                            nr_identif:opt.model.get('vin'),
                            id_vehicul:opt.model.get('id_vehicul'),
                            text: opt.roataspate + '(spate)',
                            EntityState:0
                        });
                    }
                });
         }
     });
 module.exports = MentiuniView;
},{"./anvelopeEditor":89,"./mentiune":94}],96:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = window.Marionette.CompositeView.extend({
    template: require('./../../templates/individuale/vehicule.hts'),
    className: 'page',
    initialize: function (options) {
        var self = this;
        self.caption = 'Lista vehicule operator';
    },
    onRender: function () {
        var self = this;
        self.setPermissions();
    },
    setPermissions: function () {
        this.isOperator = ipc.sendSync('user:request:isuserinrole', [[18], 'appciv']);
    },
    onShow: function () {
        var self = this;
        this.renderGrid();
    },
    renderGrid: function () {
        var self = this;
        if (w2ui.hasOwnProperty('gridVehiculeOperator')) {
            w2ui['gridVehiculeOperator'].render(self.$el);
        } else {
            self.$el.w2grid({
                name: 'gridVehiculeOperator',
                url: app.baseUrl + 'individuale/getvehiculeOperator/',
                method: 'POST', // need this to avoid 412 error on Safari
                recid: 'id',
                show: {
                    toolbar: true,
                    footer: true,
                },
                columns: [{
                    field: 'id',
                    caption: 'ID',
                    sortable: true,
                    hidden: true,
                    size: '1px'
                }, {
                    field: 'nr_registru',
                    caption: 'Nr. Omologare',
                    sortable: true,
                    size: '25%'
                }, {
                    field: 'vin',
                    caption: 'VIN',
                    sortable: true,
                    size: '25%'
                }, {
                    field: 'wvta',
                    caption: 'WVTA',
                    sortable: true,
                    size: '25%'
                }, {
                    field: 'motiv_respingere',
                    caption: 'Stare In Clar',
                    sortable: true,
                    size: '25%',
                    hidden: true,
                    searchable: false
                }, {
                    field: 'stare',
                    caption: 'Status',
                    sortable: true,
                    size: '25%',
                    render: function (record) {
                        var cls = 'default',
                            stare = record.motiv_respingere;
                        switch (record.stare) {
                            case 0:
                                stare = 'OK';
                                cls = 'label-default';
                                break;
                            case 1:
                                stare = 'OK';
                                cls = 'label-primary';
                                break;
                            case 2:
                                stare = 'Date eronate';
                                cls = 'label-warning';
                                break;
                            case 3:
                            case 19:
                                stare = 'Tiparit';
                                cls = 'label-danger';
                                break;
                            case 10:
                            case 55:
                                stare = 'Transmis';
                                cls = 'label-waiting';
                                break;
                            case 11:
                                stare = 'Prelucrat OK';
                                cls = 'label-ready';
                                break;
                            case 12:
                                stare = 'Prelucrat OK';
                                cls = 'label-ready';
                                break;
                            case 18:
                                stare = 'Verificat';
                                cls = 'label-danger';
                                break;
                            case 15:
                                stare = 'Tiparit';
                                cls = 'label-success';
                                break;
                            default:
                                break;
                        }
                        var html = '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="label ' + cls + '">&nbsp;&nbsp;&nbsp;</label>';
                        return html;
                    }
                }],
                toolbar: {
                    items: [{
                        type: 'button',
                        id: 'btnEditVehicul',
                        caption: 'Detalii',
                        icon: 'w2ui-icon-pencil',
                        disabled: true,
                        onClick: function (event) {
                            var id = w2ui['gridVehiculeOperator'].getSelection();
                            self.destroy();
                            app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
                        }
                    }]
                },
                searches: [{
                    field: 'vin',
                    caption: 'V.I.N. ',
                    type: 'text'
                }],
                parser: function (responseText) {
                    var data = $.parseJSON(responseText);
                    // do other things
                    return {
                        status: 'success',
                        total: data.records,
                        records: data.rows
                    };
                },
                onSelect: function (event) {
                    this.toolbar.enable('btnEditVehicul');
                },
                onUnselect: function () {
                    this.toolbar.disable('btnEditVehicul');
                },
                onDestroy: function () {
                    self.destroy();
                }
            });
        }
    },

    refreshGrid: function () {
        w2ui['gridVehiculeIndividuale_' + this.parentID].reload();
    }
});

},{"./../../templates/individuale/vehicule.hts":56}],97:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/situatie.hts'),
    className: 'page',
    attributes: function() {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    initialize: function(options) {
        var self = this;
        _.bindAll(this, 'refreshGrid');
        // this.setPermissions();
    },
    onShow: function() {
        this.renderGrid();
    },
    renderGrid: function() {
        var self = this;
        var dt = new Date();

        dt.setDate(1); // going to 1st of the month
        dt.setHours(-1);
        var lDay = dt.getDate().pad();
        var prevMonth = Number((dt.getMonth() + 1)).pad();
        var year = dt.getFullYear();

        var fDate = self.fdate = '01.' + prevMonth + '.' + year;
        var lDate = self.lDate = lDay + '.' + prevMonth + '.' + year;

        $('#grid').w2grid({
            name: 'gridSituatie',
            url: app.baseUrl + 'individuale/getSituatieVehicule',
            method: 'POST',
            recid: 'id',
            fixedBody: true,
            enableGrouping: true,
            recid: 'vin',
            show: {
                toolbar: true,
                footer: true
            },
            toolbar: {

                items: [{
                        type: 'button',
                        disabled: false,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                            self.exportxls();
                        }
                    },
                    // {
                    //     type: 'break'
                    // },
                    // {
                    //     type: 'button',
                    //     id: 'btnRaport',
                    //     caption: 'Raport',
                    //     icon: 'w2ui-icon-print',
                    //     disabled: false,
                    //     onClick: function(e) {
                    //         self.printRaport();
                    //     }
                    // }
                ]
            },
            summaryData: {
                gridSummary: [{
                    field: 'vin',
                    summary: 'count'
                }]
            },
            groupData: ['user_displayname'],
            multiSearch: true,
            searches: [{
                    field: 'client',
                    caption: 'Beneficiar',
                    type: 'text'
                },
                {
                    field: 'comanda',
                    caption: 'Nr.Comanda ',
                    type: 'int'
                },
                {
                    field: 'data_tipar',
                    caption: 'Data tipar',
                    type: 'date'
                },
                {
                    field: 'user_displayname',
                    caption: 'Expert DOI',
                    type: 'text'
                },
                {
                    field: 'user_operator',
                    caption: 'Operator',
                    type: 'text'
                }
            ],
            summaryTemplates: [{
                field: 'vin',
                render: function(record) {
                    return '<b>Total CIV-uri: ' + record.vin + '</b>';
                }
            }],
            groupTemplates: [{
                field: 'user_displayname',
                render: function(record) {
                    return '<b >' + record.user_displayname + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'user_operator',
                render: function(record) {
                    return '<b >' + record.user_operator + ' Total(' + record.grpcnt + ')</b>';
                }
            },{
                field: 'comanda',
                render: function(record) {
                    return '<b >' + record.comanda + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'client',
                render: function(record) {
                    return '<b >' + record.client + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'data_tipar',
                render: function(record) {
                    return '<b >' + record.data_tipar + ' Total(' + record.grpcnt + ')</b>';
                }
            }],
            searchData: [{
                field: "data_tipar",
                type: "date",
                operator: "between",
                value: [fDate, lDate]
            }],
            hasInitialSearchData: true,
            onSearch: function(event) {},
            columns: [{
                    field: 'client',
                    caption: 'Beneficiar',
                    size: '350px',
                    sortable: true
                }, {
                    field: 'comanda',
                    caption: 'Nr.Comanda',
                    size: '150px',
                    sortable: true
                }, {
                    field: 'vin',
                    caption: 'Cod VIN',
                    size: '220px',
                    sortable: true
                },
                {
                    field: 'serie_civ',
                    caption: 'Serie CIV',
                    size: '120px',
                    sortable: true
                },
                {
                    field: 'data_tipar',
                    caption: 'Data tipar',
                    size: '120px',
                    sortable: true
                }, {
                    field: 'user_displayname',
                    caption: 'Expert DOI',
                    size: '200px',
                    sortable: true
                },{
                    field: 'user_operator',
                    caption: 'Operator',
                    size: '200px',
                    sortable: true
                },
                 {
                    field: 'nr_crt',
                    caption: 'Numar registru',
                    size: '200px',
                    sortable: true
                },
                 {
                    field: 'factura',
                    caption: 'Factura',
                    size: '200px',
                    sortable: true
                }
            ],
            postData: {
                summaryData: {
                    gridSummary: [{
                        field: 'vin',
                        summary: 'count'
                    }]
                },
            },
            // enableGrouping: true,
            // groupData: ['client'],
            parser: function(response) {
                var data = JSON.parse(response);
                var result = {
                    status: 'success',
                    records: data.rows,
                    summary: data.summary || [],
                    total: data.records
                };
                // if (data.summary) {
                //     data.summary[0].summary = true;
                //     result.records.push(data.summary[0]);
                // }
                return result;
            },
        });
        w2ui['gridSituatie'].stateRestore();
    },
    exportxls: function() {
        var grid = w2ui['gridSituatie'];
        var post = {
            cmd: 'get-xls',
            limit: 35000,
            offset: 0,
            search: grid.searchData,
            searchLogic: "AND"
        };

        //$('#dialog').trigger('click');
        //$('#dialog').off('change').on('change', function(event) {
            ipc.send('app:request:file', {
                url: grid.url,
                method: 'POST',
                data: post,
                filename: ''
            });
         //   $(this).val('');
       // });
    },
    printRaport: function(id) {
        var self = this;
        var grid = w2ui['gridSituatie'];
        var post = {
            cmd: 'get-xls',
            limit: 35000,
            offset: 0,
            search: grid.searchData,
            searchLogic: "AND"
        };
        ipc.send('app:request:pdf', [app.baseUrl + 'individuale/GetRaporSituatie?data=' + JSON.stringify(post), function(win) {}]);
    },
    serialize: function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    },
    onBeforeDestroy: function() {
        w2ui['gridSituatie'].stateSave();
        w2ui.gridSituatie.destroy();
    },
    refreshGrid: function(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui['gridSituatie'].reload();
        }
    }
});

},{"./../../templates/cereri/situatie.hts":48}],98:[function(require,module,exports){
var ipc = requireNode('ipc');
var fs = requireNode('fs');
var Globals = require('./../../globals');
var root, vehicul,
    EditView = window.Marionette.FormView.extend({
        className: 'page',
        /**
         * view related properties
         * @type {Object}
         */
        ui: {
            'save': '#btnSaveVehicul',
            'copy': '#btnCopyVehicul',
            'info': '#btnVehiculComplet',
            'back': '#btnBack',
            'newwin': '#btnNewWindow',
            'firstIndex': '#btnFirst',
            'lastIndex': '#btnLast',
            'nextIndex': '#btnNext',
            'prevIndex': '#btnPrev',
            'addFile': '#btnAddFile',
            'addMentiune': '#btnAddMentiune',
            'arhivare' : '#btnArhivare',
            'send' : '#btnSendVehicul',
            'fisa' : '#btnFisaVehicul',
            'unlock':'#btnUnlock'
        },
        /**
         * ui event handlers
         * @type {Object}
         */
        events: {
            'click @ui.save': 'save',
            'click @ui.copy': 'copy',
            'click @ui.back': 'back',
            'click @ui.info': 'info',
            'click @ui.newwin': 'anulare',
            'click @ui.firstIndex': 'gotofirst',
            'click @ui.lastIndex': 'gotolast',
            'click @ui.nextIndex': 'gotonext',
            'click @ui.prevIndex': 'gotoprev',
            'click @ui.addFile': 'addFile',
            'click @ui.addMentiune': 'addMentiune',
            'click @ui.arhivare' : 'arhivare',
            'click @ui.send' : 'transmite',
            'click @ui.unlock' : 'unlock',
            'click @ui.fisa' : 'fisa'
        },
        /**
         * model event handlers
         * @type {Object}
         */
        modelEvents: {
            'change:wvta':'validateWVTA',
            'change:extensie':'extensieChanged',
            'change:versiune':'prepareData',
            'change:cod_motor':'motorChanged',
            'change:id_tvv':'reload'
        },
        /**
         * model link to controls
         * @type {Object}
         */
        bindingsOverrides: {
            'input:not("#nr_registru"),textarea:not("#motiv_respingere")': {
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) && value != 1) || value == 19 || value == 12 || value == 15 || value == 11;
                    },
                    onSet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) && value != 1) || value == 19 || value == 12 || value == 15 || value == 11;
                    }
                }]
            },
            //disable copy button for new records
            '#btnCopyVehicul': {
                attributes: [{
                    name: 'disabled',
                    observe: '[id,stare]',
                    onGet: function (value,status) {
                        return !value && status < 10;
                    }
                }]
            },
            //disable info button for new records
            '#btnVehiculComplet': {
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4], 'appciv'
                        ]) || value <= 10) || value > 12 ;
                    }
                }]
            },
            '#btnArhivare,#btnFisaVehicul':{
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4], 'appciv'
                        ]) || value < 15);
                    }
                }]
            },
            '#nr_registru': {
                observe: 'nr_registru',
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value > 10;
                    }
                }],
                onSet:function(val){
                    return val.toUpperCase();
                }
            },
            '#motiv_respingere': {
                observe: 'motiv_respingere',
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value > 10;
                    }
                }]
            },
            '.mentiuni': {
                attributes: [{
                    name: 'disabled',
                    observe: 'id',
                    onGet: function (value) {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]);
                    }
                }]
            },
            '#btnAddMentiune,#btnVehiculComplet,#btnArhivare,#btnNewWindow,#btnUnlock': {
                visible: function () {
                    return !ipc.sendSync('user:request:isuserinrole', [
                        [4,18], 'appciv'
                    ]);
                }
            },
            '#btnVehiculComplet,#btnArhivare':{
                visible: function () {
                    return !ipc.sendSync('user:request:isuserinrole', [
                        [4], 'appciv'
                    ]);
                }
            },
            '#btnNewWindow,#btnUnlock':{
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value >= 15) ;
                    }
                }]
            },
            '#btnSendVehicul':{
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (!ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value != 1) ;
                    }
                }]
            },
            '#btnAddFile': {
                observe: 'stare',
                visible: function (value) {
                    return value == 1 || (value == 10 && !ipc.sendSync('user:request:isuserinrole', [
                        [4,18], 'appciv'
                    ]));
                }
            },
            '#btnSaveVehicul,#btnCopyVehicul': {
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (value > 10 && ipc.sendSync('user:request:isuserinrole', [
                            [15, 1], 'appciv'
                        ])) || (value >= 10 && ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]));
                    },
                    onSet: function (value) {
                        return (value > 10 && ipc.sendSync('user:request:isuserinrole', [
                            [15, 1], 'appciv'
                        ])) || (value >= 10 && ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]));
                    }
                }]
            }
        },

        // <Constants>
        template: require('./../../templates/individuale/vehicul1.hbs'),
        initialize: function () {
            var self = this;
            _.bindAll(this, 'renderanvelope');
            this.setPermissions();
            //property - holds window state(inline or dialog)
            this.isDialog = false;
            root = app.baseUrl;
            //cache module controller for convenience
            vehicul = app.module('appciv').controller;
            //set view type
            this.setViewType();
        },
        setPermissions: function () {
            this.isOperator = ipc.sendSync('user:request:isuserinrole', [[18], 'appciv']);
            this.isClient = ipc.sendSync('user:request:isuserinrole', [[4], 'appciv']);
            this.isAdmin = ipc.sendSync('user:request:isuserinrole', [[1], 'appciv']);
        },
        /**
         * set view type -is copy or fresh record
         */
        setViewType: function () {
            var isCopy = this.model.get('isCopy');
            if (!this.model.id) {
                if (!isCopy) {
                    this.isNew = true;
                }
            }
        },
        /**
         * on view attachet to DOM
         * @return {[type]} [description]
         */
        onShow: function () {
            //atriutele si mentiunile se vor afisa la schimbarea/alegerea extensiei in cazul
            //vehiculului nou
            var pstyle = 'border: 1px solid #dfdfdf; padding: 10px;';
            //build layout
            if (!w2ui.hasOwnProperty('layoutVehicul')) {
                $('#vehiculTemplate').w2layout({
                    name: 'layoutVehicul',
                    panels: [{
                            type: 'left',
                            size: '50%',
                            style: pstyle,
                            title: 'Date principale',
                            resizable: true,
                            content: $('#date_principale').html()
                        }, {
                            type: 'main',
                            size: '50%',
                            title: 'Fisiere atasate',
                            style: pstyle,
                            content: $('#date_tehnice').html()
                        }, {
                            type: 'bottom',
                            size: 60,
                            style: pstyle,
                            content: $('#buttons_container').html()
                        }

                    ]
                });
            }
            //set dropdowns for controls that suport it
            this.setupView();
            // cache original mentiuni
            this.existing = this.model.get('Mentiuni').toJSON()
            //if record is in update state we enable buttons and render child records and "mentiuni" property
            if (!this.model.isNew()) {
                this.renderfiles();
                this.renderMentiuni();
                if(!this.isClient){
                    this.renderatributes();
                    vehicul.loadListeAnvelope(this.model, this.renderanvelope);
                }
                // this.renderanvelope();
            }

            // if(this.model.get('nr_registru')){
            //     $('#btnAddFile,#btnAddMentiune').hide();
            //     $('input,textarea').attr('disabled','disabled');
            // }

            if (this.model.id) {
                console.log(this.options);
                this.relatedVehicles = this.options.relatedVehicles;
                this.prepareFormNavigation();
            }
            if(this.isOperator){
                $('#supervize_container').hide();
            }
        },

        /**
         * Prepare prev next navigation
         **/
        prepareFormNavigation: function () {
            this.currentIndex = this.relatedVehicles.indexOf(this.model.id) + 1;
            $('#currentIndex').val(this.currentIndex);
        },

        /**
         * go to previous page
         * if this is dialog then we close it
         * @return {[type]} [description]
         */
        back: function () {
            var self = this;
            if (this.isDialog) {
                _.find(w2ui.panels, function (p) {
                    return p.name === 'editVeh' + self.cid;
                }).destroy();

            }else if(self.isOperator){
                app.module('appciv').router.navigate('appciv/listaOperator', {
                    trigger: true
                });
            } else {
                app.module('appciv').router.navigate('appciv/listCIVIndividual', {
                    trigger: true
                });
            }
        },

        renderfiles: function () {
            var options = {
                element: '#files_list_container',
                editable: !this.model.get('nr_registru'),
                id_vehicul: this.model.get('id')
            };
            vehicul.renderFiles(options);
        },

        renderMentiuni: function () {
            var options = {
                element: '#mentiuni_container',
                mentiuni: this.model.get('Mentiuni'),
                vin: this.model.get('vin'),
                editable: !this.model.get('nr_registru'),
            };
            vehicul.renderMentiuni(options);
        },
        renderatributes: function(param) {
            var options = {
                element: '#date_tehnice_container',
                atributes: this.model.get('Atribute'),
                iswltp:param
            };
            vehicul.renderAtributes(options);
        },
        renderanvelope: function() {
            var self = this;
            var options = {
                element: '#anvelope_container',
                anvelope: self.model.get('Anvelope')
            };
            vehicul.renderAnvelope(options);
        },

        /**
         * validate vin property - only alfanumeric
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        validatenewvin: function (e) {
            var errors = {};
            var data = [];
            errors.data = data;
            var real_vin = this.model.get('vin');
            if (!real_vin) {
                data.push({
                    name: 'vin',
                    message: 'Camp obligatoriu!'
                });
                //app.Util.showError({}, errors);
                w2utils.validateRaw(this.$el, data);
                return false;
            }
            var vin = real_vin.toUpperCase();
            var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
            //var wild = /^$/;

            if (vin !== undefined && vin.length > 0) {
                if (regex.test(vin) && vin.length === 17) {
                    //app.Util.removeError($('#vin').parent());
                    this.model.set('vin', vin);
                    return true;
                    //}else if(wild.test(vin)){

                } else {
                    data.push({
                        name: 'vin',
                        message: 'Valoare incorecta!'
                    });
                    //app.Util.showError({}, errors);
                    w2utils.validateRaw(this.$el, data);
                    return false;
                }
            } else {
                data.push({
                    name: 'vin',
                    message: 'Camp obligatoriu!'
                });
                //app.Util.showError({}, errors);
                w2utils.validateRaw(this.$el, data);
                return false;
            }
        },
        save: function () {
            var self = this;
            var options = {
                success: function (model) {
                    w2utils.unlock(self.$el);
                    var opt = {
                        text: 'Inregistrarea a fost salvata!',
                        title: 'Notificare',
                        type: 'success-template'
                    };
                    ipc.send('app:notification:show', opt);
                    if (self.model.get('isCopy')) {
                        app.router.navigate('appciv/detaliiVehiculIndividuale/' + model.id);
                        self.model.set('isCopy', false);
                    }

                    self.enableCopy();
                    self.renderfiles();
                },
                error: function (model, response) {
                    w2utils.unlock(self.$el);
                    // we get the errors as a string. This was implemented so that we can show
                    // both errors comming from server and from client. We modded the validate
                    // function of the model so that it returns a JSON string containing an element named errors
                    // from server we get the same result
                    if (response.status !== 401) {
                        var opt = {
                            text: 'Eroare la salvare!',
                            title: 'Notificare',
                            type: 'error-template'
                        };
                        ipc.send('app:notification:show', opt);
                        var data = eval('(' + response.responseText + ')');
                        //console.log(data);
                        w2utils.validateRaw(self.$el, data.data);
                    }
                }
            };
            if (self.validatenewvin() && w2utils.validate(self.model, self.$el)) {
                w2utils.lock(self.$el,'Va rugam asteptati...');
                self.model.save({}, options);
                console.log(self.model.toJSON());
            }
        },
        copy: function () {
            //this._modelBinder.unbind();

            // var Prototype = app.module('vehicul').VehiculModel;
            // var newmodel = this.model; //new Prototype(this.model.toJSON());
            $('#culoare').w2field().reinit();
            this.model.set('EntityState', 0).set('vin', '')
                .set('isCopy', true)
                .set('serie_motor', '')
                .set('culoare', '')
                .unset('id');
            this.isCopy = true;
            this.disableCopy();
            this.$el.find('#date_tehnice_container').empty();
            // app.router.navigate('#/appciv/copyVehicul/' + this.model.get('id'), {
            //     trigger: false
            // });

        },
        fisa: function(){
            var self = this;
            var path = app.baseUrl + 'civfiles/GetRaportVehicul?id=' + this.model.get('id');
            if(this.model.get('nr_factura')){
                ipc.send('app:request:pdf', [path]);
            }else{
                var template = '<div class="w2ui-page page-0 modalContent" id="platafact_container">'+
                                    '<h3 style="text-align:center">Alegeti factura cu care s-a achitat C.I.V.</h3>'+
                                    '<div class="w2ui-field">'+
                                        '<label>Numar factura</label>'+
                                        '<div>'+
                                            '<input type="text" id="nrfact" size="60" />'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                this.plata = $(template).w2panel({
                    name: 'platafact',
                    title: 'Date factura',
                    width: '600px',
                    showMin: false,
                    modal:true,
                    showMax: false,
                    height: '250px',
                    resizable: true,
                    useraction:function(){
                        self.model.set('nr_factura',$('#nrfact').data('selected').text);
                        $.post(app.baseUrl + 'individuale/savefacturavehicul',{id_vehicul:self.model.get('id'),id_factura:$('#nrfact').data('selected').id},function(){
                            w2panel.destroy();
                        });
                    },
                    buttons:'<button class="btn btn-blue" onclick="w2panel.useraction();">OK</button> '+
                            '<button class="btn btn-red cancel" onclick="w2panel.close();">Cancel</button>',
                    onOpen: function(event) {
                        event.onComplete = function(){
                            $('#platafact_container').find('#nrfact').w2field('list',{
                                url:app.baseUrl+'individuale/getfacturiindividuale',
                                minLength:-1,
                                match:'contains',
                                renderDrop: function(e) {
                                    console.log(e);
                                    return '<td>' + e.text + '</td><td style="padding-left:3px">' + e.benef + '</td><td style="padding-left:3px"> '+e.ramase+'</td>';
                                },
                            });
                        };
                    },
                    onClose: function(event) {
                       event.onComplete = function(){ipc.send('app:request:pdf', [path]);};
                    }
                });
            }
        },
        info: function () {
            var civnou = localStorage.getItem('civnou') && localStorage.getItem('civnou')=='true';
            var tipciv = civnou?'N':'V';
            var x = 0;
            var y = 0;
            try {
                var configPrinter = JSON.parse(fs.readFileSync('configPrinters.json'));
                var active = _.findWhere(configPrinter, {
                    default: true
                });
                x = active.x;
                y = -active.y;
            } catch (ex) {

            }
            var self = this;
            var id = self.model.id;
            var reprez = ipc.sendSync('user:request:reprezentanta');
            var path = civnou? app.civUrl +this.model.get('vin')+'?org=dot&reprez='+reprez + '&x=' + x + '&y=' + y:app.baseUrl + 'individuale/GetTiparCIVComanda?id=' + this.model.get('id_comanda') + '&x=' + x + '&y=' + y + '&vin=' + self.model.get('vin');
            //civ nou http://10.2.2.84/restservice/api/printciv/1234?org=dot
            ipc.send('app:request:pdf', [path, function (win) {
                win.on('closed', function () {
                    w2confirm({
                        msg: 'Finalizati tiparirea CIV?',
                        opt: false,
                        opt_text: 'Verificat!',
                        no_class: 'btn-red',
                        yes_class: 'btn-blue',
                        opt_class: 'btn-orange'
                    }).yes(function () {
                        $.post(app.baseUrl + 'individuale/finalizeCIV/' + id+'?tipciv='+tipciv, {}, function (stare) {
                            self.model.set('stare',stare);
                        });
                        win.close(true);
                    }).no(function () {
                        win.close(true);
                    }).opt(function () {
                        $.post(app.baseUrl + 'individuale/verificatCIV/' + id, {}, function () {
                            // w2ui.gridCereri.set(id[0], {
                            //     depusa: 18
                            // });
                        });
                        win.close(true);
                    });
                });
            }]);
        },
        // modelChanged: function(e) {
        //     this.listenToOnce(this.model,'change',this.modelChanged);
        //     var self = this;
        //     self.disableCopy();
        //     $.each(e.changedAttributes(), function(i, value) {
        //         if (i !== 'vin') {
        //             if(i==='id_tvv'){
        //                 console.log('tvv changed');
        //             }else if(i==='id_extensie'){
        //                 console.log('extensie changed');
        //             }
        //             //app.Util.removeError($('#' + i).parent());
        //         }
        //     });
        // },
        disableCopy: function () {
            $('#btnCopyVehicul').attr('disabled', true);
            $('#btnVehiculComplet').attr('disabled', true);
            $('#btnArhivare').attr('disabled', true);
        },
        enableCopy: function () {
            $('#btnCopyVehicul').attr('disabled', null);
            // $('#btnVehiculComplet').attr('disabled', null);
            // $('#btnArhivare').attr('disabled', null);
        },
        onBeforeDestroy: function () {
            w2ui.layoutVehicul.destroy();
            if (this.win) {
                this.win.destroy();
            }
        },

        

        newwin: function () {
            var self = this;
            $('#btnNewWindow').hide();
            this.isDialog = true;
            self.win = $(this.el).w2panel({
                name: 'editVeh' + this.cid,
                showMax: true,
                showMin: true,
                preserveContent: true,
                width: 800,
                height: 600,
                resizable: true,
                maximized: true
            });
            w2ui.layoutVehicul.resize();
            self.win.on('close', function (event) {
                event.onComplete = function () {
                    w2ui.layoutVehicul.resize();
                    self.isDialog = false;
                    $('#btnNewWindow').show();
                    self.win = null;
                };
            });
        },

        gotofirst: function () {
            var id = this.relatedVehicles[0];
            app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
        },

        gotolast: function () {
            var id = this.relatedVehicles[this.relatedVehicles.length - 1];
            app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
        },
        gotonext: function () {
            if (this.currentIndex < this.relatedVehicles.length) {
                var id = this.relatedVehicles[this.currentIndex];
                app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
            }
        },
        gotoprev: function () {
            if (this.currentIndex > 1) {
                var id = this.relatedVehicles[this.currentIndex - 2];
                app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
            }
        },

        addFile: function () {
            app.trigger('vehicul:add:file', {
                id_vehicul: this.model.id
            });
        },

        addMentiune: function () {
            app.trigger('vehicul:add:mentiune', {
                id_vehicul: this.model.id,
                vin:this.model.get('vin')
            });
        },
        anulare: function () {
            var that = this;
             w2confirm('Doriti anularea acestei inregistrari?').yes(function(){
                that.model.set('stare', 1).set('nr_registru','');
                that.save();
                app.trigger('vehicul:set:editable');
             });
        },
        unlock:function(){
            var self = this;
            w2confirm('Doriti deblocarea acestei inregistrari?').yes(function(){
                 self.model.set('stare', 10).set('nr_registru','');
                 self.save();
                 app.trigger('vehicul:set:editable');
            });
        },
        arhivare : function(){
            vehicul.arhivareCIVIndividuale(this.model.get('id_comanda'),this.model.get('vin'));
        },
        transmite: function(){
            this.model.set('stare', 10);
            this.save();
        },
        validateWVTA:function(m){
            // if(!this.model.get('id_wvta'))
            //   return true;
            var regex = /([a-z][0-9]{1,2}\*[0-9A-Z]*\/*[0-9]*\*[0-9]{4,5})$/;
      
             var match = regex.exec(m.get('wvta'));
             if(!match){
               $('#wvta').w2tag('Valoare incorecta!',{
                     'class': 'w2ui-error'
                 });
                 $('.save-dosar').attr('disabled',true);
                 return false;
             }else{
               $('#wvta').w2tag().removeClass('w2ui-error');
               $('.save-dosar').attr('disabled',null);
               var selected = $('#wvta').data('selected')
               this.model.set('id_wvta',selected.id)
               this.reset()
               return true;
             }
        },
        extensieChanged:function(d){
            var selected = $('#extensie').data('selected')
            this.model.set('id_extensie',selected.id)
            $('#tip').w2field().reinit()
            //this.reset()
        },
        motorChanged:function(){
            var selected = $('#cod_motor').data('selected')
            this.model.set('motor',selected.id)
        },
        prepareData:function(v){
            var selected = $('#versiune').data('selected')
            this.model.set('id_tvv',selected.id)
        },

        reload:function(){
            console.log('reload')
            var self = this;
            var params = {
                id_tvv: this.model.get('id_tvv'),
                id_extensie: this.model.get('id_extensie'),
                id: this.model.id && this.model.id !== 0 ? this.model.id : 0
            };

        //     $.ajax({
        //         url: root + 'vehicule/getwvta',
        //         data: {
        //             id_tvv: self.model.get('id_tvv')
        //         },
        //         success: function(response) {
        //             self.model.set('categ_euro', response.categ_euro);
        //             if (response.categ_euro.substr(0, 1) !== 'O' && response.categ_euro.substr(0, 1) !== 'R') {
        //                     // $('#serie_motor').attr('disabled', null);
        //                     // $('#motor').attr('disabled', null);
        //                     $('#engine_container').show();
        //                     $('#cod_motor').w2field().reinit();
        //                     self.model.set('serie_motor', '').set('motor', '');
        //                     if(response.categ_euro.split('|').length > 1){
        //                         $('#categ_euro').w2field('list',{
        //                             items:response.categ_euro.split('|')
        //                         });
        //                         $('#categorie').show();
        //                     }else{
        //                         $('#categorie').hide();
        //                     }
        //                 } else {
        //                     console.log("Remorca!!");
        //                     // $('#serie_motor').attr('disabled', true);
        //                     // $('#motor').attr('disabled', true);
        //                     $('#engine_container').hide();
        //                 }
        //             }
        //         });
            
        //         self.model.get('Atribute').reset();
        //         $.ajax({
        //             url: root + 'individuale/getatributevehicul',
        //             data: params,
        //             dataType: 'json',
        //             type: 'GET',
        //             success: function(response) {
        //                 if(response.error !==''){
        //                     w2alert(response.error);
        //                 }
        //                 if(response.atribute.length == 0){
        //                     $('#date_tehnice_container').hide()
        //                     self.model.get('Atribute').reset();
        //                     return;
        //                 }else{
        //                     $('#date_tehnice_container').show()
        //                 }
        //                 app.trigger('wltp:changed',response.iswltp == 1);
        //                 self.model.get('Atribute').reset(response.atribute);
        //                 if (self.isNew) {
        //                     self.renderatributes(response.iswltp);
        //                 }
        //                 self.model.set('nr_registru',response.nr_registru);
        //                 // self.model.get('Mentiuni').reset(response.mentiuni);
        //                 var added = [];
                        
        //                 response.mentiuni.split('\n').map(function(m,i){
        //                     added.push({
        //                         id:null,
        //                         text:m,
        //                         id_vehicul:self.model.id,
        //                         nr_rand:i,
        //                         nr_identif:self.model.get('vin')
        //                     })
        //                 });
        //                 var currindex = added.length;
        //                 self.existing.map(function(m){
        //                     m.nr_rand = currindex;
        //                     currindex ++;
        //                 })
        //                 var ment = added.concat(self.existing)
        //                 self.model.get('Mentiuni').reset(ment);
        //                 self.renderMentiuni();
        //             },
        //             error: function(response) {
        //                 console.error(response);
        //             }
        //         });
        //         //reload anvelope
        //         self.model.get('Anvelope').reset();
        //         $.ajax({
        //             url: root + 'individuale/getanvelopevehicul',
        //             data: params,
        //             dataType: 'json',
        //             type: 'GET',
        //             success: function(response) {
        //                 if(response.length == 0){
        //                     $('#anvelope_container').hide()
        //                     self.model.get('Anvelope').reset();
        //                     return;
        //                 }else{
        //                     $('#anvelope_container').show()
        //                 }
        //                 vehicul.loadListeAnvelope(self.model, function() {
        //                     self.model.get('Anvelope').reset(response);
        //                     if (self.isNew) {
        //                         self.renderanvelope();
        //                     } else {
        //                        app.module('appciv').trigger('anvelopeView:setSelect');
        //                     }
        //                     // self.renderanvelope();
        //                 });
        //             },
        //             error: function(response) {
        //                 console.error(response);
        //             }
        //         });
         },

        reset:function(){
            var self = this;
            var props = ['an_fabr','motor','cod_motor','Atribute','Anvelope','nr_registru','putere_kw','cilindree','serie_motor'];
            props.map(function(prop){
                self.model.unset(prop)
            })
        }


    });
module.exports = EditView;
},{"./../../globals":24,"./../../templates/individuale/vehicul1.hbs":55}],99:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = window.Marionette.CompositeView.extend({
    template: require('./../../templates/individuale/vehicule.hts'),
    initialize: function(options) {
        var self = this;
        this.parentID = options.parentID;
        this.elid = options.element;
        this.canadd = options.canadd;
        self.caption = 'Lista vehicule atasate comenzii nr.' + self.parentID;
    },
    onRender: function() {
        var self = this;
        self.setPermissions();
        self.renderGrid();
        
    },
    setPermissions:function(){
        this.isClient = ipc.sendSync('user:request:isuserinrole', [[4,18], 'appciv']);
        this.isAdmin= ipc.sendSync('user:request:isuserinrole', [[1], 'appciv']);
        this.isRAR  = ipc.sendSync('user:request:isuserinrole', [[15,16], 'appciv']);
    },
    serializeData: function() {
        return {
            'id_comanda': this.parentID
        };
    },
    renderGrid: function() {
        var self = this;
        $(self.elid).w2grid({
            name: 'gridVehiculeIndividuale_' + this.parentID,
            url: app.baseUrl + 'individuale/getvehicule/' + self.parentID,
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            show: {
                toolbar: true,
                footer: true,
                selectColumn: true
            },
            columns: [{
                field: 'id',
                caption: 'ID',
                sortable: true,
                hidden: true,
                size: '1px'
            }, {
                field: 'nr_registru',
                caption: 'Nr. Omologare',
                sortable: true,
                size: '25%'
            }, {
                field: 'vin',
                caption: 'VIN',
                sortable: true,
                size: '25%'
            }, {
                field: 'wvta',
                caption: 'WVTA',
                sortable: true,
                size: '25%'
            }, {
                field: 'motiv_respingere',
                caption: 'Stare In Clar',
                sortable: true,
                size: '25%',
                hidden: true,
                searchable: false
            }, {
                field: 'stare',
                caption: 'Status',
                sortable: true,
                size: '25%',
                render: function(record) {
                    var cls = 'default',
                        stare = record.motiv_respingere;
                    switch (record.stare) {
                        case 0:
                            stare = 'OK';
                            cls = 'label-default';
                            break;
                        case 1:
                            stare = 'OK';
                            cls = 'label-primary';
                            break;
                        case 2:
                            stare = 'Date eronate';
                            cls = 'label-warning';
                            break;
                        case 3:
                        case 19:
                            stare = 'Tiparit';
                            cls = 'label-danger';
                            break;
                        case 10:
                        case 55:
                            stare = 'Transmis';
                            cls = 'label-waiting';
                            break;
                        case 11:
                            stare = 'Prelucrat OK';
                            cls = 'label-ready';
                            break;
                        case 12:
                            stare = 'Prelucrat OK';
                            cls = 'label-ready';
                            break;
                        case 18:
                            stare = 'Verificat';
                            cls = 'label-danger';
                            break;
                        case 15:
                            stare = 'Tiparit';
                            cls = 'label-success';
                            break;
                        default:
                            break;
                    }
                    var html = '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="label ' + cls + '">&nbsp;&nbsp;&nbsp;</label>';
                    return html;
                }
            }],
            toolbar: {
                //                    onRender: function () {
                //                        if (!self.canadd) {
                //                            this.disable('btnAddVehicul');
                //                        }
                //                        this.disable('btnEditVehicul');
                //                        this.disable('btnDeleteVehicul');
                //                        this.disable('btnDetaliiVehicul');
                //                    },
                items: [{
                    type: 'button',
                    caption: 'Adauga',
                    icon: 'w2ui-icon-plus',
                    id: 'btnAddVehicul',
                    disabled: !self.canadd,
                    onClick: function(e) {
                        self.destroy();
                        app.module('appciv').router.navigate('appciv/addVehiculIndividuale/' + self.parentID, true);
                    }
                }, {
                    type: 'button',
                    id: 'btnEditVehicul',
                    caption: 'Edit',
                    icon: 'w2ui-icon-pencil',
                    disabled: true,
                    onClick: function(event) {
                        var id = w2ui['gridVehiculeIndividuale_' + self.parentID].getSelection();
                        self.destroy();
                        app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
                    }
                }, {
                    type: 'button',
                    id: 'btnDeleteVehicul',
                    caption: 'Sterge',
                    icon: 'w2ui-icon-cross',
                    disabled: true,
                    onClick: function(event) {
                        w2ui['gridVehiculeIndividuale_' + self.parentID].delete();
                    }
                }, {
                    type: 'break'
                }, {
                    type: 'button',
                    id: 'btnDetaliiVehicul',
                    icon: 'w2ui-icon-search',
                    caption: 'Detalii',
                    disabled: true,
                    onClick: function(event) {
                        var id = w2ui['gridVehiculeIndividuale_' + self.parentID].getSelection();
                        ipc.send('app:request:pdf', app.baseUrl + '/civfiles/GetVehiculComplet?id=' + id);
                    }
                },
                {
                    type: 'button',
                    id: 'btnNewWin',
                    icon: 'w2ui-icon-newwindow',
                    caption: 'Detaseaza',
                    disabled: false,
                    onClick: function(event) {
                        var id = w2ui['gridVehiculeIndividuale_' + self.parentID].getSelection();
                        self.win = $(self.elid).w2panel({
                            name: 'listvehicles' + id,
                            showMax: true,
                            showMin: true,
                            preserveContent: true,
                            width: 800,
                            height: 600,
                            resizable: true,
                            maximized: false,
                            onOpen:function(){
                            },
                            onClose:function(){

                            }
                        });
                    }
                }]
            },
            // onDblClick: function(event) {
            //     var b = this.get(event.recid).stare;
            //     if (b < 10 && (b !== 4 && b !== 3)) {
            //         self.destroy();
            //         app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + event.recid, true);
            //     }
            // },
            multiSearch: false,
            multiSelect: true,
            searches: [{
                field: 'vin',
                caption: 'V.I.N. ',
                type: 'text'
            }, {
                field: 'wvta',
                caption: 'W.V.T.A.',
                type: 'text'
            }, {
                field: 'nr_registru',
                caption: 'Nr. Omologare',
                type: 'text'
            }, {
                field: 'stare',
                caption: 'Status',
                type: 'list',
                options: {
                    items: ['In lucru', 'Remediabile', 'Transmise', 'Prelucrate', 'Invalide', 'Tiparite']
                }
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onDeleted: function(event) {
                var response = JSON.parse(event.xhr.responseText);
                w2ui.gridCereriIndividuale.get(response.id_comanda).depusa = response.status_comanda;
                w2ui.gridCereriIndividuale.refreshCell(response.id_comanda, 'stare_comanda');
            },
            onSelect: function(event) {
                var rec = this.get(event.recid);
                if((rec.stare == 1 && self.isClient) || (!self.isClient && rec.stare >=10) || self.isAdmin || self.isRAR)
                    this.toolbar.enable('btnEditVehicul');
                //     if (b !== 4 && b !== 3) {
                //         this.toolbar.enable('btnDetaliiVehicul');
                //     }
                //     if (b < 10) {
                //         this.toolbar.enable('btnDeleteVehicul');
                //         if (b !== 4 && b !== 3) {
                //             this.toolbar.enable('btnEditVehicul');
                //         }
                //     }
                // }

            },
            onUnselect: function() {
                this.toolbar.disable('btnEditVehicul');
                this.toolbar.disable('btnDeleteVehicul');
                this.toolbar.disable('btnDetaliiVehicul');
            },
            fixedBody: true,
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
                    // sf['oper'] = sf['operator'];
                    // delete sf['operator'];
                    if (sf.field === 'stare') {
                        switch (sf.value) {
                            case 'In lucru':
                                sf.value = '(0,1,2)';
                                break;
                            case 'Remediabile':
                                sf.value = '(2)';
                                break;
                            case 'Transmise':
                                sf.value = '(10,11,12,15)';
                                break;
                            case 'Prelucrate':
                                sf.value = '11';
                                break;
                            case 'Invalide':
                                sf.value = '(4,12,8,3)';
                                break;
                            case 'Tiparite':
                                sf.value = '15';
                                break;
                            default:
                                break;
                        }
                        sf.operator = 'isin';
                    }
                }

            },

            onLoad:function(event){
            //   var grid = this;
            //   event.onComplete = function(){
            //     if(!self.refreshInterval){
            //       self.refreshInterval = setInterval(function(){
            //         $.ajax({
            //           url:app.baseUrl + 'civutils/getStareVehicule/'+self.parentID,
            //           type:'GET',
            //           success:function(data){
            //             data.response.map(function(stare){
            //               grid.set(stare.id,{stare:stare.stare,motiv_respingere:stare.motiv_respingere});
            //             });
            //           },
            //           error:function(){
            //               clearInterval(self.refreshInterval);
            //           }
            //         });
            //       },60000);
            //     }
            //   };
            },
            onDestroy:function(){
              self.destroy();
            }
        });


    },
    onBeforeDestroy: function() {
        //w2ui['gridVehicule_' + this.parentID].destroy();
        if(this.win){
            event = {};
            //console.log(event);
            this.win.destroy();
        }
        clearInterval(this.refreshInterval);
    },
    infoVehicul: function(e) {
        e.preventDefault();
        var id = $(e.currentTarget).data('rowid');
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetVehiculComplet?id=' + id);
    },
    refreshGrid: function() {
        w2ui['gridVehiculeIndividuale_' + this.parentID].reload();
    }
});

},{"./../../templates/individuale/vehicule.hts":56}],100:[function(require,module,exports){
module.exports = Marionette.FormView.extend({
    template: require('./../../templates/registru/anvelopa.hbs'),
    attributes: function() {
        return {
            id: 'anvelopa' + this.cid
        };
    },
    className: 'windowContent w2ui-reset w2ui-form',
    ui: {
        'save': '.save-anvelopa',
        'cancel': '.cancel-anvelopa'
    },
    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'closeView'
    },
    onShow: function() {
        if (!this.model.id)
            this.isNew = true;
        var self = this;
        this.win = self.$el.w2panel({
            name: 'anvelopaEditor' + self.cid,
            title: 'Editor',
            width: '400px',
            showMin: true,
            showMax: false,
            height: '300px',
            startZ: 1200,
            resizable: false,
            onOpen: function(event) {
                self.setupView();
                event.onComplete = function() {
                    w2panel.setActive('anvelopaEditor' + self.cid);
                };

            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },
    save: function() {
        var self = this;
        var options = {
            success: function(model) {
                self.closeView();
                // model.set('recid', model.get('id_registru_omol'));
                // if (self.isNew) {
                //     app.trigger('grid:added', {
                //         grid: 'gridDosare',
                //         model: model.toJSON()
                //     });
                // } else {
                //     app.trigger('grid:edited', {
                //         grid: 'gridDosare',
                //         model: model.toJSON()
                //     });
                // }
            }
        };
        if (w2utils.validate(this.model, this.$el)) {
            if (self.isNew) {
                self.collection.add(self.model);
            }
            self.closeView();
        }

    },

    closeView: function(e) {
        this.win.destroy();
        this.destroy();
    }
});

},{"./../../templates/registru/anvelopa.hbs":57}],101:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'fullscreen',
    template: require('./../../templates/registru/anvelope.hbs'),
    initialize: function() {
        this.setPagePermissions();
        //this.collection.setGridName('gridAnvelope');
    },
    // viewShown: function() {
    //     console.log('anvelope');
    //     this.renderGrid();
    // },
    refreshUI: function() {
        // if (!this.isrendered) {
        if (w2ui.hasOwnProperty('gridAnvelope')) {
            // w2ui.gridAnvelope.initToolbar();
            // if (w2ui.gridAnvelope.toolbar != null) w2ui.gridAnvelope.toolbar.render($('#grid_' + w2ui.gridAnvelope.name + '_toolbar')[0]);
            w2ui.gridAnvelope.records = this.collection.toJSON();
            w2ui.gridAnvelope.refreshFull();
            //console.log(this.collection.toJSON());
        }
        this.isrendered = true;

        // }
        // if (!w2ui.hasOwnProperty('gridSursaAnvelope'))
        //     this.renderSursa();
    },
    onShow: function() {
        this.renderGrid();
         this.collection.on('add remove', function(){
            window.isDirty.dirty = true;
        });
    },
    renderGrid: function() {
        var self = this;
        this.$el.find('#gridAnvelope').w2grid({
            name: 'gridAnvelope',
            records: self.collection.toJSON(),
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: self.allowEdit,
                toolbarEdit: self.allowEdit,
                toolbarDelete: self.allowEdit
            },
            toolbar:{
              items:[
                {type:'button',id:'mvUp',icon:'w2ui-icon-upload',onClick:self.mvRecord.bind(self,1)},
                {type:'button',id:'mvDown',icon:'w2ui-icon-download',onClick:self.mvRecord.bind(self,0)}
              ]
            },
            //reorderRows: true,
            onEdit: function(event) {
                self.openEdit(event.recid);
            },
            onAdd: function(event) {
                self.openEdit();
            },
            onDelete: function(event) {
                var ids = this.getSelection();
                event.onComplete = function() {
                    _.each(ids, function(id) {
                        var model = self.collection.find(function(s) {
                            return s.cid === id;
                        });
                        if (model.id)
                            model.set('EntityState', 2);
                        else
                            self.collection.remove(model);
                    });
                };
            },
            onSubmit: function(data) {
                var me = this;
                _.each(data.changes, function(field) {
                    var r = me.get(field.recid);
                    if (typeof field.axa !== 'undefined') {
                        r.axa = field.axa.id;
                    }
                    if (typeof field.id_roata !== 'undefined') {
                        r.id_roata = field.id_roata.id;
                        r.valoare = field.id_roata.text;
                    }
                });
            },
            columns: [{
              field:'ordine_civ',
              caption:'Ordine CIV',
              sortable:true,
              size:'150px'
            },{
                field: 'axa',
                caption: 'Axa',
                sortable: true,
                render: function(record) {
                    switch (Number(record.axa)) {
                        case 1:
                            return 'Fata';
                        case 2:
                            return 'Spate';
                    }
                },
                size: '30%'
            }, {
                field: 'id_roata',
                caption: 'Anvelopa',
                sortable: true,
                render: function(record) {
                    return record.valoare;
                },
                size: '30%'
            }, {
                field: 'janta',
                caption: 'Janta',
                sortable: true,
                size: '30%'
            }]
        });

    },

    mvRecord:function(direction){
      var self = this;
      var obj = w2ui.gridAnvelope;
      var selLength = obj.getSelection().length;
      var ind1 = obj.get(obj.getSelection()[0],true);
      var tmp = [];
      for (var i = 0; i < selLength; i++) {
        tmp.push(obj.records[obj.get(obj.getSelection()[i],true)]);
      }
      // var tmp = obj.records[ind1];
      var ind2;
      if(direction===1 && ind1 > 0){
          //move up
          obj.records.splice(ind1, selLength);
          ind2 = ind1-1;
          var args = [ind2,0];
          for (var x = 2; x < tmp.length+2; x++) {
            args[x] = tmp[x-2];
          }
          Array.prototype.splice.apply(obj.records,args);
      }else if(direction===0 && ind1 < obj.records.length){
        // move down
        obj.records.splice(ind1, selLength);
        ind2 = ind1;
        var args = [ind2 + 1,0];
        for (var x = 2; x < tmp.length+2; x++) {
          args[x] = tmp[x-2];
        }
        Array.prototype.splice.apply(obj.records,args);
        //obj.records.splice(ind2 + selLength, 0, tmp);
      }else{
        obj.refresh();
        obj.selectNone();
        return;
      }

      obj.selectNone();
    //   if(direction === 1){
    //     tmp.map(function(rec){
    //
    //     });
    //   //obj.select(obj.records[ind2].recid);
    // }
    //   else {
    //     //obj.select(obj.records[ind2+1].recid);
    //   }
        var ids = _.pluck(tmp,'recid');
        obj.select.apply(obj,ids);
        self.collection.each(function(model){
          model.set('ordine_civ',obj.get(model.cid,true)+1);
        });
        obj.refresh();
    },
    renderSursa: function() {
        var me = this;
        $('#gridSursaAnvelope').w2grid({
            name: 'gridSursaAnvelope',
            recid: 'ndelcodroa',
            show: {
                toolbar: true,
                selectColumn: true
            },
            url: app.dotUrl + '/nrom/getAnvelope',
            columns: [{
                field: 'ndelcodroa',
                caption: 'ID',
                hidden: true
            }, {
                field: 'janta',
                caption: 'Janta',
                size: '50%',
                sortable: true
            }, {
                field: 'anvelopa',
                caption: 'Putere(kW)',
                size: '50%',
                sortable: true
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText).data;
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            toolbar: {
                items: [{
                    type: 'button',
                    text: 'Transfera selectia',
                    icon: 'w2ui-icon-upload',
                    onClick: function() {
                        var grid = w2ui.gridSursa;
                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var motor = grid.get(id);
                            var exist = me.collection.find(function(model) {
                                return model.get('id_roata') === motor.ndelcodroa;
                            });
                            if (exist) {
                                w2alert('Anvelopa selectata exista deja!');
                            } else {
                                // var Proto = app.module('appdot.dosare').PrototypeMotor;
                                // var mdl = new Proto({
                                //     id_motor: motor.ndelcodmot,
                                //     cod: motor.cod,
                                //     tip: motor.tip_mot,
                                //     puterecp: motor.p_max_cp,
                                //     puterekw: motor.p_max_kw,
                                //     cilindree: motor.cilindree
                                // });
                                // me.collection.add(mdl);
                            }
                        }
                        grid.refresh();
                        grid.selectNone();
                    }
                }]
            }
        });
    },
    setPagePermissions: function() {
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3], 'appdot'
        ]);

    },
    onBeforeDestroy: function() {
        if (w2ui.hasOwnProperty('gridAnvelope'))
            w2ui.gridAnvelope.destroy();
        // if (w2ui.hasOwnProperty('gridSursaAnvelope'))
        //     w2ui.gridSursaAnvelope.destroy();
    },
    enableEdit:function(){
      w2ui.gridAnvelope.toolbar.enable('w2ui-add');
      w2ui.gridAnvelope.toolbar.enable('w2ui-edit');
    },
    openEdit: function(id) {
        var m,View;
        if (!id) {
            var Model = require('./../../models/registru/anvelopa');
            m = new Model();
            View = require('./anvelopeEditor');
        } else {
            m = this.collection.find(function(s) {
                return s.cid === id;
            });
            View = require('./anvelopa');
        }
        var view = new View({
            model: m,
            collection: this.collection
        });
        app.modal.show(view, {
            preventDestroy: true
        });
    }
});

},{"./../../models/registru/anvelopa":32,"./../../templates/registru/anvelope.hbs":59,"./anvelopa":100,"./anvelopeEditor":102}],102:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/registru/anvelopaEditor.hbs'),
    attributes: function() {
        return {
            id: 'anvelopa' + this.cid
        };
    },
    initialize:function(){
        var Model = require('./../../models/registru/anvelopa')
         this.m1 = new Model({axa:1});
         this.m2 = new Model({axa:2});
    },
    className: 'windowContent w2ui-reset w2ui-form',
    ui: {
        'save': '.save-anvelopa',
        'cancel': '.cancel-anvelopa'
    },
    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'closeView',
        'change #idemspate':'setIdemSpate'
    },
    onShow: function() {
        this.isNew = true;
        var self = this;
        this.win = self.$el.w2panel({
            name: 'anvelopaEditor' + self.cid,
            title: 'Editor',
            width: '400px',
            showMin: true,
            showMax: false,
            height: '300px',
            startZ: 1200,
            resizable: false,
            onOpen: function(event) {
                self.setupView();
                event.onComplete = function() {
                    w2panel.setActive('anvelopaEditor' + self.cid);
                };

            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },
    save: function() {
        var self = this;
        var options = {
            success: function(model) {
                self.closeView();
                // model.set('recid', model.get('id_registru_omol'));
                // if (self.isNew) {
                //     app.trigger('grid:added', {
                //         grid: 'gridDosare',
                //         model: model.toJSON()
                //     });
                // } else {
                //     app.trigger('grid:edited', {
                //         grid: 'gridDosare',
                //         model: model.toJSON()
                //     });
                // }
            }
        };
        if (w2utils.validate(this.m1, this.$el) && w2utils.validate(this.m2, this.$el)) {
            if (self.isNew) {
                self.m1.set('ordine_civ',self.collection.models.length+1);
                self.collection.add(self.m1);
                self.m2.set('ordine_civ',self.collection.models.length+1);
                self.collection.add(self.m2);
            }
            self.closeView();
        }

    },
    setupView:function(){
        console.log('here');
        var self = this;
        this.$el.find('#id_roataf').w2field('list',{
            url: app.dotUrl + '/nrom/getAnvelope',
            minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.m1.set('id_roata',e.item.id).set('valoare',e.item.text).set('janta',e.item.janta);
            }
        });
         this.$el.find('#id_roatas').w2field('list',{
            url: app.dotUrl + '/nrom/getAnvelope',
             minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.m2.set('id_roata',e.item.id).set('valoare',e.item.text).set('janta',e.item.janta);
            }
        });
         this.$el.find('#id_roataf').parent().find('.w2ui-field-helper').width('250px');
         this.$el.find('#id_roatas').parent().find('.w2ui-field-helper').width('250px');
    },
    setIdemSpate:function(){
        if($('#idemspate').is(':checked')){
            this.m2.set('id_roata',this.m1.get('id_roata'));
            this.$el.find('#id_roatas').data('selected',this.$el.find('#id_roataf').data('selected')).trigger('change');
        }
    },
    closeView: function(e) {
        this.win.destroy();
        this.destroy();
    }
});

},{"./../../models/registru/anvelopa":32,"./../../templates/registru/anvelopaEditor.hbs":58}],103:[function(require,module,exports){
var ipc = requireNode('ipc')

module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/registru/cereri.hbs'),
    className: 'page',
    attributes: function() {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    events: {},
    initialize: function(options) {
        var self = this;
        this.location = options.location;
        _.bindAll(this, 'refreshGrid');
        this.setPermissions();
    },
    setPermissions: function() {
        this.allowSuper = ipc.sendSync('user:request:isuserinrole', [
            [13,1], 'appciv'
        ]);
        this.allowDelete = ipc.sendSync('user:request:isuserinrole', [
            [1], 'appciv'
        ]);
        this.allowPrint = ipc.sendSync('user:request:isuserinrole', [
            [1, 10], 'appciv'
        ]);

    },
    onShow: function() {
        var self = this;
        this.renderGrid();
    },
    renderGrid:function(){
        var self = this;
        $('#cereriNrOmGrid').w2grid({
            name: 'gridCereriOmologare',
            url: app.dotUrl + 'doiit/getComenzi',
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            fixedBody: true,
            show:{
                toolbar:true,
                toolbarAdd:true,
                toolbarEdit:true,
                toolbarDelete:true,
                footer:true
            },
            onAdd:function(){},
            onEdit:function(data){
                app.router.navigate('appciv/editCerereOmologare/'+data.recid,{trigger:true})
            },
            onDelete:function(data){
                console.log(data);
            },
            columns:[
                {field:'id', caption:'Nr. Cerere', size:'20%'},
                {field:'wvta', caption:'WVTA', size:'20%'},
                {field:'marca', caption:'Marca', size:'20%'},
                {field:'tip', caption:'Tip', size:'20%'},
                {field:'varianta', caption:'Varianta', size:'20%'},
                {field:'versiune', caption:'Versiune', size:'20%'},
                {field:'denumire_comerciala', caption:'Denumire', size:'20%'},
                {field:'nr_registru', caption:'Nr. Omologare', size:'20%'},
            ],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
        })
    },
    refreshGrid:function(){},
    onBeforeDestroy:function(){
        w2ui['gridCereriOmologare'].destroy()
    }
});
},{"./../../templates/registru/cereri.hbs":60}],104:[function(require,module,exports){
module.exports = Marionette.CompositeView.extend({
    className: 'form-inline mid-form',
    tagName: 'form',
    events: {
        'click .btnAddValue': 'addValue',
        'click .btnDelValue': 'delValue'
    },
    initialize: function () {
        // this.listenTo(app,'dt:add:value',this.addValue.bind(this));
        // this.listenTo(app,'dt:remove:value',this.delValue.bind(this));
        var self = this;
        this.nedcAtrs = [24, 141, 142, 246, 247, 248];
        this.wltpAtrs = [290,291,292,293,294,295,296,297,298,299,300,301];
        if (this.options.type == 'poluare' || this.options.type == 'wltp') {
            this.listenTo(app,'wltp:changed',this.toggleWltp);
        }
        _.bindAll(this, 'forceValidation');
        self.collection.on('change', function () {
            if (!window.isDirty.dirty) {
                window.isDirty.dirty = true;
            }
        });
        self.collection.on('save', function () {
            if (window.isDirty.dirty) {
                window.isDirty.dirty = false;
            }
        });
    },
    getTemplate: function () {
        var coll = this.collection,
            html = '<form role="form" class="form-inline mid-form"><fieldset style="padding: 10px">';
        if (this.options.type == 'poluare') {
            html += '<div class="common"></div><table style="width:100%" border="1" cellspacing="2">' +
                '<tr><th style="width:50%">OMOLOGARE NEDC</th><th colspan="2"><input type="checkbox" id="enablewltp"/> OMOLOGARE WLTP</th></tr>' +
                '<tr><td></td><td style="width: 269px;text-align: right;padding: 3px 27px 3px 0;">Vehicul Low</td><td style="padding-left: 15px;">Vehicul High</td></tr>'+
                '<tr><td><div class="nedc"></div></td><td colspan="2"><div class="wltp"></div></td></tr></table>';
        }
        html += '</fieldset></form>';
        return html;
    },
    childView: require('./mase'),
    childViewOptions: function (model) {
        model.set('iswltp', this.iswltp);
        return {
            type: this.options.type,
            index: model.cid
        };
    },
    setReadOnly: function () {
        _.each(this.children._views, function (view) {
            $.each(view.$el.find('input,textarea,button.btnAddValue,button.btnDelValue'), function (i, el) {
                //if ($(el).val() !== '') {
                $(el).prop('disabled', true);
                //}
            });
        });
    },

    toggleWltp:function(val){
        var self = this;
        _.each(this.children._views, function (view) {
            if(self.wltpAtrs.indexOf(view.model.get('id_nom')) !== -1){
                $.each(view.$el.find('input,textarea,select,button.btnAddValue,button.btnDelValue'), function (i, el) {
                if (val) {
                        view.model.set('iswltp', true);
                        $(el).prop('disabled', null);
                    }else{
                        view.model.set('iswltp', false);
                        $(el).prop('disabled', true);
                    }
                });
            }
            if(self.nedcAtrs.indexOf(view.model.get('id_nom')) !== -1){
                $.each(view.$el.find('input,textarea,select,button.btnAddValue,button.btnDelValue'), function (i, el) {
                if (val) {
                        view.model.set('iswltp', true);
                        $(el).prop('disabled', true);
                    }else{
                        view.model.set('iswltp', false);
                        $(el).prop('disabled', null);
                    }
                });
            }
        });
    },
    onShow: function () {
        var coll = this.collection;
        if (this.options.type == 'poluare') {
            this.$el.find('#enablewltp').change(function () {
               app.trigger('wltp:changed',this.checked);
            });
            if(this.options.iswltp){
                this.$el.find('#enablewltp').attr('checked',true);
                this.toggleWltp(true);
            }else{
                this.$el.find('#enablewltp').attr('checked',false);
                this.toggleWltp(false);
            }
        }
        this.listenTo(coll, 'change', function () {
            var mt, mpmin, mpmax, mu_model;
            coll.models.map(function (m) {
                if (m.get('id_nom') === 6) {
                    mpmin = m.get('val_min');
                    mpmax = m.get('val_max');
                }
                else if (m.get('id_nom') === 7)
                    mt = m.get('val')
                else if (m.get('id_nom') === 13)
                    mu_model = m;
            });
            if (mu_model) {
                mu_model.set('suggested_valmin', Number(mt) - Number(mpmax));
                mu_model.set('suggested_valmax', Number(mt) - Number(mpmin));
            }
        });
    },
    attachHtml: function (collectionView, itemView, index) {
        if (itemView.model.get('grupa') === this.options.type || (itemView.model.get('grupa') === 'wltp' && this.options.type === 'poluare')) {
            if (this.options.type == 'poluare' || this.options.type == 'wltp') {
                if (this.nedcAtrs.indexOf(itemView.model.get('id_nom')) !== -1) {
                    collectionView.$el.find('fieldset').find('.nedc').append(itemView.el);
                }
                else if (this.wltpAtrs.indexOf(itemView.model.get('id_nom')) !== -1) {
                    collectionView.$el.find('fieldset').find('.wltp').append(itemView.el);
                } else {
                    collectionView.$el.find('fieldset').find('.common').append(itemView.el);
                }
            } else {
                collectionView.$el.find('fieldset').append(itemView.el);
            }
        }
    },

    forceValidation: function () {
        var self = this;
        _.each(self.children._views, function (view) {
            w2utils.validate(view.model, view.$el);
        });
    },
    addValue: function (e) {
        //var e = opt.ev;
        var self = this;
        //e.preventDefault();
        var target = $(e.currentTarget);
        var cid = target.data('model');
        var tehn = this.collection.find(function (m) {
            return m.cid === cid;
        });
        //var val = tehn.get('val');
        var child = this.children.findByModel(tehn);
        var html =
            '<div style="display:inline" id="addValueContainer"><input type="text" id="addMultiValue" />' +
            //'   <button class="btn btn-blue closeMulti" id="btnSaveNewValue"><i class="w2ui-icon-check"></i></button>' +
            '   <button class="btn btn-red closeMulti"><i class="w2ui-icon-cross"></i></button>' +
            '</div>';
        target.w2overlay({
            html: html,
            hideEl: '.closeMulti',
            width: '300px',
            maxHeight: '200px',
            openAbove: true,
            style: 'padding:10px;overflow:auto',
            onShow: function () {
                var self = this;
                if (tehn.get('tip') === 'lista') {
                    var el = '<select id="addMultiValue" placeholder="Selectati din lista"><option value="">--Selectati--</option>';
                    var source = JSON.parse(tehn.get('sursa'));
                    for (var i = 0; i < source.length; i++) {
                        if ($.isPlainObject(source[i]))
                            el += '<option value="' + source[i].id + '">' + source[i].text + '</option>';
                        else
                            el += '<option value="' + source[i] + '">' + source[i] + '</option>';
                    }
                    el += '</select>';
                    $('#addMultiValue').replaceWith(el);
                } else {
                    $('#addMultiValue').on('keyup', function (e) {
                        if (e.which === 13)
                            $(self.hideEl).click();
                    });
                }
            },
            onHide: function (e) {
                if ($('#addMultiValue').val()) {
                    var val = tehn.get('val');
                    if (!val) {
                        val = $('#addMultiValue').val();
                        tehn.set('val', val).set('pseudo', val);
                        child.render();
                    } else if (val.split('|').indexOf($('#addMultiValue').val()) === -1) {
                        val += '|' + $('#addMultiValue').val();
                        tehn.set('val', val).set('pseudo', val);
                        child.render();
                    }
                }
            }
        });

        console.log(child);
    },
    delValue: function (e) {
        //var e = opt.ev;
        var self = this;
        //e.preventDefault();
        var target = $(e.currentTarget);
        var cid = target.data('model');
        var tehn = this.collection.find(function (m) {
            return m.cid === cid;
        });
        var child = this.children.findByModel(tehn);
        var selected = tehn.get('pseudo').replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
        if (selected !== tehn.get('val')) {
            var val = tehn.get('val').split('|');
            var newval = [];
            val.map(function (c) {
                newval.push(c.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, ''));
            });
            val = _.without(newval, selected);
            var nval = val.join('|');
            tehn.set('val', nval);
            child.render();
        }

    }
});

},{"./mase":108}],105:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/registru/detaliiMotor.hbs'),
    className: 'fullPage',
    bindings: {
        '#tip': 'tip',
        '#cod': 'cod',
        '#combustib': 'combustib',
        '#tip_motor': 'tip_motor',
        '#tip_alim': 'tip_alim',
        '#timpi': 'timpi',
        '#tip_racire': 'tip_racire',
        '#tip_depol': 'tip_depol',
        '#p_max_kw': 'p_max_kw',
        '#p_max_cp': 'p_max_cp',
        '#rot_p_max': 'rot_p_max',
        '#cuplu_max': 'cuplu_max',
        '#rot_c_max': 'rot_c_max',
        '#nr_cilindr': 'nr_cilindr',
        '#cilindree': 'cilindree',
        '#config': 'config',
        '#alezaj': 'alezaj',
        '#cursa': 'cursa',
        '#compresie': 'compresie',
        '#echipare': 'echipare',
        '#echipare1': 'echipare1',
        '#echipare2': 'echipare2',
        '#echipare3': 'echipare3',
        '#echipare4': 'echipare4',
        '#partic1': 'partic1',
        '#partic2': 'partic2',
        '#partic3': 'partic3',
        '#co': 'co',
        '#hc': 'hc',
        '#nox': 'nox',
        '#particule': 'particule',
        '#opacitate': 'opacitate',
        '#doc_omolog': 'doc_omolog',
        '#kw_max_net': 'kw_max_net',
        '#kw_max_h':'kw_max_h',
        '#kw_max_30':'kw_max_30',
        '#observatii': 'observatii'

    },
    onRender: function() {
        this.stickit();
    }
});

},{"./../../templates/registru/detaliiMotor.hbs":61}],106:[function(require,module,exports){
module.exports = Marionette.FormView.extend({
    template: require('./../../templates/registru/general.hbs'),
    initialize: function() {
        var self = this;
        // this.model.on('change', function() {
        //     self.confirmReset.apply(self, arguments);
        // });
    },
    serializeData:function(){
        return {ext:this.options.extensie};
    },
    bindingsOverrides: {
        '.clasa': {
            observe: 'cod_categorie',
            visible: function(value) {
                return value === 'C' || value === 'G';
            }
        },
        '#producator':'producator',
        // '#nr_axe':{
        //     observe:'nr_axe',
        //     onGet:function(value){
        //         if(!value || value==='0')
        //             return '2';
        //         else
        //             return value;
        //     },
        //     onSet:function(value){
        //         if(!value || value === '0'){
        //             w2alert('Numarul axelor nu poate fi 0!');
        //             return '2';
        //         }else{
        //             return value;
        //         }
        //     }
        // },

        '#nr_registru': {
            observe: 'nr_registru',
            onGet: function(value) {
                if (!value)
                    return 'Se asteapta generarea...';
                return value;
            }
        }
    },
    forceValidation: function() {
        w2utils.validate(this.model, this.$el);
    },
    onShow:function(){
        var self = this;
        //this.$el.find('input').on('change',function(){self.confirmReset.apply(self,arguments);});
        this.setupView();
        $('#producator').w2field('combo',{
            url:app.dotUrl + '/nrom/getProducatori',
            minLength: 1,
            selected: {
                id: self.model.get('producator'),
                text: self.model.get('producator')
            },
            postData:{
                categorie: self.model.get('categorie'),
                ext:self.options.extensie
            }
        });
        // $('#categorie').w2field('enum',{
        //     minLength: 1,
        //     selected: {
        //         id: self.model.get('producator'),
        //         text: self.model.get('producator')
        //     },
        //     postData:{
        //         categorie: self.model.get('categorie'),
        //         ext:self.options.extensie
        //     }
        // });
        self.model.on('change', function(){
                 if (self.model.get('canBeDirty') && !window.isDirty.dirty){
                    window.isDirty.dirty = true;
                }
            });
            self.model.on('save',function(){
                if (window.isDirty.dirty){
                    window.isDirty.dirty = false;
                }
            });
        if (this.model.get('nr_registru')) {
            this.setReadOnly();
        }
    },
    setReadOnly: function() {
        $.each(this.$el.find('input,textarea'), function(i, el) {
            if ($(el).attr('id') !== 'producator' && $(el).attr('id') !== 'categorie') {
                $(el).prop('readonly', true);
            }
        });
        //this.$el.find('input,textarea').attr('disabled', true);
    },
    confirmReset: function() {
        var self = this;
        if (this.model.get('nr_registru')) {
            var changed = self.model.changedAttributes(),
                resetAttributes;
            if (changed) {
                var keys = _.keys(changed);
                resetAttributes = _.pick(self.model.previousAttributes(), keys);
            }
            w2confirm('Modificarea acestor date va duce la generarea unui<br><b>Numar de Registru</b> nou!<br>Continuati?')
                .yes(function() {
                    self.setModelNew.apply(self, arguments);
                })
                .no(function() {
                    self.model.off('change');
                    self.model.set(resetAttributes);
                    self.model.on('change', function() {
                        self.confirmReset.apply(self, arguments);
                    });
                });
        }
    },
    setModelNew: function() {
        this.model;
        var resetAttributes = {
            nr_registru: '',
            EntityState: 0,
            id: null
        };
        this.model.off('change');
        this.model.set(resetAttributes);
        app.trigger('dosare:resetTVV');
    },
    refreshModel:function(model){
        // this.unstickit();
        this.model.set(model);
        this.model.set('EntityState',3);
    }
});

},{"./../../templates/registru/general.hbs":62}],107:[function(require,module,exports){
var Globals = require('./../../globals');
var ipc = requireNode('ipc');
module.exports = Marionette.LayoutView.extend({
    expandedGrid: '',
    template: require('./../../templates/registru/index.hbs'),
    attributes: function() {
        return {
            style: 'height:100%'
        };
    },
    initialize: function(options) {
        this.id_cerere = options.id;
    },

    onShow: function(){
        //build page layout and regions
        var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
        this.$el.w2layout({
            name:'nrRegLayout',
            panels:[
                {type:'top', style:pstyle,resizable:false,size:'50px', toolbar: {
                    items: [
                        { type: 'check',  id: 'item1', caption: 'Vezi date existente', img: 'icon-page', checked: false },
                        { type: 'break',  id: 'break0' },
                        // { type: 'menu',   id: 'item2', caption: 'Drop Down', img: 'icon-folder', items: [
                        //     { text: 'Item 1', icon: 'icon-page' }, 
                        //     { text: 'Item 2', icon: 'icon-page' }, 
                        //     { text: 'Item 3', value: 'Item Three', icon: 'icon-page' }
                        // ]},
                        // { type: 'break', id: 'break1' },
                        // { type: 'radio',  id: 'item3',  group: '1', caption: 'Radio 1', img: 'icon-page', hint: 'Hint for item 3', checked: true },
                        // { type: 'radio',  id: 'item4',  group: '1', caption: 'Radio 2', img: 'icon-page', hint: 'Hint for item 4' },
                        // { type: 'spacer' },
                        // { type: 'button',  id: 'item5',  caption: 'Item 5', icon: 'w2ui-icon-check', hint: 'Hint for item 5' }
                    ],
                    onClick: function (event) {
                        w2ui['nrRegLayout'].toggle('preview')
                    }
                }},
                { type: 'main', style: pstyle, content: '<div id="workRegion" class="page">Work area</div>', title:'Zona Lucru' },
                { type: 'preview', size: '50%', resizable: true, hidden: false, style: pstyle, content: '<div id="resourceRegion" class="page">Resource Area</div>', title:'Zona date WVTA' },
            ]
        })
        this.addRegions({
            work: '#workRegion',
            resource: '#resourceRegion'
        });
        var TVVFormView = require('./tvvform');
        var tvvform = new TVVFormView({id_cerere : this.id_cerere});
        this.work.show(tvvform)
        w2ui['nrRegLayout'].toggle('preview')
    },

    onBeforeDestroy: function() {
        w2ui['nrRegLayout'].destroy()
    }

});

},{"./../../globals":24,"./../../templates/registru/index.hbs":63,"./tvvform":113}],108:[function(require,module,exports){
module.exports = Marionette.FormView.extend({
    initialize: function() {},
    bindings: {
        '[name="val"]': 'val',
        '[name="pseudo"]': 'pseudo',
        '[name="val_min"]': 'val_min',
        '[name="val_max"]': 'val_max',
        '[name="suggested_val"]':'suggested_val',
        '[name="suggested_valmin"]':'suggested_valmin',
        '[name="suggested_valmax"]':'suggested_valmax',
    },
    modelEvents: {
        'change': 'removeError'
    },
    // events:{
    //     'click [name="btnAddValue"]' : 'addValue',
    //     'click [name="btnDelValue"]' : 'removeValue'
    // },

    getTemplate: function() {
        switch (this.model.get('tip')) {
            case 'interval':
                return require('./../../templates/registru/interval.hbs');
            case 'lista':
                this.source = JSON.parse(this.model.get('sursa'));
                return require('./../../templates/registru/lista.hbs');
            case 'liber':
                return require('./../../templates/registru/liber.hbs');
            case 'memo':
                return require('./../../templates/registru/memo.hbs');
            case 'tag':
                return require('./../../templates/registru/tag.hbs');
        }
        return '<p>' + this.options.type + ' View El' + this.options.index + '</p>';
    },
    onViewRendered:function(){
        var self = this;
         self.model.on('change', function(){
                 if (self.model.get('canBeDirty') && !window.isDirty.dirty){
                    window.isDirty.dirty = true;
                }
            });
            self.model.on('save',function(){
                if (window.isDirty.dirty){
                    window.isDirty.dirty = false;
                }
            });
    },
    onRender: function() {
        // this.ensureElement();
        var self = this;
        if (this.model.get('tip') === 'lista' && this.model.get('multiple') !== 1) {
            this.$el.find('[name="val"]').w2field('list', {
                minLength: 0,
                items: self.source,
                selected: self.model.get('val')
            }).on('change', function() {
                var selected = $(this).data('selected');
                self.model.set('val', selected.id);
            });
        } else if (this.model.get('tip') === 'lista' && this.model.get('multiple') !== 1) {
            this.model.set('pseudo', this.model.get('val'));
        }else if(this.model.get('tip')==='tag'){
            var selected = self.model.get('val')?self.model.get('val').split('|'):['FARA']
            this.$el.find('[name="val"]').w2field('enum',{
                items:['FARA'],
                openOnFocus:true,
                selected:selected,
                onNew:function(event){
                    event.originalEvent.preventDefault();
                    console.log(event);
                     $.extend(event.item, { id:  event.item.id, text : event.item.text });
                }
            }).on('change', function() {
                var selected = $(this).data('selected');
                console.log(selected);
                var val = '';
                selected.map(function(el){
                    val += '|' + el.text;
                });
                self.model.set('val', val.substr(1,val.length));
            });;
        }
        if (this.model.get('isnumeric') === 1) {
            this.$el.find('input,select').prop('type','number').addClass('numeric');
        }
        this.$el.find('[name="pseudo"]').on('keyup',function(e){
            if(e.which == 46){
                self.model.set('val','');
                self.render();
            }
        });
        this.stickit();
    },
    serializeData: function() {
        var multivalues = [];
        if (this.model.get('multiple') === 1 && this.model.get('val')) {
            multivalues = this.model.get('val').split('|');
        }
        return {
            index: this.model.cid,
            val: this.model.get('val'),
            val_min: this.model.get('val_min'),
            val_max: this.model.get('val_max'),
            nume: this.model.get('nume'),
            source: this.source,
            multivalues: multivalues,
            multiple: this.model.get('multiple') === 1,
            deletable: multivalues.length > 1
        };
    },
    removeError: function() {
        var self = this;
        for (var i in this.model.changed) {
            self.$el.find('[name="' + i + '"]').removeClass('w2ui-error').w2tag('');
        }
        if(this.model.get('tip')==='interval'){
            if(this.model.get('val_max') && this.model.get('val_min') && Number(this.model.get('val_max')) !== 0  && Number(this.model.get('val_min')) > Number(this.model.get('val_max'))){
                self.$el.find('[name="val_max"]').addClass('w2ui-error').w2tag('Min > Max');
            }else{
                self.$el.find('[name="val_max"]').removeClass('w2ui-error').w2tag('');
            }
        }
    },

    addValue:function(e){
        app.trigger('dt:add:value',{ev:e});
    },
     removeValue:function(e){
        app.trigger('dt:remove:value',{ev:e});
    }

});

},{"./../../templates/registru/interval.hbs":64,"./../../templates/registru/liber.hbs":65,"./../../templates/registru/lista.hbs":66,"./../../templates/registru/memo.hbs":67,"./../../templates/registru/tag.hbs":72}],109:[function(require,module,exports){
module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/registru/mentiune.hbs'),
    bindings: {
        '[name="mentiune"]': 'mentiune',
        '[name="val_sup"]': 'val_sup'
    },
    events: {
        'click .btnRemoveCollection': 'removeModel'
    },
    onRender: function() {
        this.stickit();
    },
    removeModel: function() {
        this.model.set('EntityState', 2);
        app.trigger('mentiune:remove', this.model);
    },
    serializeData: function() {
        return {
            maxchar: 50 - this.model.get('mentiune').length
        };
    }
});

},{"./../../templates/registru/mentiune.hbs":68}],110:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = Marionette.CompositeView.extend({
    template: require('./../../templates/registru/mentiuni.hbs'),
    initialize: function() {
        var self = this;
        this.setPagePermissions();
        _.bindAll(this, 'concatenate');
        this.collection.comparator = function(model) {
            return model.get('id');
        };

        // call the sort method
        this.collection.sort();
        this.collection.on('change add remove', this.concatenate);
        this.listenTo(app, 'mentiune:remove', function(model) {
            var view = self.children.findByModel(model);
            view.destroy();
            window.isDirty.dirty = true;
            self.concatenate();
        });
    },
    attachHtml: function(collectionView, itemView, index) {
        if (itemView.model.get('EntityState') !== 2)
            collectionView.$el.append(itemView.el);
    },
    childView: require('./mentiune'),
    refreshUI: function() {
        if (w2ui.hasOwnProperty('gridSursaMentiuni')) {
            w2ui.gridSursaMentiuni.refreshFull();
        }
        this.concatenate();
    },
    concatenate: function() {
        var str = '';
        this.collection.each(function(model) {
            if (model.get('EntityState') !== 2) {
                var ment = model.get('mentiune') ? model.get('mentiune') : '';
                var vs = model.get('val_sup') ? model.get('val_sup') : '';
                str += ment + vs;
            }
        });
        var splittedArray = str.match(/.{1,50}/g) || [];

        var words = splittedArray.length > 0 ? splittedArray.join('\n') : '';
        $('#preview').text(words);

    },
    onShow: function() {
        var self = this;
        this.setSursa();
        this.concatenate();
        self.collection.on('add remove', function(){
                window.isDirty.dirty = true;
        });

    },
    enableEdit:function(){
      w2ui.gridSursaMentiuni.toolbar.enable('w2ui-add');
      w2ui.gridSursaMentiuni.toolbar.enable('w2ui-save');
      w2ui.gridSursaMentiuni.toolbar.enable('w2ui-delete');
    },
    setSursa: function() {
        var self = this;
        this.$el.find('#sursaMentiuni').w2grid({
            name: 'gridSursaMentiuni',
            url: app.dotUrl + '/nrom/getmentiuni',
            show: {
                toolbar: true,
                toolbarAdd: self.allowEdit,
                toolbarSave: self.allowEdit,
                toolbarDelete: self.allowEdit
            },
            onAdd: function() {
                this.add({
                    recid: 0
                });
            },
            recid: 'id',
            columns: [{
                field: 'id',
                hidden: true
            }, {
                field: 'mentiune',
                sortable: true,
                size: '100%',
                editable: {
                    type: 'text'
                }
            }],
            toolbar: {
                items: [{
                    type: 'button',
                    text: 'Adauga mentiunea',
                    icon: 'w2ui-icon-download',
                    onClick: function() {
                        var grid = w2ui.gridSursaMentiuni;

                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var comp = grid.get(id);
                            console.log(comp);
                            var exist = self.collection.find(function(model) {
                                return model.get('id_mentiune') === comp.id && model.get('EntityState') !== 2;
                            });
                            if (exist) {
                                w2alert('Componenta selectata exista deja!');
                            } else {
                                var Proto = require('./../../models/registru/mentiune');
                                var mdl = new Proto({
                                    id_mentiune: comp.id,
                                    mentiune: comp.mentiune,
                                    val_sup: ''
                                });
                                self.collection.add(mdl);
                            }
                        }
                        grid.selectNone();
                    }
                }]
            },
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
        });
    },
    setPagePermissions: function() {
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3], 'appdot'
        ]);
    },
    onBeforeDestroy: function() {
        if (w2ui.hasOwnProperty('gridSursaMentiuni'))
            w2ui.gridSursaMentiuni.destroy();

    },
});

},{"./../../models/registru/mentiune":34,"./../../templates/registru/mentiuni.hbs":69,"./mentiune":109}],111:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'fullscreen',
    template: require('./../../templates/registru/motoare.hbs'),
    initialize: function() {
        this.setPagePermissions();
        //this.collection.setGridName('gridMotoare');
    },
    refreshUI: function() {
        // if (!this.isrendered) {
        if (w2ui.hasOwnProperty('gridMotoare')){
            w2ui.gridMotoare.records = this.collection.toJSON();
            w2ui.gridMotoare.refreshFull();
        }
        if (w2ui.hasOwnProperty('gridSursa'))
            w2ui.gridSursa.refreshFull();
        this.isrendered = true;
        // }
    },
    onShow: function() {
        var self = this;
        this.renderGrid();
        this.renderSursa();
        self.collection.on('add remove', function(){
            window.isDirty.dirty = true;
        });
    },
    renderGrid: function() {
        console.log('render motor');
        var self = this;
        this.$el.find('#gridMotoare').w2grid({
            name: 'gridMotoare',
            show: {
                toolbar: true,
                toolbarDelete: self.allowEdit
            },
            records: self.collection.toJSON(),
            onDelete: function(event) {
                var ids = this.getSelection();
                event.onComplete = function() {
                    window.isDirty.dirty = true;
                    _.each(ids, function(id) {
                        var model = self.collection.find(function(s) {
                            return s.cid === id;
                        });
                        if (model.id)
                            model.set('EntityState', 2);
                        else
                            self.collection.remove(model);
                    });
                };
            },
            columns: [{
                field: 'cod',
                caption: 'Cod motor',
                size: '20%',
                sortable: true
            }, {
                field: 'puterekw',
                caption: 'Putere(kW)',
                size: '20%',
                sortable: true
            }, {
                field: 'puterecp',
                caption: 'Putere(CP)',
                size: '20%',
                sortable: true
            }, {
                field: 'rot_p_max',
                caption: 'Turatie putere',
                size: '20%',
                sortable: true
            },{
                field: 'cilindree',
                caption: 'Cilindree',
                size: '20%',
                sortable: true
            }, {
                field: 'tip',
                caption: 'Tip motor',
                size: '20%',
                sortable: true
            },
            {
                field: 'cod_poansonat',
                caption: 'Cod poansonat',
                size: '20%',
                sortable: true,
                editable:{
                    type:'text'
                }
            }],
            onChange: function(event) {
                event.onComplete= function(e){
                    console.log(event.value_new);
                    var model = self.collection.find(function(s) {
                        return s.cid === event.recid;
                    });
                    model.set('cod_poansonat',event.value_new);
                    w2ui[event.target].save();
                };

            }
        });
    },
    renderSursa: function() {
        var me = this;
        this.$el.find('#gridSursa').w2grid({
            name: 'gridSursa',
            recid: 'ndelcodmot',
            show: {
                toolbar: true
            },
            url: app.dotUrl + '/nrom/getmotoare',
            columns: [{
                field: 'ndelcodmot',
                caption: 'ID',
                hidden: true
            }, {
                field: 'cod',
                caption: 'Cod motor',
                size: '20%',
                sortable: true
            }, {
                field: 'p_max_kw',
                caption: 'Putere(kW)',
                size: '20%',
                sortable: true
            }, {
                field: 'p_max_cp',
                caption: 'Putere(CP)',
                size: '20%',
                sortable: true
            }, {
                field: 'cilindree',
                caption: 'Cilindree',
                size: '20%',
                sortable: true
            }, {
                field: 'tip_mot',
                caption: 'Tip motor',
                size: '20%',
                sortable: true
            }],
            onExpand: function(event) {
                var motor = this.get(event.recid);
                var DetaliiMotorView = require('./detaliiMotor');
                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%',
                    height: '250px'
                }).animate({
                    height: '250px'
                }, {
                    duration: 10,
                    complete: function() {
                        $.post(app.dotUrl + '/nrom/getdetaliimotor/' + motor.ndelcodmot, null, function(response) {
                            var Model = Backbone.Model.extend();
                            var model = new Model(response.motor);
                            var view = new DetaliiMotorView({
                                model: model
                            });
                            $('#' + event.box_id).html(view.render().el);
                            view.stickit();
                        });

                    }
                });
            },
            parser: function(responseText) {
                var data = $.parseJSON(responseText).data;
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            toolbar: {
                items: [{
                    type: 'button',
                    text: 'Transfera selectia',
                    icon: 'w2ui-icon-upload',
                    onClick: function() {
                        var grid = w2ui.gridSursa;
                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var motor = grid.get(id);
                            var exist = me.collection.find(function(model) {
                                return model.get('id_motor') === motor.ndelcodmot;
                            });
                            if (exist) {
                                w2alert('Motorul selectat exista deja!');
                            } else {
                                var Proto = require('./../../models/registru/motor');
                                var mdl = new Proto({
                                    id_motor: motor.ndelcodmot,
                                    cod: motor.cod,
                                    tip: motor.tip_mot,
                                    puterecp: motor.p_max_cp,
                                    rot_p_max:motor.rot_p_max,
                                    puterekw: motor.p_max_kw,
                                    cilindree: motor.cilindree
                                });
                                me.collection.add(mdl);
                                w2ui.gridMotoare.add(mdl.toJSON())
                            }
                        }
                        grid.refresh();
                        grid.selectNone();
                        
                    }
                }]
            }
        });
    },
    setPagePermissions: function() {
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3], 'appdot'
        ]);

    },
    onBeforeDestroy: function() {
        if (w2ui.hasOwnProperty('gridMotoare'))
            w2ui.gridMotoare.destroy();
        if (w2ui.hasOwnProperty('gridSursa'))
            w2ui.gridSursa.destroy();
    },
});

},{"./../../models/registru/motor":35,"./../../templates/registru/motoare.hbs":70,"./detaliiMotor":105}],112:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'fullscreen',
    template: require('./../../templates/registru/sisteme.hbs'),
    initialize: function() {
        this.setPagePermissions();
        //this.collection.setGridName('gridSisteme');
    },
    refreshUI: function() {
    	var self = this;
    	if (w2ui.hasOwnProperty('gridSisteme')){
            w2ui.gridSisteme.records = this.collection.toJSON();
            w2ui.gridSisteme.refreshFull();
        }
        if (w2ui.hasOwnProperty('gridSursaSist')){
             w2ui.gridSursaSist.refresh();
        }
         else
         	$.get(app.dotUrl + '/nrom/getlimitari/'+self.options.categorie,null,function(response){
        		self.sourceItems=response;
        		self.renderSursa();
        	});
        this.isRendered = true;
    },
    onShow: function() {
        var self = this;
        this.renderGrid();
        if (!this.options.isnew){
        	$.get(app.dotUrl + '/nrom/getlimitari/'+self.options.categorie,null,function(response){
        		response.map(function(s){
        			s.recid = s.id;
        			s.items = s.cerinte;
        			return s;
        		});
        		self.sourceItems=response;
        		self.renderSursa();
        	});

        }
        self.collection.on('add remove', function(){
                window.isDirty.dirty = true;
        });
    },
     renderGrid: function() {
        var self = this;
        this.$el.find('#gridSisteme').w2grid({
            name: 'gridSisteme',
            show: {
                toolbar: true,
                toolbarDelete:true,
                selectColumn: true
            },
            records: self.collection.toJSON(),
            onDelete: function(event) {
                var ids = this.getSelection();
                event.onComplete = function() {
                    window.isDirty.dirty = true;
                    _.each(ids, function(id) {
                        var model = self.collection.find(function(s) {
                            return s.cid === id;
                        });
                        if (model.id)
                            model.set('EntityState', 2);
                        else
                            self.collection.remove(model);
                    });
                };
            },
            columns: [{
            	field:'id_comp',
            	hidden:true,
            },{
            	field:'id_cerinta',
            	hidden:true,
            },{
                field: 'act_normativ',
                caption: 'Act normativ',
                size: '30%',
                sortable: true
            }, {
                field: 'categorie',
                caption: 'Aplicare',
                size: '60%',
                sortable: true
            }, {
                field: 'cerinta',
                caption: 'Cerinta',
                size: '30%',

            },
            {
                field: 'datain',
                caption: 'Data Aplicarii',
                size: '10%',
                sortable: true,
                type: 'date'
            },
            {
                field: 'data_exp',
                caption: 'Data Expirarii',
                size: '10%',
                sortable: true,
                type: 'date'
            }]
        });
    },
    renderSursa:function(){
    	var me = this;
        this.$el.find('#gridSursaSist').w2grid({
            name: 'gridSursaSist',
            recid: 'id',
            show: {
                toolbar: true,
                selectColumn:true
            },
            records:me.sourceItems,
            // url: app.dotUrl + '/nrom/getsisteme',
            columns: [{
                field: 'id',
                hidden: true
            },{
                field: 'id_cerinta',
                hidden: true
            },
            {
                field: 'coloana',
                caption:'Coloana',
                size:'100px',
                sortable:true
            },{
                field: 'act_normativ',
                caption: 'Act normativ',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            },
            {
            	field:'cerinta',
            	caption:' <b style="color:red">CERINTA SE SELECTEAZA DIN LISTA DACA E CAZUL!</b>',
            	size:'30%',
            	 editable:{
            		type:'list',
            		onChange:function(e){
            			var selected = e.item;
            			if(e.item.id){
	            			console.log(selected.data_exp);
	            			var grid = w2ui.gridSursaSist;
	            			var recid = grid.getSelection()[0];
	            			grid.set(recid,{data_exp:e.item.data_exp,cerinta:e.item.text,id_cerinta:e.item.id});
	            		}
            		}
            	}
            },
            {
                field: 'categorie',
                caption: 'Aplicare',
                size: '50%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            }, {
                field: 'datain',
                caption: 'Data aplicarii',
                size: '10%',
                sortable: true,
                type: 'date',
                editable: {
                    type: 'date'
                }
            },
             {
                field: 'data_exp',
                caption: 'Data expirarii',
                size: '10%',
                sortable: true,
                type: 'date',
                editable: {
                    type: 'date'
                }
            },{
                field: 'categorie_ue',
                caption: 'Categorii',
                size: '20%',
                sortable: true,
                type: 'text',
                editable: {
                    type: 'text'
                }
            }],
     //        onEditField:function(event){
     //        	event.onComplete=function(data){
					// var record = this.get(data.recid);
					// var tr = $('#grid_' + this.name + '_rec_' + w2utils.escapeId(data.recid));
	    //         	var el = tr.find('[col=' + data.column + '] > div');
	    //         	var input = $(el).find('input').get(0);
	    //         	console.log(record);
	    //         	switch(this.columns[data.column].field){
	    //         		case 'litera':
	    //         			$(input).w2field().options.items=['C','D'];
	    //         			break;
	    //         	}
     //        	}

     //        },
            // onExpand:function(event){
            // 	if (w2ui.hasOwnProperty('gridCerinte_' + event.recid)) {
            //         w2ui['gridCerinte_' + event.recid].destroy();
            //     }
            //     $('#' + event.box_id).css({
            //         margin: '0px',
            //         padding: '0px',
            //         width: '100%',
            //         'min-height':'200px'
            //     }).animate({
            //         height: '200px'
            //     }, {
            //         duration: 10,
            //         complete: function() {
            //             var record = w2ui['gridSursaSist'].get(event.recid);
            //             record.cerinte.map(function(c){
            //             	c.recid = c.id;
            //             	return c;
            //             });
            //             $('#' + event.box_id).w2grid({
            //             	name:'gridCerinte_' + event.recid,
            //             	show:{
            //             		toolbar:false,
            //             		selectColumn:true
            //             	},
            //             	multiSelect:false,
            //             	records:record.cerinte,
            //             	columns:[
            //             		{field:'id'},
            //             		{field:'cerinta',caption:'Cerinta',size:'20%'},
            //             		{field:'datain',caption:'Data',size:'20%'},
            //             		{field:'data_exp',caption:'Data Exp',size:'20%'}
            //             	]
            //             });
            //         }
            //     });
            // },
            toolbar: {
                items: [{
                    type: 'button',
                    text: 'Transfera selectia',
                    icon: 'w2ui-icon-upload',
                    onClick: function() {
                        console.log('sisteme');
                        var grid = w2ui.gridSursaSist;
                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var comp = grid.get(id);
                            var exist = me.collection.find(function(model) {
                                return model.get('id_comp') === comp.id;
                            });
                            if (exist) {
                                w2alert('Componenta selectata exista deja!');
                            }else if(!comp.cerinta){
                                w2alert('Va rog selectati o valoare in coloana "CERINTA"');
                            }else {
                                var Proto = require('./../../models/registru/sistem')
                                var mdl = new Proto({
                                    id_comp: comp.id,
                                    act_normativ: comp.act_normativ,
                                    datain: comp.datain,
                                    data_exp:comp.data_exp,
                                    cerinta:comp.cerinta,
                                    id_cerinta:comp.id_cerinta,
                                    categorie: comp.categorie
                                });
                                me.collection.add(mdl);
                                w2ui.gridSisteme.add(mdl.toJSON())
                            }
                        }
                        grid.selectNone();
                    }
                }]
            }
        });

    },
    setPagePermissions: function() {
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3], 'appdot'
        ]);

    },
    onBeforeDestroy: function() {
        if (w2ui.hasOwnProperty('gridSisteme'))
            w2ui.gridSisteme.destroy();
        if (w2ui.hasOwnProperty('gridSursaSist'))
            w2ui.gridSursaSist.destroy();
    }
});

},{"./../../models/registru/sistem":37,"./../../templates/registru/sisteme.hbs":71}],113:[function(require,module,exports){
var ipc = requireNode('ipc');
var Globals = require('./../../globals');
var ModelDef = require('./../../models/registru/tvvsextensie');
module.exports = Marionette.LayoutView.extend({
    template: require('./../../templates/registru/tvvform.hbs'),
    // classname: 'fullscreen',
    initialize: function () {
        var self = this;
        this.model = new ModelDef();
        if(this.options.id_cerere){
            $.ajax({
                url:app.dotUrl + 'doiit/getTvvExtensieByCerere/'+ this.options.id_cerere,
                dataType:'json',
                contentType:'application/json',
                success:function(response){
                    self.model.set(response)
                    self.setPagePermissions();
                    self.buildSubViews();
                    self.formID = 'formTVV' + self.model.id;
                    self.buildView();
                    self.setButtons();
                    self.attachActions();
                }
            });
        }else{
            this.setPagePermissions();
            this.buildSubViews();
            this.listenTo(app, 'dosare:resetTVV', this.setModelNew);
            this.listenTo(app, 'dosare:reloadTVV', this.reloadTVV);
            this.formID = 'formTVV' + this.model.id;
        }
    },
    setPagePermissions: function () {
        this.allowUnlock = ipc.sendSync('user:request:isuserinrole', [
            [1, 9], 'appdot'
        ]) && this.model.get('SetDateTVV').get('validat') === 1;
        this.allowValidate = ipc.sendSync('user:request:isuserinrole', [
            [1, 9, 11], 'appdot'
        ]);
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3, 11], 'appdot'
        ]);
        this.allowCerificateView = ipc.sendSync('user:request:isuserinrole', [
            [1, 3, 9, 11], 'appdot'
        ]);
    },
    toggleValidateButton: function (dirty) {
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if (this.allowValidate) {
            if (dirty)
                box.find('#btnValideaza').prop('disabled', true);
            else
            if (this.model.get('SetDateTVV').id)
                box.find('#btnValideaza').prop('disabled', false);

        }
        this.toggleFisaButton();
    },
    toggleFisaButton: function () {
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if (this.model.get('SetDateTVV').id)
            box.find('#btnPrintFisa').prop('disabled', false);
        else
            box.find('#btnPrintFisa').prop('disabled', true);
    },
    buildSubViews: function () {
        var GView = require('./general');
        this.GeneralView = new GView({
            model: this.model.get('TVV'),
            extensie: this.model.get('id_extensie')
        });
        var MView = require('./dateTehnice');
        this.MaseView = new MView({
            type: 'mase',
            collection: this.model.get('SetDateTVV').get('DateTehnice') //.byGroup('mase')
        });
        var PView = require('./dateTehnice');
        this.PoluareView = new PView({
            type: 'poluare',
            iswltp:this.model.get('SetDateTVV').get('iswltp'),
            collection: this.model.get('SetDateTVV').get('DateTehnice') //.byGroup('poluare')
        });
        this.listenTo(app,'wltp:changed',function(val){
            if(val) this.model.get('SetDateTVV').set('iswltp',1);
            else this.model.get('SetDateTVV').set('iswltp',0);
        });
        var DView = require('./dateTehnice');
        this.DimensiuniView = new DView({
            type: 'dimensiuni',
            collection: this.model.get('SetDateTVV').get('DateTehnice') //.byGroup('dimensiuni')
            //collection : _.filter(this.model.get('SetDateTVV').get('DateTehnice').models,function(m){return m.get('grupa') === 'dimensiuni'})
        });
        var AxView = require('./dateTehnice');
        this.AxeView = new AxView({
            type: 'axe',
            collection: this.model.get('SetDateTVV').get('DateTehnice') //.byGroup('axe')
        });
        var AlView = require('./dateTehnice');
        this.AlteView = new AlView({
            type: 'altele',
            collection: this.model.get('SetDateTVV').get('DateTehnice') //.byGroup('altele')
        });

        var AnView = require('./anvelope');
        this.AnvelopeView = new AnView({
            collection: this.model.get('SetDateTVV').get('Anvelope')
        });
        var TView = require('./dateTehnice');
        this.TransmisieView = new TView({
            type: 'cv',
            collection: this.model.get('SetDateTVV').get('DateTehnice') //.byGroup('cv')
        });
        var MView = require('./motoare');
        this.MotoareView = new MView({
            collection: this.model.get('SetDateTVV').get('Motoare')
        });
        var SView = require('./sisteme');
        this.SistemeView = new SView({
            collection: this.model.get('SetDateTVV').get('Sisteme'),
            categorie: this.model.get('TVV').get('categorie'),
            isnew: this.model.get('TVV').isNew()
        });
        var MnView = require('./mentiuni');
        this.MentiuniView = new MnView({
            collection: this.model.get('SetDateTVV').get('Mentiuni')
        });
    },
    open: function () {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'nrRegistruEditor' + self.model.id,
            title: 'Date TVV',
            width: '1000px',
            showMin: true,
            showMax: true,
            height: '650px',
            resizable: true,
            toolbarButtons:(self.allowUnlock ? [{id:'unlock',className:'w2ui-icon-lock',click:self.unlockButtons.bind(self)}]:null),
            onOpen: function (event) {
                event.onComplete = function () {
                    self.buildView();
                    self.setButtons();
                    self.attachActions();
                    // self.win.buttons = $('#formButtons').html();
                };
            },
            onClose: function (event) {
                self.destroy();
            },
            buttons: self.getButtonsHtml()
        });
    },
    getButtonsHtml: function () {
        return '<div id="formButtons" style="display:none">'+
        '<span id="editButtons">'+
        '<button class="btn btn-blue" id="btnSave"><i class="w2ui-icon-save"></i> Salveaza</button>'+
        '<button class="btn btn-orange" id="btnImportDate"><i class="w2ui-icon-upload"></i> Importa datele de la extensia anterioara</button>'+
        '<button class="btn btn-green" id="btnValideaza"><i class="w2ui-icon-check"></i> Valideaza datele!</button>'+
        '</span>'+
        '<span id="operButtons">'+
        '<button class="btn btn-blue" id="btnPrintCert"><i class="w2ui-icon-print"></i> Certificat</button>  '+
        '<button class="btn btn-orange" id="btnPrintAtestat"><i class="w2ui-icon-print"></i> Atestat</button>'+
        '</span>'+
        '<button class="btn btn-green" id="btnPrintFisa"><i class="w2ui-icon-print"></i> Fisa</button>'+
        '<button class="btn btn-red" id="btnClose"><i class="w2ui-icon-cross"></i> Inchide</button>'+
        '<button class="btn btn-orange" id="copyButton" style="display:none"><i class="w2ui-icon-copy"></i> Copy</button>'+
        '<button class="btn btn-orange" id="pasteButton" style="display:none"><i class="w2ui-icon-copy"></i> Paste</button>'+
        '</div>';
    },
    onShow: function () {
        // this.$el.css({
        //     'opacity': 0
        // });
        // this.open();
        // this.setButtons();
    },
    setButtons: function () {
        var box = this.$el;//$('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if(this.options.tip_completare === 9){
            $('#btnImportDate').hide();
            box.find('#editButtons').hide();
            box.find('#copyButton').show();
        }else{
            if(Globals.getClipboard()){
                box.find('#pasteButton').show();
            }
            if (this.model.get('SetDateTVV').get('importat') || this.model.get('TVV').isNew()) {
                $('#btnImportDate').prop('disabled', true);
            }
            if (this.model.get('SetDateTVV').get('validat') === 1) {
                box.find('#editButtons').hide();
                if (this.model.get('TVV').get('nr_registru') && this.allowCerificateView) {
                    box.find('#operButtons').show();
                } else {
                }
            } else {
                if (!this.allowValidate) {
                    box.find('#btnValideaza').hide();
                }else{
                    if(!this.model.get('SetDateTVV').id)box.find('#btnValideaza').prop('disabled',true);
                }
                if (this.allowEdit)
                    box.find('#editButtons').show();
                else
                    box.find('#editButtons').hide();
            }
            box.find('#formButtons').show();
            this.toggleFisaButton();
        }
    },
    events: {
        'click #btnSave': 'save',
        'click #btnClose': 'close',
        'click #btnImportDate': 'importDate',
        'click #btnValideaza': 'validareDate',
        'click #btnPrintCert': 'printCerificat',
        'click #btnPrintAtestat': 'printAtestat',
        'click #copyButton': 'copyDate',
        'click #pasteButton': 'pasteDate',
        'click #btnPrintFisa': 'printFisa'
    },
    attachActions:function() {
        var self = this;
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        box.find('#btnSave').on('click', self.save.bind(self));
        box.find('#btnClose').on('click', self.close.bind(self));
        box.find('#btnImportDate').on('click', self.importDate.bind(self));
        box.find('#btnValideaza').on('click', self.validareDate.bind(self));
        box.find('#btnPrintCert').on('click', self.printCerificat.bind(self));
        box.find('#btnPrintAtestat').on('click', self.printAtestat.bind(self));
        box.find('#btnPrintFisa').on('click', self.printFisa.bind(self));
        box.find('#copyButton').on('click', self.copyDate.bind(self));
        box.find('#pasteButton').on('click', self.pasteDate.bind(self));
        box.find('#formButtons').show();
    },
    buildView: function () {
        var tabs;
        var hideTab = this.model.get('SetDateTVV').get('DateTehnice').models.length === 0 || this.options.tip_completare === 1;
        tabs = [{
            id: 'tabTVV',
            caption: 'Date generale',
            hint: 'GeneralView',
            index: 1
        }, {
            id: 'tabMase',
            caption: 'Mase',
            hint: 'MaseView',
            index: 3,
            hidden: hideTab
        }, {
            id: 'tabDimensiuni',
            caption: 'Dimensiuni',
            hint: 'DimensiuniView',
            index: 2,
            hidden: hideTab
        }, {
            id: 'tabAxe',
            caption: 'Axe',
            hint: 'AxeView',
            index: 7,
            hidden: hideTab
        }, {
            id: 'tabAltele',
            caption: 'Alte Date',
            hint: 'AlteView',
            index: 9,
            hidden: hideTab
        }, {
            id: 'tabAnvelope',
            caption: 'Anvelope',
            hint: 'AnvelopeView',
            index: 8,
            hidden: hideTab
        }, {
            id: 'tabTransmisie',
            caption: 'Transmisie',
            hint: 'TransmisieView',
            index: 6,
            hidden: hideTab
        }, {
            id: 'tabMotor',
            caption: 'Motor',
            hint: 'MotoareView',
            index: 4,
            hidden: hideTab
        }, {
            id: 'tabPoluare',
            caption: 'Poluare',
            hint: 'PoluareView',
            index: 5,
            hidden: hideTab
        }, {
            id: 'tabComponente',
            caption: 'Componente/Sisteme',
            hint: 'SistemeView',
            index: 10,
            hidden: hideTab
        }, {
            id: 'tabMentiuni',
            caption: 'Mentiuni',
            hint: 'MentiuniView',
            index: 11,
            hidden: hideTab
        }];


        //setam ordinea de afisare a taburilor
        tabs = _.sortBy(tabs, 'index');
        var me = this;
        //construim forma
        this.$el.find('#tvvForm').w2form({
            name: me.formID,
            tabs: tabs,
            focus: 1000
        });
        w2ui[me.formID].tabs.onClick = this.tabClicked.bind(this);
        this.setRegions();
        // this.GeneralView.setupView();
        if (this.model.get('TVV').get('nr_registru'))
            this.GeneralView.setReadOnly();
        this.$el.css({
            'opacity': 1
        });

    },
    setRegions: function () {
        this.addRegions({
            'dategenerale': '#tabTVV',
            'dimensiuni': '#tabDimensiuni',
            'mase': '#tabMase',
            'axe': '#tabAxe',
            'altele': '#tabAltele',
            'transmisie': '#tabTransmisie',
            'motor': '#tabMotor',
            'poluare': '#tabPoluare',
            'anvelope': '#tabAnvelope',
            'sisteme': '#tabSisteme',
            'mentiuni': '#tabMentiuni',
        });
        this.dategenerale.show(this.GeneralView);
        this.dimensiuni.show(this.DimensiuniView);
        this.mase.show(this.MaseView);
        this.axe.show(this.AxeView);
        this.motor.show(this.MotoareView);
        this.altele.show(this.AlteView);
        this.transmisie.show(this.TransmisieView);
        this.poluare.show(this.PoluareView);
        this.anvelope.show(this.AnvelopeView);
        this.sisteme.show(this.SistemeView);
        this.mentiuni.show(this.MentiuniView);
    },
    tabClicked: function (tab) {
        var me = this;
        // if (me.forceValidation && me[tab.tab.hint].forceValidation)
        //     me[tab.tab.hint].forceValidation.apply(me[tab.tab.hint], arguments);

        // var div = document.getElementById(tab.target),
        //     divDisplay = div.className,
        //     observer = new MutationObserver(function() {
        //         var currentDisplay = div.className;
        //         if (divDisplay !== currentDisplay && currentDisplay.indexOf('active') !== -1) {
        //             if (me[tab.tab.hint].refreshUI)
        //                 me[tab.tab.hint].refreshUI.apply(me[tab.tab.hint], arguments);
        //         }
        //     });

        // //observe changes
        // observer.observe(div, {
        //     attributes: true
        // });
        // $('.tab.active').removeClass('active');
        // $('#' + tab.target).addClass('active');
        if (me[tab.tab.hint].refreshUI)
            me[tab.tab.hint].refreshUI.apply(me[tab.tab.hint], arguments);
        if (me.forceValidation)
            w2utils.validate(me.model, me.$el);
    },
    unlockButtons:function(){
      var self = this;
      var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
      $.get(app.dotUrl + '/nrom/GetStatusTVV',{id:self.model.get('TVV').get('id')},function(response){
        if(response.hasCIV >= 1){
          self.GeneralView.setReadOnly();
          self.MaseView.setReadOnly();
          self.DimensiuniView.setReadOnly();
          self.AxeView.setReadOnly();
          self.AlteView.setReadOnly();
          self.PoluareView.setReadOnly();
          self.TransmisieView.setReadOnly();
          self.AnvelopeView.enableEdit();
          self.MentiuniView.enableEdit();
        }else{
          self.GeneralView.setReadOnly();
          self.AnvelopeView.enableEdit();
          self.MentiuniView.enableEdit();
        }
        box.find('#editButtons').show();
      })

    },
    onBeforeDestroy: function () {
        var me = this;
        // _.each(w2ui['tabsTVV' + me.cid].tabs, function(tab) {
        //     if (me[tab.hint])
        //         me[tab.hint].destroy();
        // });
        //w2ui[me.formID].destroy();
    },
    enableTabs: function () {
        var me = this;
        _.each(w2ui[me.formID].tabs.tabs, function(tab) {
            if (tab.hidden)
                w2ui[me.formID].tabs.show(tab.id);
        });
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if (!this.model.get('SetDateTVV').get('importat'))
            box.find('#btnImportDate').prop('disabled', false);
    },
     save: function() {
        var self = this;
        //this.forceValidation = true;
        // console.log(self.model.toJSON());
        // return;
        //if (w2utils.validate(this.model, this.$el)) {
           w2utils.lock(self.$el, 'Va rugam asteptati', true);
            var isNew = self.model.get('TVV').isNew() && !self.modifTVVExistent;
            if (!isNew) {
                self.model.get('TVV').set('tip_tvv', 4);
            }
            this.model.save({}, {
                silent: true,
                success: function(response) {
                    window.isDirty.dirty = false;
                    // if (response.get('SetDateTVV').get('bun') == 0) {
                    //     w2alert('ATENTIE!<br>TVV-ul nu este valid deoarece nu indeplineste cerintele ' + response.get('SetDateTVV').get('cineapus_bun') + ' intrate in vigoare la data ' + response.get('SetDateTVV').get('data_bun'));
                    // }
                    if (isNew) {
                        self.refreshSubviews(response.get('SetDateTVV'));
                        self.SistemeView.options.categorie = self.model.get('TVV').get('categorie');
                        self.SistemeView.options.isnew = false;
                        self.SistemeView.refreshUI();
                        self.enableTabs();
                        app.trigger('dosar:tvv:add', response);
                    }else{
                        app.trigger('dosar:tvv:modified', self.model.get('TVV'));
                    }
                    self.setButtons();
                    var opt = {
                        title: 'Notificare',
                        text: 'Inregistrarea a fost salvata!',
                        type: 'success-template'
                    };
                    ipc.send('app:notification:show', opt);
                    w2utils.unlock(self.$el);
                },
                error: function(response) {
                    var opt = {
                        title: 'Eroare',
                        text: response,
                        type: 'error-template'
                    };
                    ipc.send('app:notification:show', opt);
                    w2utils.unlock(self.$el);
                }
            });
        //}
        //console.log(this.model.toJSON());

    },
    refreshSubviews: function(data) {
        var self = this;
        self.model.set('SetDateTVV', data);
        self.MaseView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('mase');
        self.MaseView.render();
        // self.MaseView.attachChangeEvent();
        self.DimensiuniView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('dimensiuni');
        self.DimensiuniView.render();
        self.AxeView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('axe');
        self.AxeView.render();
        self.AlteView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('altele');
        self.AlteView.render();
        self.PoluareView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('poluare');
        self.PoluareView.render();
        self.TransmisieView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('cv');
        self.TransmisieView.render();
        self.SistemeView.collection = self.model.get('SetDateTVV').get('Sisteme');
        self.SistemeView.options.categorie= self.model.get('TVV').get('categorie'),
        self.SistemeView.refreshUI();
        self.MentiuniView.collection = self.model.get('SetDateTVV').get('Mentiuni');
        self.MentiuniView.refreshUI();
        self.MotoareView.collection = self.model.get('SetDateTVV').get('Motoare');
        self.MotoareView.refreshUI();
        self.AnvelopeView.collection = self.model.get('SetDateTVV').get('Anvelope');
        self.AnvelopeView.refreshUI();
    },

    reloadTVV:function(tvv){
        var self = this;
        var oldid = self.model.get('TVV').id;
        //check if we have a set of data with new tvv
        $.get(app.dotUrl + 'nrom/getsetdatetvvextensie',{id_tvv:tvv.id,id_extensie:self.model.get('id_extensie')},function(set){
            self.model.set('TVV', tvv);
            self.model.set('id_tvv',tvv.id);
        // self.GeneralView.model = self.model.get('TVV');
            self.GeneralView.refreshModel(tvv);
            if(self.model.get('TVV').get('nr_registru'))
            self.GeneralView.setReadOnly();
            if(set.id){
                self.refreshSubviews(set);
            }
            // app.trigger('dosar:tvv:edit',{old:oldid,tvv:tvv});
        });
            
    },

    importDate: function(e) {
        var self = this;
        w2confirm('Sigur doriti aducerea datelor de la extensia anterioara?<br>Datele existente se vor sterge!').yes(function() {
            w2utils.lock(self.$el, 'Va rugam asteptati', true);
            $.ajax({
                type: 'POST',
                url: app.dotUrl + '/nrom/importDateTvv',
                data: {
                    id_tvv: self.model.get('id_tvv'),
                    id_extensie: self.model.get('id_extensie'),
                    nr_registru_curent:self.model.get('TVV').get('nr_registru'),
                    nr_registru_preluat:self.model.get('TVV').get('nr_registru_vechi'),
                    wvta: self.model.get('TVV').get('wvta')
                },
                success: function(response) {
                    //console.log(response);
                    response.importat = 1;
                    response.validat = 0;
                    response.verificat = '';
                    self.refreshSubviews(response);
                    $(e.target).attr('disabled', true);
                },
                error: function(error) {
                    w2utils.unlock(self.$el);
                    w2alert(error.responseText);
                }
            }).done(function() {
                window.isDirty.dirty = false;
                w2utils.unlock(self.$el);

            });
        });

    },
    validareDate: function() {
        var self = this;
        var host;
        w2confirm('Sigur validati acest numar?').yes(function(){
            if (w2utils.validate(self.model, self.$el)) {
            w2utils.lock(self.$el, 'Va rugam asteptati', true);
                ipc.sendSync('user:request:host', null, function(compname) {
                        host = compname;
                        self.model.get('SetDateTVV')
                            .set('validat', 1)
                            .set('verificat', host)
                            .set('expert', app.User.expert);
                        });
                $.ajax(
                    {
                        dataType:'json',
                        contentType:'application/json',
                        type:'POST',
                        url:app.dotUrl + '/nrom/validaresetdate/'+self.model.id,
                        data:JSON.stringify(self.model.get('SetDateTVV').toJSON()),
                        success: function(response) {
                            // self.model.get('SetDateTVV').set(response.set);
                            if (response.status === 'invalid') {
                                self.model.get('SetDateTVV')
                                .set('validat', 0)
                                .set('verificat', '')
                                .set('expert', '');
                                w2confirm('ATENTIE!<br>TVV-ul nu este valid deoarece nu indeplineste cerintele ' + response.set.regulament + ' intrate in vigoare la data ' + response.set.data+'<br>Sigur validati?')
                                    .yes(function() {
                                           self.model.get('SetDateTVV')
                                            .set('validat', 1)
                                            .set('verificat', host)
                                            .set('override_bun',host)
                                            .set('expert', app.User.expert);
                                            $.ajax({
                                                dataType:'json',
                                                contentType:'application/json',
                                                type:'POST',
                                                url:app.dotUrl + '/nrom/overridevalidaresetdate/'+self.model.id,
                                                data:JSON.stringify(self.model.get('SetDateTVV').toJSON()),
                                                success:function(response){
                                                    // self.model.get('SetDateTVV').set(response.set);
                                                    app.trigger('dosar:tvv:modified', self.model.get('TVV'));
                                                    self.setButtons();
                                                    var opt = {
                                                        title: 'Notificare',
                                                        text: 'Datele au fost validate!',
                                                        type: 'success-template'
                                                    };
                                                    ipc.send('app:notification:show', opt);
                                                    w2utils.unlock(self.$el);
                                                }
                                            });
                                    })
                                    .no(function() {
                                        w2utils.unlock(self.$el);
                                    });
                            } else {
                                     app.trigger('dosar:tvv:modified', self.model.get('TVV'));
                                    self.setButtons();
                                    var opt = {
                                        title: 'Notificare',
                                        text: 'Datele au fost validate!',
                                        type: 'success-template'
                                    };
                                    ipc.send('app:notification:show', opt);
                                    w2utils.unlock(self.$el);
                            }
                        }
                });
            }
        });

    },

    printCerificat: function() {
        var url = app.dotUrl + '/nrom/printcomunicare/?id=' + this.model.id;
        ipc.send('app:request:pdf', url);
    },
    printAtestat: function() {
        var url = app.dotUrl + '/nrom/printatestat/?id=' + this.model.id;
        ipc.send('app:request:pdf', url);
    },
    printFisa: function() {
        //if(!this.model.id){
        //    w2alert('Acest Numar de Registru este generat in sistemul vechi! Va rugam consultati aplicatia APPROVAL!');
        //}else{
            console.log('printfisa');
            var url = app.dotUrl + '/nrom/printfisasistem/?nr_registru=' + this.model.get('nr_registru')+'&extensie='+this.model.get('extensie') + '&id=' + this.model.id;
            ipc.send('app:request:pdf', url);
        //}
    },
    setModelNew: function(fromClipboard) {
        if(!fromClipboard){
            this.model.set({
                id: null,
                EntityState: 0,
                id_tvv: 0,
                tip_activ: 0
            });
            this.model.get('SetDateTVV').set({
                EntityState: 0,
                id_tvv: null,
                validat: null,
                verificat: ''
            });
        }
        this.model.get('SetDateTVV').get('DateTehnice').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Anvelope').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Motoare').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Mentiuni').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Sisteme').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });

        this.modifTVVExistent = true;
        this.setButtons();

    },

    copyDate:function(){
        $('#copyButton').attr('disabled',true);
        Globals.setClipboard(this.model.get('SetDateTVV'));
    },
    pasteDate:function(){
        var self = this;
        $('#pasteButton').attr('disabled',true);
        var clipboard = Globals.getClipboard();
        if(clipboard){
            w2confirm('Datele existente se vor sterge! Sigur doriti inlocuirea datelor?').yes(function(){
                $.ajax({
                    type: 'POST',
                    url: app.dotUrl + '/nrom/DeleteSetDateExistent',
                    data: {
                        id_tvv: self.model.get('id_tvv'),
                        id_extensie: self.model.get('id_extensie')
                    },
                    success: function(response) {
                        console.log(response);
                        clipboard.importat = 1;
                        clipboard.validat = 0;
                        clipboard.verificat = '';
                        clipboard.set('id_tvv',response.id_tvv);
                        clipboard.set('id_extensie',response.id_extensie);
                        self.refreshSubviews(clipboard);
                        self.setModelNew(true);
                        Globals.clearClipboard();
                    }
                });

            });

        }
    },

    close: function () {
        window.isDirty.dirty = false;
        this.win.close();
    }
});
},{"./../../globals":24,"./../../models/registru/tvvsextensie":39,"./../../templates/registru/tvvform.hbs":73,"./anvelope":101,"./dateTehnice":104,"./general":106,"./mentiuni":110,"./motoare":111,"./sisteme":112}],114:[function(require,module,exports){
var Model = require('./../../models/vehiculciv');
var Collection = require('./../../collections/vehiculeciv');
module.exports = Marionette.ItemView.extend({
	
	template:require('./../../templates/arhivare.html'),
	className: 'windowContent w2ui-reset w2ui-form',
	events:{
		'click #btnSave':'arhivare',
		'click #btnClose':'closeView',
		'click #btnNext':'next',
		'click #btnPrev':'prev',
		'click #btnLast':'last',
		'click #btnFirst':'first',
		'keyup #serieciv':'gotofolie',
		'blur #serieciv':'gotofolie',
		'keyup #vin1':'lookup',
		'blur #vin1':'lookup',
		'keyup #folie_civ':'gotosave'
	},
	bindings:{
	},

	init:function(){
		this.controller = this.options.controller;
	},

	onShow:function(){
		this.collection = new Collection(this.options.data);
		this.model = this.collection.models[0];
		this.open();
	},

	open:function(){
		var self = this;
	    this.win = self.$el.w2panel({
	        name: 'civReport' + self.cid,
	        title: 'Arhivare CIV',
	        width: '1000',
	        showMin: true,
	        showMax: true,
	        height: '800',
	        resizable: true,
	        maximized:true,
	        onOpen: function(event) {
	        	$('#totalciv').text(self.collection.models.length);
	        	$('input[type=text][readonly]').css({'background-color':'yellow','color':'black'});
	        	$('textarea[readonly]').css({'background-color':'yellow','color':'black'});
	            self.setupView(true);
	            if(self.model.get('serie_civ')){
					$('#folie_civ').focus();
				}else{
					$('#serieciv').focus();
				}	
	        },
	        onClose: function(event) {
	            self.destroy();
	        }
	    });
	},

	rebaseIndex:function(){
		this.collection.models.map(function(model,i){
			model.set('currentIndex',i+1);
		});
	},

	setupView:function(link){
		if(!link)
			this.unstickit();
		var self = this;
		var mentiuni = '';
		if(link) self.rebaseIndex();
		if(this.model){
			//this.model.set('currentIndex',this.collection.models.indexOf(this.model)+1);
			this.model.get('Modificari').map(function(mod){
				mentiuni += mod.modificare + '\n';
			});
			this.model.set('mentiuni',mentiuni);
			//this.model.unset('folie_civ');
			for(var field in this.model.attributes){
				self.bindings['#'+field] = field;
			}
			$('#btnSave').attr('disabled',null);
		}else{
			this.model = new Model();
			$('#btnSave').attr('disabled',true);
		}
		$('#vin1').val(this.model.get('nr_identif'));
		$('#serieciv').val(this.model.get('serie_civ'));
		//if(link)
		this.stickit();
	},
	
	next:function(e,del){
		var self = this;
		if(del && this.collection.models.length===1){
			this.collection.remove(this.model);
			this.model = null;
			$('#totalciv').text(this.collection.models.length);
			this.setupView();
			w2alert('Nu mai sunt civ-uri de arhivat!');
		}
		if(this.model.get('currentIndex')<this.collection.models.length){
			if(del){
				var currmodel = this.model;
			}
			var nextindex = this.model.get('currentIndex')+1;
			this.model = this.collection.find(function(model) { 
				return model.get('currentIndex') === nextindex;
			});
			if(del){
				this.collection.remove(currmodel);
				this.rebaseIndex();
				if(this.model.get('serie_civ')){
					$('#folie_civ').focus();
				}else{
					$('#serieciv').focus();
				}	
				$('#totalciv').text(this.collection.models.length);
			}
			this.setupView();
		}
	},
	
	prev:function(){
		var self = this;
		if(this.model.get('currentIndex')>1){
			var nextindex = this.model.get('currentIndex')-1;
			this.model = this.collection.find(function(model) { return model.get('currentIndex') ===nextindex; });//this.collection.models[this.model.get('currentIndex')-1];
			this.setupView();
		}
	},
	
	last:function(){
		this.model = this.collection.models[this.collection.length-1];
		this.setupView();
	},
	
	first:function(){
		this.model = this.collection.models[0];
		this.setupView();
	},
	
	search:function(field,value){
		console.log('searching for ' + value + ' in ' + field);
		var  newmodel = this.collection.find(function(model) { return model.get(field) === value; })
		if((newmodel && field ==='serie_civ') || field === 'nr_identif'){
			this.model = newmodel;
			this.setupView();
		}else if(!newmodel && field === 'serie_civ'){
			this.model.set('serie_civ',value);
		}
	},
	lookup:function(e){
		if((e.which && e.which === 13) || !e.which){
			this.search('nr_identif',$('#vin1').val().toUpperCase());
		}
	},
	arhivare:function(){
		var self = this;
		//self.model.set('civnou',localStorage.getItem('civnou'));
		$.ajax({
			url:app.baseUrl+ self.options.controller + '/arhivareciv',
			type:'POST',
			contentType:'application/json',
			data:JSON.stringify(self.model.toJSON()),
			dataType:'json',
			success:function(data){
				self.next(null,true);
			},
			error:function(data){
				console.log(data.responseJSON);
				w2alert(data.responseJSON.message);
			}
		});
		
	},

	gotofolie:function(e){
		var myString = $('#serieciv').val().toUpperCase();
		if(!myString) return;
		if((e.which && e.which === 13) || !e.which){
			$('#serieciv').val(myString);
			var myRegexp = /([A-Z])(-)([0-9]{6})/;
			var match1 = myRegexp.exec(myString);
			if(!match1){
				var myRegexp = /([A-Z])([0-9]+)/;
				var match2 = myRegexp.exec(myString);
				if(!match2){
					alert('Seria CIV nu este introdusa corect!');
					$('#serieciv').focus();
				}else{
					var sc = match2[1] + '-' + match2[2];
					 $('#serieciv').val(sc);
					 this.search('serie_civ',sc);
					 $('#folie_civ').focus();
				}
			}else{
				this.search('serie_civ',myString);
				$('#folie_civ').focus();
			}
		}		
	},

	gotosave:function(e){
		if(e.which === 13){
			$('#btnSave').focus();
		}
	},
	
	closeView: function(e) {
        this.win.destroy();
    }
});
},{"./../../collections/vehiculeciv":22,"./../../models/vehiculciv":42,"./../../templates/arhivare.html":44}],115:[function(require,module,exports){
var fs = requireNode('fs');

var PrinterConfig = window.Marionette.ItemView.extend({
	getTemplate:function(){return '<div></div>';},
	className:'page',
	indexConfig:0,
	events:{
		'click #printBtn':'print'
	},
	initialize:function(){
		this.config = JSON.parse(fs.readFileSync( 'configPrinters.json'));
		this.records = [];
		console.log(this.config);
		for(var i in this.config){
			var configuration = this.config[i];
			configuration.recid = i;
			this.records.push(configuration);
			this.indexConfig ++;
		}
	},
	onShow:function(){
		this.open();
	},
	open: function() {
	    var self = this;
	    this.win = self.$el.w2panel({
	        name: 'civReport' + self.cid,
	        title: 'Configurari Imprimante',
	        width: '1000',
	        showMin: true,
	        showMax: true,
	        height: '800',
	        resizable: true,
	        onOpen: function(event) {
	            self.setupView();
	        },
	        onClose: function(event) {
	            self.destroy();
	        }
	    });
    },
    setupView:function(){
			 var self = this;
				this.$el.w2grid({
					name:'priterConfigGrid',
					show:{
						toolbar:true,
						toolbarAdd:true,
						toolbarDelete:true,
						toolbarSave:true
					},
					columns:[
						{field:'recid',caption:'ID',size:'100px'},
						{field:'name',caption:'Nume imprimanta',size:'30%',editable:{type:'text'}},
						{field:'x',caption:'Pozitie x(mm)',size:'150px',editable:{type:'text'}},
						{field:'y',caption:'pozitie y(mm)',size:'150px',editable:{type:'text'}},
						{field:'default',caption:'Activ',size:'100px',editable:{type:'checkbox'}}
					],
					records:self.records,
					onAdd:function(){
						this.add({recid:self.indexConfig + 1});
					},
					onSubmit:function(event){
						event.onComplete = function(){
							var newConfig = {};
							this.records.map(function(rec){
								newConfig[rec.recid] = rec;
							});
							fs.writeFileSync('configPrinters.json',JSON.stringify(newConfig, null, "\t"));
						}
					}
				});
    },

    onBeforeDestroy: function() {
       //fs.writeFileSync('configPrinters.json',JSON.stringify(this.config, null, "\t"));
       //$(document).off('keydown',self.moveElement);
       //$(document).off('keyup',self.checkCTRL);
			 w2ui.priterConfigGrid.destroy();
    },

    closeView: function(e) {
        this.win.destroy();
    },

    checkCTRL:function(e){

    },

    moveElement:function(e){

    },
    print:function(){

    }
});
module.exports = PrinterConfig;

},{}],116:[function(require,module,exports){
var Model = require('./../../models/vehiculciv');
var Collection = require('./../../collections/vehiculeciv');
module.exports = Marionette.ItemView.extend({
	
	template:require('./../../templates/arhivare.html'),
	className: 'w2ui-reset w2ui-form page',
	events:{
		'click #btnSave':'arhivare',
		'click #btnClose':'closeView',
		'click #btnNext':'next',
		'click #btnPrev':'prev',
		'click #btnLast':'last',
		'click #btnFirst':'first',
		'keyup #serieciv':'gotofolie',
		//'blur #serieciv':'gotofolie',
		'keyup #vin1':'lookup',
		//'blur #vin1':'lookup',
		'keyup #folie_civ':'gotosave'
	},
	bindings:{
	},

	init:function(){
       
	},

	onShow:function(){
        this.collection = new Collection();
        this.model = new Model();//this.collection.models[0];
		this.controller = this.options.controller;
        this.isAnulare = this.options.isAnulare;
        this.isArhivare = this.options.isArhivare;
        var self = this;
        this.anulari = [];
        //$('#totalciv').text(self.collection.models.length);
        $('input[type=text][readonly]').css({'background-color':'yellow','color':'black'});
        $('textarea[readonly]').css({'background-color':'yellow','color':'black'});
        //self.setupView(true);
        if(self.isArhivare){
            if(self.model.get('serie_civ')){
                $('#folie_civ').focus();
            }else{
                $('#serieciv').focus();
            }	
        }if(self.isAnulare){
            $('#btnSave').text('Anulare');
            this.anulari.push({id:0, text:'Carte anulata cf.proc.Ian.2007'});
            this.anulari.push({id:9, text:'CARTE ANULATA'});
            this.anulari.push({id:1, text:'GRESITA LA ELIBERARE'});
            this.anulari.push({id:2, text:'CIV EXPIRAT'});
            this.anulari.push({id:3, text:'DATE INCORECTE'});
            this.anulari.push({id:4, text:'DATE CORECTATE DE PROPRIETAR'});
            this.anulari.push({id:5, text:'MENTIUNI INCORECTE'});
            this.anulari.push({id:6, text:'ALTE MOTIVE'});
            this.anulari.push({id:7, text:'CIV ANULAT DE PRODUCATOR'});
            this.anulari.push({id:8, text:'CIV ANULAT DE POLITIE'});
        }
        $('#btnClose').remove();
	},


	rebaseIndex:function(){
		this.collection.models.map(function(model,i){
			model.set('currentIndex',i+1);
		});
	},

	setupView:function(link){
		if(!link)
			this.unstickit();
		var self = this;
		var mentiuni = '';
		if(link) self.rebaseIndex();
		if(this.model){
			//this.model.set('currentIndex',this.collection.models.indexOf(this.model)+1);
			if(this.model.get('Modificari')){
                this.model.get('Modificari').map(function(mod){
                    mentiuni += mod.modificare + '\n';
                });
            }
			this.model.set('mentiuni',mentiuni);
			//this.model.unset('folie_civ');
			for(var field in this.model.attributes){
				self.bindings['#'+field] = field;
			}
			$('#btnSave').attr('disabled',null);
		}else{
			this.model = new Model();
			$('#btnSave').attr('disabled',true);
		}
		$('#vin1').val(this.model.get('nr_identif'));
		$('#serieciv').val(this.model.get('serie_civ'));
		//if(link)
		this.stickit();
	},
	
	next:function(e,del){
		var self = this;
		if(del && this.collection.models.length===1){
			this.collection.remove(this.model);
			this.model = null;
			$('#totalciv').text(this.collection.models.length);
			this.setupView();
			w2alert('Nu mai sunt civ-uri de arhivat!');
		}
		if(this.model.get('currentIndex')<this.collection.models.length){
			if(del){
				var currmodel = this.model;
			}
			var nextindex = this.model.get('currentIndex')+1;
			this.model = this.collection.find(function(model) { 
				return model.get('currentIndex') === nextindex;
			});
			if(del){
				this.collection.remove(currmodel);
				this.rebaseIndex();
				if(this.model.get('serie_civ')){
					$('#folie_civ').focus();
				}else{
					$('#serieciv').focus();
				}	
				$('#totalciv').text(this.collection.models.length);
			}
			this.setupView();
		}
	},
	
	prev:function(){
		var self = this;
		if(this.model.get('currentIndex')>1){
			var nextindex = this.model.get('currentIndex')-1;
			this.model = this.collection.find(function(model) { return model.get('currentIndex') ===nextindex; });//this.collection.models[this.model.get('currentIndex')-1];
			this.setupView();
		}
	},
	
	last:function(){       
		this.model = this.collection.models[this.collection.length-1];
		this.setupView();
	},
	
	first:function(){
		this.model = this.collection.models[0];
		this.setupView();
	},
	
	search:function(field,value){
        var self = this;
        w2utils.lock(self.$el,'Se cauta CIV-uri....');
		console.log('searching for ' + value + ' in ' + field);
        var method = this.isAnulare?'/getVehiculeDeAnulat':'/getVehiculeDeArhivat';
        var postData = {};
        postData[field] = value;
        $.ajax({
            url: app.baseUrl + 'vins' + method,
            data:postData,
            type:'POST',
            success:function(data){
                self.collection.reset(data);
                if(self.collection.length === 0){
                    w2alert('Nu s-a gasit CIV');
                    w2utils.unlock(self.$el);
                    $('#totalciv').text('0');
                    self.model = new Model();
                    self.setupView(true);
                    return;
                }
                $('#totalciv').text(self.collection.models.length);
                var  newmodel = self.collection.models[0];
                if((newmodel && field ==='serie_civ') || field === 'nr_identif'){
                    self.model = newmodel;
                    self.setupView(true);
                }else if(!newmodel && field === 'serie_civ'){
                    self.model.set('serie_civ',value);
                }
                w2utils.unlock(self.$el);
            },
            error:function(){
                w2alert('Nu s-a gasit CIV');
                w2utils.unlock(self.$el);
            }
        })
		
	},
	lookup:function(e){
		if((e.which && e.which === 13) || !e.which){
			this.search('nr_identif',$('#vin1').val().toUpperCase());
		}
	},
	arhivare:function(){
		var self = this;
		var method = '', controller = '';
        if(self.isArhivare){
            method = '/arhivareciv';
			if(self.model.get('activitate') == 'e')
				controller = 'individuale';
			else
				controller = 'vehicule';
        }else{
            method = '/anulareciv';
			controller = 'vins';
        }
        
        
        
        if(self.isAnulare){
            w2popup.open({
                title: 'Motiv anulare',
                body: '<div class="w2ui-centered"><p>Alegeti motivul anularii</p><input type="text" id="motivanulare" style="width:250px" /></div>',
                onOpen:function(e){
                    e.onComplete = function(){
                        $('#motivanulare').w2field('list',{items:self.anulari});
                    };
                },
                onClose:function(e){
                    console.log(event);
                    if($(event.target).attr('id') == 'btnCancelAnulare')
                    {}
                    else{
                        var selected = $('#motivanulare').data('selected');
                        if(selected.id){
                            $.ajax({
                                url:app.baseUrl + controller + method,
                                type:'POST',
                                contentType:'application/json',
                                data:JSON.stringify({motiv:selected.id,civ:self.model.get('serie_civ')}),
                                dataType:'json',
                                success:function(data){
                                    self.next(null,true);
                                },
                                error:function(data){
                                    console.log(data.responseJSON);
                                    w2alert(data.responseJSON.message);
                                }
                            });
                        }else{
                            e.preventDefault();
                            w2alert('Nu ati ales motivul anularii!');
                        }
                    }
                },
                buttons   : '<button class="btn btn-blue" onclick="w2popup.close();" id="btnExecuteAnulare">OK</button> '+
                            '<button class="btn btn-red" onclick="w2popup.close();" id="btnCancelAnulare">Cancel</button>',
            });

        }
        else{
            $.ajax({
                url:app.baseUrl + controller + method,
                type:'POST',
                contentType:'application/json',
                data:JSON.stringify(self.model.toJSON()),
                dataType:'json',
                success:function(data){
                    self.next(null,true);
                },
                error:function(data){
                    console.log(data.responseJSON);
                    w2alert(data.responseJSON.message);
                }
            });
        }
		
	},

	gotofolie:function(e){
		var myString = $('#serieciv').val().toUpperCase();
		if(!myString) return;
		if((e.which && e.which === 13) || !e.which){
			$('#serieciv').val(myString);
			var myRegexp = /([A-Z])(-)([0-9]{6})/;
			var match1 = myRegexp.exec(myString);
			if(!match1){
				var myRegexp = /([A-Z])([0-9]+)/;
				var match2 = myRegexp.exec(myString);
				if(!match2){
					alert('Seria CIV nu este introdusa corect!');
					$('#serieciv').focus();
				}else{
					var sc = match2[1] + '-' + match2[2];
					 $('#serieciv').val(sc);
					 this.search('serie_civ',sc);
					 $('#folie_civ').focus();
				}
			}else{
				this.search('serie_civ',myString);
				$('#folie_civ').focus();
			}
		}		
	},

	gotosave:function(e){
		if(e.which === 13){
			$('#btnSave').focus();
		}
	},
	
	closeView: function(e) {
        this.win.destroy();
    }
});
},{"./../../collections/vehiculeciv":22,"./../../models/vehiculciv":42,"./../../templates/arhivare.html":44}],117:[function(require,module,exports){
var ipc = requireNode('ipc');
   module.exports = Marionette.ItemView.extend({
   	template:require('./../templates/update.html'),
   	events:{

   	},
   	initialize:function(){

   	},
   	onShow:function(){
          var options = {
                uploadUrl: app.baseUrl + 'appdot/civutils/updateapp',
                uploadAsync: false,
                maxFileCount: 10,
                maxFileSize: 10000
            };
            app.Settings.fileinputDefaults.allowedFileExtensions= [
                  "json",
                  "zip",
                  "png",
                  "msi"
               ];
            $.extend(options, app.Settings.fileinputDefaults);
            this.$el.find('#fileupload').fileinput(options);
            this.$el.find('#fileupload').on('filebatchuploadsuccess', function(event, data) {
               
            }).on('fileuploaded', function(event, data) {
                
            });
   	}
   });
},{"./../templates/update.html":74}],118:[function(require,module,exports){
 var Globals = require('./../../globals');
 var AnvelopaItemView = window.Marionette.ItemView.extend({
     _ctlFata: undefined,
     _ctlSpate: undefined,
     ui: {
         'del': '.btnDelAnvelopa'
     },
     events: {
         'click @ui.del': 'deleteMe'
     },
     modelEvents: {
         //'change': 'triggerEvent'
     },
     triggerEvent: function() {
         app.module('appciv').trigger('attachedProp:changed');
     },
     resetError: function(field) {
         $().w2tag();
     },
     bindings: {
        '[name="rfcontainer"]': {
                attributes: [{
                    name: 'hidden',
                    observe: 'id_roataf',
                    onGet: function(value) {
                        //if (value)
                            return (Globals.anvelopefata.models.length==0);
                        //return value;
                    }
                }]
            },
            '[name="rscontainer"]': {
                attributes: [{
                    name: 'hidden',
                    observe: 'id_roatas',
                    onGet: function(value) {
                        //if (value)
                            return (Globals.anvelopespate.models.length==0);
                        //return value;
                    }
                }]
            },
     },
     deleteMe: function() {
        console.log('init del anv');
         app.module('appciv.vehicule').trigger('anvelopa:remove', this.model);
     },
     template: require('./../../templates/vehicule/anvelopaDropTemplate.hts'),
     initialize: function() {
         //set initial values for anvelope
         var idf, af, as;
         if (Globals.anvelopefata) {
             //this.listenTo(Globals.anvelopefata, 'update', this.updateSourcesFata);
             if (this.model.get('id_roataf') && this.model.get('EntityState') !==2) {
                 idf = this.model.get('id_roataf');
                 af = Globals.anvelopefata.get(idf).get('text');
                 this.model.set('anvelopaf', af);
             }
         }
         if (Globals.anvelopespate) {
             //this.listenTo(Globals.anvelopespate, 'update', this.updateSourcesSpate);
             if (this.model.get('id_roatas') && this.model.get('EntityState') !==2) {
                 as = Globals.anvelopespate.get(this.model.get('id_roatas')).get('text');
             }
             this.model.set('anvelopas', as);
         }
     },
     onRender: function() {
         this.setView();
         this.listenTo(this.model, 'change', function() {
             app.module('appciv').trigger('attachedProp:changed');
         });
         this.setSelect();
         this.stickit();
     },
     onDomRefresh: function() {
         this.setSelect();

     },
     setSelect: function() {
         var self = this;
         this._ctlFata = this.$el.find('[name="id_roataf"]');
         this._ctlSpate = this.$el.find('[name="id_roatas"]');
         this._ctlFata.w2field('list', {
                 minLength: 0,
                 items: Globals.anvelopefata.toJSON(),
                 selected: self.model.get('id_roataf')
             })
             .on('change', function(e) {
                 var newval = $(this).data('selected');
                 var current = self.model.get('id_roataf');
                 //Globals.anvelopefata.get(newval.id).set('disabled', true);
                 self.model.set('anvelopaf', newval.text);
                 if (current) {
                     //Globals.anvelopefata.get(current).unset('disabled');
                 }
                 self.model.set('id_roataf', newval.id);
                 //$(this).w2field().options.items = app.module('appciv.vehicule').Globals.anvelopefata.toJSON();
                 Globals.anvelopefata.trigger('update');
             });
         this._ctlSpate.w2field('list', {
             minLength: 0,
             items: Globals.anvelopespate.toJSON(),
             selected: self.model.get('id_roatas')
         }).on('change', function(e) {
             var newval = $(this).data('selected');
             var current = self.model.get('id_roatas');
             //Globals.anvelopespate.get(newval.id).set('disabled', true);
             self.model.set('anvelopas', newval.text);
             if (current) {
                 //Globals.anvelopespate.get(current).unset('disabled');
             }
             self.model.set('id_roatas', newval.id);
             //$(this).w2field().options.items = app.module('appciv.vehicule').Globals.anvelopespate.toJSON();
             Globals.anvelopespate.trigger('update');
         });
     },
     setView: function() {
         if (this.model.get('nivel_echipare') === 0) {
             this.$('.btnDelAnvelopa').remove();
         }
     },
     updateSourcesFata: function() {
         $(this._ctlFata).w2field().options.items = Globals.anvelopefata.toJSON()
;
     },
     updateSourcesSpate: function() {
         $(this._ctlSpate).w2field().options.items = Globals.anvelopespate.toJSON();
     },
     serializeData: function() {
         return {
             index: this.options.index,
             lblFata:w2utils.lang('Fata(Anvelopa/Janta):'),
             lblSpate:w2utils.lang('Spate(Anvelopa/Janta):')
         };
     }

 });
 module.exports = AnvelopaItemView;

},{"./../../globals":24,"./../../templates/vehicule/anvelopaDropTemplate.hts":75}],119:[function(require,module,exports){
var AnvelopaItemView = require('./anvelopa'),
    AnvelopaModel = require('./../../models/anvelopa'),
    Globals = require('./../../globals'),
    AnvelopeAccordionView = Marionette.CompositeView.extend({
        className: 'accordion',
        initialize: function() {
            this.listenTo(app.module('appciv'), 'anvelopeView:setSelect', this.onShow);
        },
        childView: AnvelopaItemView,
        ui: {
            'add': '#btnAddAnvelopa'
        },
        events: {
            'click @ui.add': 'add'
        },
        add: function() {
            //conditii de adaugare anvelopa
            var prevSelected = true;
            for (var i in this.collection.models) {
                var anv = this.collection.models[i];
                if ((Globals.anvelopefata.length>0 && anv.get('id_roataf') === 0) || (Globals.anvelopespate.length > 0 &&  anv.get('id_roatas') === 0)) {
                    prevSelected = false;
                }
            }

            if (this.collection.models.length < 5 && prevSelected) { //nr maxim de anvelope
                if (true) {
                    this.collection.add(new AnvelopaModel({
                        nivel_echipare: 1,
                        EntityState: 0
                    }));
                    this.onShow();
                }
            } else {
                setTimeout(function() {
                    $('#btnAddAnvelopa').w2tag();
                }, 3000);
                $('#btnAddAnvelopa').w2tag('Nu sunt indeplinite conditiile de adaugare anvelope optionale!');
            }

        },
        getTemplate: function() {
            //var html = '' //'<script id="layout-anvelope-template" type="text/template">'
            var html = '<div>';
            html +=
                '<div class="panel panel-primary">' +
                '   <div class="w2ui-panel-title">'+w2utils.lang('Anvelope echipare standard')+'</div>' +
                '   <div class="panel-body" id="standard"></div>' +
                '</div>' +
                '<div class="panel panel-primary">' +
                '   <div class="w2ui-panel-title">'+w2utils.lang('Anvelope echipare optionala')+'</div>' +
                '   <div class="panel-body" id="optionale">' +
                '       <button class="btn btn-green btn-icon-only" id="btnAddAnvelopa"><i class="w2ui-icon-plus"></i></button>' +
                '   </div>' +
                '</div>';
            html +='</div>';
            //+ '</script>';
            return html;
        },
        childViewOptions: function(model) {
            return {
                index: this.collection.indexOf(model)
            };
        },
        attachHtml: function(collectionView, itemView, index) {
            if (itemView.model.get('EntityState') !== 2) {
                itemView.model.set('index', index);
                //itemView.$el.find('input').attr('id', 'Anvelope_' + index + '__id_roataf');
                //itemView.$el.find('input').attr('id', 'Anvelope_' + index + '__id_roatas');
                var echipare = itemView.model.get('nivel_echipare'),
                    container = '';
                switch (echipare) {
                    case 0:
                        container = 'standard';
                        break;
                    case 1:
                        container = 'optionale';
                        break;
                }
                collectionView.$('#' + container).append(itemView.render().el);
            }
        },
        onRender: function() {
            //initialize accordion effect
            this.listenTo(app.module('appciv.vehicule'), 'anvelopa:remove', function(model) {
                //daca modelul nu este nou
                //declansam doar evenimentul, pentru a nu elimina definitiv modelul din colectie
                //modelul este doar marcat pentru a fi sters de pe server la salvare, dar vizual el va fi
                //sters din collectie. La refresh , daca nu s-a salvat inregistrarea, va reapare.
                console.log('del set anv');
                if (!model.id) {
                    this.collection.remove(model);
                } else {
                    this.collection.trigger('remove', model);
                }
                // marcam selectiile curente ale modelului ca selectabile
                //TODO: trebuie refacute cumva sursele pentru select-uri....
                // try {
                //     Globals.anvelopefata
                //         .get(model.get('id_roataf'))
                //         .unset('disabled');
                //     Globals.anvelopefata.trigger('update');

                //     Globals.anvelopespate
                //         .get(model.get('id_roatas'))
                //         .unset('disabled');
                //     Globals.anvelopespate.trigger('update');
                // } catch (ex) {}
            });
            this.$el.find('.w2ui-panel-title').click(function() {
                $(this).next().toggle('fast');
                return false;
            }).next().hide('fast');
        },
        // onAddChild: function(itemView) {
        //         itemView.setSelect();
        //         itemView.setView();
        //     }
        onShow: function() {
            // this.children.each(function(view) {
            //     view.setSelect();
            // });

        }
    });
module.exports = AnvelopeAccordionView;

},{"./../../globals":24,"./../../models/anvelopa":25,"./anvelopa":118}],120:[function(require,module,exports){
 var AtributItemView = window.Marionette.ItemView.extend({
     source: undefined,
     className: 'w2ui-field',
     bindings: {
         '[name="val"]': 'val',
         '[name="label"]': 'label',
         '[name="min"]': 'min',
         '[name="max"]': 'max'
     },

     getTemplate: function() {
         switch (this.model.get('tip')) {
             case 'interval':
                 return require('./../../templates/vehicule/atributItemTemplate.hts');
             case 'lista':
                 return require('./../../templates/vehicule/atributDropTemplate.hts');
             case 'liber':
                 return require('./../../templates/vehicule/atributFreeTemplate.hts');
             case 'tag':
                return require('./../../templates/vehicule/tag.hbs');
             default:
                 return require('./../../templates/vehicule/atributFreeTemplate.hts');
         }

     },
     initialize: function() {
         this.source = this.model.get('source');
     },
     onRender: function() {
        if (this.model.get('tip') === 'interval') {
             this.setNumeric();
         }else if ((this.model.get('tip') === 'lista' || this.model.get('source')) && this.model.get('id_nomenclator') != 24) {
             this.setSelect();
         }
         this.stickit();
         this.listenTo(this.model, 'change', function() {
             app.module('appciv').trigger('attachedProp:changed');
         });

     },
     setSelect: function() {
         var mdl = this.model;
         if (this.source !== '' && this.source !== undefined && this.source !== null) {
             var data = this.source.split('|'),
                 sursa = [],
                 ctl = this.$el.find('[name="val"]');
             // daca exista o singura valoare sau suntem in mod editare si valoarea nu este egala cu valoarea unica,
             // afisam atributul pentru a putea fi corectat
             //altfel nu afisam atributul, pentru ca singura valoare posibila este valoarea unica
             //if (data.length > 1 || (this.model.get('EntityState') === 3 && this.model.get('val') !== data[0])) {
             $.each(data, function(index, v) {
                 sursa.push({
                     id: v,
                     text: v
                 });
             });
             if(mdl.get('tip') === 'tag'){
                var selected = mdl.get('val')?mdl.get('val').split('|'):[]
                ctl.w2field('enum',{
                    items:sursa,
                    openOnFocus:true,
                    selected:selected
                }).on('change', function() {
                    var selected = $(this).data('selected');
                    var val = '';
                    selected.map(function(el){
                        val += '|' + el.text;
                    });
                    mdl.set('val', val.substr(1,val.length));
                });
             }else{
                 ctl.w2field('list', {
                     selected: {
                         id: mdl.get('val'),
                         text: mdl.get('val')
                     },
                     items: sursa
                 });
             }
             //} else {
             //    this.model.set('val', data[0]);
             //    ctl.parent().remove();
             //}

             //                if (self.model.get('EntityState')===0) {
             //                    self.model.set('val',source.split(',')[0]);
             //                }
         }
     },
     setNumeric: function() {
        if(Number(this.model.get('min'))<=Number(this.model.get('max')) && Number(this.model.get('min'))!==0){
            var min = 0;
            var max = this.model.get('max');
            switch(this.model.get('id_nomenclator'))
            {
                case 18:
                    min = 0;
                    break;
                default:
                    min = this.model.get('min');
                    break;
            }
             this.$el.find('[name="val"]').w2field('int', {
                 min: parseInt(min),
                 max: parseInt(max)
             });
         }

     },
     serializeData: function() {
         return {
             index: this.options.index
         };
     }
 });
 module.exports = AtributItemView;

},{"./../../templates/vehicule/atributDropTemplate.hts":76,"./../../templates/vehicule/atributFreeTemplate.hts":77,"./../../templates/vehicule/atributItemTemplate.hts":78,"./../../templates/vehicule/tag.hbs":81}],121:[function(require,module,exports){
 var AtributItemView = require('./atribut'),
     AtributeAccordionView = window.Marionette.CompositeView.extend({
         className: 'accordion',
         childView: AtributItemView,
         initialize:function(){
             var self = this;
             self.iswltp = this.options.iswltp;
             this.wltpAttrs = [290,291,292,293,294,295,296,297,298,299,300,301];
             this.nedcAttrs = [141,142,246,247,248];
             co2wltp = this.options.collection.find(function(m){return m.get('id_nomenclator') == '290'});
             if(co2wltp){
                 this.iswltp = (co2wltp.get('min') && co2wltp.get('min') != '0') || (co2wltp.get('max') && co2wltp.get('max') != '0');
             }
             this.listenTo(app,'wltp:changed',function(val){
                self.iswltp = val;
             })
         },
         getTemplate: function() {
             var coll = this.collection,
                 html = '<form role="form" class="form-inline">', //= '<script id="layout-view-template" type="text/template">',
                 atrs = _.groupBy(coll.toJSON(), 'grupa');
             $.each(atrs, function(i, grp) {
                 ///append accordion element to dom
                 html +=
                     '<div id="panel-'+i+'" class="panel panel-primary hide">' +
                     '<div class="w2ui-panel-title">' + i.charAt(0).toUpperCase() + i.slice(1) + '</div>' +
                     '<div class="panel-body" id="' + i + '"></div>' +
                     '</div>';
             });
             html += '</form>';

             return html;
         },
         childViewOptions: function(model) {
             return {
                 index: this.collection.indexOf(model)
             };
         },
         attachHtml: function(collectionView, itemView, index) {
             //itemView.$el.addClass('form-group );
             var data, v, min, max;
             itemView.model.set('index', index);
             min=Number(itemView.model.get('min'));
             max=Number(itemView.model.get('max'));
             var sourceOfValues=itemView.model.get('source');
             v= itemView.model.get('val');
             // show-hide attributes 
             // daca exista o singura valoare sau suntem in mod editare si valoarea nu este egala cu valoarea unica, 
             // afisam atributul pentru a putea fi corectat
             //altfel nu afisam atributul, pentru ca singura valoare posibila este valoarea unica
            

             /*if (itemView.model.get('tip') === 'lista') {
                 data = itemView.model.get('source').split('|');
                 if (data.length <= 1 || (itemView.model.get('val') === data[0])) {
                     return; //iesim, conditia de afisare nu este ndeplinita
                 }

             } else if (itemView.model.get('tip') === 'interval') {
                 v = (itemView.model.get('val') === '' || itemView.model.get('val') === null) && itemView.model.get('min') !== 0 ? itemView.model.get('min') : itemView.model.get('val');
                 min = itemView.model.get('val') !== null && itemView.model.get('min') === 0 ? itemView.model.get('val') : itemView.model.get('min');
                 max = itemView.model.get('val') !== null && itemView.model.get('max') === 0 ? itemView.model.get('val') : itemView.model.get('max');
                 if (itemView.model.get('val') !== null) {
                     v = Number(itemView.model.get('val'));
                     min = itemView.model.get('min') === 0 ? itemView.model.get('val') : itemView.model.get('min');
                     max = itemView.model.get('max') === 0 ? itemView.model.get('val') : itemView.model.get('max');
                     if (min === max) {
                         v = min;
                     }

                 } else {
                     if (itemView.model.get('min') === 0 && itemView.model.get('max') !== 0) {
                         v = itemView.model.get('max');
                         min = itemView.model.get('max');
                         max = itemView.model.get('max');
                     } else if (itemView.model.get('max') === 0 && itemView.model.get('min') !== 0) {
                         v = itemView.model.get('min');
                         min = itemView.model.get('min');
                         max = itemView.model.get('min');
                     } else if (itemView.model.get('max') === 0 && itemView.model.get('min') === 0) {
                         v = 0;
                         min = 0;
                         max = 0;
                     } else {

                     }
                 }
                 if (min === max && ((itemView.model.get('val') >= min && itemView.model.get('val') <= max))) { //vezi mai sus self.model.get('EntityState')===3 &&
                     // if(min==="0"&&max==="0"){
                     // itemView.model.set('val',0);
                     // }
                     return; //atributul e ok, putem sa-l scoatem de pe pagina 
                 } else {
                     itemView.model.set('val', v);
                 }
             }*/

             //refactor!!
             if(itemView.model.get('id_nomenclator') == 24 && this.iswltp){
                collectionView.$('#' + itemView.model.get('grupa')).append(itemView.el).parent().removeClass('hide');
                return;
             }
             if(itemView.model.get('id_nomenclator') == 290 && this.iswltp){// show alt cod for getting wltp co2
                collectionView.$('#' + itemView.model.get('grupa')).append(itemView.el).parent().removeClass('hide');
                return;
             }
             if(this.wltpAttrs.indexOf(itemView.model.get('id_nomenclator'))!==-1) return;// exclude other wltp attrs
             if(this.iswltp && this.nedcAttrs.indexOf(itemView.model.get('id_nomenclator')) != -1) return; // exclude nedc (not required) if is wltp
             if(itemView.model.get('tip')==='interval'){//valoare de tip interval - se verifica min!=max si max!=0
                if(min===max || max===0){
                    if(itemView.model.get('val') && Number(itemView.model.get('val'))!==min){
                        //return;
                    }
                    else{
                        //setam valoarea cu min si scoatem atributul de pe pagina
                        itemView.model.set('val',min);
                        return;
                    }
                    
                }
             }
             else if(!sourceOfValues && itemView.model.get('id_nomenclator') === 28){//tip transmisie nu este obligatoriu decat daca au fost specificate valori la omologare
                return;
             }
             else if(!sourceOfValues){
                // atribut adaugat suplimentar
             }
             else if(sourceOfValues.split('|').length===1){
                //nu avem valori multiple de selectie - setam valoarea cu sursa de date si scoatem atributul de pe pagina
                itemView.model.set('val',sourceOfValues);
                    return;
             }
             else if(min===0 && max===0 && sourceOfValues.split('|').length===1){
                itemView.model.set('val',sourceOfValues);
                    return;
             }else{
                //$('#panel-'+itemView.model.get('grupa'));
             }
             collectionView.$('#' + itemView.model.get('grupa')).append(itemView.el).parent().removeClass('hide');
         },
         onRender: function() {
             //initialize accordion effect
             this.$el.find('.w2ui-panel-title').click(function() {
                 $(this).next().toggle('fast');
                 return false;
             }).next().hide('fast');
         }
     });
 module.exports = AtributeAccordionView;

},{"./atribut":120}],122:[function(require,module,exports){
 var postData = {};
 var ipc = requireNode('ipc');
 module.exports = Marionette.ItemView.extend({
     template: require('./../../templates/vehicule/vins.hts'),
     className: 'page',
     attributes: function() {
         var width = $('#layout_layout_panel_main').width();
         return {
             style: 'min-width:' + width + 'px'
         };
     },
     events: {},
     idbeneficiar:null,
     initialize: function(options) {
         var self = this;
         this.setPermissions();
     },
     setPermissions: function() {
         this.showListaBenef = ipc.sendSync('user:request:isuserinrole', [
             [1], 'appciv'
         ]);
     },
     onShow: function() {
         var self = this;
         this.buildUpload();
         this.renderGrid();
     },
     renderGrid: function() {
         var self = this;
         this.$el.find('#grid').w2grid({
             name: 'gridVINS',
             url: app.baseUrl + 'vins/getVINS',
             method: 'POST', // need this to avoid 412 error on Safari
             recid: 'id',
             fixedBody: true,
             show: {
                 toolbar: true,
                 footer: true,
                 toolbarAdd: true,
                 toolbarSave: true,
                 toolbarDelete: true
             },
             onAdd: function() {
                 w2ui['gridVINS'].add({
                     recid: 0
                 });
             },
             toolbar: {
                 items: [{
                     type: 'button',
                     id: 'btnchooseFile',
                     caption: w2utils.lang('Alege fisier'),
                     icon: 'w2ui-icon-upload',
                     onClick: function(event) {
                         self.choosefile();
                     }
                 },(self.showListaBenef?
                   { type: 'html',  id: 'listaBenef',
                      html:
                        '<div style="padding: 3px 10px;">'+
                        w2utils.lang(' Beneficiari:')+
                        '    <input size="20" id="listabenef"   style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>'+
                        '</div>'
                  }:
                  {})
               ]
             },
             multiSearch: false,
             searches: [{
                 field: 'marca',
                 caption: w2utils.lang('Marca'),
                 type: 'text'
             },{
                 field: 'tip',
                 caption: w2utils.lang('Tip'),
                 type: 'text'
             }, {
                 field: 'varianta',
                 caption: w2utils.lang('Varianta'),
                 type: 'text'
             }, {
                 field: 'Versiune',
                 caption: w2utils.lang('Versiune'),
                 type: 'text'
             },{
                 field: 'denumire',
                 caption: w2utils.lang('Denumire Comerciala'),
                 type: 'text'
             }, {
                 field: 'vin',
                 caption: w2utils.lang('Nr. Identificare'),
                 type: 'text'
             }, {
                 field: 'serie_motor',
                 caption: w2utils.lang('Serie Motor'),
                 type: 'text'
             }, {
                 field: 'cat_ce',
                 caption: w2utils.lang('Cat. EU'),
                 type: 'text'
             },  {
                 field: 'act_normativ',
                 caption: w2utils.lang('Act normativ'),
                 type: 'text'
             },{
                 field: 'wvta',
                 caption: 'WVTA',
                 type: 'text'
             },],
             columns: [{
                     field: 'marca',
                     caption: w2utils.lang('Marca'),
                     size: '200px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'tip',
                     caption: w2utils.lang('Tip'),
                     size: '120px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'varianta',
                     caption: w2utils.lang('Varianta'),
                     size: '100px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'versiune',
                     caption: w2utils.lang('Versiune'),
                     size: '120px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'denumire',
                     caption: w2utils.lang('Denumire Comerciala'),
                     size: '200px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'vin',
                     caption: w2utils.lang('Nr. Identificare'),
                     size: '200px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'serie_motor',
                     caption: w2utils.lang('Serie Motor'),
                     size: '100px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'cat_ce',
                     caption: w2utils.lang('Cat. EU'),
                     size: '60px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'act_normativ',
                     caption: w2utils.lang('Act normativ'),
                     size: '30%',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'wvta',
                     caption: 'WVTA',
                     size: '150px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }

             ],
             parser: function(responseText) {
                 var data = $.parseJSON(responseText);
                 // do other things
                 return {
                     status: 'success',
                     total: data.records,
                     records: data.rows
                 };
             },
             onRefresh:function(e){
               e.onComplete = function(){
                 if($('#listabenef').length>0){
                   $('#listabenef').w2field('list',{
                       width: '200px',
                       url: app.baseUrl + 'civutils/GetBeneficiari'
                   }).on('change', function() {
                       var selected = $('#listabenef').data('selected');
                       self.idbeneficiar = selected.id;
                   });
                 }
               };
             }
         });
         w2ui['gridVINS'].stateRestore();

         //this.buildUpload();

     },
     onBeforeDestroy: function() {
         w2ui['gridVINS'].stateSave();
         w2ui.gridVINS.destroy();
     },

     choosefile: function() {
         var chooser = this.$el.find('#fileupload');
         // chooser.off('change').on('change', function(evt) {
         //     console.log($(this).val());
         // });

         chooser.trigger('click');
     },

     setUploadEvent: function() {
         var chooser = this.$el.find('#fileupload');
     },

     buildUpload: function() {
         var self = this;
         $('#fileupload').fileinput({
             uploadUrl: app.baseUrl + 'civfiles/uploadxls',
             uploadClass: 'btn btn-toolbar',
             uploadTitle: w2utils.lang('Trimite fisier'),
             uploadLabel: w2utils.lang(' Trimite'),
             uploadIcon: '<i class="w2ui-icon-upload"></i>',
             showPreview: false,
             showRemove: false,
             showUpload: false,
             showCaption: false,
             progressClass: 'hide',
             uploadExtraData: function() {
                 //var id_comanda = w2ui['gridVINS'].getSelection() || null;
                 //if (id_comanda) {
                     return {
                         id_beneficiar: self.idbeneficiar
                     };
                 //}
             },
             browseClass: 'btn disabled btn-toolbar',
             browseTitle: w2utils.lang('Alege fisiere'),
             browseLabel: w2utils.lang(' Incarca vehicule'),
             browseIcon: '<i class="w2ui-icon-folder"></i>',
             removeClass: 'btn btn-toolbar',
             removeTitle: 'Reset',
             removeLabel: ' Reset',
             removeIcon: '<i class="w2ui-icon-cross"></i>'
         });

         $('#fileupload')
             .off('fileloaded').on('fileloaded', function() {
                 w2ui['gridVINS'].lock();
                 $('#fileupload').fileinput('upload');
             })
             .off('filebatchuploadsuccess').on('filebatchuploadsuccess', self.uploadComplete)
             .off('filebatchuploaderror').on('filebatchuploaderror', self.uploadError);
     },

     uploadComplete: function(e, data) {
         var response = data.response.response; //(data.result);
         w2ui['gridVINS'].unlock();
         switch (response.code) {
             case 1: // comanda ok
                 ipc.send('app:notification:show', {
                     type: 'success-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 2: //comanda ok, veh in eroare
             case 3:
                 ipc.send('app:notification:show', {
                     type: 'warning-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 4: //comanda not ok
                 ipc.send('app:notification:show', {
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 6: //comanda not ok
             case 0:
             case 9:
             case 8:
                 ipc.send('app:notification:show', {
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             default:
                 ipc.send('app:notification:show', {
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
         }
         w2ui['gridVINS'].reload();
     },

     uploadError: function(e, data) {
         $('#fileupload').fileinput('reset');
         w2ui['gridVINS'].unlock();
         ipc.send('app:notification:show', {
             type: 'error-template',
             text: w2utils.lang('Eroare la transmitere! Verificati fisierul!'),
             title:'Notificare'
         });
     }
 });

},{"./../../templates/vehicule/vins.hts":83}],123:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'page',
    template: require('./../../templates/vehicule/spreadsheet.hts'),
    events: {
        'click #load': 'loadData',
        'click #save': 'saveData',
        'click #copy': 'duplicateRows',
        'click #back': 'back'
    },
    back: function() {
        window.location.hash = '#appciv/cereri';
    },
    duplicateRows: function() {
        var array = w2ui.spreadsheetVehicule.records;
        var source = $.extend({}, array[0]);
        delete source.vin;
        delete source.recid;
        delete source.culoare;
        delete source.an;
        delete source.serie;

        for (var i = 1; i < array.length; i++) {
            for(var field in array[i]){
              if(array[i][field]){
                delete source[field];
              }
            }
            w2ui.spreadsheetVehicule.set(i, source);
        }
        // w2ui.spreadsheetVehicule.save();
    },
    resetGrid: function() {
        w2ui.spreadsheetVehicule.columns = [];
        w2ui.spreadsheetVehicule.records = [];
        w2ui.spreadsheetVehicule.refresh();
    },
    onShow: function() {
        var self = this;
        // this.validators={};
        this.isValid = true;
        // console.log('spreadsheet');
        this.buildLoad();
        $().w2grid({
            name: 'spreadsheetVehicule',
            show: {
                toolbar: true,
                toolbarAdd: true,
                toolbarDelete: true,
                toolbarSave:true,
                footer: true,
                lineNumbers: true
            },
            selectType: 'cell',
            records: [],
            columns: [],
            toolbar: {
                items: [
                // {
                //     type: 'button',
                //     id: 'save',
                //     text: 'Salveaza',
                //     icon: 'w2ui-icon-check',
                //     onClick: self.saveData.bind(self)
                // },
                 {
                    type: 'button',
                    id: 'load',
                    text: 'Incarca',
                    icon: 'w2ui-icon-upload',
                    onClick: self.loadData.bind(self)
                }, {
                    type: 'button',
                    id: 'multiply',
                    text: 'Multiplica randuri',
                    icon: 'w2ui-icon-list',
                    onClick: self.duplicateRows.bind(self)
                }, {
                    type: 'button',
                    id: 'reset',
                    text: 'Reset',
                    icon: 'w2ui-icon-trash',
                    onClick: self.resetGrid.bind(self)
                }, {
                    type: 'check',
                    id: 'anvoptionale',
                    text: 'Anvelope Optionale',
                    icon: 'w2ui-icon-wrench',
                    onClick: self.activateOptionale.bind(self)
                }]
            },
            onPaste: function(event) {
              var me = this;
              var temp = [];
              event.text.split('\n').map(function(t){
                if(t && t.trim() !== '')
                {
                  temp.push(t);
                }
              });
              event.text = temp.join('\n');

                //var data = event.text.split('\n');
                var index = temp.length;
                //if(!data[index] || data[index] === '') index--;
                for (var i = 1; i < index; i++) {
                    this.add({
                        recid: i
                    },true);
                }
                // event.onComplete = this.save;
            },
            onAdd: function() {
                this.add({
                    recid: this.records.length + 1
                },true)
            },
            onChange: function(e) {
                e.onComplete = function() {
                    var newobj = {};
                    newobj[this.columns[e.column].field] = e.value_new;
                    this.set(e.recid,newobj);
                }
            },
            onSubmit:function(e){
                e.onComplete = function(){
                    self.saveData.apply(self,arguments);
                };
            },
            onDelete: function(event) {
                var array = this.getSelection();
                event.onComplete = function() {
                    var prevrecid;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].recid === prevrecid) continue;
                        prevrecid = array[i].recid;
                        this.remove(prevrecid);
                    }
                    for (var i = 0; i < this.records.length; i++) {
                        this.records[i].recid = i;
                    }
                }
            }

        });
        $('#vehicles').w2render('spreadsheetVehicule');
    },
    activateOptionale: function(e) {
        if (e) {
            e.onComplete = function() {
                var state = w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked;
                if (!state) {
                    for (var i = 2; i < 20; i++) {
                        w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_1');
                        w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_2');
                    }
                } else {
                    for (var i = 2; i < 20; i++) {
                        w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_1');
                        w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_2');
                    }
                }
            }
        } else {
            var state = w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked;
            if (!state) {
                for (var i = 2; i < 20; i++) {
                    w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_1');
                    w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_2');
                }
            } else {
                for (var i = 2; i < 20; i++) {
                    w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_1');
                    w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_2');
                }
            }
        }
        // w2ui.spreadsheetVehicule.columns
    },
    loadData: function(e) {
        var self = this;
        // var options = {
        // 	  rowHeaders: true,
        //         colHeaders: true,
        //         minSpareRows: 1,
        //         contextMenu: true,
        //         beforeValidate :self.beforeValidate.bind(self)
        //     };
        $.ajax({
            url: app.baseUrl + 'civutils/getdateciv',
            type: 'POST',
            data: {
                id_tvv: $('#versiune').data('selected').id,
                id_extensie: $('#extensie').data('selected').id
            },
            success: function(response) {
                var data = response.data;
                var columns = [],
                    records = [];
                for (var i = 0; i < data.colHeaders.length; i++) {
                    
                    var editOptions = data.columns[i].editor;
                    var editor;

                    if (editOptions) {
                        if (data.columns[i].data === 'culoare') {
                            editor = {
                                type: 'combo'
                            }
                        } else {
                            editor = {
                                type: editOptions === 'select' ? 'select' : 'text',
                            }
                        }
                        if (data.columns[i].selectOptions) {
                            editor.items = [];
                            for (var x = 0; x < data.columns[i].selectOptions.length; x++) {
                                editor.items.push({
                                    id: data.columns[i].selectOptions[x],
                                    text: data.columns[i].selectOptions[x]
                                });
                            }
                        }
                    } else if (data.columns[i].type) {
                        editor = {
                            type: 'float'
                        };
                        if (data.columns[i].interval) {
                            editor.min = Number(data.columns[i].interval[0]);
                            editor.max = Number(data.columns[i].interval[1]);
                        }
                    } else {
                        editor = {
                            type: 'text'
                        };
                    }


                    columns.push({
                        field: data.columns[i].data,
                        caption: data.colHeaders[i],
                        sortable: true,
                        size: data.columns[i].data.search('anv') !== -1 || data.columns[i].data.search('vin') !== -1 ? '230px' : data.columns[i].data.search('culoare') !== -1 ? '150px' : '100px',
                        editable: editor
                    });
                }
                data.data.recid = 0;
                records.push(data.data);

                if (w2ui.hasOwnProperty('spreadsheetVehicule')) {
                    w2ui.spreadsheetVehicule.columns = columns;
                    w2ui.spreadsheetVehicule.records = records;
                    w2ui.spreadsheetVehicule.refresh();
                }
                self.activateOptionale();
            }
        });
    },
    buildLoad:function() {
        var self = this;
        $('#wvta').w2field('list',{url:app.baseUrl + 'civutils/getWVTA',minLength: 0,postData:{idcom:self.options.id_comanda},cascadeTo:['#extensie']});
        $('#extensie').w2field('list',{cascadeTo:['#tip'],url:app.baseUrl + 'civutils/getExtensiiWVTA',minLength: 0,postData:function(){return {id_wvta:$('#wvta').data('selected').id,idcom:self.options.id_comanda};}});
        $('#tip').w2field('list',{cascadeTo:['#varianta'],url:app.baseUrl + 'civutils/gettipuri',minLength: 0,postData:function(){return {id_extensie:$('#extensie').data('selected').id,idcom:self.options.id_comanda};}});
        $('#varianta').w2field('list',{cascadeTo:['#versiune'],url:app.baseUrl + 'civutils/getvariante',minLength: 0,postData:function(){return {idcom:self.options.id_comanda,id_wvta:$('#wvta').data('selected').id,tip:$('#tip').data('selected').id};}});
        $('#versiune').w2field('list',{url:app.baseUrl + 'civutils/getversiuni',minLength: 0,postData:function(){return {idcom:self.options.id_comanda,id_wvta:$('#wvta').data('selected').id,varianta:$('#varianta').data('selected').id,tip:$('#tip').data('selected').id};}});
        $('#versiune').on('change', function() {
            self.loadData();
        });
    },
    validator:function(value, callback) {
        callback(true);
    },
    beforeValidate:function(value, row, prop, source) {
        var interval = this.validators[prop];
        var col = this.hot.propToCol(prop);
        var totalRows = this.hot.countRows();
        if (row < totalRows - 1) {
            if (interval) {
                if (value && value != '' && value >= Number(interval[0]) && value <= Number(interval[1])) {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                } else {
                    if (!value || value === '')
                        $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare obligatorie!');
                    else
                        $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare intre ' + interval[0] + ' si ' + interval[1]);
                    this.isValid = false;
                }
            } else if (prop === 'vin') {
                if (!this.validateVin(value)) {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare invalida!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }

            } else if (prop === 'an') {
                if (value < 1960 || value > new Date().getFullYear()) {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare invalida!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }
            } else {
                if (!value || value === '') {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare obligatorie!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }
            }
        }
    },
    validateRow:function(row, rowindex) {
        var valid = true;
        var grid = w2ui.spreadsheetVehicule;
        var columns = grid.columns;
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var tr = $('#grid_spreadsheetVehicule_rec_'+rowindex);//grid.getCellHTML(rowindex,i);
            var cell = tr.find('td[col="'+i+'"]');
            if (!row[column.field] || row[column.field] === '') {
                /*$('#grid_spreadsheetVehicule_data_'+rowindex+'_'+i)*/cell.w2tag('Camp obligatoriu', {
                    'class': 'w2ui-error'
                });
                valid = false;
            }
            if (column.field === 'vin') {
                valid = this.validateVin(row['vin']);
                if (!valid)
                    /*$('#grid_spreadsheetVehicule_data_'+rowindex+'_'+i)*/cell.w2tag('Valoare incorecta', {
                        'class': 'w2ui-error'
                    });
            }
        }
        return valid;
    },
    saveData:function() {
        var cansave = true;
        var self = this;
        var array = w2ui.spreadsheetVehicule.records;
        self.isValid = true;
        for (var i = 0; i < array.length; i++) {
            if (!self.validateRow(array[i], i)) self.isValid = false;
        }
        if (!self.isValid) {
            var opt = {
                text: 'Vehiculele contin erori!',
                title: 'Notificare',
                type: 'error-template'
            };
            ipc.send('app:notification:show', opt);
            return;
        }
        var postData = {
            id_tvv: $('#versiune').data('selected').id,
            id_extensie: $('#extensie').data('selected').id,
            id_comanda: self.options.id_comanda,
            data: w2ui.spreadsheetVehicule.records,
            optionale:w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked
        }
        if (cansave && self.isValid) {
            $('#validationSummary').empty();
             w2utils.lock('#main', 'Va rugam asteptati...', true);
            $.ajax({
                url: app.baseUrl + 'civutils/saveVehiculeExcel',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                success: function(response) {
                    if (response.errors.length === 0) {
                        $('#validationSummary').empty();
                        var opt = {
                            text: 'Vehiculele au fost adaugate!',
                            title: 'Notificare',
                            type: 'success-template'
                        };
                        ipc.send('app:notification:show', opt);
                    } else {
                        var opt = {
                            text: 'Vehiculele contin erori!',
                            title: 'Notificare',
                            type: 'error-template'
                        };
                        ipc.send('app:notification:show', opt);

                        response.errors.map(function(error) {
                            for (var err in error) {
                                $('#validationSummary').append('<span>' + err + ': ' + error[err] + '</span><br>');
                            }
                        });
                    }
                    response.goodVehicles.map(function(vin) {
                        var rows = w2ui.spreadsheetVehicule.records;
                        for (var row = 0; row < rows.length; row++) {
                            if (rows[row].vin === vin) {
                                w2ui.spreadsheetVehicule.remove(rows[row].recid);
                            }
                        }
                    });
                      w2utils.unlock('#main');
                },
                error: function(data) {
                    w2utils.unlock('#main');
                    data.map(function(err) {
                        $('#validationSummary').append('<span>' + err + ': ' + data[err] + '</span><br>');
                    });
                }
            });
        } else {
            //w2alert('datele nu sunt valide!');
        }
    },
    validateVin:function(value, source) {
        var vin = value; //.toUpperCase();
        var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
        //var wild = /^$/;

        if (vin !== undefined && vin.length > 0) {
            if (regex.test(vin) && vin.length === 17) {
                //app.Util.removeError($('#vin').parent());
                return true;
                //}else if(wild.test(vin)){

            } else {
                return false;
            }
        }
    },
    onBeforeDestroy:function() {
        w2ui.spreadsheetVehicule.destroy();
    }



});

},{"./../../templates/vehicule/spreadsheet.hts":80}],124:[function(require,module,exports){
var ipc = requireNode('ipc');
var Globals = require('./../../globals');
var root, vehicul,
    EditView = window.Marionette.FormView.extend({
        className: 'page',
        /**
         * view related properties
         * @type {Object}
         */
        ui: {
            'save': '#btnSaveVehicul',
            'copy': '#btnCopyVehicul',
            'info': '#btnVehiculComplet',
            'back': '#btnBack',
            'newwin': '#btnNewWindow',
            'firstIndex':'#btnFirst',
            'lastIndex':'#btnLast',
            'nextIndex':'#btnNext',
            'prevIndex':'#btnPrev',
        },
        /**
         * ui event handlers
         * @type {Object}
         */
        events: {
            'click @ui.save': 'save',
            'click @ui.copy': 'copy',
            'click @ui.back': 'back',
            'click @ui.info': 'info',
            'click @ui.newwin': 'newwin',
            'click @ui.firstIndex': 'gotofirst',
            'click @ui.lastIndex': 'gotolast',
            'click @ui.nextIndex': 'gotonext',
            'click @ui.prevIndex': 'gotoprev'
        },
        /**
         * model event handlers
         * @type {Object}
         */
        modelEvents: {
            // 'change': 'modelChanged',
            //'change:vin': 'validatenewvin',
            //'change:id_tvv': 'resetVehicul',
            // 'change:id_extensie': 'reloadDate',
            // 'change:cnot': 'setnr'
        },
        /**
         * model link to controls
         * @type {Object}
         */
        bindingsOverrides: {
            //set motor values from data.selected of control
            '#motor': {
                observe: ['motor'],
                onGet: function(value) {
                    return value;
                },
                onSet: function(value) {
                    var newval = $('#motor').data('selected');
                    return newval.id;
                }
            },
            //disable copy button for new records
            '#btnCopyVehicul': {
                attributes: [{
                    name: 'disabled',
                    observe: 'id',
                    onGet: function(value) {
                        return !value;
                    }
                }]
            },
            //disable info button for new records
            '#btnVehiculComplet': {
                attributes: [{
                    name: 'disabled',
                    observe: 'id',
                    onGet: function(value) {
                        return !value;
                    }
                }]
            },
            //hide engine for O and R categories
            '#engine_container': {
                attributes: [{
                    name: 'hidden',
                    observe: 'categ_euro',
                    onGet: function(value) {
                        if (value)
                            return (value.substr(0, 1) === 'O' || value.substr(0, 1) === 'R');
                        return value;
                    }
                }]
            },
            '#wvta':{
                observe:'wvta',
                onGet:function(value){
                    return value;
                },
                onSet:function(value){
                    this.resetVehicul();
                    var selected = $('#wvta').data('selected');
                    return selected.text;
                }
            },
            '#versiune':{
                observe:'versiune',
                onGet:function(value){
                    return value;
                },
                onSet:function(value){
                    this.reloadDate();
                    var selected = $('#versiune').data('selected');
                    return selected.id;
                }
            },
            '#categ_euro':'categ_euro'
            /*,
            '#vin':{
                observe:'vin',
                onGet:function(value){
                    return value;
                },
                onSet:function(value){
                    this.validatenewvin();
                    return value;

                }
            }*/
        },

        // <Constants>
        template: require('./../../templates/vehicule/vehicul.hts'),
        initialize: function() {

            var self = this;
            //property - holds window state(inline or dialog)
            this.isDialog = false;
            _.bindAll(this, 'renderanvelope');
            root = app.baseUrl;
            //cache module controller for convenience
            vehicul = app.module('appciv').controller;
            //set view type
            this.setViewType();
            // window.isDirty.watch('dirty',function(prop,oldval,newval){
            //     // self.toggleValidateButton(newval);
            //     self.disableCopy();
            // });
                        //disable copy button if one of child properies has change
            // this.listenTo(app.module('appciv'), 'attachedProp:changed', function(){window.isDirty.dirty=true;});
            // this.listenTo(this.model,'change',function(){window.isDirty.dirty=true;});
        },
        /**
         * set view type -is copy or fresh record
         */
        setViewType: function() {
            var isCopy = this.model.get('isCopy');
            if (!this.model.id) {
                if (!isCopy) {
                    this.isNew = true;
                }
            }
        },
        /**
         * on view attachet to DOM
         * @return {[type]} [description]
         */
        onShow: function() {
            //  if(w2ui.panels && w2ui.panels.length>0){
            //     w2panel.destroy();
            // }
            //atriutele si mentiunile se vor afisa la schimbarea/alegerea extensiei in cazul
            //vehiculului nou
            var pstyle = 'border: 1px solid #dfdfdf; padding: 10px;';
            //build layout
            $('#categorie').hide();
            if(!w2ui.hasOwnProperty('layoutVehicul')){
                $('#vehiculTemplate').w2layout({
                    name: 'layoutVehicul',
                    panels: [{
                            type: 'left',
                            size: '50%',
                            style: pstyle,
                            title: 'Date principale',
                            resizable: true,
                            content: $('#date_principale').html()
                        }, {
                            type: 'main',
                            size: '50%',
                            title: 'Date tehnice',
                            style: pstyle,
                            content: $('#date_tehnice').html()
                        }, {
                            type: 'bottom',
                            size: 60,
                            style: pstyle,
                            content: $('#buttons_container').html()
                        }

                    ]
                });
            }
            //set dropdowns for controls that suport it
            this.setupView();
            //if record is in update state we enable buttons and render child records and "mentiuni" property
            if (!this.isNew) {
                this.renderatributes();
                vehicul.loadListeAnvelope(this.model, this.renderanvelope);
                this.rendermentiuni();
                // this.enableCopy();
            }

            if(this.model.id){
                console.log(this.options);
                this.relatedVehicles = this.options.relatedVehicles;
                this.prepareFormNavigation();
            }

            //link model properties to controls
            // this.stickit();


        },

        /**
        * Prepare prev next navigation
        **/
        prepareFormNavigation:function(){
            this.currentIndex = this.relatedVehicles.indexOf(this.model.id) +1;
            $('#currentIndex').val(this.currentIndex);
        },

        /**
         * go to previous page
         * if this is dialog then we close it
         * @return {[type]} [description]
         */
        back: function() {
            var self = this;
            if (this.isDialog) {
                _.find(w2ui.panels, function(p) {
                    return p.name === 'editVeh' + self.cid;
                }).destroy();

            } else {
                app.module('appciv').router.navigate('appciv/cereri', {
                    trigger: true
                });
            }
        },
        //reset properties if sensible data is changed(nr_registru or extensie)
        //TODO: refactor - is too complex and hard to mantain
        resetVehicul: function() {
            var self = this;
            console.log(self.model.get('id_tvv'));
            // if is copy we need to refresh only color and serie_motor - all others remains the same
            self.model.set('nr_registru','');
            if (!self.iscopy) {
                if (!self.isNew) {
                    //not new - we nees to reset child collections
                    self.model.get('Atribute').reset();
                    self.model.get('Anvelope').reset();
                    //try to reset the anvelope dropdown sources
                    try {
                        Globals.anvelopefata.reset();
                        Globals.anvelopespate.reset();
                    } catch (e) {
                        console.error(e);
                    }
                }
                // reset an fabricatie
                self.model.set('an_fabr', '');
                //get new wvta,categ euro and cnot and set them to model

                // self.model.set('motor', '');
            }
            //reset serie motor and culoare
            // self.model.set('serie_motor', '');
            // self.model.set('culoare', '');
            // reinitialize extensie dropdown
            //$('#extensie').w2field().reinit();
        },
        /**
         * reload child related data
         * @return {[type]} [description]
         */
        reloadDate: function() {
            var self = this;
            // we need this params to reload some data from server
            var params = {
                id_tvv: this.model.get('id_tvv'),
                id_extensie: this.model.get('id_extensie'),
                id: this.model.id && this.model.id !== 0 ? this.model.id : 0
            };
            // check if nr registru and extensie are set
            if (params.id_tvv && params.id_extensie) {
                // if not is copy we need to refresh motor dropdown
                if (!self.iscopy) {
                    $.ajax({
                    url: root + 'vehicule/getwvta',
                    data: {
                        id_tvv: self.model.get('id_tvv')
                    },
                    success: function(response) {
                        self.model.set('categ_euro', response.categ_euro);
                        if (response.categ_euro.substr(0, 1) !== 'O' && response.categ_euro.substr(0, 1) !== 'R') {
                                // $('#serie_motor').attr('disabled', null);
                                // $('#motor').attr('disabled', null);
                                $('#engine_container').show();
                                $('#motor').w2field().reinit();
                                self.model.set('serie_motor', '').set('motor', '');
                                if(response.categ_euro.split('|').length > 1){
                                    $('#categ_euro').w2field('list',{
                                        items:response.categ_euro.split('|')
                                    });
                                    $('#categorie').show();
                                }else{
                                    $('#categorie').hide();
                                }
                            } else {
                                console.log("Remorca!!");
                                // $('#serie_motor').attr('disabled', true);
                                // $('#motor').attr('disabled', true);
                                $('#engine_container').hide();
                            }
                        }
                    });

                }
                //reload date tehnice
                self.model.get('Atribute').reset();
                $.ajax({
                    url: root + 'vehicule/getatributevehicul',
                    data: params,
                    dataType: 'json',
                    type: 'GET',
                    success: function(response) {
                        if(response.error !==''){
                            w2alert(response.error);
                        }
                        app.trigger('wltp:changed',response.iswltp == 1);
                        self.model.get('Atribute').reset(response.atribute);
                        if (self.isNew) {
                            self.renderatributes(response.iswltp);
                        }
                        self.model.set('nr_registru',response.nr_registru);
                        self.model.set('mentiuni', response.mentiuni);
                        
                        self.rendermentiuni();
                    },
                    error: function(response) {
                        console.error(response);
                    }
                });
                //reload anvelope
                self.model.get('Anvelope').reset();
                $.ajax({
                    url: root + 'vehicule/getanvelopevehicul',
                    data: params,
                    dataType: 'json',
                    type: 'GET',
                    success: function(response) {
                        vehicul.loadListeAnvelope(self.model, function() {
                            self.model.get('Anvelope').reset(response);
                            if (self.isNew) {
                                self.renderanvelope();
                            } else {
                               app.module('appciv').trigger('anvelopeView:setSelect');
                            }
                            // self.renderanvelope();
                        });
                    },
                    error: function(response) {
                        console.error(response);
                    }
                });
            }
        },

        rendermentiuni: function() {
          for (var x = 0; x < 10; x += 1) {
              $('#ment' + (x + 1)).val('');
          }
            if(this.model.get('mentiuni')){
                var mentiuni = this.model.get('mentiuni').split('\n');
                $('.mentiuni').find('input').val('');
                for (var i = 0; i < mentiuni.length; i += 1) {
                    $('#ment' + (i + 1)).val(mentiuni[i]);
                }
            }
        },
        renderatributes: function(param) {
            var options = {
                element: '#date_tehnice_container',
                atributes: this.model.get('Atribute'),
                iswltp:param
            };
            vehicul.renderAtributes(options);
        },
        renderanvelope: function() {
            var self = this;
            var options = {
                element: '#anvelope_container',
                anvelope: self.model.get('Anvelope')
            };
            vehicul.renderAnvelope(options);
        },
        setnr: function() {
            var self = this;
            // $.ajax({
            //     url: root + 'appciv/comenzi/getnrombycnot',
            //     type: 'GET',
            //     data: {
            //         'cnot': this.model.get('cnot')
            //     },
            //     success: function(response) {
            //         //$('#nr_registru').data('selected', response).trigger('change');
            //         self.model.set('nr_registru', response.text);
            //     }
            // });
        },

        /**
         * validate vin property - only alfanumeric
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        validatenewvin: function(e) {
            var errors = {};
            var data = [];
            errors.data = data;
            var real_vin = this.model.get('vin');
            if(!real_vin){
                 data.push({
                        name: 'vin',
                        message: 'Camp obligatoriu!'
                    });
                    //app.Util.showError({}, errors);
                    w2utils.validateRaw(this.$el, data);
                    return false;
            }
            var vin = real_vin.toUpperCase();
            var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
            //var wild = /^$/;

            if (vin !== undefined && vin.length > 0) {
                if (regex.test(vin) && ((vin.length === 17 && this.model.get('categ_euro').search('T') === -1) || (vin.length <= 17 && this.model.get('categ_euro').search('T') !== -1))) {
                    //app.Util.removeError($('#vin').parent());
                    this.model.set('vin', vin);
                    return true;
                    //}else if(wild.test(vin)){

                } else {
                    data.push({
                        name: 'vin',
                        message: 'Valoare incorecta!'
                    });
                    //app.Util.showError({}, errors);
                    w2utils.validateRaw(this.$el, data);
                    return false;
                }
            } else {
                data.push({
                    name: 'vin',
                    message: 'Camp obligatoriu!'
                });
                //app.Util.showError({}, errors);
                w2utils.validateRaw(this.$el, data);
                return false;
            }
        },
        save: function() {
            var self = this;
            var options = {
                success: function(model) {
                    var opt = {
                        text: 'Inregistrarea a fost salvata!',
                        title:'Notificare',
                        type: 'success-template'
                    };
                    ipc.send('app:notification:show', opt);
                    if (self.model.get('isCopy')) {
                        app.router.navigate('appciv/detaliiVehicul/' + model.id);
                        self.model.set('isCopy', false);
                    }

                    self.enableCopy();
                },
                error: function(model, response) {
                    // we get the errors as a string. This was implemented so that we can show
                    // both errors comming from server and from client. We modded the validate
                    // function of the model so that it returns a JSON string containing an element named errors
                    // from server we get the same result
                    if (response.status !== 401) {
                        var opt = {
                            text: 'Eroare la salvare!',
                            title:'Notificare',
                            type: 'error-template'
                        };
                        ipc.send('app:notification:show', opt);
                        var data = eval('(' + response.responseText + ')');
                        //console.log(data);
                        w2utils.validateRaw(self.$el, data.data);
                    }
                }
            };
            if (self.validatenewvin() && w2utils.validate(self.model, self.$el)) {
                self.model.save({}, options);
                //alert('isValid')
            }
        },
        copy: function() {
            //this._modelBinder.unbind();

            // var Prototype = app.module('vehicul').VehiculModel;
            // var newmodel = this.model; //new Prototype(this.model.toJSON());
            $('#culoare').w2field().reinit();
            this.model.set('EntityState', 0).set('vin', '')
                .set('isCopy', true)
                .set('serie_motor', '')
                .set('culoare','')
                .unset('id');
            this.model.get('Atribute').each(function(model) {
                model.set('EntityState', 0).unset('id').unset('id_vehicul');
            });
            this.model.get('Anvelope').each(function(model) {
                model.set('EntityState', 0).unset('id').unset('id_vehicul');
            });
            this.isCopy = true;
            this.disableCopy();
            // app.router.navigate('#/appciv/copyVehicul/' + this.model.get('id'), {
            //     trigger: false
            // });

        },
        info: function() {
            var self = this;
            ipc.send('app:request:pdf', root + 'civfiles/GetVehiculComplet?id=' + self.model.id);
        },
        // modelChanged: function(e) {
        //     this.listenToOnce(this.model,'change',this.modelChanged);
        //     var self = this;
        //     self.disableCopy();
        //     $.each(e.changedAttributes(), function(i, value) {
        //         if (i !== 'vin') {
        //             if(i==='id_tvv'){
        //                 console.log('tvv changed');
        //             }else if(i==='id_extensie'){
        //                 console.log('extensie changed');
        //             }
        //             //app.Util.removeError($('#' + i).parent());
        //         }
        //     });
        // },
        disableCopy: function() {
            $('#btnCopyVehicul').attr('disabled', true);
            $('#btnVehiculComplet').attr('disabled', true);
        },
        enableCopy: function() {
            $('#btnCopyVehicul').attr('disabled', null);
            $('#btnVehiculComplet').attr('disabled', null);
        },
        onBeforeDestroy: function() {
            w2ui.layoutVehicul.destroy();
            if (this.win) {
                this.win.destroy();
            }
        },

        newwin: function() {
            var self = this;
            $('#btnNewWindow').hide();
            this.isDialog = true;
            self.win = $(this.el).w2panel({
                name: 'editVeh' + this.cid,
                showMax: true,
                showMin: true,
                preserveContent: true,
                width: 800,
                height: 600,
                resizable: true,
                maximized: true
            });
            w2ui.layoutVehicul.resize();
            self.win.on('close', function(event) {
                event.onComplete = function() {
                    w2ui.layoutVehicul.resize();
                    self.isDialog = false;
                    $('#btnNewWindow').show();
                    self.win = null;
                };
            });
        },

        gotofirst:function(){
            var id = this.relatedVehicles[0];
            app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
        },

        gotolast:function(){
            var id = this.relatedVehicles[this.relatedVehicles.length-1];
            app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
        },
        gotonext:function(){
            if(this.currentIndex < this.relatedVehicles.length){
                var id = this.relatedVehicles[this.currentIndex];
                app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
            }
        },
        gotoprev:function(){
            if(this.currentIndex > 1){
                var id = this.relatedVehicles[this.currentIndex-2];
                app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
            }
        },

    });
module.exports = EditView;

},{"./../../globals":24,"./../../templates/vehicule/vehicul.hts":82}],125:[function(require,module,exports){
var ipc = requireNode('ipc');
module.exports = window.Marionette.CompositeView.extend({
    template: require('./../../templates/vehicule/index.hts'),
    initialize: function(options) {
        var self = this;
        this.parentID = options.parentID;
        this.elid = options.element;
        this.canadd = options.canadd;
        self.caption = 'Lista vehicule atasate comenzii nr.' + self.parentID;
    },
    onRender: function() {
        var self = this;
        self.renderGrid();
    },

    serializeData: function() {
        return {
            'id_comanda': this.parentID
        };
    },
    renderGrid: function() {
        var self = this;
        $(self.elid).w2grid({
            name: 'gridVehicule_' + this.parentID,
            url: app.baseUrl + 'vehicule/getvehicule/' + self.parentID,
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            show: {
                toolbar: true,
                footer: true,
                selectColumn: true
            },
            columns: [{
                field: 'id',
                caption: 'ID',
                sortable: true,
                hidden: true,
                size: '1px'
            }, {
                field: 'nr_registru',
                caption: 'Nr. Omologare',
                sortable: true,
                size: '25%'
            }, {
                field: 'vin',
                caption: 'VIN',
                sortable: true,
                size: '25%'
            }, {
                field: 'wvta',
                caption: 'WVTA',
                sortable: true,
                size: '25%',
                render:function(rec){
                    return rec.wvta + '*' + rec.extensie;
                }
            }, {
                field: 'motiv_respingere',
                caption: 'Stare In Clar',
                sortable: true,
                size: '25%',
                hidden: true,
                searchable: false
            }, {
                field: 'stare',
                caption: 'Status',
                sortable: true,
                size: '25%',
                render: function(record) {
                    var cls = 'default',
                        stare = record.motiv_respingere;
                    switch (record.stare) {
                        case 0:
                            // stare = 'OK';
                            cls = 'label-default';
                            break;
                        case 1:
                            // stare = 'OK';
                            cls = 'label-primary';
                            break;
                        case 2:
                            // stare = 'Date eronate';
                            cls = 'label-warning';
                            break;
                        case 3:
                        case 8:
                            // stare = 'Invalid';
                            cls = 'label-danger';
                            break;
                        case 10:
                        case 55:
                            // stare = 'Transmis';
                            cls = 'label-waiting';
                            break;
                        case 11:
                            // stare = 'Prelucrat OK';
                            cls = 'label-ready';
                            break;
                        case 12:
                            // stare = 'Nu se poate prelucra';
                            cls = 'label-warning';
                            break;
                        case 4:
                            // stare = 'Netransmis';
                            cls = 'label-danger';
                            break;
                        case 15:
                            // stare = 'Tiparit';
                            cls = 'label-success';
                            break;
                        default:
                            break;
                    }
                    var html = '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="label ' + cls + '">&nbsp;&nbsp;&nbsp;</label>';
                    return html;
                }
            }],
            toolbar: {
                //                    onRender: function () {
                //                        if (!self.canadd) {
                //                            this.disable('btnAddVehicul');
                //                        }
                //                        this.disable('btnEditVehicul');
                //                        this.disable('btnDeleteVehicul');
                //                        this.disable('btnDetaliiVehicul');
                //                    },
                items: [{
                    type: 'button',
                    caption: 'Adauga',
                    icon: 'w2ui-icon-plus',
                    id: 'btnAddVehicul',
                    disabled: !self.canadd,
                    onClick: function(e) {
                        self.destroy();
                        app.module('appciv').router.navigate('appciv/addVehicul/' + self.parentID, true);
                    }
                }, {
                    type: 'button',
                    id: 'btnEditVehicul',
                    caption: 'Edit',
                    icon: 'w2ui-icon-pencil',
                    disabled: true,
                    onClick: function(event) {
                        var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                        self.destroy();
                        app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
                    }
                }, {
                    type: 'button',
                    id: 'btnDeleteVehicul',
                    caption: 'Sterge',
                    icon: 'w2ui-icon-cross',
                    disabled: true,
                    onClick: function(event) {
                        w2ui['gridVehicule_' + self.parentID].delete();
                    }
                }, {
                    type: 'break'
                }, {
                    type: 'button',
                    id: 'btnDetaliiVehicul',
                    icon: 'w2ui-icon-search',
                    caption: 'Detalii',
                    disabled: true,
                    onClick: function(event) {
                        var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetVehiculComplet?id=' + id);
                    }
                },
                {
                    type: 'button',
                    id: 'btnNewWin',
                    icon: 'w2ui-icon-newwindow',
                    caption: 'Detaseaza',
                    disabled: false,
                    onClick: function(event) {
                        var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                        self.win = $(self.elid).w2panel({
                            name: 'listvehicles' + id,
                            showMax: true,
                            showMin: true,
                            preserveContent: true,
                            width: 800,
                            height: 600,
                            resizable: true,
                            maximized: false,
                            onOpen:function(){
                            },
                            onClose:function(){

                            }
                        });
                    }
                }]
            },
            onDblClick: function(event) {
                var b = this.get(event.recid).stare;
                if (b < 10 && (b !== 4 && b !== 3)) {
                    self.destroy();
                    app.module('appciv').router.navigate('appciv/detaliiVehicul/' + event.recid, true);
                }
            },
            multiSearch: false,
            multiSelect: true,
            searches: [{
                field: 'vin',
                caption: 'V.I.N. ',
                type: 'text'
            }, {
                field: 'wvta',
                caption: 'W.V.T.A.',
                type: 'text'
            }, {
                field: 'nr_registru',
                caption: 'Nr. Omologare',
                type: 'text'
            }, {
                field: 'stare',
                caption: 'Status',
                type: 'list',
                options: {
                    items: ['In lucru', 'Remediabile', 'Transmise', 'Prelucrate', 'Invalide', 'Tiparite']
                }
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onDeleted: function(event) {
                var response = JSON.parse(event.xhr.responseText);
                w2ui.gridCereri.get(response.id_comanda).depusa = response.status_comanda;
                w2ui.gridCereri.refreshCell(response.id_comanda, 'stare_comanda');
            },
            onSelect: function(event) {
                if (event.recid) {
                    var b = this.get(event.recid).stare;
                    if (b !== 4 && b !== 3) {
                        this.toolbar.enable('btnDetaliiVehicul');
                    }
                    if (b < 10) {
                        this.toolbar.enable('btnDeleteVehicul');
                        if (b !== 4 && b !== 3) {
                            this.toolbar.enable('btnEditVehicul');
                        }
                    }
                }

            },
            onUnselect: function() {
                this.toolbar.disable('btnEditVehicul');
                this.toolbar.disable('btnDeleteVehicul');
                this.toolbar.disable('btnDetaliiVehicul');
            },
            fixedBody: true,
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
                    // sf['oper'] = sf['operator'];
                    // delete sf['operator'];
                    if (sf.field === 'stare') {
                        switch (sf.value) {
                            case 'In lucru':
                                sf.value = '(0,1,2)';
                                break;
                            case 'Remediabile':
                                sf.value = '(2)';
                                break;
                            case 'Transmise':
                                sf.value = '(10,11,12,15)';
                                break;
                            case 'Prelucrate':
                                sf.value = '11';
                                break;
                            case 'Invalide':
                                sf.value = '(4,12,8,3)';
                                break;
                            case 'Tiparite':
                                sf.value = '15';
                                break;
                            default:
                                break;
                        }
                        sf.operator = 'isin';
                    }
                }

            },

            onLoad:function(event){
              var grid = this;
              event.onComplete = function(){
                if(!self.refreshInterval){
                  self.refreshInterval = setInterval(function(){
                    $.ajax({
                      url:app.baseUrl + 'civutils/getStareVehicule/'+self.parentID,
                      type:'GET',
                      success:function(data){
                        data.response.map(function(stare){
                          grid.set(stare.id,{stare:stare.stare,motiv_respingere:stare.motiv_respingere});
                        });
                      },
                      error:function(){
                          clearInterval(self.refreshInterval);
                      }
                    });
                  },60000);
                }
              };
            },
            onDestroy:function(){
              self.destroy();
            }
        });


    },
    onBeforeDestroy: function() {
        //w2ui['gridVehicule_' + this.parentID].destroy();
        if(this.win){
            event = {};
            //console.log(event);
            this.win.destroy();
        }
        clearInterval(this.refreshInterval);
    },
    infoVehicul: function(e) {
        e.preventDefault();
        var id = $(e.currentTarget).data('rowid');
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetVehiculComplet?id=' + id);
    },
    refreshGrid: function() {
        w2ui['gridVehicule' + this.parentID].reload();
    }
});

},{"./../../templates/vehicule/index.hts":79}],126:[function(require,module,exports){
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

},{"./models/user":130,"./views/footer":139,"./views/index":140,"./views/info":141,"./views/login":142,"./views/menu":143,"./views/profile":144,"./views/settings":145}],127:[function(require,module,exports){

// window.$ = window.jQuery = global.$ = require('jquery');
// // var base = 'f:/gitresources';
// var base = '/home/cristi/Documents/Projects';

//core backbone
// var MarionetteModule = require('backbone.marionette');
// window.Marionette = global.Marionette = MarionetteModule.Marionette;
// window.Backbone = global.Backbone = MarionetteModule.Backbone;
// window._ = global._ = MarionetteModule._;
// require('./../node_modules/tinymce/tinymce');
// require('./../node_modules/tinymce/themes/modern/theme.min');

// //extensions backbone
// require(base+'/nwbundles/backbone-associate/src/backbone.associate');
// require(base+'/nwbundles/bootstrap-fileinput/js/fileinput');
// require(base+'/nwbundles/stickit/backbone.stickit');
// require(base+'/nwbundles/extensions/bb.extensions');
// require(base+'/nwbundles/extensions/m.extensions');
// //var editor = require(base+'/nwbundles/nicedit/nicEdit');
// require(base+'/nwbundles/filemenu/src/js/fileMenu');
// // require(base+'/nwbundles/jqwidgets/jqx-all');


// //ui
// var w2uimodule = require(base+'/nwbundles/w2ui/dist/w2ui');
// window.w2ui = w2uimodule.w2ui;
// window.w2utils = w2uimodule.w2utils;
// window.w2obj = w2uimodule.w2obj;
// window.w2popup = w2uimodule.w2popup;
// window.w2panel = w2uimodule.w2panel;
// window.w2alert = w2uimodule.w2alert;
// window.w2confirm = w2uimodule.w2confirm;
// window.w2prompt = w2uimodule.w2prompt;

require('./../backend/startup');


},{"./../backend/startup":5}],128:[function(require,module,exports){
(function (global){


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

app.commands.setHandler('app:set:pagetitle', function(page) {
    $('#lblPageTitle').html(normalizeTitle(page.page));
});

app.commands.setHandler('app:request:info', function() {
    app.controller.info();
});

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../backend/config":1,"./applications/appciv/appciv":10,"./controller":126,"./router":131}],129:[function(require,module,exports){
var Profile = Backbone.SModel.extend({
    idAttribute: 'id_user',
    urlRoot: function() {
        return app.baseUrl + '/users/profile';
    }
});
module.exports = Profile;

},{}],130:[function(require,module,exports){
 var Backbone = window.Backbone;
 var User = Backbone.SModel.extend({
     defaults: {
         auth: false,
         username: '',
         password: ''
     },
     initialize: function() {},
     fields: [{
         name: 'username',
         el: '#username',
         type: 'text',
         required: true
     }, {
         name: 'password',
         el: '#password',
         type: 'password',
         required: true
     }, {
         name: 'rememberme',
         el: '#rememberme',
         type: 'checkbox'
     }]
 });
 module.exports = User;

},{}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"footer\" style=\"padding:2px\"></div>";
  });

},{"hbsfy/runtime":153}],133:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- <div class=\"app-header\">\r\n    <div class=\"app-left-col\">\r\n        <img src=\"";
  if (helper = helpers.img) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.img); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" width=\"130\" height=\"168\" />\r\n    </div>\r\n    <h1>APLICATIE COMENZI C.I.V.<br>COMPARTIMENT OMOLOGARI</h1>\r\n</div>\r\n<div class=\"app-content\">\r\n    <p>&nbsp;</p>\r\n</div>\r\n<div class=\"app-linie\"></div>\r\n<div class=\"app-left-col\">\r\n    <p>\r\n        <strong>Detinator: </strong>R.A.R. - D.T.I.C.\r\n        <br />\r\n        <strong>Programator: </strong>Cristian Mardare\r\n        <br />\r\n        <strong>Design: </strong>Cristian Mardare\r\n    </p>\r\n</div>\r\n<div class=\"app-right-col\">\r\n    <p align=\"right\">\r\n        <strong>Persoana de contact: </strong>Cristian Mardare\r\n        <br />\r\n        <strong>Mobil: </strong>0721.298.782\r\n        <br />\r\n        <strong>E-mail: </strong>cristian.mardare@rarom.ro\r\n    </p>\r\n</div> -->\r\n";
  return buffer;
  });

},{"hbsfy/runtime":153}],134:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div style=\"padding:10px\">\r\n    <h4>Aplicatie Cereri C.I.V.</h4>\r\n    <ul style=\"list-style-type:none\">\r\n        <li>\r\n            <label>Programator: Cristian Mardare</label>\r\n        </li>\r\n        <li>\r\n            <label>Detinator: RAR-DTIC</label>\r\n        </li>\r\n        <li>\r\n            <label>Contact:</label>\r\n            <ul>\r\n                <li>Tel: 0721 298 782</li>\r\n                <li>Email: cristian.mardare@rarom.ro</li>\r\n            </ul>\r\n        </li>\r\n        <li>\r\n            <label>Versiune: ";
  if (helper = helpers.version) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.version); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\r\n        </li>\r\n</div>\r\n";
  return buffer;
  });

},{"hbsfy/runtime":153}],135:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"w2ui-page page-0 modalContent\" id=\"loginForm\" style=\"width:430px\"> \r\n    <div class=\"w2ui-field\">\r\n        <label>Username:</label>\r\n        <div>\r\n            <input name=\"username\" id=\"username\" list=\"usrlist\" type=\"text\" maxlength=\"100\" style=\"width: 250px\"/>\r\n            <datalist id=\"usrlist\"></datalist>\r\n        </div>\r\n    </div>\r\n    <div class=\"w2ui-field\">\r\n        <label>Password:</label>\r\n        <div>\r\n            <input name=\"password\" id=\"password\" type=\"password\" maxlength=\"100\" style=\"width: 250px\"/>\r\n        </div>\r\n    </div>\r\n    <div class=\"w2ui-field\">\r\n        <label>Retine datele:</label>\r\n        <div>\r\n            <input name=\"rememberme\" id=\"rememberme\" type=\"checkbox\"/>\r\n        </div>\r\n    </div>\r\n</div> \r\n<div class=\"w2ui-buttons\"> \r\n    <button class=\"btn btn-red\"  name=\"cancel\">Cancel</button>\r\n    <button class=\"btn btn-blue\" name=\"login\">Login</button>\r\n</div>";
  });

},{"hbsfy/runtime":153}],136:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"header\">\r\n\r\n</div>\r\n";
  });

},{"hbsfy/runtime":153}],137:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"userContainer\" class=\"well-centered\">\r\n    <div class=\"w2ui-page page-0\">\r\n        <div class=\"w2ui-field\">\r\n            <label>Username:</label>\r\n            <div>\r\n                <input name=\"username\" id=\"username\" type=\"text\" maxlength=\"100\" size=\"40\" readonly/>\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Nume afisat:</label>\r\n            <div>\r\n                <input name=\"user_displayname\" id=\"user_displayname\" type=\"text\" maxlength=\"100\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Email:</label>\r\n            <div>\r\n                <input name=\"email\" id=\"email\" type=\"email\" maxlength=\"100\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!--Date proxy-->\r\n    <div class=\"w2ui-page page-1\">\r\n        <div class=\"w2ui-field\">\r\n            <label> Activeaza proxy:</label>\r\n            <div>\r\n                <input type=\"checkbox\" name=\"setupproxy\" id=\"setupproxy\" />\r\n                <span class=\"check\"></span>\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Protocol(http/https):</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_protocol\" id=\"proxy_protocol\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> User:</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_user\" id=\"proxy_user\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Password:</label>\r\n            <div>\r\n                <input type=\"password\" name=\"proxy_pass\" id=\"proxy_pass\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Adresa(ip):</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_address\" id=\"proxy_address\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Port:</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_port\" id=\"proxy_port\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"w2ui-page page-2\">\r\n        <div class=\"w2ui-field\">\r\n            <label> Parola curenta:</label>\r\n            <div>\r\n                <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Parola noua:</label>\r\n            <div>\r\n                <input type=\"password\" name=\"newpass\" id=\"newpass\" class=\"form-control\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Confirma parola:</label>\r\n            <div>\r\n                <input type=\"password\" name=\"confirmedpass\" id=\"confirmedpass\" class=\"form-control\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <!--Date Beneficiar-->\r\n    <div class=\"w2ui-page page-3\">\r\n        <div class=\"w2ui-field\">\r\n            <label>Denumire beneficiar</label>\r\n            <div>\r\n                <input name=\"company\" id=\"company\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Adresa:</label>\r\n            <div>\r\n                <textarea name=\"address\" id=\"address\" style=\"width: 318px; height: 80px; resize: none\"></textarea>\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Telefon</label>\r\n            <div>\r\n                <input name=\"telefon\" id=\"telefon\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Fax</label>\r\n            <div>\r\n                <input name=\"fax\" id=\"fax\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Reprezentanti legali</label>\r\n            <div id=\"grid_rep\" style=\"width:500px;min-height:250px\">\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Calitate</label>\r\n            <div>\r\n                <input name=\"calitate\" id=\"calitate\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Registrul Comertului</label>\r\n            <div>\r\n                <input name=\"nr_reg_com\" id=\"nr_reg_com\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>CUI</label>\r\n            <div>\r\n                <input name=\"cui\" id=\"cui\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>IBAN</label>\r\n            <div>\r\n                <input name=\"cont\" id=\"cont\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label>Banca</label>\r\n            <div>\r\n                <input name=\"banca\" id=\"banca\" type=\"text\" maxlength=\"150\" size=\"40\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"w2ui-buttons\">\r\n        <button class=\"btn\" name=\"reset\">Resetare cache</button>\r\n        <button class=\"btn\" name=\"save\">Save</button>\r\n    </div>\r\n</div>\r\n<div class=\"well well-sm well-centered\">\r\n    Nota: Pentru modificarea utilizatorilor corespunzatori beneficiarului va rugam sa contactati reprezentantii RAR.\r\n</div>\r\n";
  });

},{"hbsfy/runtime":153}],138:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return " <div  style=\"width:500px;\">\r\n <div class=\"w2ui-page page-1\">\r\n        <div class=\"w2ui-field\">\r\n            <label> Activeaza proxy:</label>\r\n            <div>\r\n                <input type=\"checkbox\" name=\"setupproxy\" id=\"setupproxy\" />\r\n                <span class=\"check\"></span>\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Protocol:</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_protocol\" id=\"proxy_protocol\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> User:</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_user\" id=\"proxy_user\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Password:</label>\r\n            <div>\r\n                <input type=\"password\" name=\"proxy_pass\" id=\"proxy_pass\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Adresa(ip):</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_address\" id=\"proxy_address\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n        <div class=\"w2ui-field\">\r\n            <label> Port:</label>\r\n            <div>\r\n                <input type=\"text\" name=\"proxy_port\" id=\"proxy_port\" class=\"proxydata form-control\" disabled=\"disabled\" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n     <div class=\"w2ui-buttons\">\r\n        <button class=\"btn\" name=\"reset\" id=\"btnReset\">Resetare proxy</button>\r\n        <button class=\"btn\" name=\"save\" id=\"btnSaveSettings\">Save</button>\r\n    </div>\r\n</div>";
  });

},{"hbsfy/runtime":153}],139:[function(require,module,exports){
 var gui = requireNode('nw.gui');
  var pkg = gui.App.manifest;
 var footer = window.Marionette.ItemView.extend({
     distractionMode: false,
     template: require('./../templates/footer.html'),
     onShow: function() {
         var self = this;
         var lang = localStorage.getItem('locale') || 'RO';
         $('#footer').w2toolbar({
             name: 'footerToolbar',
             height: 30,
             items: [{
                     type: 'button',
                     id: 'btnSettings',
                     caption: '',
                     icon: 'w2ui-icon-settings',
                     hint: 'Setari aplicatie',
                     onClick: function() {
                         gui.Window.get().showDevTools();
                     }
                 }, {
                     type: 'button',
                     id: 'btnReload',
                     caption: '',
                     icon: 'w2ui-icon-reload',
                     hint: 'Refresh',
                     onClick: function() {
                         gui.Window.get().reload(3);
                     }
                 }, {
                    type: 'menu',
                    id: 'btnMenuLang',
                    caption: lang.toUpperCase(),
                    icon: 'w2ui-icon-lang',
                    items: [{
                        id: 'btnLangRo',
                        text: 'RO',
                        disabled: false,
                       //  icon: 'w2ui-icon-lock'

                    }, {
                        text: 'EN',
                       //  icon: 'w2ui-icon-info',
                        id: 'btnLangEn',
                        disabled: false,
                       //  route: app.currentAppName + '/profile'
                    }]
                }, {
                     type: 'break',
                     id: 'break1'
                 }, , {
                     type: 'spacer',
                     id: 'taskbar',
                     html: '<div class="w2taskbar"></div>'
                 },

                 {
                     type: 'button',
                     id: 'btnDistractionMode',
                     caption: '',
                     icon: 'w2ui-icon-pin',
                     hint: 'Enter distraction mode',
                     onClick: function() {
                         if (self.distractionMode) {
                             for (var obj in w2ui) {
                                 if (w2ui[obj].hasOwnProperty('panels')) {
                                     for (var panel in w2ui[obj].panels) {
                                         var p = w2ui[obj].panels[panel];
                                         if (p.hideInFullScreen)
                                             w2ui[obj].show(p.type);
                                     }

                                 }
                             }
                             self.distractionMode = false;
                         } else {
                             for (var obj in w2ui) {
                                 if (w2ui[obj].hasOwnProperty('panels')) {
                                     for (var panel in w2ui[obj].panels) {
                                         var p = w2ui[obj].panels[panel];
                                         if (p.hideInFullScreen)
                                             w2ui[obj].hide(p.type);
                                     }
                                 }
                             }
                             self.distractionMode = true;
                         }
                     }

                 }, {
                     type: 'html',
                     html: '&copy;RAR-DTIC - 2014 - Version '+pkg.version
                 }
             ],
             onClick: function(event) {
                if (event.target === 'btnMenuLang:btnLangRo') {
                    //var locale = require('./../../common/locale');
                    localStorage.setItem('locale','ro')
                    gui.Window.get().reload(3);
                 }
                 if (event.target === 'btnMenuLang:btnLangEn') {
                    //var locale = require('./../../common/en');
                    localStorage.setItem('locale','en')
                    gui.Window.get().reload(3);
                }
                if (event.target === 'btnMenuLang:btnLangFr') {
                    //var locale = require('./../../common/en');
                    localStorage.setItem('locale','fr')
                    gui.Window.get().reload(3);
                }
             }
         });

         if (window.gui && !window.singleapp) {
             w2ui.footerToolbar.add({
                 type: 'button',
                 id: 'newWin',
                 icon: 'w2ui-icon-newwindow',
                 hint: 'Deschide in fereastra noua',
                 onClick: function() {
                     var appWindow = gui.Window.get(window.open(window.location.hash));
                     appWindow.width = 800;
                     appWindow.height = 600;
                     appWindow.window.singleapp = true;
                 }
             });
         }
     }
 });
 module.exports = footer;

},{"./../templates/footer.html":132}],140:[function(require,module,exports){
    var home = window.Marionette.ItemView.extend({

        template: require('./../templates/index.html'),
        className: 'frontpage',
        onShow: function() {
            var self = this;
            //this.buildGrid();
        },

        serializeData: function() {
            return {
                img: 'images/SiglaRAR-scris-gri.png'
            };
        }
    });
    module.exports = home;

},{"./../templates/index.html":133}],141:[function(require,module,exports){
var InfoView = Marionette.ItemView.extend({
    template: require('./../templates/info.html'),
    initialize: function() {},
    serializeData: function() {
        var pkg = requireNode('nw.gui').App.manifest;
        return {
            version: pkg.version
        };
    },
    onShow: function() {
        var self = this;

        this.win = self.$el.w2panel({
            name: 'infoPage',
            title: 'Info',
            modal: true,
            width: '480px',
            height: '250px',
            onOpen: function(event) {

            },
            onClose: function(event) {
                self.destroy();
            }
        });
    }
});
module.exports = InfoView;

},{"./../templates/info.html":134}],142:[function(require,module,exports){
    var ipc = window.requireNode('ipc');
    var root;
    var usrlist;
    var LoginView = window.Marionette.ItemView.extend({
        template: require('./../templates/login.html'),
        className: 'windowContent w2ui-reset w2ui-form',
        initialize: function() {
            this.deferred = $.Deferred();
            _.bindAll(this, 'login');
            root = app.baseUrl;
            this.callback = this.options.callback;
            var lst = ipc.sendSync('user:request:userlist');
            usrlist = lst.length > 0 ? JSON.parse(lst) : [];
        },
         promise:function(){
            return this.deferred.promise();
        },
        events: {
            'click [name="login"]': 'login',
            'click [name="cancel"]': 'closeView',
            'input #username': 'trysetpass',
            'keyup #loginForm': 'submitForm'
        },
        bindings: {},
        onShow: function() {
            var self = this,
                users = [],
                lastLogin = {};
            this.win = self.$el.w2panel({
                name: 'loginForm',
                title: 'Autentificare',
                modal: true,
                width: '480px',
                height: '250px'
            });
            var list = [];
            if (usrlist) {
                for (var name in usrlist) {
                    var options = usrlist[name];
                    list.push(name);
                    if (options.active) {
                        self.username = name;
                        self.password = ipc.sendSync('pass:request:decrypt', options.pass);
                    }
                }
            }
            //bind model properties to coresponding controls on view
            for (var f in this.model.fields) {
                var field = this.model.fields[f];
                self.bindings[field.el] = field.name;
                $(field.el).w2field(field.type, field.options);
            }
            $('#username').w2field('combo', {
                items: list
            }).on('change', self.trysetpass);
            this.stickit();
        },


        submitForm: function(e) {
            //send form on enter
            var self = this;
            if (e.which === 13) {
                self.$el.find('[name="login"]').click();
            }
        },
        closeView: function(e) {
            var self = this;
            //callback comes from xhr request - it waits until login is done and resends request with new credentials
            if (self.callback)
                self.callback();
            this.deferred.resolve({username:self.model.get('username'),password:self.model.get('password')});
            this.win.destroy(e);
        },
        login: function(e) {
            var self = this;
            var data = {
                username: $('#username').val(),
                password: $('#password').val(),
                rememberme: $('#rememberme').is(':checked'),
                appname: app.currentAppName
            };
            if (w2utils.validate(self.model)) {
                ipc.sendSync('user:request:login', data, function(user) {
                    if (user.auth) {
                        app.User = user;
                        app.trigger('user:updated');
                        if (self.callback) {
                            self.callback(true);
                        }
                        self.closeView();
                    } else {
                        w2panel.message({
                            width: 350,
                            height: 200,
                            html: '<div style="padding: 60px; text-align: center">Date autentificare incorecte</div>' +
                                '<div style="text-align: center"><button class="btn" onclick="w2panel.message()">Inchide</button>'
                        });
                    }
                });

            }
        },
        /*
            We try to set password stored in user prefs
         */
        trysetpass: function(e) {
            try {
                if (usrlist) {
                    var pass = ipc.sendSync('pass:request:decrypt', usrlist[$(e.currentTarget).val()].pass);
                    $('#password').val(pass).trigger('change');
                }
            } catch (ex) {}
        }
    });
    module.exports = LoginView;

},{"./../templates/login.html":135}],143:[function(require,module,exports){
var ipc = requireNode('ipc');
var gui = requireNode('nw.gui');
var Settings = require('./../../backend/config');

module.exports = Marionette.ItemView.extend({
    template: require('./../templates/menu.html'),
    markup: [{
            label: 'Program',
            enabled: true,
            submenu: [{
                type: 'separator'
            }, {
                enabled: true,
                label: 'Services',
                click:function(){app.module('appciv').controller.configTiparCIV();}
            }, {
                enabled: true,
                label: w2utils.lang('Formular CIV'),
                click:function(){
                    var civnou = localStorage.getItem('civnou') && localStorage.getItem('civnou')=='true';
                    var formular = civnou?w2utils.lang('CIV Nou'): w2utils.lang('CIV vechi');
                    w2confirm(w2utils.lang('Aplicatia tipareste pe formularul ') + formular + w2utils.lang('! Doriti schimbarea formularului?'))
                        .yes(function(){
                            localStorage.setItem('civnou',!civnou);
                        });
                }
            },{
                type: 'separator'
            }, {
                enabled: true,
                type: 'normal',
                label: w2utils.lang('Inchide'),
                icon: 'w2ui-icon-poweroff',
                accelerator: 'CmdOrCtrl+Q',
                click: function() {
                    gui.Window.get().close();
                }
            }, ]
        },
        //  {
        //     label: 'Edit',
        //     submenu: [{
        //         label: 'Undo',
        //         accelerator: 'CmdOrCtrl+Z',
        //         selector: 'undo:'
        //     }, {
        //         label: 'Redo',
        //         accelerator: 'Shift+CmdOrCtrl+Z',
        //         selector: 'redo:'
        //     }, {
        //         type: 'separator'
        //     }, {
        //         label: 'Cut',
        //         accelerator: 'CmdOrCtrl+X',
        //         selector: 'cut:'
        //     }, {
        //         label: 'Copy',
        //         accelerator: 'CmdOrCtrl+C',
        //         selector: 'copy:'
        //     }, {
        //         label: 'Paste',
        //         accelerator: 'CmdOrCtrl+V',
        //         selector: 'paste:'
        //     }, {
        //         label: 'Select All',
        //         accelerator: 'CmdOrCtrl+A',
        //         selector: 'selectAll:'
        //     }]
        // },

        {
            label: w2utils.lang('Fereastra'),
            enabled: true,
            type: 'normal',
            submenu: [{
                label: w2utils.lang('Reincarca'),
                enabled: true,
                type: 'normal',
                accelerator: 'CmdOrCtrl+R',
                icon: 'w2ui-icon-reload',
                click: function() {
                    gui.Window.get().reload(3);
                }
            }, {
                label: 'Debug',
                type: 'normal',
                accelerator: 'Alt+CmdOrCtrl+I',
                enabled: true,
                icon: 'w2ui-icon-settings',
                show: function() {
                    return ipc.sendSync('user:request:isuserinrole', [
                        [1], 'appciv'
                    ]);
                },
                click: function() {
                    gui.Window.get().showDevTools();
                }
            }, {
                label: 'Minimize',
                type: 'normal',
                accelerator: 'CmdOrCtrl+M',
                enabled: true,
                click: function() {
                    gui.Window.get().minimize();
                }
            }]
        }
    ],

    setMenuItemVisibility: function(menu) {
        var self = this;
        for (var x in menu) {
            var menuItem = menu[x];
            menuItem.enabled = true;
            if (menuItem.show) {
                menuItem.hidden = !menuItem.show();
            }
            if (menuItem.submenu) {
                self.setMenuItemVisibility(menuItem.submenu);

            }
        }

    },
    refresh: function() {
        var self = this;
        var template = [];
        self.setMenuItemVisibility(self.markup);
        template = self.markup;
        w2ui.filemenu.refresh(template);

    },
    toggleMenuItem: function(item) {
        var self = this;
        if (item && item.label) {
            var configItem = _.findDeep(self.markup, {
                label: item.label
            });
            if (configItem.show && typeof configItem.show === 'function')
                item.enabled = configItem.show.call();
            if (item.submenu) {
                $.each(item.submenu, function(ind, subitem) {
                    self.toggleMenuItem(subitem);
                })
            }
        }
    },
    initialize: function() {
        var self = this;
        var template = [];
        template = _.union(template, self.markup);
        for (var x in Settings.modules) {
            var m = Settings.modules[x];
            if (m.active) {
                //if (ipc.sendSync('app:authorize:app', m.name)) {
                var submenu = m.menuDescriptor;
                //self.setMenuItemVisibility(submenu);
                // template.push({
                //     label: m.title,
                //     //enabled: true,
                //     submenu: submenu
                // });
                //}
                template = _.union(template, submenu);
                // template.push(submenu);
            }
        }
        self.markup = template;
        console.log(template);
    },
    onShow: function() {
        this.$el.w2toolbar({
            name: 'toolbar',
            items: [{
                type: 'html',
                id: 'item7',
                html: '<div class="header"></div>'
            }, {
                type: 'break'
            }, {
                type: 'spacer'
            }, {
                type: 'html',
                id: 'pageTitle',
                html: '<div class="pageTitle" id="lblPageTitle">Page title will go here</div>'
            }]
        });
        var fm = $('.header').fileMenu({
            slideSpeed: 200,
            items: this.markup
        });
    },
    buildNativeMenu: function() {
        var self = this;
        var currentmenu = gui.Window.get().menu;
        var menu = currentmenu || new gui.Menu({
            type: 'menubar'
        });
        $.each(this.markup, function(index, item) {
            var menuitem = self.buildNativeMenuItem(item);
            menu.append(menuitem);
        });
        gui.Window.get().menu = menu;
    },
    buildNativeMenuItem: function(item) {
        var self = this;
        if (typeof item.show === 'function')
            item.enabled = item.show.call();
        if (item.items) {
            var submenu = new gui.Menu();
            $.each(item.items, function(ind, subitem) {
                var submenuitem = self.buildNativeMenuItem(subitem);
                submenu.append(submenuitem);
            });
            // delete item.submenu;
            item.submenu = submenu;
        }
        var menuitem = new gui.MenuItem(item);
        return menuitem;
    }
});

},{"./../../backend/config":1,"./../templates/menu.html":136}],144:[function(require,module,exports){
   var ipc = requireNode('ipc');
   var ProfileView = Marionette.ItemView.extend({
       hasproxy: false,
       template: require('./../templates/profile.html'),
       className: 'page',
       events: {
           'click #btnSaveProfile': 'save',
           'click #btnChangePass': 'showpasschange',
           'change #setupproxy': 'enableproxysetup',
           'click #btnReset': 'resetapp'
       },
       bindings: {
           '[name="username"]': 'username',
           '#user_displayname': 'user_displayname',
           '#address': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').adresa2;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').adresa2 = value;
                   return this.model.get('beneficiar');
               }
           },
           '#company': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').denumire_beneficiar;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').denumire_beneficiar = value;
                   return this.model.get('beneficiar');
               }
           },
           '#telefon': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').telefon;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').telefon = value;
                   return this.model.get('beneficiar');
               }
           },
           '#fax': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').fax;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').fax = value;
                   return this.model.get('beneficiar');
               }
           },
           '#cont': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').cont;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').cont = value;
                   return this.model.get('beneficiar');
               }
           },
           '#banca': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').banca;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').banca = value;
                   return this.model.get('beneficiar');
               }
           },
           '#nr_reg_com': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').atribut_fiscal;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').atribut_fiscal = value;
                   return this.model.get('beneficiar');
               }
           },
           '#calitate': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').calitate;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').calitate = value;
                   return this.model.get('beneficiar');
               }
           },
           '#cui': {
               observe: 'beneficiar',
               onGet: function(value) {
                   return this.model.get('beneficiar').cod_fiscal;
               },
               onSet: function(value) {
                   this.model.get('beneficiar').cod_fiscal = value;
                   return this.model.get('beneficiar');
               }
           },
           '#email': 'email',
           '#password': 'password',
           '#newpass': 'newpass',
           '#confirmedpass': 'confirmedpass',
           '#setupproxy': 'setupproxy',
           '#proxy_protocol': 'proxy_protocol',
           '#proxy_user': 'proxy_user',
           '#proxy_pass': 'proxy_pass',
           '#proxy_address': 'proxy_address',
           '#proxy_port': 'proxy_port'
       },
       initialize: function() {
           var self = this;
           _.bindAll(this, 'showpasschange', 'save', 'modelchanged', 'enableproxysetup', 'resetapp');
           var Proto = require('./../models/profile');
           app.User = ipc.sendSync('user:request:fromcache', 'appciv');
           app.trigger('user:updated');
           this.model = new Proto({
               id: app.data.User.uid
           });
           this.model.fetch().then(function() {
               self.buildView();
               self.stickit();
           });
           this.model.on('change', this.modelchanged);
       },
       resetapp: function() {
           localStorage.clear();
       },
       buildView: function() {
           var self = this;
           console.log(this.model);
           this.setinitialproxy();
           var tabs = [{
               id: 'tab1',
               caption: 'General'
           }, {
               id: 'tab2',
               caption: 'Proxy'
           }, {
               id: 'tab3',
               caption: 'Schimbare parola'
           }]
           if (this.model.get('id_beneficiar') !== 0) {
               tabs.push({
                   id: 'tab4',
                   caption: 'Date Beneficiar'
               });
           }
           $('#userContainer').w2form({
               name: 'userContainer',
               tabs: tabs,
               actions: {
                   reset: function() {
                       self.resetapp();
                   },
                   save: function() {
                       if (this.validate().length === 0) {
                           self.save();
                       }
                   }
               }
           });
           w2ui.userContainer_tabs.on('click', function(tab) {
               if (tab.target === 'tab4')
                   w2ui.gridReprezentanti.refresh();
           });
           $('#grid_rep').w2grid({
               name: 'gridReprezentanti',
               url: app.baseUrl + 'beneficiari/getreprezentanti/' + self.model.get('beneficiar').id_benef,
               recid: 'id_reprezentant',
               columns: [{
                   field: 'id_reprezentant',
                   caption: 'ID',
                   size: '0px',
                   hidden: true
               }, {
                   field: 'id_beneficiar',
                   caption: 'ID_B',
                   size: '0px',
                   hidden: true
               }, {
                   field: 'nume_reprezentant',
                   caption: 'Nume reprezentant',
                   size: '25%',
                   editable: {
                       type: 'text'
                   }
               }, {
                   field: 'functie',
                   caption: 'Functie',
                   size: '25%',
                   editable: {
                       type: 'text'
                   }
               }, {
                   field: 'telefon',
                   caption: 'Telefon',
                   size: '25%',
                   editable: {
                       type: 'text'
                   }
               }, {
                   field: 'email',
                   caption: 'Email',
                   size: '25%',
                   editable: {
                       type: 'email'
                   }
               }],
               show: {
                   toolbar: true,
                   footer: true,
                   toolbarAdd: true,
                   toolbarSave: true,
                   toolbarDelete: true
               },
               toolbar: {},
               parser: function(response) {
                   var data = $.parseJSON(response);
                   return {
                       status: 'success',
                       records: data.rows,
                       total: data.records
                   };
               },
               onAdd: function() {
                   w2ui['gridReprezentanti'].add({
                       recid: 0,
                       id_beneficiar: self.model.get('beneficiar').id_benef
                   });
               },
               onSave: function(event) {
                   w2ui['gridReprezentanti'].reload();
               },
               // fixedBody: false
           });
           //self.stickit();
       },

       showpasschange: function(e) {
           e.preventDefault();
           var self = this;
           self.canceled = false;
           $('#changepassContainer').show('blind');
           $(e.currentTarget).replaceWith('<button id="btnCancelPass" class="btn btn-danger">Renunta la schimbarea parolei</button>');
           $('#btnCancelPass').on('click', function(ev) {
               self.canceled = true;
               self.model.set('newpass', '').set('confirmedpass', '');
               $('#changepassContainer').hide('blind');
               $(ev.currentTarget).replaceWith('<button id="btnChangePass" class="btn btn-primary">Schimba parola</button>');
           });
       },

       enableproxysetup: function(e) {
           var self = this;
           if ($(e.currentTarget).prop('checked')) {
               self.hasproxy = true;
               $('.proxydata').prop('disabled', null);
           } else {
               self.hasproxy = false;
               $('.proxydata').prop('disabled', 'disabled');
           }
       },

       setinitialproxy: function() {
           var setupproxy;
           var proxyStr = localStorage.getItem('proxy');
           if(proxyStr){
            try{
                setupproxy = JSON.parse(ipc.sendSync('app:request:decrypt',proxyStr)) || null;
            }catch(ex){

            }
           }
           if (setupproxy && setupproxy.enabled) {
               // if (setupproxy.enabled && !$('#setupproxy').prop('checked')) {
               //     $('#setupproxy').prop('checked', true);
               // }
               // console.log(setupproxy);
               this.model.set('setupproxy', setupproxy.enabled);
               this.model.set(setupproxy);
               $('.proxydata').prop('disabled', null);
               // $('#proxy_protocol').val(setupproxy.protocol);
               // $('#proxy_user').val(setupproxy.user);
               // $('#proxy_pass').val(setupproxy.pass);
               // $('#proxy_address').val(setupproxy.address);
               // $('#proxy_port').val(setupproxy.port);
           }
       },

       setproxy: function() {
           var proxy = {
               enabled: $('#setupproxy').prop('checked'),
               proxy_protocol: $('#proxy_protocol').val(),
               proxy_user: $('#proxy_user').val(),
               proxy_pass: $('#proxy_pass').val(),
               proxy_address: $('#proxy_address').val(),
               proxy_port: $('#proxy_port').val()
           };
           localStorage.setItem('proxy', ipc.sendSync('app:request:encrypt',JSON.stringify(proxy)));
           ipc.sendSync('app:proxy:reset');
       },
       //TODO: resetare erori la renuntarea schimbarii de parola

       modelchanged: function(model) {
           var self = this;
           var field = _.keys(model.changed)[0];
           var newVal = _.values(model.changed)[0];
           // app.Util.removeError($('#' + field));
           self.inerror = false;
           if (field === 'newpass') {
               var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
               if (!re.test(newVal)) {
                   self.inerror = !self.canceled;
                   var data = [{
                       name: 'newpass',
                       message: 'Minim 6 caractere, o cifra si un caracter majuscul'
                   }];
                   ipc.send('app:error:show', data);
               }
           }

           if (field === 'confirmedpass') {
               if (newVal !== model.get('newpass')) {
                   self.inerror = !self.canceled;
                   var data = [{
                       name: 'confirmedpass',
                       message: 'Valoarea introdusa nu este identica cu parola de mai sus'
                   }];
                   ipc.send('app:error:show', data);
               }
           }
           if (!self.inerror) {
               $('#btnSaveProfile').attr('disabled', null);
           }
       },

       save: function(e) {
           // e.preventDefault();

           var self = this;
           //if(self.hasproxy)
           self.setproxy();
           var options = {
               success: function(model) {
                   var opt = {
                       title: 'Notificare',
                       text: 'Inregistrarea a fost salvata!',
                       type: 'success-template'
                   };
                   ipc.send('app:notification:show', opt);
               },
               error: function(model, response) {
                   // we get the errors as a string. This was implemented so that we can show
                   // both errors comming from server and from client. We modded the validate
                   // function of the model so that it returns a JSON string containing an element named errors
                   // from server we get the same result
                   if (Number(response.status) !== 403 && Number(response.status) !== 401) {
                       var data = eval('(' + response.responseText + ')');
                       //app.Util.showErrors(model, data);
                       /*if(self.model.get('transfered')===8){
                       self.model.set('transfered',9);
                       }*/
                       //self.showErrors(model, response);
                       w2utils.validateRaw($(self.el), data);
                   } else {

                   }
               }
           };
           if (self.validate()) {
               self.model.save({}, options);
           }
       },

       validate: function() {
           if (this.model.get('newpass')) {
               var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
               if (!re.test(this.model.get('newpass'))) {
                   var data = [{
                       name: 'newpass',
                       message: 'Minim 6 caractere, o cifra si un caracter majuscul'
                   }];
                   ipc.send('app:error:show', data);
                   return false;
               }
               if (this.model.get('confirmedpass') != this.model.get('newpass')) {
                   var data = [{
                       name: 'confirmedpass',
                       message: 'Valoarea introdusa nu este identica cu parola de mai sus'
                   }];
                   ipc.send('app:error:show', data);
                   return false;
               }
           }
           if (!w2utils.validate(this.model, this.$el)) {
               return false;
           }
           return true;
       },
       onBeforeDestroy: function() {
           w2ui.userContainer.destroy();
           w2ui.gridReprezentanti.destroy();
       }

   });
   module.exports = ProfileView;

},{"./../models/profile":129,"./../templates/profile.html":137}],145:[function(require,module,exports){
var ipc = requireNode('ipc');
   var SettingsView = Marionette.ItemView.extend({
       hasproxy: false,
       template: require('./../templates/settings.html'),
       className: 'page',
       events: {
           'click #btnSaveSettings': 'save',
           'change #setupproxy': 'enableproxysetup',
           'click #btnReset': 'resetapp'
       },
       bindings: {
       	   '#setupproxy': 'setupproxy',
           '#proxy_protocol': 'proxy_protocol',
           '#proxy_user': 'proxy_user',
           '#proxy_pass': 'proxy_pass',
           '#proxy_address': 'proxy_address',
           '#proxy_port': 'proxy_port'
       },
       initialize: function() {
       	   this.model = new Backbone.Model();
           var self = this;
           _.bindAll(this, 'save', 'enableproxysetup', 'resetapp');
       },
       onShow:function(){
       		// this.$el.w2form({
       		// 	name:'settingsForm'
       		// });
       		this.setinitialproxy();
           	this.stickit();
       },
       save:function(){
       		this.setproxy();
       },
       resetapp: function() {
           localStorage.removeItem('proxy');
           this.setinitialproxy();
       },
        enableproxysetup: function(e) {
           var self = this;
           if ($(e.currentTarget).prop('checked')) {
               self.hasproxy = true;
               $('.proxydata').prop('disabled', null);
           } else {
               self.hasproxy = false;
               $('.proxydata').prop('disabled', 'disabled');
           }
       },

       setinitialproxy: function() {
           var setupproxy = localStorage.getItem('proxy') || null;
           if (setupproxy) {
               var newproxy = JSON.parse(ipc.sendSync('app:request:decrypt',setupproxy));
               if(newproxy.enabled){
                this.model.set('setupproxy', newproxy.enabled);
                this.model.set(newproxy);
                $('.proxydata').prop('disabled', null);
               }
           }else if(!setupproxy){
           		 this.model.set('setupproxy', false);
           		 this.model.unset('proxy_protocol');
           		 this.model.unset('proxy_user');
           		 this.model.unset('proxy_pass');
           		 this.model.unset('proxy_address');
           		 this.model.unset('proxy_port');
           		 $('.proxydata').prop('disabled',true);
           }
       },

       setproxy: function() {
           var proxy = {
               enabled: $('#setupproxy').prop('checked'),
               proxy_protocol: $('#proxy_protocol').val(),
               proxy_user: $('#proxy_user').val(),
               proxy_pass: $('#proxy_pass').val(),
               proxy_address: $('#proxy_address').val(),
               proxy_port: $('#proxy_port').val()
           };
           localStorage.setItem('proxy', ipc.sendSync('app:request:encrypt',JSON.stringify(proxy)));
           ipc.sendSync('app:proxy:reset');
       },
   });

   module.exports = SettingsView;
},{"./../templates/settings.html":138}],146:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":147,"./handlebars/exception":148,"./handlebars/runtime":149,"./handlebars/safe-string":150,"./handlebars/utils":151}],147:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":148,"./utils":151}],148:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],149:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":147,"./exception":148,"./utils":151}],150:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],151:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":150}],152:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":146}],153:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":152}]},{},[127]);
