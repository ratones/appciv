 var VINModel = require('../models/vin'),
     VINsCollection = window.Backbone.SCollection.extend({
         model: VINModel,

         url: function() {
             var url = window.app.baseUrl + 'vins/getvins';
             if (this.meta('quickFilter')) {
                 url += this.meta('quickFilter');
             }
             return url;
         }

     });
 module.exports = VINsCollection;
