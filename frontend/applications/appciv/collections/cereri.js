var CerereModel = require('../models/cerere');
var CereriCollection = window.Backbone.SCollection.extend({
    model: CerereModel,
    //url: 'variante/getvarianteaprobate',
    meta: function(prop, value) {
        if (value === undefined) {
            return this._meta[prop];
        } else {
            this._meta[prop] = value;
        }
    },
    url: function() {
        var url = window.app.baseUrl + 'comenzi/getcomenzi';
        if (this.meta('quickFilter')) {
            url += this.meta('quickFilter');
        }
        return url;
    },
    initialize: function(models, options) {
        this._meta = {};
    },
    parse: function(response) {
        this.meta('total', response.total);
        // this.meta('filteredSize', response.iTotalDisplayRecords);
        return response.data;
    },
    setFilter: function(filter) {
        this.url = window.app.baseUrl + 'comenzi/getcomenzi/';
        this.url = this.url + '?' + filter;
    },

    addFilter: function(filter) {
        this.url = window.app.baseUrl + this.url + filter;
    }

});
module.exports = CereriCollection;
