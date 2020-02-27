var ipc = requireNode('ipc');
var fs = requireNode('fs');
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
            'firstIndex': '#btnFirst',
            'lastIndex': '#btnLast',
            'nextIndex': '#btnNext',
            'prevIndex': '#btnPrev',
            'addFile': '#btnAddFile',
            'addMentiune': '#btnAddMentiune',
            'arhivare' : '#btnArhivare',
            'send' : '#btnSendVehicul',
            'fisa' : '#btnFisaVehicul',
            'unlock':'#btnUnlock'
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
            'click @ui.newwin': 'anulare',
            'click @ui.firstIndex': 'gotofirst',
            'click @ui.lastIndex': 'gotolast',
            'click @ui.nextIndex': 'gotonext',
            'click @ui.prevIndex': 'gotoprev',
            'click @ui.addFile': 'addFile',
            'click @ui.addMentiune': 'addMentiune',
            'click @ui.arhivare' : 'arhivare',
            'click @ui.send' : 'transmite',
            'click @ui.unlock' : 'unlock',
            'click @ui.fisa' : 'fisa'
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
            'input:not("#nr_registru"),textarea:not("#motiv_respingere")': {
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) && value != 1) || value == 19 || value == 12 || value == 15 || value == 11;
                    },
                    onSet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) && value != 1) || value == 19 || value == 12 || value == 15 || value == 11;
                    }
                }]
            },
            //disable copy button for new records
            '#btnCopyVehicul': {
                attributes: [{
                    name: 'disabled',
                    observe: '[id,stare]',
                    onGet: function (value,status) {
                        return !value && status < 10;
                    }
                }]
            },
            //disable info button for new records
            '#btnVehiculComplet': {
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4], 'appciv'
                        ]) || value <= 10) || value > 12 ;
                    }
                }]
            },
            '#btnArhivare,#btnFisaVehicul':{
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4], 'appciv'
                        ]) || value < 15);
                    }
                }]
            },
            '#nr_registru': {
                observe: 'nr_registru',
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value > 10;
                    }
                }],
                onSet:function(val){
                    return val.toUpperCase();
                }
            },
            '#motiv_respingere': {
                observe: 'motiv_respingere',
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value > 10;
                    }
                }]
            },
            '.mentiuni': {
                attributes: [{
                    name: 'disabled',
                    observe: 'id',
                    onGet: function (value) {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]);
                    }
                }]
            },
            '#btnAddMentiune,#btnVehiculComplet,#btnArhivare,#btnNewWindow,#btnUnlock': {
                visible: function () {
                    return !ipc.sendSync('user:request:isuserinrole', [
                        [4,18], 'appciv'
                    ]);
                }
            },
            '#btnVehiculComplet,#btnArhivare':{
                visible: function () {
                    return !ipc.sendSync('user:request:isuserinrole', [
                        [4], 'appciv'
                    ]);
                }
            },
            '#btnNewWindow,#btnUnlock':{
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value >= 15) ;
                    }
                }]
            },
            '#btnSendVehicul':{
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (!ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]) || value != 1) ;
                    }
                }]
            },
            '#btnAddFile': {
                observe: 'stare',
                visible: function (value) {
                    return value == 1 || (value == 10 && !ipc.sendSync('user:request:isuserinrole', [
                        [4,18], 'appciv'
                    ]));
                }
            },
            '#btnSaveVehicul,#btnCopyVehicul': {
                attributes: [{
                    name: 'disabled',
                    observe: 'stare',
                    onGet: function (value) {
                        return (value > 10 && ipc.sendSync('user:request:isuserinrole', [
                            [15, 1], 'appciv'
                        ])) || (value >= 10 && ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]));
                    },
                    onSet: function (value) {
                        return (value > 10 && ipc.sendSync('user:request:isuserinrole', [
                            [15, 1], 'appciv'
                        ])) || (value >= 10 && ipc.sendSync('user:request:isuserinrole', [
                            [4,18], 'appciv'
                        ]));
                    }
                }]
            },

        },

        // <Constants>
        template: require('./../../templates/individuale/vehicul.html'),
        initialize: function () {
            var self = this;
            this.setPermissions();
            //property - holds window state(inline or dialog)
            this.isDialog = false;
            root = app.baseUrl;
            //cache module controller for convenience
            vehicul = app.module('appciv').controller;
            //set view type
            this.setViewType();
        },
        setPermissions: function () {
            this.isOperator = ipc.sendSync('user:request:isuserinrole', [[18], 'appciv']);
        },
        /**
         * set view type -is copy or fresh record
         */
        setViewType: function () {
            var isCopy = this.model.get('isCopy');
            if (!this.model.id) {
                if (!isCopy) {
                    this.isNew = true;
                }
            }
        },
        onRender: function(){
            this.$el.find('.w2ui-panel-title').click(function() {
                $(this).next().toggle('fast');
                return false;
            }).next().hide('fast');
        },
        /**
         * on view attachet to DOM
         * @return {[type]} [description]
         */
        onShow: function () {
            //atriutele si mentiunile se vor afisa la schimbarea/alegerea extensiei in cazul
            //vehiculului nou
            var pstyle = 'border: 1px solid #dfdfdf; padding: 10px;';
            //build layout
            if (!w2ui.hasOwnProperty('layoutVehicul')) {
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
                            title: 'Fisiere atasate',
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
            if (!this.model.isNew()) {
                this.renderfiles();
                this.renderMentiuni();
            }

            // if(this.model.get('nr_registru')){
            //     $('#btnAddFile,#btnAddMentiune').hide();
            //     $('input,textarea').attr('disabled','disabled');
            // }

            if (this.model.id) {
                console.log(this.options);
                this.relatedVehicles = this.options.relatedVehicles;
                this.prepareFormNavigation();
            }
            if(this.isOperator){
                $('#supervize_container').hide();
            }
        },

        /**
         * Prepare prev next navigation
         **/
        prepareFormNavigation: function () {
            this.currentIndex = this.relatedVehicles.indexOf(this.model.id) + 1;
            $('#currentIndex').val(this.currentIndex);
        },

        /**
         * go to previous page
         * if this is dialog then we close it
         * @return {[type]} [description]
         */
        back: function () {
            var self = this;
            if (this.isDialog) {
                _.find(w2ui.panels, function (p) {
                    return p.name === 'editVeh' + self.cid;
                }).destroy();

            }else if(self.isOperator){
                app.module('appciv').router.navigate('appciv/listaOperator', {
                    trigger: true
                });
            } else {
                app.module('appciv').router.navigate('appciv/listCIVIndividual', {
                    trigger: true
                });
            }
        },

        renderfiles: function () {
            var options = {
                element: '#date_tehnice_container',
                editable: !this.model.get('nr_registru'),
                id_vehicul: this.model.get('id')
            };
            vehicul.renderFiles(options);
        },

        renderMentiuni: function () {
            var options = {
                element: '#mentiuni_container',
                mentiuni: this.model.get('Mentiuni'),
                vin: this.model.get('vin'),
                editable: !this.model.get('nr_registru'),
            };
            vehicul.renderMentiuni(options);
        },

        /**
         * validate vin property - only alfanumeric
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        validatenewvin: function (e) {
            var errors = {};
            var data = [];
            errors.data = data;
            var real_vin = this.model.get('vin');
            if (!real_vin) {
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
        save: function () {
            var self = this;
            var options = {
                success: function (model) {
                    w2utils.unlock(self.$el);
                    var opt = {
                        text: 'Inregistrarea a fost salvata!',
                        title: 'Notificare',
                        type: 'success-template'
                    };
                    ipc.send('app:notification:show', opt);
                    if (self.model.get('isCopy')) {
                        app.router.navigate('appciv/detaliiVehiculIndividuale/' + model.id);
                        self.model.set('isCopy', false);
                    }

                    self.enableCopy();
                    self.renderfiles();
                },
                error: function (model, response) {
                    w2utils.unlock(self.$el);
                    // we get the errors as a string. This was implemented so that we can show
                    // both errors comming from server and from client. We modded the validate
                    // function of the model so that it returns a JSON string containing an element named errors
                    // from server we get the same result
                    if (response.status !== 401) {
                        var opt = {
                            text: 'Eroare la salvare!',
                            title: 'Notificare',
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
                w2utils.lock(self.$el,'Va rugam asteptati...');
                self.model.save({}, options);
                //console.log(self.model.toJSON());
            }
        },
        copy: function () {
            //this._modelBinder.unbind();

            // var Prototype = app.module('vehicul').VehiculModel;
            // var newmodel = this.model; //new Prototype(this.model.toJSON());
            $('#culoare').w2field().reinit();
            this.model.set('EntityState', 0).set('vin', '')
                .set('isCopy', true)
                .set('serie_motor', '')
                .set('culoare', '')
                .unset('id');
            this.isCopy = true;
            this.disableCopy();
            this.$el.find('#date_tehnice_container').empty();
            // app.router.navigate('#/appciv/copyVehicul/' + this.model.get('id'), {
            //     trigger: false
            // });

        },
        fisa: function(){
            var self = this;
            var path = app.baseUrl + 'civfiles/GetRaportVehicul?id=' + this.model.get('id');
            if(this.model.get('nr_factura')){
                ipc.send('app:request:pdf', [path]);
            }else{
                var template = '<div class="w2ui-page page-0 modalContent" id="platafact_container">'+
                                    '<h3 style="text-align:center">Alegeti factura cu care s-a achitat C.I.V.</h3>'+
                                    '<div class="w2ui-field">'+
                                        '<label>Numar factura</label>'+
                                        '<div>'+
                                            '<input type="text" id="nrfact" size="60" />'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                this.plata = $(template).w2panel({
                    name: 'platafact',
                    title: 'Date factura',
                    width: '600px',
                    showMin: false,
                    modal:true,
                    showMax: false,
                    height: '250px',
                    resizable: true,
                    useraction:function(){
                        self.model.set('nr_factura',$('#nrfact').data('selected').text);
                        $.post(app.baseUrl + 'individuale/savefacturavehicul',{id_vehicul:self.model.get('id'),id_factura:$('#nrfact').data('selected').id},function(){
                            w2panel.destroy();
                        });
                    },
                    buttons:'<button class="btn btn-blue" onclick="w2panel.useraction();">OK</button> '+
                            '<button class="btn btn-red cancel" onclick="w2panel.close();">Cancel</button>',
                    onOpen: function(event) {
                        event.onComplete = function(){
                            $('#platafact_container').find('#nrfact').w2field('list',{
                                url:app.baseUrl+'individuale/getfacturiindividuale',
                                minLength:-1,
                                match:'contains',
                                renderDrop: function(e) {
                                    console.log(e);
                                    return '<td>' + e.text + '</td><td style="padding-left:3px">' + e.benef + '</td><td style="padding-left:3px"> '+e.ramase+'</td>';
                                },
                            });
                        };
                    },
                    onClose: function(event) {
                       event.onComplete = function(){ipc.send('app:request:pdf', [path]);};
                    }
                });
            }
        },
        info: function () {
            var civnou = localStorage.getItem('civnou') && localStorage.getItem('civnou')=='true';
            var tipciv = civnou?'N':'V';
            var x = 0;
            var y = 0;
            try {
                var configPrinter = JSON.parse(fs.readFileSync('configPrinters.json'));
                var active = _.findWhere(configPrinter, {
                    default: true
                });
                x = active.x;
                y = -active.y;
            } catch (ex) {

            }
            var self = this;
            var id = self.model.id;
            var reprez = ipc.sendSync('user:request:reprezentanta');
            var path = civnou? app.civUrl +this.model.get('vin')+'?org=dot&reprez='+reprez + '&x=' + x + '&y=' + y:app.baseUrl + 'individuale/GetTiparCIVComanda?id=' + this.model.get('id_comanda') + '&x=' + x + '&y=' + y + '&vin=' + self.model.get('vin');
            //civ nou http://10.2.2.84/restservice/api/printciv/1234?org=dot
            ipc.send('app:request:pdf', [path, function (win) {
                win.on('closed', function () {
                    w2confirm({
                        msg: 'Finalizati tiparirea CIV?',
                        opt: false,
                        opt_text: 'Verificat!',
                        no_class: 'btn-red',
                        yes_class: 'btn-blue',
                        opt_class: 'btn-orange'
                    }).yes(function () {
                        $.post(app.baseUrl + 'individuale/finalizeCIV/' + id+'?tipciv='+tipciv, {}, function (stare) {
                            self.model.set('stare',stare);
                        });
                        win.close(true);
                    }).no(function () {
                        win.close(true);
                    }).opt(function () {
                        $.post(app.baseUrl + 'individuale/verificatCIV/' + id, {}, function () {
                            // w2ui.gridCereri.set(id[0], {
                            //     depusa: 18
                            // });
                        });
                        win.close(true);
                    });
                });
            }]);
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
        disableCopy: function () {
            $('#btnCopyVehicul').attr('disabled', true);
            $('#btnVehiculComplet').attr('disabled', true);
            $('#btnArhivare').attr('disabled', true);
        },
        enableCopy: function () {
            $('#btnCopyVehicul').attr('disabled', null);
            // $('#btnVehiculComplet').attr('disabled', null);
            // $('#btnArhivare').attr('disabled', null);
        },
        onBeforeDestroy: function () {
            w2ui.layoutVehicul.destroy();
            if (this.win) {
                this.win.destroy();
            }
        },

        

        newwin: function () {
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
            self.win.on('close', function (event) {
                event.onComplete = function () {
                    w2ui.layoutVehicul.resize();
                    self.isDialog = false;
                    $('#btnNewWindow').show();
                    self.win = null;
                };
            });
        },

        gotofirst: function () {
            var id = this.relatedVehicles[0];
            app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
        },

        gotolast: function () {
            var id = this.relatedVehicles[this.relatedVehicles.length - 1];
            app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
        },
        gotonext: function () {
            if (this.currentIndex < this.relatedVehicles.length) {
                var id = this.relatedVehicles[this.currentIndex];
                app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
            }
        },
        gotoprev: function () {
            if (this.currentIndex > 1) {
                var id = this.relatedVehicles[this.currentIndex - 2];
                app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
            }
        },

        addFile: function () {
            app.trigger('vehicul:add:file', {
                id_vehicul: this.model.id
            });
        },

        addMentiune: function () {
            app.trigger('vehicul:add:mentiune', {
                id_vehicul: this.model.id,
                vin:this.model.get('vin')
            });
        },
        anulare: function () {
            var that = this;
             w2confirm('Doriti anularea acestei inregistrari?').yes(function(){
                that.model.set('stare', 1).set('nr_registru','');
                that.save();
                app.trigger('vehicul:set:editable');
             });
        },
        unlock:function(){
            var self = this;
            w2confirm('Doriti deblocarea acestei inregistrari?').yes(function(){
                 self.model.set('stare', 10).set('nr_registru','');
                 self.save();
                 app.trigger('vehicul:set:editable');
            });
        },
        arhivare : function(){
            vehicul.arhivareCIVIndividuale(this.model.get('id_comanda'),this.model.get('vin'));
        },
        transmite: function(){
            this.model.set('stare', 10);
            this.save();
        }

    });
module.exports = EditView;