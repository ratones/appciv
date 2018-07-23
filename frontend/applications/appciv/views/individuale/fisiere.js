 var FisierItemView = require('./fisier'),
     FisereView = window.Marionette.CompositeView.extend({
         className: 'accordion',
         childView: FisierItemView,
         getTemplate: function() {
            var html = '<div></div>';
             return html;
         },
         childViewOptions: function(model) {
             return {
                 index: this.collection.indexOf(model),
                 editable:this.options.editable
             };
         },
         onRender:function(){
             var self = this;
             this.listenTo(app,'vehicul:add:file',function(options){
                self.collection.add({
                    id_vehicul:options.id_vehicul,
                    slot:'suplimentar'
                });
             });
         }
        //  attachHtml: function(collectionView, itemView, index) {
             
        //  }
     });
 module.exports = FisereView;