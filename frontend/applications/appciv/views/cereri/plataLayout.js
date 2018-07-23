var ipc = requireNode('ipc');

var layout = window.Marionette.LayoutView.extend({
    template: require('./../../templates/cereri/layoutPlata.hts'),
    className: 'page',
    initialize: function() {
        this.model = this.options.model;
    },
    onShow: function() {
        this.open();
    },
    open: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'plataForm' + self.cid,
            title: 'Instiintare plata',
            width: '800px',
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
    setupView: function(argument) {
        this.$el.w2layout({
            name: 'plataLayout',
            panels: [{
                type: 'main',
                size: '60%',
                content: '<webview id="webview" style="width:100%;height:100%"></webview>'
            }, {
                type: 'right',
                size: '40%',
                resizable: true,
                content: '<div class"page" id="panelPlata">test</div>'
            }]
        });
        this.addRegions({
            plata: '#panelPlata'
        });
        var pdf = app.baseUrl + '/civfiles/getplatacomanda/?id=' + this.model.get('id_comanda') + '&api=' + app.User.api;
        // var appPath = ipc.sendSync('app:request:path');
        this.$el.find('#webview').attr('src', pdf);
        //this.plata.show(new PlataView());
        var PlataView = require('./plata');
        this.plata.show(new PlataView({
            model: this.model
        }));
    },
    onBeforeDestroy: function() {
        w2ui.plataLayout.destroy();
    }
});
module.exports = layout;
