module.exports = Backbone.SModel.extend({
    urlRoot: app.dotUrl + '/nrom/getDateTVV',
    defaults: {
        cod_tip_omologare: 'W',
        tip_omologare: 'INREGISTRARE DE TIP',
        canBeDirty:true,
        isViewInitialized:false
    },
    initialize:function(){
        if(this.get('isViewInitialized')){

        }
        // $('#marca').w2field().reinit();
        //     $('#tip').w2field().reinit();
        //     $('#varianta').w2field().reinit();
        //     $('#versiune').w2field().reinit();
        //     $('#denumire_comerciala').w2field().reinit();
    },
    bindEvents:function(){
        var self = this;
        this.listenTo(this,'change:cod_tip_omologare',function(){
            self.unset('cod_caroserie').unset('caroserie');
            $('#cod_caroserie').w2field().reinit();
        });
        this.listenTo(this,'change:categorie',function(e){
            if(!self.get('nr_registru')){
                self.unset('cod_categorie').unset('categorie_folosinta');
                $('#cod_categorie').w2field().reinit();
            }
        });
        this.listenTo(this,'change:cod_categorie',function(){
            self.unset('cod_caroserie').unset('caroserie');
            $('#cod_caroserie').w2field().reinit();
            $('#id_clasa').w2field().reinit();
        });
        // this.listenTo(this,'change:cod_caroserie',function(){
        //     self.unset('marca').unset('cod_marca');
        //     $('#marca').w2field().reinit();
        // });
        this.listenTo(this,'change:marca',function(){
            self.unset('tip').unset('cod_tip');
            $('#tip').w2field().reinit();
        });
        this.listenTo(this,'change:tip',function(){
            self.unset('varianta').unset('cod_varianta');
            $('#varianta').w2field().reinit();
        });
        this.listenTo(this,'change:varianta',function(){
            self.unset('versiune').unset('cod_versiune');
            $('#versiune').w2field().reinit();
        });
        this.listenTo(this,'change:versiune',function(){
            self.unset('denumire_comerciala');
            $('#denumire_comerciala').w2field().reinit();
        });
    },
    fields: function() {
        var self = this;
        var tipomol = [
            {id:'W',text:'INREGISTRARE DE TIP'},
            {id:'Y',text:'INREGISTRARE DE TIP(TIP NOU)'}
        ];
        var fields = [
            // {
            //     el: '#mod_omologare',
            //     name: 'mod_omologare',
            //     type: 'list',
            //     options: {
            //         items: [{
            //             id: 'Omologare de tip nou',
            //             text: 'Omologare de tip nou'
            //         }, {
            //             id: 'Omologare de tip vechi',
            //             text: 'Omologare de tip vechi'
            //         }],
            //         cascadeTo: ['#tip_omologare']
            //     },
            //     selected: self.get('mod_omologare')
            // },
            /* {
                 el: '#tip_omologare',
                 name: 'tip_omologare',
                 type: 'list',
                 options: {
                     url: function() {
                         return app.dotUrl + '/nrom/gettipomol';
                     },
                     postData: function() {
                         return {
                             mod: 'Omologare de tip nou'
                         };
                     },
                     minLength: 0,
                 },
                 selected: {
                     id: self.get('cod_tip_omologare'),
                     text: self.get('tip_omologare')
                 },
                 change: function() {
                     var selected = $('#tip_omologare').data('selected');
                     self.set('cod_tip_omologare', selected.id);
                 }
             },*/
            {
                name: 'cod_tip_omologare',
                el: '#cod_tip_omologare',
                type: 'list',
                options: {
                    items:tipomol,
                    minLength: 0,
                    onChange: function(e) {
                        var selected = e.item;
                        self.set('cod_tip_omologare', selected.id);
                        self.set('tip_omologare', selected.text);
                    },
                    selected: {
                        id: self.get('cod_tip_omologare'),
                        text: self.get('tip_omologare')
                    }
                }
            },
            {
                name: 'nr_registru',
                el: '#nr_registru',
                type: 'text'
            }, {
                name: 'wvta',
                el: '#wvta',
                type: 'text'
            }, {
                name: 'cnot',
                el: '#cnot',
                type: 'text'
            }, {
                name: 'observatii',
                el: '#observatii',
                type: 'text'
            }, {
                name: 'extensie',
                el: '#extensie',
                type: 'text'
            }, {
                name: 'categorie',
                el: '#categorie',
                type: 'enum',
                required: true,
                options: {
                    url: function() {
                        return app.dotUrl + '/nrom/getcategeu';
                    },
                    minLength: 0,
                    // selected:self.get('categorie'),
                    selected: self.get('categorie')?self.get('categorie').split('|'):'',
                    onChange:function(e){
                        var selected = $(e.target).data('selected');
                        console.log(selected);
                        if(selected.length <= 0 && !self.get('categorie')) return;
                        var val = '';
                        selected.map(function(el){
                            val += '|' + el.text;
                        });
                        self.set('categorie', val.substr(1,val.length));
                    }
                }
            }, {
                name: 'cod_categorie',
                el: '#cod_categorie',
                type: 'list',
                options: {
                    url: app.dotUrl + '/nrom/getcategfol',
                    postData: function() {
                        return {
                            cateu: self.get('categorie').split('|')[0]
                        };
                    },
                    minLength: 0,
                    selected: {
                        id: self.get('cod_categorie'),
                        text: self.get('categorie_folosinta')
                    },
                    onChange:function(e){
                        self.set('cod_categorie',e.item.id).set('categorie_folosinta', e.item.text);
                    }
                },
                required: true
            }, {
                name: 'id_clasa',
                el: '#id_clasa',
                type: 'list',
                options: {
                    url: app.dotUrl + '/nrom/getclase',
                    minLength: 0,
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie')
                        };
                    },
                    selected: {
                        id: self.get('id_clasa'),
                        text: self.get('clasa')
                    },
                    onChange:function(e){
                        self.set('id_clasa',e.item.id).set('clasa', e.item.text);
                    }
                }
            }, {
                name: 'cod_caroserie',
                el: '#cod_caroserie',
                type: 'list',
                options: {
                    url: app.dotUrl + '/nrom/getcaroserii',
                    postData: function() {
                        return {
                            tip_omol:self.get('cod_tip_omologare'),
                            cat_fol: self.get('cod_categorie')
                        };
                    },
                    minLength: 0,
                    //cascadeTo: ['#marca' /*, '#tip', '#varianta', '#versiune'*/ ]
                    selected: {
                        id: self.get('cod_caroserie'),
                        text: self.get('caroserie')
                    },
                    onChange:function(e){
                        self.set('cod_caroserie',e.item.id).set('caroserie', e.item.text);
                    }
                },
                required: true
            }, {
                name: 'marca',
                el: '#marca',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/getmarci',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie')
                        };
                    },
                    minLength: 0,
                    selected: {
                        id: self.get('cod_marca'),
                        text: self.get('marca')
                    }
                },
                // change:function(e){
                //         var selected = $(e.currentTarget).data('selected');
                //         self.set('cod_marca',selected.id).set('marca', selected.text);
                // },
                required: true,
                idField:'cod_marca',
                txtField:'marca'
            }, {
                name: 'tip',
                el: '#tip',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/gettipuri',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca')
                        };
                    },
                    renderDrop: function(e) {
                        return '<td>' + e.id + '</td><td>' + e.text + '</td>';
                    },
                    minLength: 0,
                    // cascadeTo: ['#varianta' /*, '#versiune'*/ ]
                    selected: {
                        id: self.get('cod_tip'),
                        text: self.get('tip')
                    }
                },
                // change:function(e){
                //     var selected = $(e.currentTarget).data('selected');
                //     self.set('cod_tip',selected.id).set('tip', selected.text);
                // },
                required: true,
                idField:'cod_tip',
                txtField:'tip'
            }, {
                name: 'varianta',
                el: '#varianta',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/getvariante',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca'),
                            cod_tip: self.get('cod_tip')
                        };
                    },
                    renderDrop: function(e) {
                        return '<td>' + e.id + '</td><td>' + e.text + '</td>';
                    },
                    minLength: 0,
                    // cascadeTo: ['#versiune']
                    selected: {
                        id: self.get('cod_varianta'),
                        text: self.get('varianta')
                    }
                },
                // change:function(e){
                //     var selected = $(e.currentTarget).data('selected');
                //     self.set('cod_varianta',selected.id).set('varianta', selected.text);
                // },
                required: true,
                idField:'cod_varianta',
                txtField:'varianta'
            }, {
                name: 'versiune',
                el: '#versiune',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/getversiuni',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca'),
                            cod_tip: self.get('cod_tip'),
                            cod_varianta: self.get('cod_varianta')
                        };
                    },
                    renderDrop: function(e) {
                        return '<td>' + e.id + '</td><td>' + e.text + '</td>';
                    },
                    minLength: 1,
                    // cascadeTo: ['#denumire']
                    selected: {
                        id: self.get('cod_versiune'),
                        text: self.get('versiune')
                    }
                },
                change:function(e){
                    var selected = $(e.currentTarget).data('selected');
                    // self.set('cod_versiune', selected.id).set('versiune',selected.text);
                    $.post(app.dotUrl + '/nrom/checktvv', {
                        tip: self.get('tip'),
                        varianta: self.get('varianta'),
                        versiune: self.get('versiune'),
                        wvta: self.get('wvta')
                    }, function(response) {
                        if (response !== 0) {
                            w2confirm('Acest TVV exista in baza de date la acest WVTA!<br>Doriti sa continuati cu datele introduse?')
                                .yes(function() {
                                    $.get(app.dotUrl + '/nrom/getTvvExistent/' + response, null, function(tvv) {
                                        if(tvv.nr_registru){
                                            app.trigger('dosare:reloadTVV',tvv);
                                        }else{
                                            app.trigger('dosare:reloadTVV',tvv);
                                            //  self.set('id',tvv.id)
                                            //         .set('denumire_comerciala',tvv.denumire_comerciala)
                                            //         .set('nr_axe',tvv.nr_axe)
                                            //         .set('producator',tvv.producator);
                                        }
                                    });
                                })
                                .no(function() {
                                    self.unset('varianta').unset('cod_varianta').unset('versiune').unset('cod_versiune');
                                    $('#varianta').w2field().reinit();
                                    $('#varianta').w2field().reinit();
                                });
                        }
                    });
                },
                idField:'cod_versiune',
                txtField:'versiune',
                required: true
            }, {
                name: 'denumire_comerciala',
                el: '#denumire_comerciala',
                type: 'combo',
                options: {
                    url: app.dotUrl + '/nrom/gettipcom',
                    postData: function() {
                        return {
                            cod_cat: self.get('cod_categorie'),
                            cod_caros: self.get('cod_caroserie'),
                            cod_marca: self.get('cod_marca'),
                            cod_tip: self.get('cod_tip'),
                            cod_varianta: self.get('varianta'),
                            cod_versiune: self.get('versiune')
                        };
                    },
                    minLength: 1,
                    selected: {
                        id: self.get('denumire_comerciala'),
                        text: self.get('denumire_comerciala')
                    },
                    onChange:function(){
                        self.set('denumire_comerciala', e.item.id).set('denumire_comerciala',e.item.text);
                    }
                },
                required: true
            }, {
                name: 'nr_axe',
                el: '#nr_axe',
                type: 'int',
                options: {
                    min: 1,
                    max: 10
                }
            },
            /* {
                            name: 'antipoluare',
                            el: '#antipoluare',
                            type: 'list',
                            options: {
                                url: app.dotUrl + '/nrom/getPoluare',
                                minLength: 0
                            },
                            required: true,
                            selected: {
                                id: self.get('antipoluare'),
                                text: self.get('antipoluare')
                            }
                        }, */
           // {
           //     name: 'producator',
           //     el: '#producator',
           //     type: 'text',
                // options: {
                //     url: app.dotUrl + '/nrom/getProducatori',
                //     postData: function() {
                //         return {
                //             categorie: self.get('categorie')
                //         };
                //     },
                //     minLength: 1,
                //     selected: {
                //         id: self.get('producator'),
                //         text: self.get('producator')
                //     }
                // },
            //    required: true
           // }
            /* {
                            el: '#abs',
                            name: 'abs',
                            type: 'list',
                            options: {
                                items: [{
                                    id: 'DA',
                                    text: 'DA'
                                }, {
                                    id: 'NU',
                                    text: 'NU'
                                }]
                            },
                            selected: self.get('abs')
                        }, {
                            el: '#obd',
                            name: 'obd',
                            type: 'list',
                            options: {
                                items: [{
                                    id: 'DA',
                                    text: 'DA'
                                }, {
                                    id: 'NU',
                                    text: 'NU'
                                }]
                            },
                            selected: self.get('obd')
                        }*/
        ];
        self.bindEvents();
        return fields;

    }
});
