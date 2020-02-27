 var AtributItemView = window.Marionette.ItemView.extend({
     source: undefined,
     className: 'w2ui-field',
     bindings: {
         '[name="val"]': 'val',
         '[name="label"]': 'label',
         '[name="min"]': 'min',
         '[name="max"]': 'max'
     },

     getTemplate: function() {
         switch (this.model.get('tip')) {
             case 'interval':
                 return require('./../../templates/vehicule/atributItemTemplate.hts');
             case 'lista':
                 return require('./../../templates/vehicule/atributDropTemplate.hts');
             case 'liber':
                 return require('./../../templates/vehicule/atributFreeTemplate.hts');
             case 'tag':
                return require('./../../templates/vehicule/tag.hbs');
             default:
                 return require('./../../templates/vehicule/atributFreeTemplate.hts');
         }

     },
     initialize: function() {
         this.source = this.model.get('source');
     },
     onRender: function() {
        if (this.model.get('tip') === 'interval') {
             this.setNumeric();
         }else if ((this.model.get('tip') === 'lista' || this.model.get('source')) && this.model.get('id_nomenclator') != 24) {
             this.setSelect();
         }
         this.stickit();
         this.listenTo(this.model, 'change', function() {
             app.module('appciv').trigger('attachedProp:changed');
         });

     },
     setSelect: function() {
         var mdl = this.model;
         console.log('Model', mdl)
         if (this.source !== '' && this.source !== undefined && this.source !== null) {
             var data = this.source.split('|'),
                 sursa = [],
                 ctl = this.$el.find('[name="val"]');
             // daca exista o singura valoare sau suntem in mod editare si valoarea nu este egala cu valoarea unica,
             // afisam atributul pentru a putea fi corectat
             //altfel nu afisam atributul, pentru ca singura valoare posibila este valoarea unica
             //if (data.length > 1 || (this.model.get('EntityState') === 3 && this.model.get('val') !== data[0])) {
             $.each(data, function(index, v) {
                 sursa.push({
                     id: v,
                     text: v
                 });
             });
             if(mdl.get('tip') === 'tag'){
                var selected = mdl.get('val')?mdl.get('val').split('|'):[]
                ctl.w2field('enum',{
                    items:sursa,
                    openOnFocus:true,
                    selected:selected
                }).on('change', function() {
                    var selected = $(this).data('selected');
                    var val = '';
                    selected.map(function(el){
                        val += '|' + el.text;
                    });
                    mdl.set('val', val.substr(1,val.length));
                });
             }else{
                 ctl.w2field('list', {
                     selected: {
                         id: mdl.get('val'),
                         text: mdl.get('val')
                     },
                     items: sursa
                 });
             }
            //  } else {
            //     this.model.set('val', data[0]);
            //     ctl.parent().remove();
            //  }

                            // if (self.model.get('EntityState')===0) {
                            //     self.model.set('val',source.split(',')[0]);
                            // }
        //  }else if(mdl.get('writeto')){
        //     ctl = this.$el.find('[name="val"]');
        //     ctl.w2field('list', {
        //         items: JSON.parse(mdl.get('writeto'))
        //     });
        //  }
         }
     },
     setNumeric: function() {
        if(Number(this.model.get('min'))<=Number(this.model.get('max')) && Number(this.model.get('min'))!==0){
            var min = 0;
            var max = this.model.get('max');
            switch(this.model.get('id_nomenclator'))
            {
                case 18:
                    min = 0;
                    break;
                default:
                    min = this.model.get('min');
                    break;
            }
             this.$el.find('[name="val"]').w2field('int', {
                 min: parseInt(min),
                 max: parseInt(max)
             });
         }

     },
     serializeData: function() {
         return {
             index: this.options.index
         };
     }
 });
 module.exports = AtributItemView;
