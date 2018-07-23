 var postData = {};
 var ipc = requireNode('ipc');
 module.exports = Marionette.ItemView.extend({
     template: require('./../../templates/vehicule/vins.hts'),
     className: 'page',
     attributes: function() {
         var width = $('#layout_layout_panel_main').width();
         return {
             style: 'min-width:' + width + 'px'
         };
     },
     events: {},
     idbeneficiar:null,
     initialize: function(options) {
         var self = this;
         this.setPermissions();
     },
     setPermissions: function() {
         this.showListaBenef = ipc.sendSync('user:request:isuserinrole', [
             [1], 'appciv'
         ]);
     },
     onShow: function() {
         var self = this;
         this.buildUpload();
         this.renderGrid();
     },
     renderGrid: function() {
         var self = this;
         this.$el.find('#grid').w2grid({
             name: 'gridVINS',
             url: app.baseUrl + 'vins/getVINS',
             method: 'POST', // need this to avoid 412 error on Safari
             recid: 'id',
             fixedBody: true,
             show: {
                 toolbar: true,
                 footer: true,
                 toolbarAdd: true,
                 toolbarSave: true,
                 toolbarDelete: true
             },
             onAdd: function() {
                 w2ui['gridVINS'].add({
                     recid: 0
                 });
             },
             toolbar: {
                 items: [{
                     type: 'button',
                     id: 'btnchooseFile',
                     caption: w2utils.lang('Alege fisier'),
                     icon: 'w2ui-icon-upload',
                     onClick: function(event) {
                         self.choosefile();
                     }
                 },(self.showListaBenef?
                   { type: 'html',  id: 'listaBenef',
                      html:
                        '<div style="padding: 3px 10px;">'+
                        w2utils.lang(' Beneficiari:')+
                        '    <input size="20" id="listabenef"   style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>'+
                        '</div>'
                  }:
                  {})
               ]
             },
             multiSearch: false,
             searches: [{
                 field: 'marca',
                 caption: w2utils.lang('Marca'),
                 type: 'text'
             },{
                 field: 'tip',
                 caption: w2utils.lang('Tip'),
                 type: 'text'
             }, {
                 field: 'varianta',
                 caption: w2utils.lang('Varianta'),
                 type: 'text'
             }, {
                 field: 'Versiune',
                 caption: w2utils.lang('Versiune'),
                 type: 'text'
             },{
                 field: 'denumire',
                 caption: w2utils.lang('Denumire Comerciala'),
                 type: 'text'
             }, {
                 field: 'vin',
                 caption: w2utils.lang('Nr. Identificare'),
                 type: 'text'
             }, {
                 field: 'serie_motor',
                 caption: w2utils.lang('Serie Motor'),
                 type: 'text'
             }, {
                 field: 'cat_ce',
                 caption: w2utils.lang('Cat. EU'),
                 type: 'text'
             },  {
                 field: 'act_normativ',
                 caption: w2utils.lang('Act normativ'),
                 type: 'text'
             },{
                 field: 'wvta',
                 caption: 'WVTA',
                 type: 'text'
             },],
             columns: [{
                     field: 'marca',
                     caption: w2utils.lang('Marca'),
                     size: '200px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'tip',
                     caption: w2utils.lang('Tip'),
                     size: '120px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'varianta',
                     caption: w2utils.lang('Varianta'),
                     size: '100px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'versiune',
                     caption: w2utils.lang('Versiune'),
                     size: '120px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'denumire',
                     caption: w2utils.lang('Denumire Comerciala'),
                     size: '200px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'vin',
                     caption: w2utils.lang('Nr. Identificare'),
                     size: '200px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'serie_motor',
                     caption: w2utils.lang('Serie Motor'),
                     size: '100px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'cat_ce',
                     caption: w2utils.lang('Cat. EU'),
                     size: '60px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'act_normativ',
                     caption: w2utils.lang('Act normativ'),
                     size: '30%',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 },{
                     field: 'wvta',
                     caption: 'WVTA',
                     size: '150px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }

             ],
             parser: function(responseText) {
                 var data = $.parseJSON(responseText);
                 // do other things
                 return {
                     status: 'success',
                     total: data.records,
                     records: data.rows
                 };
             },
             onRefresh:function(e){
               e.onComplete = function(){
                 if($('#listabenef').length>0){
                   $('#listabenef').w2field('list',{
                       width: '200px',
                       url: app.baseUrl + 'civutils/GetBeneficiari'
                   }).on('change', function() {
                       var selected = $('#listabenef').data('selected');
                       self.idbeneficiar = selected.id;
                   });
                 }
               };
             }
         });
         w2ui['gridVINS'].stateRestore();

         //this.buildUpload();

     },
     onBeforeDestroy: function() {
         w2ui['gridVINS'].stateSave();
         w2ui.gridVINS.destroy();
     },

     choosefile: function() {
         var chooser = this.$el.find('#fileupload');
         // chooser.off('change').on('change', function(evt) {
         //     console.log($(this).val());
         // });

         chooser.trigger('click');
     },

     setUploadEvent: function() {
         var chooser = this.$el.find('#fileupload');
     },

     buildUpload: function() {
         var self = this;
         $('#fileupload').fileinput({
             uploadUrl: app.baseUrl + 'civfiles/uploadxls',
             uploadClass: 'btn btn-toolbar',
             uploadTitle: w2utils.lang('Trimite fisier'),
             uploadLabel: w2utils.lang(' Trimite'),
             uploadIcon: '<i class="w2ui-icon-upload"></i>',
             showPreview: false,
             showRemove: false,
             showUpload: false,
             showCaption: false,
             progressClass: 'hide',
             uploadExtraData: function() {
                 //var id_comanda = w2ui['gridVINS'].getSelection() || null;
                 //if (id_comanda) {
                     return {
                         id_beneficiar: self.idbeneficiar
                     };
                 //}
             },
             browseClass: 'btn disabled btn-toolbar',
             browseTitle: w2utils.lang('Alege fisiere'),
             browseLabel: w2utils.lang(' Incarca vehicule'),
             browseIcon: '<i class="w2ui-icon-folder"></i>',
             removeClass: 'btn btn-toolbar',
             removeTitle: 'Reset',
             removeLabel: ' Reset',
             removeIcon: '<i class="w2ui-icon-cross"></i>'
         });

         $('#fileupload')
             .off('fileloaded').on('fileloaded', function() {
                 w2ui['gridVINS'].lock();
                 $('#fileupload').fileinput('upload');
             })
             .off('filebatchuploadsuccess').on('filebatchuploadsuccess', self.uploadComplete)
             .off('filebatchuploaderror').on('filebatchuploaderror', self.uploadError);
     },

     uploadComplete: function(e, data) {
         var response = data.response.response; //(data.result);
         w2ui['gridVINS'].unlock();
         switch (response.code) {
             case 1: // comanda ok
                 ipc.send('app:notification:show', {
                     type: 'success-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 2: //comanda ok, veh in eroare
             case 3:
                 ipc.send('app:notification:show', {
                     type: 'warning-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 4: //comanda not ok
                 ipc.send('app:notification:show', {
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 6: //comanda not ok
             case 0:
             case 9:
             case 8:
                 ipc.send('app:notification:show', {
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             default:
                 ipc.send('app:notification:show', {
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
         }
         w2ui['gridVINS'].reload();
     },

     uploadError: function(e, data) {
         $('#fileupload').fileinput('reset');
         w2ui['gridVINS'].unlock();
         ipc.send('app:notification:show', {
             type: 'error-template',
             text: w2utils.lang('Eroare la transmitere! Verificati fisierul!'),
             title:'Notificare'
         });
     }
 });
