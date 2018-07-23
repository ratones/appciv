var Model = require('./../../models/registru/mentiune');
var Mentiuni = Backbone.SCollection.extend({
    model: Model
});
module.exports = Mentiuni;
