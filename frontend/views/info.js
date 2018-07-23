var InfoView = Marionette.ItemView.extend({
    template: require('./../templates/info.html'),
    initialize: function() {},
    serializeData: function() {
        var pkg = requireNode('nw.gui').App.manifest;
        return {
            version: pkg.version
        };
    },
    onShow: function() {
        var self = this;

        this.win = self.$el.w2panel({
            name: 'infoPage',
            title: 'Info',
            modal: true,
            width: '480px',
            height: '250px',
            onOpen: function(event) {

            },
            onClose: function(event) {
                self.destroy();
            }
        });
    }
});
module.exports = InfoView;
