var DateTehnice = require('./../../collections/registru/datetehnice')
var Anvelope = require('./../../collections/registru/anvelope')
var Motoare = require('./../../collections/registru/motoare')
var Sisteme = require('./../../collections/registru/sisteme')
var Mentiuni = require('./../../collections/registru/mentiuni')

var SetDateTehnice = Backbone.SModel.extend({
    fields: [{
        name: 'DateTehnice',
        type: 'collection'
    }]
});

Backbone.associate(SetDateTehnice, {
    DateTehnice: {
        type: DateTehnice
    },
    Anvelope: {
        type: Anvelope
    },
    Motoare: {
        type: Motoare
    },
    Sisteme: {
        type: Sisteme
    },
    Mentiuni: {
        type: Mentiuni
    }
});

module.exports = SetDateTehnice;
