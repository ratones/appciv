 var Globals = require('./../../globals');
 var AnvelopaItemView = window.Marionette.ItemView.extend({
     _ctlFata: undefined,
     _ctlSpate: undefined,
     ui: {
         'del': '.btnDelAnvelopa'
     },
     events: {
         'click @ui.del': 'deleteMe'
     },
     modelEvents: {
         //'change': 'triggerEvent'
     },
     triggerEvent: function() {
         app.module('appciv').trigger('attachedProp:changed');
     },
     resetError: function(field) {
         $().w2tag();
     },
     bindings: {
        '[name="rfcontainer"]': {
                attributes: [{
                    name: 'hidden',
                    observe: 'id_roataf',
                    onGet: function(value) {
                        //if (value)
                            return (Globals.anvelopefata.models.length==0);
                        //return value;
                    }
                }]
            },
            '[name="rscontainer"]': {
                attributes: [{
                    name: 'hidden',
                    observe: 'id_roatas',
                    onGet: function(value) {
                        //if (value)
                            return (Globals.anvelopespate.models.length==0);
                        //return value;
                    }
                }]
            },
     },
     deleteMe: function() {
        console.log('init del anv');
         app.module('appciv.vehicule').trigger('anvelopa:remove', this.model);
     },
     template: require('./../../templates/vehicule/anvelopaDropTemplate.hts'),
     initialize: function() {
         //set initial values for anvelope
         var idf, af, as;
         if (Globals.anvelopefata) {
             //this.listenTo(Globals.anvelopefata, 'update', this.updateSourcesFata);
             if (this.model.get('id_roataf') && this.model.get('EntityState') !==2) {
                 idf = this.model.get('id_roataf');
                 af = Globals.anvelopefata.get(idf).get('text');
                 this.model.set('anvelopaf', af);
             }
         }
         if (Globals.anvelopespate) {
             //this.listenTo(Globals.anvelopespate, 'update', this.updateSourcesSpate);
             if (this.model.get('id_roatas') && this.model.get('EntityState') !==2) {
                 as = Globals.anvelopespate.get(this.model.get('id_roatas')).get('text');
             }
             this.model.set('anvelopas', as);
         }
     },
     onRender: function() {
         this.setView();
         this.listenTo(this.model, 'change', function() {
             app.module('appciv').trigger('attachedProp:changed');
         });
         this.setSelect();
         this.stickit();
     },
     onDomRefresh: function() {
         this.setSelect();

     },
     setSelect: function() {
         var self = this;
         this._ctlFata = this.$el.find('[name="id_roataf"]');
         this._ctlSpate = this.$el.find('[name="id_roatas"]');
         this._ctlFata.w2field('list', {
                 minLength: 0,
                 items: Globals.anvelopefata.toJSON(),
                 selected: self.model.get('id_roataf')
             })
             .on('change', function(e) {
                 var newval = $(this).data('selected');
                 var current = self.model.get('id_roataf');
                 //Globals.anvelopefata.get(newval.id).set('disabled', true);
                 self.model.set('anvelopaf', newval.text);
                 if (current) {
                     //Globals.anvelopefata.get(current).unset('disabled');
                 }
                 self.model.set('id_roataf', newval.id);
                 //$(this).w2field().options.items = app.module('appciv.vehicule').Globals.anvelopefata.toJSON();
                 Globals.anvelopefata.trigger('update');
             });
         this._ctlSpate.w2field('list', {
             minLength: 0,
             items: Globals.anvelopespate.toJSON(),
             selected: self.model.get('id_roatas')
         }).on('change', function(e) {
             var newval = $(this).data('selected');
             var current = self.model.get('id_roatas');
             //Globals.anvelopespate.get(newval.id).set('disabled', true);
             self.model.set('anvelopas', newval.text);
             if (current) {
                 //Globals.anvelopespate.get(current).unset('disabled');
             }
             self.model.set('id_roatas', newval.id);
             //$(this).w2field().options.items = app.module('appciv.vehicule').Globals.anvelopespate.toJSON();
             Globals.anvelopespate.trigger('update');
         });
     },
     setView: function() {
         if (this.model.get('nivel_echipare') === 0) {
             this.$('.btnDelAnvelopa').remove();
         }
     },
     updateSourcesFata: function() {
         $(this._ctlFata).w2field().options.items = Globals.anvelopefata.toJSON()
;
     },
     updateSourcesSpate: function() {
         $(this._ctlSpate).w2field().options.items = Globals.anvelopespate.toJSON();
     },
     serializeData: function() {
         return {
             index: this.options.index,
             lblFata:w2utils.lang('Fata(Anvelopa/Janta):'),
             lblSpate:w2utils.lang('Spate(Anvelopa/Janta):')
         };
     }

 });
 module.exports = AnvelopaItemView;
