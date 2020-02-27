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
            // if (callback) callback.call();
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
