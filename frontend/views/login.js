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
