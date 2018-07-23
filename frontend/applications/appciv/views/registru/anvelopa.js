module.exports = Marionette.FormView.extend({
    template: require('./../../templates/registru/anvelopa.hbs'),
    attributes: function() {
        return {
            id: 'anvelopa' + this.cid
        };
    },
    className: 'windowContent w2ui-reset w2ui-form',
    ui: {
        'save': '.save-anvelopa',
        'cancel': '.cancel-anvelopa'
    },
    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'closeView'
    },
    onShow: function() {
        if (!this.model.id)
            this.isNew = true;
        var self = this;
        this.win = self.$el.w2panel({
            name: 'anvelopaEditor' + self.cid,
            title: 'Editor',
            width: '400px',
            showMin: true,
            showMax: false,
            height: '300px',
            startZ: 1200,
            resizable: false,
            onOpen: function(event) {
                self.setupView();
                event.onComplete = function() {
                    w2panel.setActive('anvelopaEditor' + self.cid);
                };

            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },
    save: function() {
        var self = this;
        var options = {
            success: function(model) {
                self.closeView();
                // model.set('recid', model.get('id_registru_omol'));
                // if (self.isNew) {
                //     app.trigger('grid:added', {
                //         grid: 'gridDosare',
                //         model: model.toJSON()
                //     });
                // } else {
                //     app.trigger('grid:edited', {
                //         grid: 'gridDosare',
                //         model: model.toJSON()
                //     });
                // }
            }
        };
        if (w2utils.validate(this.model, this.$el)) {
            if (self.isNew) {
                self.collection.add(self.model);
            }
            self.closeView();
        }

    },

    closeView: function(e) {
        this.win.destroy();
        this.destroy();
    }
});
