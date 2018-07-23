module.exports = Backbone.SModel.extend({
    defaults: {
        canBeDirty: true
    },
    fields: function() {
        var self = this;
        var notrequired = [28,286];
        var nedcAtrs = [24, 141, 142, 246, 247, 248];
        var wltpAtrs = [290,291,292,293,294,295,296,297,298,299,300,301];
        var isRequired = notrequired.indexOf(Number(self.get('id_nom'))) < 0;
        if(isRequired){
            if(wltpAtrs.indexOf(Number(self.get('id_nom'))) != -1 && !self.get('iswltp')){
                isRequired = false;
            }
            if(nedcAtrs.indexOf(Number(self.get('id_nom'))) != -1 && self.get('iswltp')){
                isRequired = false;
            }
        }
        var fields = [{
                el: '#DateTehnice_' + this.cid + '__suggested_val',
                name: 'suggested_val'
            }];
        if (this.get('tip') === 'interval') {
            fields.push({
                el: '#DateTehnice_' + this.cid + '__val_max',
                name: 'val_max',
                //required: true
            });
            fields.push({
                el: '#DateTehnice_' + this.cid + '__val_min',
                name: 'val_min',
                required: isRequired
            });
        } else {
            fields.push({
                el: '#DateTehnice_' + this.cid + '__val',
                name: 'val',
                required: isRequired
            });
        }
        return fields;
    }
});
