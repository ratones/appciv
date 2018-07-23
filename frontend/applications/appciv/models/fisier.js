var FisierModel = window.Backbone.Model.extend({
    urlRoot: function() {
        return app.baseUrl + 'individuale/fisier';
    },
    defaults: {
        //val:''
        EntityState:3
    },
    fields: function() {
        var self = this;
    },
    initialize: function() {}
});
module.exports = FisierModel;