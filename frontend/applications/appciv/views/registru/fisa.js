module.exports = Marionette.FormView.extend({
    template: require('./../../templates/registru/fisa.hbs'),
    initialize: function() {
        console.log(this.model);
    },
    events: {
        'click #btnPrint': 'print'
    },
    open: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'FisaPreview' + self.cid,
            title: 'Fisa TVV',
            width: '950px',
            showMin: true,
            showMax: true,
            height: '650px',
            resizable: true,
            onOpen: function(event) {
                event.onComplete = function() {
                    w2panel.setActive('FisaPreview' + self.cid);
                };
            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },
    print: function() {
        var url = app.dotUrl + '/nrom/printfisa';
    }
    onShow: function() {
        this.open();
    },
});
