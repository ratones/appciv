var FisierModel = require('./../models/fisier'),
    FisiereCollection = window.Backbone.SCollection.extend({
        model: FisierModel,
        id_vehicul: undefined,

        initialize: function(models, options) {
            if (options !== undefined) {
                this.id_vehicul = options.id_vehicul;
            }

        },

        url: function() {
            return app.baseUrl + 'individuale/getfisierevehicul/' + this.id_vehicul;
        },

        byGroup: function(grupa) {
            filtered = this.filter(function(box) {
                return box.get('grupa') === grupa;
            });
            return new FisiereCollection(filtered);
        }

    });

module.exports = FisiereCollection;