module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/registru/mentiune.hbs'),
    bindings: {
        '[name="mentiune"]': 'mentiune',
        '[name="val_sup"]': 'val_sup'
    },
    events: {
        'click .btnRemoveCollection': 'removeModel'
    },
    onRender: function() {
        this.stickit();
    },
    removeModel: function() {
        this.model.set('EntityState', 2);
        app.trigger('mentiune:remove', this.model);
    },
    serializeData: function() {
        return {
            maxchar: 50 - this.model.get('mentiune').length
        };
    }
});
