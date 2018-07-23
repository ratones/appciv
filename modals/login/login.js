var ipc = require('ipc');
var remote = require('remote');
var w2uil = require('./../../vendor/w2ui/dist/w2ui');
window.w2ui = w2uil.w2ui;
window.w2utils = w2uil.w2utils;
window.w2obj = w2uil.w2obj;
window.w2popup = w2uil.w2popup;
window.w2panel = w2uil.w2panel;
window.w2alert = w2uil.w2alert;
window.w2confirm = w2uil.w2confirm;
window.Vue = require('vue');

var userlist = ul || {};


ipc.on('user:login:complete', function(errors) {
    if (errors) {
        // w2panel.message({
        //     width: 350,
        //     height: 200,
        //     html: '<div style="padding: 60px; text-align: center">Date autentificare incorecte</div>' +
        //         '<div style="text-align: center"><button class="btn" onclick="w2panel.message()">Inchide</button>'
        // });
    } else {
        remote.getCurrentWindow().close();
    }
});
var login = new Vue({
    data: {
        username: '',
        password: '',
        rememberme: false,
        appname: window.appname
    },
    methods: {
        login: function() {
            var self = this;
            console.log(JSON.stringify(this.$data));
            ipc.send('user:request:login', JSON.stringify(this.$data));
        },
        cancel: function() {
            remote.getCurrentWindow().close();
        },
        trysetpass: function(e) {
            try {
                if (userlist) {
                    var pass = ipc.sendSync('pass:request:decrypt', userlist[$(e.currentTarget).val()].pass);
                    $('#password').val(pass).trigger('change');
                }
            } catch (ex) {}
        }
    },
    attached: function() {
        var self = this;
        var list = [];
        if (userlist) {
            for (name in userlist) {
                var options = userlist[name];
                list.push(name);
                if (options.active) {
                    self.username = name;
                    self.password = ipc.sendSync('pass:request:decrypt', options.pass);
                }
            }
        }
        $('#username').w2field('combo', {
            items: list,
            openAbove: true,
            overridePosition: true
        }).on('change', self.trysetpass);
    }
});

login.$mount('body');
