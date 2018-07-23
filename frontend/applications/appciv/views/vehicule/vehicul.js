var ipc = requireNode('ipc');
var Globals = require('./../../globals');
var root, vehicul,
    EditView = window.Marionette.FormView.extend({
        className: 'page',
        /**
         * view related properties
         * @type {Object}
         */
        ui: {
            'save': '#btnSaveVehicul',
            'copy': '#btnCopyVehicul',
            'info': '#btnVehiculComplet',
            'back': '#btnBack',
            'newwin': '#btnNewWindow',
            'firstIndex':'#btnFirst',
            'lastIndex':'#btnLast',
            'nextIndex':'#btnNext',
            'prevIndex':'#btnPrev',
        },
        /**
         * ui event handlers
         * @type {Object}
         */
        events: {
            'click @ui.save': 'save',
            'click @ui.copy': 'copy',
            'click @ui.back': 'back',
            'click @ui.info': 'info',
            'click @ui.newwin': 'newwin',
            'click @ui.firstIndex': 'gotofirst',
            'click @ui.lastIndex': 'gotolast',
            'click @ui.nextIndex': 'gotonext',
            'click @ui.prevIndex': 'gotoprev'
        },
        /**
         * model event handlers
         * @type {Object}
         */
        modelEvents: {
            // 'change': 'modelChanged',
            //'change:vin': 'validatenewvin',
            //'change:id_tvv': 'resetVehicul',
            // 'change:id_extensie': 'reloadDate',
            // 'change:cnot': 'setnr'
        },
        /**
         * model link to controls
         * @type {Object}
         */
        bindingsOverrides: {
            //set motor values from data.selected of control
            '#motor': {
                observe: ['motor'],
                onGet: function(value) {
                    return value;
                },
                onSet: function(value) {
                    var newval = $('#motor').data('selected');
                    return newval.id;
                }
            },
            //disable copy button for new records
            '#btnCopyVehicul': {
                attributes: [{
                    name: 'disabled',
                    observe: 'id',
                    onGet: function(value) {
                        return !value;
                    }
                }]
            },
            //disable info button for new records
            '#btnVehiculComplet': {
                attributes: [{
                    name: 'disabled',
                    observe: 'id',
                    onGet: function(value) {
                        return !value;
                    }
                }]
            },
            //hide engine for O and R categories
            '#engine_container': {
                attributes: [{
                    name: 'hidden',
                    observe: 'categ_euro',
                    onGet: function(value) {
                        if (value)
                            return (value.substr(0, 1) === 'O' || value.substr(0, 1) === 'R');
                        return value;
                    }
                }]
            },
            '#wvta':{
                observe:'wvta',
                onGet:function(value){
                    return value;
                },
                onSet:function(value){
                    this.resetVehicul();
                    var selected = $('#wvta').data('selected');
                    return selected.text;
                }
            },
            '#versiune':{
                observe:'versiune',
                onGet:function(value){
                    return value;
                },
                onSet:function(value){
                    this.reloadDate();
                    var selected = $('#versiune').data('selected');
                    return selected.id;
                }
            },
            '#categ_euro':'categ_euro'
            /*,
            '#vin':{
                observe:'vin',
                onGet:function(value){
                    return value;
                },
                onSet:function(value){
                    this.validatenewvin();
                    return value;

                }
            }*/
        },

        // <Constants>
        template: require('./../../templates/vehicule/vehicul.hts'),
        initialize: function() {

            var self = this;
            //property - holds window state(inline or dialog)
            this.isDialog = false;
            _.bindAll(this, 'renderanvelope');
            root = app.baseUrl;
            //cache module controller for convenience
            vehicul = app.module('appciv').controller;
            //set view type
            this.setViewType();
            // window.isDirty.watch('dirty',function(prop,oldval,newval){
            //     // self.toggleValidateButton(newval);
            //     self.disableCopy();
            // });
                        //disable copy button if one of child properies has change
            // this.listenTo(app.module('appciv'), 'attachedProp:changed', function(){window.isDirty.dirty=true;});
            // this.listenTo(this.model,'change',function(){window.isDirty.dirty=true;});
        },
        /**
         * set view type -is copy or fresh record
         */
        setViewType: function() {
            var isCopy = this.model.get('isCopy');
            if (!this.model.id) {
                if (!isCopy) {
                    this.isNew = true;
                }
            }
        },
        /**
         * on view attachet to DOM
         * @return {[type]} [description]
         */
        onShow: function() {
            //  if(w2ui.panels && w2ui.panels.length>0){
            //     w2panel.destroy();
            // }
            //atriutele si mentiunile se vor afisa la schimbarea/alegerea extensiei in cazul
            //vehiculului nou
            var pstyle = 'border: 1px solid #dfdfdf; padding: 10px;';
            //build layout
            $('#categorie').hide();
            if(!w2ui.hasOwnProperty('layoutVehicul')){
                $('#vehiculTemplate').w2layout({
                    name: 'layoutVehicul',
                    panels: [{
                            type: 'left',
                            size: '50%',
                            style: pstyle,
                            title: 'Date principale',
                            resizable: true,
                            content: $('#date_principale').html()
                        }, {
                            type: 'main',
                            size: '50%',
                            title: 'Date tehnice',
                            style: pstyle,
                            content: $('#date_tehnice').html()
                        }, {
                            type: 'bottom',
                            size: 60,
                            style: pstyle,
                            content: $('#buttons_container').html()
                        }

                    ]
                });
            }
            //set dropdowns for controls that suport it
            this.setupView();
            //if record is in update state we enable buttons and render child records and "mentiuni" property
            if (!this.isNew) {
                this.renderatributes();
                vehicul.loadListeAnvelope(this.model, this.renderanvelope);
                this.rendermentiuni();
                // this.enableCopy();
            }

            if(this.model.id){
                console.log(this.options);
                this.relatedVehicles = this.options.relatedVehicles;
                this.prepareFormNavigation();
            }

            //link model properties to controls
            // this.stickit();


        },

        /**
        * Prepare prev next navigation
        **/
        prepareFormNavigation:function(){
            this.currentIndex = this.relatedVehicles.indexOf(this.model.id) +1;
            $('#currentIndex').val(this.currentIndex);
        },

        /**
         * go to previous page
         * if this is dialog then we close it
         * @return {[type]} [description]
         */
        back: function() {
            var self = this;
            if (this.isDialog) {
                _.find(w2ui.panels, function(p) {
                    return p.name === 'editVeh' + self.cid;
                }).destroy();

            } else {
                app.module('appciv').router.navigate('appciv/cereri', {
                    trigger: true
                });
            }
        },
        //reset properties if sensible data is changed(nr_registru or extensie)
        //TODO: refactor - is too complex and hard to mantain
        resetVehicul: function() {
            var self = this;
            console.log(self.model.get('id_tvv'));
            // if is copy we need to refresh only color and serie_motor - all others remains the same
            self.model.set('nr_registru','');
            if (!self.iscopy) {
                if (!self.isNew) {
                    //not new - we nees to reset child collections
                    self.model.get('Atribute').reset();
                    self.model.get('Anvelope').reset();
                    //try to reset the anvelope dropdown sources
                    try {
                        Globals.anvelopefata.reset();
                        Globals.anvelopespate.reset();
                    } catch (e) {
                        console.error(e);
                    }
                }
                // reset an fabricatie
                self.model.set('an_fabr', '');
                //get new wvta,categ euro and cnot and set them to model

                // self.model.set('motor', '');
            }
            //reset serie motor and culoare
            // self.model.set('serie_motor', '');
            // self.model.set('culoare', '');
            // reinitialize extensie dropdown
            //$('#extensie').w2field().reinit();
        },
        /**
         * reload child related data
         * @return {[type]} [description]
         */
        reloadDate: function() {
            var self = this;
            // we need this params to reload some data from server
            var params = {
                id_tvv: this.model.get('id_tvv'),
                id_extensie: this.model.get('id_extensie'),
                id: this.model.id && this.model.id !== 0 ? this.model.id : 0
            };
            // check if nr registru and extensie are set
            if (params.id_tvv && params.id_extensie) {
                // if not is copy we need to refresh motor dropdown
                if (!self.iscopy) {
                    $.ajax({
                    url: root + 'vehicule/getwvta',
                    data: {
                        id_tvv: self.model.get('id_tvv')
                    },
                    success: function(response) {
                        self.model.set('categ_euro', response.categ_euro);
                        if (response.categ_euro.substr(0, 1) !== 'O' && response.categ_euro.substr(0, 1) !== 'R') {
                                // $('#serie_motor').attr('disabled', null);
                                // $('#motor').attr('disabled', null);
                                $('#engine_container').show();
                                $('#motor').w2field().reinit();
                                self.model.set('serie_motor', '').set('motor', '');
                                if(response.categ_euro.split('|').length > 1){
                                    $('#categ_euro').w2field('list',{
                                        items:response.categ_euro.split('|')
                                    });
                                    $('#categorie').show();
                                }else{
                                    $('#categorie').hide();
                                }
                            } else {
                                console.log("Remorca!!");
                                // $('#serie_motor').attr('disabled', true);
                                // $('#motor').attr('disabled', true);
                                $('#engine_container').hide();
                            }
                        }
                    });

                }
                //reload date tehnice
                self.model.get('Atribute').reset();
                $.ajax({
                    url: root + 'vehicule/getatributevehicul',
                    data: params,
                    dataType: 'json',
                    type: 'GET',
                    success: function(response) {
                        if(response.error !==''){
                            w2alert(response.error);
                        }
                        app.trigger('wltp:changed',response.iswltp == 1);
                        self.model.get('Atribute').reset(response.atribute);
                        if (self.isNew) {
                            self.renderatributes(response.iswltp);
                        }
                        self.model.set('nr_registru',response.nr_registru);
                        self.model.set('mentiuni', response.mentiuni);
                        
                        self.rendermentiuni();
                    },
                    error: function(response) {
                        console.error(response);
                    }
                });
                //reload anvelope
                self.model.get('Anvelope').reset();
                $.ajax({
                    url: root + 'vehicule/getanvelopevehicul',
                    data: params,
                    dataType: 'json',
                    type: 'GET',
                    success: function(response) {
                        vehicul.loadListeAnvelope(self.model, function() {
                            self.model.get('Anvelope').reset(response);
                            if (self.isNew) {
                                self.renderanvelope();
                            } else {
                               app.module('appciv').trigger('anvelopeView:setSelect');
                            }
                            // self.renderanvelope();
                        });
                    },
                    error: function(response) {
                        console.error(response);
                    }
                });
            }
        },

        rendermentiuni: function() {
          for (var x = 0; x < 10; x += 1) {
              $('#ment' + (x + 1)).val('');
          }
            if(this.model.get('mentiuni')){
                var mentiuni = this.model.get('mentiuni').split('\n');
                $('.mentiuni').find('input').val('');
                for (var i = 0; i < mentiuni.length; i += 1) {
                    $('#ment' + (i + 1)).val(mentiuni[i]);
                }
            }
        },
        renderatributes: function(param) {
            var options = {
                element: '#date_tehnice_container',
                atributes: this.model.get('Atribute'),
                iswltp:param
            };
            vehicul.renderAtributes(options);
        },
        renderanvelope: function() {
            var self = this;
            var options = {
                element: '#anvelope_container',
                anvelope: self.model.get('Anvelope')
            };
            vehicul.renderAnvelope(options);
        },
        setnr: function() {
            var self = this;
            // $.ajax({
            //     url: root + 'appciv/comenzi/getnrombycnot',
            //     type: 'GET',
            //     data: {
            //         'cnot': this.model.get('cnot')
            //     },
            //     success: function(response) {
            //         //$('#nr_registru').data('selected', response).trigger('change');
            //         self.model.set('nr_registru', response.text);
            //     }
            // });
        },

        /**
         * validate vin property - only alfanumeric
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        validatenewvin: function(e) {
            var errors = {};
            var data = [];
            errors.data = data;
            var real_vin = this.model.get('vin');
            if(!real_vin){
                 data.push({
                        name: 'vin',
                        message: 'Camp obligatoriu!'
                    });
                    //app.Util.showError({}, errors);
                    w2utils.validateRaw(this.$el, data);
                    return false;
            }
            var vin = real_vin.toUpperCase();
            var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
            //var wild = /^$/;

            if (vin !== undefined && vin.length > 0) {
                if (regex.test(vin) && vin.length === 17) {
                    //app.Util.removeError($('#vin').parent());
                    this.model.set('vin', vin);
                    return true;
                    //}else if(wild.test(vin)){

                } else {
                    data.push({
                        name: 'vin',
                        message: 'Valoare incorecta!'
                    });
                    //app.Util.showError({}, errors);
                    w2utils.validateRaw(this.$el, data);
                    return false;
                }
            } else {
                data.push({
                    name: 'vin',
                    message: 'Camp obligatoriu!'
                });
                //app.Util.showError({}, errors);
                w2utils.validateRaw(this.$el, data);
                return false;
            }
        },
        save: function() {
            var self = this;
            var options = {
                success: function(model) {
                    var opt = {
                        text: 'Inregistrarea a fost salvata!',
                        title:'Notificare',
                        type: 'success-template'
                    };
                    ipc.send('app:notification:show', opt);
                    if (self.model.get('isCopy')) {
                        app.router.navigate('appciv/detaliiVehicul/' + model.id);
                        self.model.set('isCopy', false);
                    }

                    self.enableCopy();
                },
                error: function(model, response) {
                    // we get the errors as a string. This was implemented so that we can show
                    // both errors comming from server and from client. We modded the validate
                    // function of the model so that it returns a JSON string containing an element named errors
                    // from server we get the same result
                    if (response.status !== 401) {
                        var opt = {
                            text: 'Eroare la salvare!',
                            title:'Notificare',
                            type: 'error-template'
                        };
                        ipc.send('app:notification:show', opt);
                        var data = eval('(' + response.responseText + ')');
                        //console.log(data);
                        w2utils.validateRaw(self.$el, data.data);
                    }
                }
            };
            if (self.validatenewvin() && w2utils.validate(self.model, self.$el)) {
                self.model.save({}, options);
            }
        },
        copy: function() {
            //this._modelBinder.unbind();

            // var Prototype = app.module('vehicul').VehiculModel;
            // var newmodel = this.model; //new Prototype(this.model.toJSON());
            $('#culoare').w2field().reinit();
            this.model.set('EntityState', 0).set('vin', '')
                .set('isCopy', true)
                .set('serie_motor', '')
                .set('culoare','')
                .unset('id');
            this.model.get('Atribute').each(function(model) {
                model.set('EntityState', 0).unset('id').unset('id_vehicul');
            });
            this.model.get('Anvelope').each(function(model) {
                model.set('EntityState', 0).unset('id').unset('id_vehicul');
            });
            this.isCopy = true;
            this.disableCopy();
            // app.router.navigate('#/appciv/copyVehicul/' + this.model.get('id'), {
            //     trigger: false
            // });

        },
        info: function() {
            var self = this;
            ipc.send('app:request:pdf', root + 'civfiles/GetVehiculComplet?id=' + self.model.id);
        },
        // modelChanged: function(e) {
        //     this.listenToOnce(this.model,'change',this.modelChanged);
        //     var self = this;
        //     self.disableCopy();
        //     $.each(e.changedAttributes(), function(i, value) {
        //         if (i !== 'vin') {
        //             if(i==='id_tvv'){
        //                 console.log('tvv changed');
        //             }else if(i==='id_extensie'){
        //                 console.log('extensie changed');
        //             }
        //             //app.Util.removeError($('#' + i).parent());
        //         }
        //     });
        // },
        disableCopy: function() {
            $('#btnCopyVehicul').attr('disabled', true);
            $('#btnVehiculComplet').attr('disabled', true);
        },
        enableCopy: function() {
            $('#btnCopyVehicul').attr('disabled', null);
            $('#btnVehiculComplet').attr('disabled', null);
        },
        onBeforeDestroy: function() {
            w2ui.layoutVehicul.destroy();
            if (this.win) {
                this.win.destroy();
            }
        },

        newwin: function() {
            var self = this;
            $('#btnNewWindow').hide();
            this.isDialog = true;
            self.win = $(this.el).w2panel({
                name: 'editVeh' + this.cid,
                showMax: true,
                showMin: true,
                preserveContent: true,
                width: 800,
                height: 600,
                resizable: true,
                maximized: true
            });
            w2ui.layoutVehicul.resize();
            self.win.on('close', function(event) {
                event.onComplete = function() {
                    w2ui.layoutVehicul.resize();
                    self.isDialog = false;
                    $('#btnNewWindow').show();
                    self.win = null;
                };
            });
        },

        gotofirst:function(){
            var id = this.relatedVehicles[0];
            app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
        },

        gotolast:function(){
            var id = this.relatedVehicles[this.relatedVehicles.length-1];
            app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
        },
        gotonext:function(){
            if(this.currentIndex < this.relatedVehicles.length){
                var id = this.relatedVehicles[this.currentIndex];
                app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
            }
        },
        gotoprev:function(){
            if(this.currentIndex > 1){
                var id = this.relatedVehicles[this.currentIndex-2];
                app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
            }
        },

    });
module.exports = EditView;
