 var AtributItemView = require('./atribut'),
     AtributeAccordionView = window.Marionette.CompositeView.extend({
         className: 'accordion',
         childView: AtributItemView,
         initialize:function(){
             var self = this;
             self.iswltp = this.options.iswltp;
             //294 - masa incercare
             //301 - CO2 NEDC
             //290 - CO2 WLTP
             //309 - autonomie
             // 184 - cons en el
             this.wltpAttrs = [141,291,292,293,295,296,297,298,299,300, 301];
             this.nedcAttrs = [141,142,246,247,248];
             co2wltp = this.options.collection.find(function(m){return m.get('id_nomenclator') == '290'});
             if(co2wltp){
                 this.iswltp = (co2wltp.get('min') && co2wltp.get('min') != '0') || (co2wltp.get('max') && co2wltp.get('max') != '0');
             }
             this.listenTo(app,'wltp:changed',function(val){
                self.iswltp = val;
             })
         },
         getTemplate: function() {
             var coll = this.collection,
                 html = '<form role="form" class="form-inline">', //= '<script id="layout-view-template" type="text/template">',
                 atrs = _.groupBy(coll.toJSON(), 'grupa');
             $.each(atrs, function(i, grp) {
                 ///append accordion element to dom
                 html +=
                     '<div id="panel-'+i+'" class="panel panel-primary hide">' +
                     '<div class="w2ui-panel-title">' + i.charAt(0).toUpperCase() + i.slice(1) + '</div>' +
                     '<div class="panel-body" id="' + i + '"></div>' +
                     '</div>';
             });
             html += '</form>';

             return html;
         },
         childViewOptions: function(model) {
             return {
                 index: this.collection.indexOf(model)
             };
         },
         attachHtml: function(collectionView, itemView, index) {
             //itemView.$el.addClass('form-group );
             var data, v, min, max;
             itemView.model.set('index', index);
             min=Number(itemView.model.get('min'));
             max=Number(itemView.model.get('max'));
             var sourceOfValues=itemView.model.get('source');
             v= itemView.model.get('val');
             // show-hide attributes 
             // daca exista o singura valoare sau suntem in mod editare si valoarea nu este egala cu valoarea unica, 
             // afisam atributul pentru a putea fi corectat
             //altfel nu afisam atributul, pentru ca singura valoare posibila este valoarea unica
            

             /*if (itemView.model.get('tip') === 'lista') {
                 data = itemView.model.get('source').split('|');
                 if (data.length <= 1 || (itemView.model.get('val') === data[0])) {
                     return; //iesim, conditia de afisare nu este ndeplinita
                 }

             } else if (itemView.model.get('tip') === 'interval') {
                 v = (itemView.model.get('val') === '' || itemView.model.get('val') === null) && itemView.model.get('min') !== 0 ? itemView.model.get('min') : itemView.model.get('val');
                 min = itemView.model.get('val') !== null && itemView.model.get('min') === 0 ? itemView.model.get('val') : itemView.model.get('min');
                 max = itemView.model.get('val') !== null && itemView.model.get('max') === 0 ? itemView.model.get('val') : itemView.model.get('max');
                 if (itemView.model.get('val') !== null) {
                     v = Number(itemView.model.get('val'));
                     min = itemView.model.get('min') === 0 ? itemView.model.get('val') : itemView.model.get('min');
                     max = itemView.model.get('max') === 0 ? itemView.model.get('val') : itemView.model.get('max');
                     if (min === max) {
                         v = min;
                     }

                 } else {
                     if (itemView.model.get('min') === 0 && itemView.model.get('max') !== 0) {
                         v = itemView.model.get('max');
                         min = itemView.model.get('max');
                         max = itemView.model.get('max');
                     } else if (itemView.model.get('max') === 0 && itemView.model.get('min') !== 0) {
                         v = itemView.model.get('min');
                         min = itemView.model.get('min');
                         max = itemView.model.get('min');
                     } else if (itemView.model.get('max') === 0 && itemView.model.get('min') === 0) {
                         v = 0;
                         min = 0;
                         max = 0;
                     } else {

                     }
                 }
                 if (min === max && ((itemView.model.get('val') >= min && itemView.model.get('val') <= max))) { //vezi mai sus self.model.get('EntityState')===3 &&
                     // if(min==="0"&&max==="0"){
                     // itemView.model.set('val',0);
                     // }
                     return; //atributul e ok, putem sa-l scoatem de pe pagina 
                 } else {
                     itemView.model.set('val', v);
                 }
             }*/

             //refactor!!
             if(itemView.model.get('id_nomenclator') == 24 && this.iswltp){
                collectionView.$('#' + itemView.model.get('grupa')).append(itemView.el).parent().removeClass('hide');
                return;
             }
             if(itemView.model.get('id_nomenclator') == 290 && this.iswltp){// show alt cod for getting wltp co2
                collectionView.$('#' + itemView.model.get('grupa')).append(itemView.el).parent().removeClass('hide');
                return;
             }
             if(this.wltpAttrs.indexOf(itemView.model.get('id_nomenclator'))!==-1) return;// exclude other wltp attrs
             if(this.iswltp && this.nedcAttrs.indexOf(itemView.model.get('id_nomenclator')) != -1) return; // exclude nedc (not required) if is wltp
             if(itemView.model.get('tip')==='interval'){//valoare de tip interval - se verifica min!=max si max!=0
                if(min===max || max===0){
                    if(itemView.model.get('val') && Number(itemView.model.get('val'))!==min){
                        //return;
                    }
                    else{
                        //setam valoarea cu min si scoatem atributul de pe pagina
                        itemView.model.set('val',min);
                        return;
                    }
                    
                }
             }
             else if(!sourceOfValues && itemView.model.get('id_nomenclator') === 28){//tip transmisie nu este obligatoriu decat daca au fost specificate valori la omologare
                return;
             }
             else if(!sourceOfValues){
                // atribut adaugat suplimentar
             }
             else if(sourceOfValues.split('|').length===1){
                //nu avem valori multiple de selectie - setam valoarea cu sursa de date si scoatem atributul de pe pagina
                itemView.model.set('val',sourceOfValues);
                    return;
             }
             else if(min===0 && max===0 && sourceOfValues.split('|').length===1){
                itemView.model.set('val',sourceOfValues);
                    return;
             }else{
                //$('#panel-'+itemView.model.get('grupa'));
             }
             collectionView.$('#' + itemView.model.get('grupa')).append(itemView.el).parent().removeClass('hide');
         },
         onRender: function() {
             //initialize accordion effect
             this.$el.find('.w2ui-panel-title').click(function() {
                 $(this).next().toggle('fast');
                 return false;
             }).next().hide('fast');
         }
     });
 module.exports = AtributeAccordionView;
