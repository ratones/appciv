var beneficiari;
var ipc = requireNode('ipc');
EditorView = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/editor.hts'),
    attributes: function() {
        return {
            id: 'cerere' + this.cid
        };
    },
    className: 'windowContent w2ui-reset w2ui-form',
    control: undefined,
    events: {
        'click #btnSaveComanda': 'save',
        'click #btnCancelEdit': 'closeView'
    },
    initialize: function() {
        _.bindAll(this, 'closeView');
    },
    bindings: {
        '#daterar_container':{
            observe:'id',
            visible:function(val){
                return val?true:false;
            }
        },
        '#data_comanda':{
            observe:'data_comanda',
            onGet:function(val){
                return val ? w2utils.formatDate(w2utils.isDate(val,'dd.MM.yyyy',true)) : null
            }
        },
        '#data_inreg':{
            observe:'data_inreg',
            onGet:function(val){
                return val? w2utils.formatDate(w2utils.isDate(val,'dd.MM.yyyy',true)):null
            },
            onSet:function(val){

            }
        }
    },
    onShow: function() {
        var self = this;

        if (this.model.id) {
            this.model.fetch().then(function() {
                self.cachedModel = self.model.toJSON();
                self.open();
            });
        } else {
            self.isNew = true;
            self.open();
        }

        for (var f in this.model.fields) {
            var field = this.model.fields[f];
            self.bindings[field.el] = field.name;
        }
        $(this.$el).find('.w2ui-field').each(function(i,el){
            var label = $(el).find('label');
            label.text(w2utils.lang(label.text()));
        });
        this.$el.find('.button-translate button').each(function(i,b){
            b.textContent = w2utils.lang(b.textContent)
        });
        self.stickit();
    },

    open: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'mailForm' + self.cid,
            title: 'Editor',
            width: '600px',
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

    setupView: function() {
        var self = this;
        this.$el.find('.datepicker').w2field('date');
        if (!ipc.sendSync('user:request:isinrole', [4]) && !this.model.id) {
            self.$el.find('#id_beneficiar').w2field('list', {
                width: '200px',
                url: app.baseUrl + 'civutils/GetBeneficiari',
                selected: {
                    id: self.model.get('id_beneficiar'),
                    text: self.model.get('societate')
                }
            }).on('change', function() {
                var selected = $('#id_beneficiar').data('selected');
                self.model.set('id_beneficiar', selected.id);
                self.model.set('societate', selected.text);
            });
            self.$el.find('#addBeneficiar').show();
        }else if(!this.model.id){//cerere noua depusa de beneficiar, trebuie sa setam beneficiarul
            var beneficiar = {};
            $.get(app.baseUrl + 'beneficiari/edit/'+app.User.id_beneficiar,null,function(response){
                self.model.set('societate',response.denumire_beneficiar)
                            .set('id_beneficiar',app.User.id_beneficiar);
            });
        }
    },
    save: function(event) {
        var self = this,
            options;
        options = {
            success: function(model) {
                model.set('recid', model.id);
                if (self.isNew) {
                    app.trigger('grid:added', {
                        grid: 'gridCereri',
                        model: model.toJSON()
                    });
                } else {
                    app.trigger('grid:edited', {
                        grid: 'gridCereri',
                        model: model.toJSON()
                    });
                }
                self.closeView();
                //success message is handled on app eventhandler
            },
            error: function(model, response) {
                var data, opt = {
                    text: w2utils.lang('Eroare la salvare!'),
                    title:w2utils.lang('Notificare'),
                    type: 'error-template'
                };
                ipc.send('app:notification:show', opt);
                data = eval('(' + response.responseText + ')');
                w2utils.validateRaw(self.$el, data.data);
            }
        };
        if (w2utils.validate(self.model, self.$el)) {
            var fields = self.model.fields;
            for(var i = 0; i < fields.length; i++){
                field = fields[i];
                if(field.type =='date'){
                    var crt = self.model.get(field.name)
                    if(crt){
                        var dt = w2utils.isDate(self.model.get(field.name),null,true)
                        var fmt = w2utils.formatDate(dt,'dd.mm.yyyy')
                        self.model.set(field.name,fmt)
                        console.log(fmt)
                    }
                }
            }
            self.model.save({}, options);
        }

    },

    onBeforeDestroy: function() {
        //if grid page is not opened we go there
        if (!w2ui.hasOwnProperty('gridCereri'))
            app.module('appciv').router.navigate('appciv/cereri', {
                trigger: true
            });
    },
    closeView: function(e) {
        this.win.destroy();
    }
});
module.exports = EditorView;
