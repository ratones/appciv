     var ipc = requireNode('ipc');
     var EditorView = window.Marionette.ItemView.extend({
         template: require('./../../templates/cereri/plata.hts'),
         className: 'w2ui-reset w2ui-form windowContent',
         events: {
             'click #btnSavePlata': 'save',
             'click #btnCancelPlata': 'closeView'
         },
         bindings: {
             '#id_fact': 'id_fact',
             '.actions': {
                 observe: ['achitat'],
                 visible: function(value) {
                     return value !== 1;
                 }
             }
         },

         onShow: function() {
             var self = this;
             self.setupView();
             self.stickit();
         },
         setupView: function() {
             var self = this;
             self.$el.find('#id_fact').w2field('list', { //transform controlul input invizibil tip comanda intro lista combo
                 width: '200px',
                 placeholder: '--Alegeti din lista--',
                 url: app.baseUrl + 'civutils/GetDateCasierie',
                 minLength: 0
             })
             .on('change', function() {
                 var selected = $('#id_fact').data('selected');
                 self.model.set('id_fact', selected.id);
             });
         },
         save: function(event) {
             var self = this,
                 options;
             var achit = self.model.get('id_fact') ? 1 : 0;
             self.model.set('achitat', achit).set('facturat', achit);
             options = {
                 success: function(model) {
                     w2ui.gridCereri.get(model.get('id_comanda')).stare_plata = model.get('achitat');
                     w2ui.gridCereri.refreshCell(model.get('id_comanda'), 'stare_plata');

                     self.closeView();
                     var opt = {
                         text: 'Inregistrarea a fost salvata!',
                         type: 'success-template',
                         title:'Notificare'
                     };
                     ipc.send('app:notification:show', opt);
                 },
                 error: function(model, response) {
                     // we get the errors as a string. This was implemented so that we can show 
                     // both errors comming from server and from client. We modded the validate
                     // function of the model so that it returns a JSON string containing an element named errors
                     // from server we get the same result
                     var data, opt = {
                         text: 'Eroare la salvare!',
                         type: 'error-template',
                         title:'Notificare'
                     };
                     ipc.send('app:notification:show', opt);
                 }
             };

             self.model.save({}, options);
         },

         closeView: function(e) {
             this.destroy();
             w2ui['plataLayout'].hide('right');
         },
         serializeData: function() {
             // var url = app.baseUrl + 'files/getplatacomanda/?id=' + this.model.get('id_comanda') + '&api=' + app.module('user').UserModel.get('api');
             // return {
             //     instiintare: process.cwd() + '/pdfjs-1/web/viewer.html?file=' + escape(url)
             // };
         }
     });
     module.exports = EditorView;
