module.exports = window.Backbone.SModel.extend({
    idAttribute: 'id_plata',
    urlRoot: function() {
        return app.baseUrl + 'comenzi/plata';
    }
});
