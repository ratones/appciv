 var VehiculModel = require('./../models/vehicul'),
     VehiculeCollection = window.Backbone.SCollection.extend({
         model: VehiculModel,
         //url: 'vehicule/getvehicule/'+this.id_comanda,
         meta: function(prop, value) {
             if (value === undefined) {
                 return this._meta[prop];
             } else {
                 this._meta[prop] = value;
             }
         },
         url: function() {
             var url = app.baseUrl + 'vehicule/getvehicule';
             if (this.id_comanda) {
                 url += '/' + this.id_comanda;
             }
             return url;
         },
         initialize: function(models, options) {
             //this.listenTo(this,'destroy',function(model){});
             if (options) {
                 if (options.fk) {
                     this.id_comanda = (options.fk);
                 }
             }
             this._meta = {};

         },
         parse: function(response) {
             this.meta('totalSize', response.iTotalRecords);
             this.meta('filteredSize', response.iTotalDisplayRecords);
             return response.aaData;
         },
         setFilter: function(filter) {
             this.url = app.baseUrl + App.Settings.modules.vehicul.collection_path + '/' + this.id_comanda;
             this.url = this.url + '?' + filter;
         },

         addFilter: function(filter) {
             this.url = app.baseUrl + this.url + filter;
         }

     });


 module.exports = VehiculeCollection;
