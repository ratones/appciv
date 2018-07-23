var CerereModel = window.Backbone.SModel.extend({
    urlRoot: function () {
        return app.baseUrl + 'individuale/edit';
    },
    fields: [{
            name: 'id',
            el: '#id',
            type: 'int'
        }, {
            name: 'data_comanda',
            el: '#data_comanda',
            type: 'date'
        }, {
            name: 'data_inreg',
            el: '#data_inreg',
            type: 'date',
            required: true
        }, {
            name: 'id_beneficiar',
            el: '#id_beneficiar',
            type: 'int',
            required: true
        }, {
            name: 'nr_inreg_soc',
            el: '#nr_inreg_soc',
            type: 'text',
            required: true
        },
        {
            name: 'cod_judet',
            el: '#cod_judet',
            type: 'text',
            required: true
        }, {
            name: 'societate',
            el: '#societate',
            type: 'text',
            required: true
        }
    ],

    addRelated: function (rel) {
        this.attributes.Vehicule.add(rel);
    },
    removeRelated: function (rel) {
        this.attributes.Vehicule.remove(rel);
    },

    initialize: function () {}
});
module.exports = CerereModel;