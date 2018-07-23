var MentiuneModel = require('./../models/mentiune'),
    MentiuniCollection = window.Backbone.SCollection.extend({
        model: MentiuneModel,
        id_vehicul: undefined,

        initialize: function(models, options) {
            if (options !== undefined) {
                this.id_vehicul = options.id_vehicul;
            }

        },

        url: function() {
            return app.baseUrl + 'vehicule/getatributevehicul/' + this.id_vehicul;
        },
    });

module.exports = MentiuniCollection;