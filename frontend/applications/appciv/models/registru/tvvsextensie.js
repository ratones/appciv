var TVVModel = require('./tvv')
var SetDateTVVModel = require('./setdatetehnice')

var TVVExtensieCerere =  Backbone.SModel.extend({
    urlRoot: app.baseUrl + 'doiit/GetTVVExtensieCerere',
    fields: function() {
        return [{
            name: 'SetDateTVV',
            type: 'model'
        }, {
            name: 'TVV',
            type: 'model'
        }];
    },
    // initialize:function(){
    //     console.log('init set date tvv')
    //     this.attributes.TVV = new TVVModel()
    //     this.attributes.SetDateTVV = new SetDateTVVModel()
    // }
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
