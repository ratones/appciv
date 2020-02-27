var VehiculModel = window.Backbone.SModel.extend({
    urlRoot: function () {
        return app.baseUrl + 'individuale/editvehicul';
    },
    defaults: {
        canBeDirty: true
    },
    initialize:function(options){
        this.is_nr_reg = options && options.is_nr_reg
    },
    fields: function () {
        var self = this;
        var data = [];
        if (self.get('culoare')) {
            $(self.get('culoare').split('-')).each(function () {
                data.push({
                    id: this,
                    text: this
                });
            });
        }
        return [{
            el: '#vin',
            name: 'vin',
            type: 'text',
            required: !self.is_nr_reg

        }, {
            el: '#nr_registru',
            name: 'nr_registru',
            type: 'text'
        }, {
            el: '#wvta',
            name: 'wvta',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function () {
                    return app.baseUrl + '/doiit/getWVTA';
                },
                postData: {
                    idcom: self.get('id_comanda')
                },
                cascadeTo: ['#extensie', '#tip', '#varianta', '#versiune']
            },
            selected: {
                id: self.get('id_wvta'),
                text: self.get('wvta')
            },
            // idField: 'id_wvta',
            // txtField: 'wvta',
            // change: function () {
            //     var selected = $('#wvta').data('selected');
            //     self.set('wvta', selected.text);
            //     self.set('id_wvta', selected.id);
            //     $().w2tag();
            // }

        }, {
            el: '#extensie',
            name: 'extensie',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getExtensiiWVTA';
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
                id: self.get('extensie'),
                text: self.get('extensie')
            },
            // change: function() {
            //     var selected = $('#extensie').data('selected');
            //     self.set('extensie',selected.text);
            //     if(selected.id)
            //         self.set('id_extensie',selected.id);
            // },
            // idField:'id_extensie',
            // txtField:'extensie'
        },  {
            el: '#tip',
            name: 'tip',
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getTipuri';
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
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getVariante';
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
            type: 'combo',
            required: true,
            options: {
                minLength: 0,
                url: function() {
                    return app.baseUrl + '/doiit/getVersiuni';
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
            // change: function() {
            //     var selected = $('#versiune').data('selected');
            //     self.set('versiune',selected.text);
            //     if(selected.id)
            //         self.set('id_tvv',selected.id);
            //     else
            //         self.set('id_tvv',0);

            // },
            // idField:'id_tvv',
            // txtField:'versiune'
        }, {
            el: '#an_fabr',
            name: 'an_fabr',
            type: 'int',
            required: !self.is_nr_reg,
            options: {
                min: 1960,
                max: Number(new Date().getFullYear()) + 1
            }
        }, {
            el: '#observatii',
            name: 'observatii',
            type: 'memo'
        }, {
            el: '#motiv_respingere',
            name: 'motiv_respingere',
            type: 'memo'
        }, {
            el: '#cod_motor',
            name: 'cod_motor',
            type: 'combo',
            required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R',
            options: {
                url: function() {
                    return app.baseUrl + '/doiit/getMotoare';
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
            // idField: 'motor',
            // txtField: 'cod_motor',
            // change: function(event) {
            //     var selected = $(event.data.field.el).data('selected');
            //     self.set('motor', selected.id);
            //     self.set('cod_motor', selected.text);
            // }
        },
        // {
        //     el: '#cod_motor',
        //     name: 'cod_motor',
        //     type: 'text'
        // }, 
        {
            el: '#co2_wltp',
            name: 'co2_wltp',
            type: 'text'
        },
        {
            el: '#co2_wltp_alt',
            name: 'co2_wltp_alt',
            type: 'text'
        },
        {
            el: '#masa_reala',
            name: 'masa_reala',
            type: 'text'
        }, {
            el: '#putere_kw',
            name: 'putere_kw',
            type: 'text'
        }, {
            el: '#cilindree',
            name: 'cilindree',
            type: 'text'
        }, {
            el: '#culoare',
            name: 'culoare',
            type: 'enum',
            required: !self.is_nr_reg,
            options: {
                minLength: 0,
                url: function () {
                    return app.baseUrl + '/vehicule/getcolors';
                },
                postData: function () {
                    return {
                        nr_registru: self.get('nr_registru'),
                        ext: self.get('extensie')
                    };
                },
                openOnFocus: true,
                max: 3
            },
            selected: data,
            change: function (event) {
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
            type: 'text'
        },{
            el: '#masa_incercare',
            name: 'masa_incercare',
            type: 'text'
        },{
            el: '#factor_deviere',
            name: 'factor_deviere',
            type: 'text'
        },{
            el: '#factor_verificare',
            name: 'factor_verificare',
            type: 'text'
        },{
            el: '#ecoinovatie',
            name: 'ecoinovatie',
            type: 'text'
        },
        {
            el: '#reduceri_co2_nedc',
            name: 'reduceri_co2_nedc',
            type: 'text'
        },
        {
            el: '#reduceri_co2_wltp',
            name: 'reduceri_co2_wltp',
            type: 'text'
        },
        {
            el: '#consum_energie',
            name: 'consum_energie',
            type: 'text'
        },{
            el: '#autonomie_electric',
            name: 'autonomie_electric',
            type: 'text'
        },
        {
            el: '#familia_interpolare',
            name: 'familia_interpolare',
            type: 'text'
        }];
    }
});
var Mentiuni = require('./../collections/mentiuni');
var Atribute = require('./../collections/atribute');
var Anvelope = require('./../collections/anvelope');
window.Backbone.associate(VehiculModel, {
    Mentiuni: {
        type: Mentiuni
    },
    Atribute: {
        type: Atribute
    },
    Anvelope: {
        type: Anvelope
    }
});
module.exports = VehiculModel;
