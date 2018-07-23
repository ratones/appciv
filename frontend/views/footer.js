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
