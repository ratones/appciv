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
