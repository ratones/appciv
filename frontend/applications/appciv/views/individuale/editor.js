var beneficiari;
var ipc = requireNode('ipc');
EditorView = window.Marionette.ItemView.extend({
    template: require('./../../templates/individuale/editor.hts'),
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
                event.onComplete = self.setupView.bind(self);
            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },

    setupView: function() {
        var self = this;
        this.$el.find('.datepicker').w2field('date');
        if (!ipc.sendSync('user:request:isinrole', [4]) && !this.model.id ) {
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
        self.$el.find('#cod_judet').w2field('list', {
                width: '200px',
                minLength:0,
                url: app.baseUrl + 'individuale/GetJudete',
                selected: {
                    id: self.model.get('cod_judet'),
                    text: self.model.get('judet')
                }
            }).on('change', function() {
                var selected = $('#cod_judet').data('selected');
                self.model.set('cod_judet', selected.id);
                self.model.set('judet', selected.text);
            });
            for (var f in this.model.fields) {
            var field = this.model.fields[f];
            self.bindings[field.el] = field.name;
        }
            self.stickit();
    },
    save: function(event) {
        var self = this,
            options;
        options = {
            success: function(model) {
                model.set('recid', model.id);
                if (self.isNew) {
                    app.trigger('grid:added', {
                        grid: 'gridIndividuale',
                        model: model.toJSON()
                    });
                    if(w2ui.hasOwnProperty('gridIndividuale')) w2ui.gridIndividuale.reload();
                } else {
                    app.trigger('grid:edited', {
                        grid: 'gridIndividuale',
                        model: model.toJSON()
                    });
                }
                self.closeView();
                //success message is handled on app eventhandler
            },
            error: function(model, response) {
                var data, opt = {
                    text: 'Eroare la salvare!',
                    title:'Notificare',
                    type: 'error-template'
                };
                ipc.send('app:notification:show', opt);
                data = eval('(' + response.responseText + ')');
                w2utils.validateRaw(self.$el, data.data);
            }
        };
        if (w2utils.validate(self.model, self.$el)) {
            self.model.save({}, options);
        }

    },

    onBeforeDestroy: function() {
        //if grid page is not opened we go there
        if (!w2ui.hasOwnProperty('gridIndividuale'))
            app.module('appciv').router.navigate('appciv/cereri', {
                trigger: true
            });
    },
    closeView: function(e) {
        this.win.destroy();
    }
});
module.exports = EditorView;
