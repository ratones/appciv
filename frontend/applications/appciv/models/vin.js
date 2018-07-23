var VINModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return window.app.baseUrl + 'vins/edit';
    },
    fields: function() {
        return [{
            name: 'id',
            el: '#id',
            type: 'int'
        }, {
            name: 'tip',
            el: '#tip',
            type: 'text',
            required: true
        }, {
            name: 'varianta',
            el: '#varianta',
            type: 'text',
            required: true
        }, {
            name: 'versiune',
            el: '#versiune',
            type: 'text',
            required: true
        }, {
            name: 'vin',
            el: '#vin',
            type: 'text',
            required: true
        }, {
            name: 'wvta',
            el: '#wvta',
            type: 'text',
            required: true
        }, {
            name: 'extensie',
            el: '#extensie',
            type: 'text',
            required: true
        }, {
            name: 'act_normativ',
            el: '#act_normativ',
            type: 'text',
            required: true
        }];
    },
});
module.exports = VINModel;
