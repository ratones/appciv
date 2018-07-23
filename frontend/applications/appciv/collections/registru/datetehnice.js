var Model = require('./../../models/registru/datetehnice');
var DateTehnice = Backbone.SCollection.extend({
    model: Model,
    initialize:function(){
        var self = this;
        // this.listenTo(this,'change',function(){
        //     var mt,mp,mu_model;
        //     self.models.map(function(m){
        //         if(m.get('id_nom')===6)
        //             mp = m.get('val_min');
        //         else if(m.get('id_nom')=== 7)
        //             mt = m.get('val')
        //         else if(m.get('id_nom')===13)
        //             mu_model = m;
        //     });
        //     if(mu_model)
        //         mu_model.set('val',Number(mt)-Number(mp));
        // });
    },
    comparator: function(item) {
        return item.get('ord');
    },
    byGroup: function(group) {
        var filtered = this.filter(function(m) {
            return m.get('grupa') === group;
        });
        return new DateTehnice(filtered);
    }
});
module.exports = DateTehnice;
