var Model = require('./../../models/registru/sistem');
var Sisteme = Backbone.SCollection.extend({
    model: Model,
    // byGroup: function(group) {
    //     var filtered = this.filter(function(m) {
    //         return m.get('grupa') === group;
    //     });
    //     return new DateTehnice(filtered);
    // }
});
module.exports = Sisteme;
