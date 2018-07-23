var VehiculModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + 'vehicule/edit';
    },
    defaults: {
        canBeDirty:true
    },
    fields: function() {
        var self = this;
        var data = [];
        if (self.get('culoare')) {
            $(self.get('culoare').split('-')).each(function() {
                data.push({
                    id: this,
                    text: this
                });
            });
        }
        return [{
            name: 'Atribute',
            type: 'collection'
        }, {
            name: 'Anvelope',
            type: 'collection'
        }, {
            el: '#vin',
            name: 'vin',
            type: 'text',
            required: true

        }, {
            el: '#cnot',
            name: 'cnot',
            type: 'text'
        }, {
            el: '#nr_registru',
            name: 'nr_registru',
            type: 'text'
            // required: true,
            // options: {
            //     minLength: 0,
            //     url: function() {
            //         return app.baseUrl + '/vehicule/getNrOmologare';
            //     },
            //     cascadeTo: ['#id_extensie', '#culoare']
            // },
            // selected: {
            //     id: self.get('id_tvv'),
            //     text: self.get('nr_registru')
            // },
            // idField:'id_tvv',
            // txtField:'nr_registru',
            // change: function() {
            //     var selected = $('#id_tvv').data('selected');
            //      self.set('nr_registru',selected.text);
            //      self.set('id_tvv',selected.id);
            //    $().w2tag();
            // }
        }, {
            el: '#wvta',
            name: 'wvta',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getWVTA';
                },
                postData:{
                    idcom:self.get('id_comanda')
                },
                cascadeTo: ['#id_extensie','#tip','#varianta','#versiune']
            },
            selected: {
                id: self.get('id_wvta'),
                text: self.get('wvta')
            },
            idField:'id_wvta',
            txtField:'wvta',
            change: function() {
                var selected = $('#wvta').data('selected');
                 self.set('wvta',selected.text);
                 self.set('id_wvta',selected.id);
               $().w2tag();
            }

        }, {
            el: '#id_extensie',
            name: 'id_extensie',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getExtensiiWVTA';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#tip','#varianta','#versiune']
            },
            selected: {
                id: self.get('id_extensie'),
                text: self.get('extensie')
            },
            change: function() {
                var selected = $('#id_extensie').data('selected');
                self.set('extensie',selected.text);
                self.set('id_extensie',selected.id);
            },
            idField:'id_extensie',
            txtField:'extensie'
        },  {
            el: '#tip',
            name: 'tip',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getTipuri';
                },
                postData: function() {
                    return {
                        id_extensie: self.get('id_extensie') || '0',
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#varianta','#versiune']
            },
            selected: {
                id: self.get('tip'),
                text: self.get('tip')
            }
        }, {
            el: '#varianta',
            name: 'varianta',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getVariante';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        tip:self.get('tip'),
                        idcom:self.get('id_comanda')
                    };
                },
                cascadeTo: ['#versiune']
            },
            selected: {
                id: self.get('varianta'),
                text: self.get('varianta')
            }
        }, {
            el: '#versiune',
            name: 'versiune',
            type: 'list',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/civutils/getVersiuni';
                },
                postData: function() {
                    return {
                        id_wvta: self.get('id_wvta') || '0',
                        tip:self.get('tip'),
                        varianta:self.get('varianta'),
                        idcom:self.get('id_comanda')
                    };
                }
            },
            selected: {
                id: self.get('id_tvv'),
                text: self.get('versiune')
            },
            change: function() {
                var selected = $('#versiune').data('selected');
                self.set('versiune',selected.text);
                self.set('id_tvv',selected.id);
            },
            idField:'id_tvv',
            txtField:'versiune'
        },{
            el: '#an_fabr',
            name: 'an_fabr',
            type: 'int',
            required: true,
            options: {
                min: 1960,
                max: Number(new Date().getFullYear()) + 1
            }
        }, {
            el: '#motor',
            name: 'motor',
            type: 'list',
            required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R',
            options: {
                url: function() {
                    return app.baseUrl + '/vehicule/getMotoare';
                },
                postData: function() {
                    return {
                        id_tvv: self.get('id_tvv'),
                        id_extensie: self.get('id_extensie')
                    };
                },
                minLength: 0
            },
            selected: {
                id: self.get('motor'),
                text: self.get('cod_motor')
            },
            idField: 'motor',
            txtField: 'cod_motor',
            change: function(event) {
                var selected = $(event.data.field.el).data('selected');
                self.set('motor', selected.id);
                self.set('cod_motor', selected.text);
            }
        }, /*{
            el: '#serie_motor',
            name: 'serie_motor',
            type: 'text',
            required: true

        },*/ {
            el: '#culoare',
            name: 'culoare',
            type: 'enum',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/vehicule/getcolors';
                },
                postData: function() {
                    return {
                        nr_registru: self.get('nr_registru'),
                        ext: self.get('extensie')
                    };
                },
                openOnFocus: true,
                max: 3
            },
            selected: data,
            change: function(event) {
                var color = [];
                var els = $(event.target).data('selected');
                for (var index in els) {
                    var el = els[index];
                    color.push(el.id);
                }
                self.set('culoare', color.join('-'));
            }
        }, {
            el: '#serie_motor',
            name: 'serie_motor',
            type: 'text',
            required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R'
        }];
    }
});
var Anvelope = require('./../collections/anvelope');
var Atribute = require('./../collections/atribute');
window.Backbone.associate(VehiculModel, {
    Atribute: {
        type: Atribute
    },
    Anvelope: {
        type: Anvelope
    }
});
module.exports = VehiculModel;
