    var AnvelopaEditor = require('./anvelopeEditor');
      var MentiuneItemView = require('./mentiune'),
     MentiuniView = window.Marionette.CompositeView.extend({
         className: 'accordion',
         childView: MentiuneItemView,
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
             if(this.options.editable){
               self.setViewEditable();
             }else{
                 this.listenTo(app,'vehicul:set:editable',function(options){
                    self.setViewEditable();
                    self.options.editable = true;
                });
             }
         },
         attachHtml: function(collectionView, itemView, index) {
             if(itemView.model.get('EntityState') != 2){
                 collectionView.$el.append(itemView.render().el);
             }
         },
         setViewEditable:function(){
             var self = this;
              this.listenTo(app,'vehicul:add:mentiune',function(options){
                    self.collection.add({
                        nr_identif:options.vin,
                        id_vehicul:options.id_vehicul,
                        EntityState:0
                    });
                });
                this.listenTo(app,'vehicul:remove:mentiune',function(model){
                    if (!model.id) {
                        this.collection.remove(model);
                    } else {
                        this.collection.trigger('remove', model);
                    }
                });
                
                 this.listenTo(app,'vehicul:add:anvelopa',function(options){
                    var view = new AnvelopaEditor({model:options});
                    app.modal.show(view, {
                        preventDestroy: true
                    });
                    // self.collection.add({
                    //     nr_identif:options.vin,
                    //     id_vehicul:options.id_vehicul,
                    //     EntityState:0
                    // });
                });
                this.listenTo(app,'app:mentiuni:addanvelope',function(opt){
                    if(opt.roatafata == opt.roataspate){
                        opt.model.set('text','Anv. Opt. ' + opt.roatafata);
                    }else{
                         opt.model.set('text','Anv. Opt. ' + opt.roatafata + '(fata) +');
                         self.collection.add({
                            nr_identif:opt.model.get('vin'),
                            id_vehicul:opt.model.get('id_vehicul'),
                            text: opt.roataspate + '(spate)',
                            EntityState:0
                        });
                    }
                });
         }
     });
 module.exports = MentiuniView;