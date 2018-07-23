module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/registru/anvelopaEditor.hbs'),
    attributes: function() {
        return {
            id: 'anvelopa' + this.cid
        };
    },
    initialize:function(){
        var Model = require('./../../models/registru/anvelopa')
         this.m1 = new Model({axa:1});
         this.m2 = new Model({axa:2});
    },
    className: 'windowContent w2ui-reset w2ui-form',
    ui: {
        'save': '.save-anvelopa',
        'cancel': '.cancel-anvelopa'
    },
    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'closeView',
        'change #idemspate':'setIdemSpate'
    },
    onShow: function() {
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
        if (w2utils.validate(this.m1, this.$el) && w2utils.validate(this.m2, this.$el)) {
            if (self.isNew) {
                self.m1.set('ordine_civ',self.collection.models.length+1);
                self.collection.add(self.m1);
                self.m2.set('ordine_civ',self.collection.models.length+1);
                self.collection.add(self.m2);
            }
            self.closeView();
        }

    },
    setupView:function(){
        console.log('here');
        var self = this;
        this.$el.find('#id_roataf').w2field('list',{
            url: app.dotUrl + '/nrom/getAnvelope',
            minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.m1.set('id_roata',e.item.id).set('valoare',e.item.text).set('janta',e.item.janta);
            }
        });
         this.$el.find('#id_roatas').w2field('list',{
            url: app.dotUrl + '/nrom/getAnvelope',
             minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.m2.set('id_roata',e.item.id).set('valoare',e.item.text).set('janta',e.item.janta);
            }
        });
         this.$el.find('#id_roataf').parent().find('.w2ui-field-helper').width('250px');
         this.$el.find('#id_roatas').parent().find('.w2ui-field-helper').width('250px');
    },
    setIdemSpate:function(){
        if($('#idemspate').is(':checked')){
            this.m2.set('id_roata',this.m1.get('id_roata'));
            this.$el.find('#id_roatas').data('selected',this.$el.find('#id_roataf').data('selected')).trigger('change');
        }
    },
    closeView: function(e) {
        this.win.destroy();
        this.destroy();
    }
});
