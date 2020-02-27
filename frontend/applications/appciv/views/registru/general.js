module.exports = Marionette.FormView.extend({
    template: require('./../../templates/registru/general.hbs'),
    initialize: function() {
        var self = this;
        console.log('general view show')
        // this.model.on('change', function() {
        //     self.confirmReset.apply(self, arguments);
        // });
    },
    serializeData:function(){
        return {ext:this.options.extensie};
    },
    bindingsOverrides: {
        '.clasa': {
            observe: 'cod_categorie',
            visible: function(value) {
                return value === 'C' || value === 'G';
            }
        },
        '#producator':'producator',
        // '#nr_axe':{
        //     observe:'nr_axe',
        //     onGet:function(value){
        //         if(!value || value==='0')
        //             return '2';
        //         else
        //             return value;
        //     },
        //     onSet:function(value){
        //         if(!value || value === '0'){
        //             w2alert('Numarul axelor nu poate fi 0!');
        //             return '2';
        //         }else{
        //             return value;
        //         }
        //     }
        // },

        '#nr_registru': {
            observe: 'nr_registru',
            onGet: function(value) {
                if (!value)
                    return 'Se asteapta generarea...';
                return value;
            }
        }
    },
    forceValidation: function() {
        w2utils.validate(this.model, this.$el);
    },
    onShow:function(){
        var self = this;
        console.log('general view show')
        //this.$el.find('input').on('change',function(){self.confirmReset.apply(self,arguments);});
        this.setupView();
        this.$el.find('#producator').w2field('combo',{
            url:app.dotUrl + '/nrom/getProducatori',
            minLength: 1,
            selected: {
                id: self.model.get('producator'),
                text: self.model.get('producator')
            },
            postData:{
                categorie: self.model.get('categorie'),
                ext:self.options.extensie
            }
        });
        // $('#categorie').w2field('enum',{
        //     minLength: 1,
        //     selected: {
        //         id: self.model.get('producator'),
        //         text: self.model.get('producator')
        //     },
        //     postData:{
        //         categorie: self.model.get('categorie'),
        //         ext:self.options.extensie
        //     }
        // });
        self.model.on('change', function(){
                 if (self.model.get('canBeDirty') && !window.isDirty.dirty){
                    window.isDirty.dirty = true;
                }
            });
            self.model.on('save',function(){
                if (window.isDirty.dirty){
                    window.isDirty.dirty = false;
                }
            });
        if (this.model.get('nr_registru')) {
            this.setReadOnly();
        }
    },
    setReadOnly: function() {
        $.each(this.$el.find('input,textarea'), function(i, el) {
            if ($(el).attr('id') !== 'producator' && $(el).attr('id') !== 'categorie') {
                $(el).prop('readonly', true);
            }
        });
        //this.$el.find('input,textarea').attr('disabled', true);
    },
    confirmReset: function() {
        var self = this;
        if (this.model.get('nr_registru')) {
            var changed = self.model.changedAttributes(),
                resetAttributes;
            if (changed) {
                var keys = _.keys(changed);
                resetAttributes = _.pick(self.model.previousAttributes(), keys);
            }
            w2confirm('Modificarea acestor date va duce la generarea unui<br><b>Numar de Registru</b> nou!<br>Continuati?')
                .yes(function() {
                    self.setModelNew.apply(self, arguments);
                })
                .no(function() {
                    self.model.off('change');
                    self.model.set(resetAttributes);
                    self.model.on('change', function() {
                        self.confirmReset.apply(self, arguments);
                    });
                });
        }
    },
    setModelNew: function() {
        this.model;
        var resetAttributes = {
            nr_registru: '',
            EntityState: 0,
            id: null
        };
        this.model.off('change');
        this.model.set(resetAttributes);
        app.trigger('dosare:resetTVV');
    },
    refreshModel:function(model){
        // this.unstickit();
        this.model.set(model);
        this.model.set('EntityState',3);
    }
});
