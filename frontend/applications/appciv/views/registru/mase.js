module.exports = Marionette.FormView.extend({
    initialize: function() {},
    bindings: {
        '[name="val"]': 'val',
        '[name="pseudo"]': 'pseudo',
        '[name="val_min"]': 'val_min',
        '[name="val_max"]': 'val_max',
        '[name="suggested_val"]':'suggested_val',
        '[name="suggested_valmin"]':'suggested_valmin',
        '[name="suggested_valmax"]':'suggested_valmax',
    },
    modelEvents: {
        'change': 'removeError'
    },
    // events:{
    //     'click [name="btnAddValue"]' : 'addValue',
    //     'click [name="btnDelValue"]' : 'removeValue'
    // },

    getTemplate: function() {
        switch (this.model.get('tip')) {
            case 'interval':
                return require('./../../templates/registru/interval.hbs');
            case 'lista':
                this.source = JSON.parse(this.model.get('sursa'));
                return require('./../../templates/registru/lista.hbs');
            case 'liber':
                return require('./../../templates/registru/liber.hbs');
            case 'memo':
                return require('./../../templates/registru/memo.hbs');
            case 'tag':
                return require('./../../templates/registru/tag.hbs');
        }
        return '<p>' + this.options.type + ' View El' + this.options.index + '</p>';
    },
    onViewRendered:function(){
        var self = this;
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
    },
    onRender: function() {
        // this.ensureElement();
        var self = this;
        if (this.model.get('tip') === 'lista' && this.model.get('multiple') !== 1) {
            this.$el.find('[name="val"]').w2field('list', {
                minLength: 0,
                items: self.source,
                selected: self.model.get('val')
            }).on('change', function() {
                var selected = $(this).data('selected');
                self.model.set('val', selected.id);
            });
        } else if (this.model.get('tip') === 'lista' && this.model.get('multiple') !== 1) {
            this.model.set('pseudo', this.model.get('val'));
        }else if(this.model.get('tip')==='tag'){
            var selected = self.model.get('val')?self.model.get('val').split('|'):['FARA']
            this.$el.find('[name="val"]').w2field('enum',{
                items:['FARA'],
                openOnFocus:true,
                selected:selected,
                onNew:function(event){
                    event.originalEvent.preventDefault();
                    console.log(event);
                     $.extend(event.item, { id:  event.item.id, text : event.item.text });
                }
            }).on('change', function() {
                var selected = $(this).data('selected');
                console.log(selected);
                var val = '';
                selected.map(function(el){
                    val += '|' + el.text;
                });
                self.model.set('val', val.substr(1,val.length));
            });;
        }
        if (this.model.get('isnumeric') === 1) {
            this.$el.find('input,select').prop('type','number').addClass('numeric');
        }
        this.$el.find('[name="pseudo"]').on('keyup',function(e){
            if(e.which == 46){
                self.model.set('val','');
                self.render();
            }
        });
        this.stickit();
    },
    serializeData: function() {
        var multivalues = [];
        if (this.model.get('multiple') === 1 && this.model.get('val')) {
            multivalues = this.model.get('val').split('|');
        }
        return {
            index: this.model.cid,
            val: this.model.get('val'),
            val_min: this.model.get('val_min'),
            val_max: this.model.get('val_max'),
            nume: this.model.get('nume'),
            source: this.source,
            multivalues: multivalues,
            multiple: this.model.get('multiple') === 1,
            deletable: multivalues.length > 1
        };
    },
    removeError: function() {
        var self = this;
        for (var i in this.model.changed) {
            self.$el.find('[name="' + i + '"]').removeClass('w2ui-error').w2tag('');
        }
        if(this.model.get('tip')==='interval'){
            if(this.model.get('val_max') && this.model.get('val_min') && Number(this.model.get('val_max')) !== 0  && Number(this.model.get('val_min')) > Number(this.model.get('val_max'))){
                self.$el.find('[name="val_max"]').addClass('w2ui-error').w2tag('Min > Max');
            }else{
                self.$el.find('[name="val_max"]').removeClass('w2ui-error').w2tag('');
            }
        }
    },

    addValue:function(e){
        app.trigger('dt:add:value',{ev:e});
    },
     removeValue:function(e){
        app.trigger('dt:remove:value',{ev:e});
    }

});
