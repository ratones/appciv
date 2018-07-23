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