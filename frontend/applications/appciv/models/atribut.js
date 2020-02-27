var AtributModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + 'vehicule/atribute';
    },
    defaults: {
        //val:''
    },
    fields: function() {
        var self = this;
        var notrequired = [28,290,291,292,293,294,295,296,297,298,299,300,301,141,142,246,247,248,184,304,307,309];
        return [{
            name: 'val',
            el: '#Atribute_' + self.get('index') + '__val',
            type: 'text',
            required: notrequired.indexOf(Number(self.get('id_nomenclator'))) < 0
        }];
    },
    initialize: function() {}
});
module.exports = AtributModel;
