//construct menu
var ipc = requireNode('ipc');
var gui = requireNode('nw.gui');
var Settings = require('./../backend/config');

var appmenu = {
    template: [{
            label: w2utils.lang('Program'),
            submenu: [{
                label: w2utils.lang('Info'),
                click: function() {
                    window.location.hash = '#home';
                }
            }, {
                type: 'separator'
            }, {
                label: 'Services'
            }, {
                type: 'separator'
            }, {
                label: w2utils.lang('Inchide'),
                accelerator: 'CmdOrCtrl+Q',
                click: function() {
                    gui.Window.close();
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
            submenu: [{
                label: w2utils.lang('Reincarca'),
                accelerator: 'CmdOrCtrl+R',
                click: function() {
                    gui.Window.reload();
                }
            }, {
                label: w2utils.lang('Debug'),
                accelerator: 'Alt+CmdOrCtrl+I',
                click: function() {
                    gui.Window.showDevTools();
                }
            }, {
                label: w2utils.lang('Minimize'),
                accelerator: 'CmdOrCtrl+M',
                click: function() {
                    gui.Window.minimize();
                }
            }]
        }, {
            label: 'Help'
        }
    ],
    setMenuItemVisibility: function(menu) {
        var self = this;
        for (var x in menu) {
            var menuItem = menu[x];
            menuItem.visible = true;
            if (menuItem.show) {
                menuItem.visible = menuItem.show();
            }
            if (menuItem.submenu) {
                for (var i in menuItem.submenu) {
                    self.setMenuItemVisibility(menuItem.submenu[i]);
                }
            }
        }

    },
    buildFromTemplate: function(template) {
        var self = this;
        var menu = new gui.Menu({
            type: 'menubar'
        });
        for (var i in template) {
            if (template[i].submenu) {
                var submenu = self.buildFromTemplate(template[i].submenu);
                template[i].submenu = submenu;
            }
            var menuItem = new gui.MenuItem(template[i]);
            //if (template[i].visible)
            menu.append(menuItem);
        }
        return menu;
    },
    buildSubmenu: function(template) {
        var menu = new gui.Menu();
        for (var i in template) {
            var menuItem = new gui.MenuItem(template[i]);
            if (template[i].visible)
                menu.append(menuItem);
        }
        return menu;
    },
    initialize: function() {
        // var self = this;
        // var template = [];
        // template = _.union(template, self.template);
        // for (var x in Settings.modules) {
        //     var m = Settings.modules[x];
        //     if (m.active) {
        //         //if (ipc.sendSync('app:authorize:app', m.name)) {
        //         var submenu = m.menuDescriptor;
        //         self.setMenuItemVisibility(submenu);
        //         template.push({
        //             label: m.title,
        //             submenu: submenu
        //         });
        //         //}
        //     }
        // }

        // var menu = self.buildFromTemplate(template);
        // menu.type = 'menubar';
        // for (var i in template) {
        //     template[i].submenu = null;
        //     var item = new gui.MenuItem(template[i]);
        //     appmenu.append(item);
        // }
        // var item = new gui.MenuItem({
        //     label: "Click me",
        //     click: function() {
        //         console.log("I'm clicked");
        //     },
        //     key: "s",
        //     modifiers: "ctrl-alt",
        // });

        // // You can have submenu!
        // var submenu = new gui.Menu();
        // submenu.append(new gui.MenuItem({
        //     label: 'Item 1'
        // }));
        // submenu.append(new gui.MenuItem({
        //     label: 'Item 2'
        // }));
        // submenu.append(new gui.MenuItem({
        //     label: 'Item 3'
        // }));
        // item.submenu = submenu;
        //appmenu.append(menu);
        // gui.Window.get().menu = menu;
        $('<div></div>').menu();

    }
};
module.exports = appmenu;
