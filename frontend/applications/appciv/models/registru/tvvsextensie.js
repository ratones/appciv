var TVVModel = require('./tvv')
var SetDateTVVModel = require('./setdatetehnice')

var TVVExtensieCerere =  Backbone.SModel.extend({
    urlRoot: app.baseUrl + '/doiit/GetTVVExtensieCerere',
    fields: function() {
        return [{
            name: 'SetDateTVV',
            type: 'model'
        }, {
            name: 'TVV',
            type: 'model'
        }];
    }
});

Backbone.associate(TVVExtensieCerere, {
    TVV: {
        type: TVVModel
    },
    SetDateTVV: {
        type: SetDateTVVModel
    }
});

module.exports = TVVExtensieCerere;
