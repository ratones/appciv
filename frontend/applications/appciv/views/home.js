var ipc = requireNode('ipc');
module.exports = window.Marionette.ItemView.extend({
    template: require('./../templates/index.hts'),
    serializeData: function() {
        return {
            img: ipc.sendSync('app:request:path') + 'images/app-civ.gif'
        };
    }
});
