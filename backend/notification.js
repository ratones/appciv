var ipc = requireNode('ipc');
var gui = requireNode('nw.gui');
var Globals = require('./globals');
var Notifications = [];
var _ = requireNode('underscore');
var notyIndex = 0;


var _defaults = {
    iconUrl: './images/alert-info.png',
    title: 'test',
    message: 'My message!',
    buttonPrimary: undefined,
    buttonSecondary: undefined
};
var speed = /^win/.test(process.platform) ? 1 : 10;
var offset = /^win/.test(process.platform) ? 2 : 12;
var Notification = {
    makeNewNotifyWindow: function() {
        var screenSize = Globals.screenSize;
        var self = this;
        var notyWindow = new gui.Window.open('',{
            width: 250,
            height: 75,
            frame: false,
            toolbar:false,
            x: screenSize.width,
            y: screenSize.height,
            resizable: false,
            transparent: true,
            'skip-taskbar': true,
            show: false
        });

        //setam pagina principala a ferestrei
        //notyWindow.loadUrl('file://' + __dirname + '/../notification/noty.html');
        notyWindow.on('closed', function() {
            //stergem referinta la fereastra actuala pentru a putea fi GC
            notyWindow = null;
        });

        return notyWindow;
    },
    create: function(options) {
        _.extend(_defaults, options);
        var win = this.makeNewNotifyWindow();
        var wind = {
            isShown: true,
            winIndex: win.id,
            win: win
        };
        var template = this.makeNotificationMarkup(_defaults, win.id);
        //win.webContents.toggleDevTools();
        //win.webContents.on('did-finish-load', function() {
        //    win.webContents.executeJavaScript('window.index = ' + win.id + ';');
        //    //document.getElementById("notifications").innerHTML = ' + template + '";
        //    win.webContents.send('append:html', template);
        //});
        Notifications.push(wind);
        this.slideInNotificationWindow(wind);
    },
    makeNotificationMarkup: function(options, id) {
        options.id = id;
        // Template is here and as a multiline string for the sake of readability since we cannot have them in the HTML
        var templateSource = '<section id="<%=id%>">' +
            '<% if(iconUrl){%>' +
            '<div class="icon">' +
            '<img class="icons" src="<%=iconUrl%>"/>' +
            ' </div>' +
            ' <%}%>' +
            '<div class="title"><%=title%></div>' +
            '<div class="description"><%=message%></div>' +
            '<%if(buttonPrimary){%>' +
            '   <div class="button primary"><%=buttonPrimary%></div>' +
            '<%}%>' +
            ' <%if(buttonSecondary){%>' +
            '    <div class="button secondary"><%=buttonSecondary%></div>' +
            ' <%}%>' +
            '</section>';
        var compiledTemplate = _.template(templateSource);
        return compiledTemplate(options); //html string
    },

    // makeImageNotificationMarkup: function(options, id) {
    //     options.id = id;
    //     // Template is here and as a multiline string for the sake of readability since we cannot have them in the HTML
    //     var templateSource = '<section id="<%id%>">' +
    //         '<%#if iconUrl%>' +
    //         '<div class="icon">' +
    //         '<img class="icons" src="<%iconUrl%>"/>' +
    //         '</div>' +
    //         '<%/if%>' +
    //         '<div class="title"><%title%></div>' +
    //         '<div class="description"><%message%></div>' +
    //         '<div class="gallery">' +
    //         '<%#if imageUrl%>' +
    //         '<img class="gallery-image" src="<%imageUrl%>"/>' +
    //         '<%/if%>' +
    //         ' <%#if imageTitle%>' +
    //         '<div class="highlight">' +
    //         '<div class="gallery-image title"><%imageTitle%></div>' +
    //         '</div>' +
    //         ' <%/if%>' +
    //         '</div>' +
    //         ' <%#if buttonPrimary%>' +
    //         '<div class="button primary"><%buttonPrimary%></div>' +
    //         '<%/if%>' +
    //         '<%#if buttonSecondary%>' +
    //         '<div class="button secondary"><%buttonSecondary%></div>' +
    //         '<%/if%>' +
    //         '</section>';

    //     var compiledTemplate = Handlebars.compile(templateSource);
    //     return compiledTemplate(options); //html string
    // },
    closeAnyOpenNotificationWindows: function() {
        _.each(Notifications, function(n) {
            clearTimeout(n.timeout);
            n.win.close();
        });
        return true;
    },
    slideOutNotificationWindow: function(index) {
        //clearTimeout('closeTimeout');
        console.log(index);
        var winObj = _.find(Notifications, function(n) {
            return n.winIndex === index;
        });
        var p = {x:winObj.win.x,y:winObj.win.y};
        winObj.win.close();
        Notifications = _.without(Notifications, winObj);
        clearTimeout(winObj.timeout);

        _.each(Notifications, function(w) {
            var f = {x:w.win.x,y: w.win.y};
            if (f.y < p.y) {
                var y = f.y;
                while (y < f.y + f.height) {
                    w.win.moveTo(f.x, y + offset);
                    y += speed;
                }
            }
        });
        //TODO: max shown
    },
    slideInNotificationWindow: function(win) {
        var self = this;
        _.each(Notifications, function(n) {
            var bounds = {x:n.win.x,y: n.win.y};
            var y = bounds.y;
            while (y > bounds.y - bounds.height) {
                n.win.moveTo(bounds.x, y - offset);
                y -= speed;
            }
        });
        win.win.show();
        var p = {x:win.win.x,y: win.win.y};
        var x = p.x;
        while (x > p.x - p.width) {
            win.win.moveTo(x - speed, p.y);
            x -= speed;
        }
        win.timeout = setTimeout(function() {
            self.slideOutNotificationWindow(win.win.id);
        }, 6000);

    }
};
ipc.on('notif:close', function(event, index) {
    Notification.slideOutNotificationWindow(index);
});
module.exports = Notification;