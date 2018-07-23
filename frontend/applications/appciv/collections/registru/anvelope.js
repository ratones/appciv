var Model = require('./../../models/registru/anvelopa');
var Anvelope = Backbone.SCollection.extend({
    model: Model,
    // byGroup: function(group) {
    //     var filtered = this.filter(function(m) {
    //         return m.get('grupa') === group;
    //     });
    //     return new DateTehnice(filtered);
    // }
});
module.exports = Anvelope;
