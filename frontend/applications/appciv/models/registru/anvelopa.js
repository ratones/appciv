module.exports = Backbone.SModel.extend({
    fields: function() {
        var self = this;
        return [{
            el: '#axa',
            name: 'axa',
            type: 'combo',
            options: {
                items: [{
                    id: 1,
                    text: 'Fata'
                }, {
                    id: 2,
                    text: 'Spate'
                }],
                selected: self.get('axa')
            },
            idField: 'axa',
            txtField: 'axaTxt'
        }, {
            el: '#id_roata',
            name: 'id_roata',
            type: 'combo',
            options: {
                url: app.dotUrl + '/nrom/getAnvelope',
                selected: {
                    id: self.get('id_roata'),
                    text: self.get('valoare')
                },
                renderDrop: function(e) {
                    console.log(e);
                    return '<td>' + e.janta + '</td><td>' + e.text + '</td>';
                },
            },
            change:function(){
                var selected = $('#id_roata').data('selected');
                self.set('janta',selected.janta);
            },
            idField: 'id_roata',
            txtField: 'valoare'
        }];
    }
});
