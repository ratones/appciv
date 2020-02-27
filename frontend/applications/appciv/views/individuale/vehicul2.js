var ipc = requireNode('ipc');
var fs = requireNode('fs');
var Globals = require('../../globals');
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
            'unlock':'#btnUnlock',
            'updDateSupl': '#btnUpdateDateSupl',
            'versiuneField':'#versiune'
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
            'click @ui.fisa' : 'fisa',
            'click @ui.updDateSupl': 'updateDateSupl',
            'blur @ui.versiuneField':'prepareData'
        },
        /**
         * model event handlers
         * @type {Object}
         */
        modelEvents: {
            'change:wvta':'validateWVTA',
            'change:extensie':'extensieChanged',
            'change:versiune':'selectData',
            'change:cod_motor':'motorChanged',
            'change:id_tvv':'reload'
        },
        /**
         * model link to controls
         * @type {Object}
         */
        bindingsOverrides: {
            'input:not("#nr_registru,.date-suplim"),textarea:not("#motiv_respingere")': {
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
            '#btnUpdateDateSupl': {
                observe: 'stare',
                visible: function (value) {
                    return value == 15 &&  !ipc.sendSync('user:request:isuserinrole', [
                        [4,18], 'appciv'
                    ]);
                }
            },
        },

        // <Constants>
        template: require('./../../templates/individuale/vehicul2.hbs'),
        initialize: function () {
            var self = this;
            _.bindAll(this, 'renderanvelope');
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
            this.isClient = ipc.sendSync('user:request:isuserinrole', [[4], 'appciv']);
            this.isAdmin = ipc.sendSync('user:request:isuserinrole', [[1], 'appciv']);
        },
        /**
         * set view type -is copy or fresh record
         */
        setViewType: function () {
            var isCopy = false//this.model.get('isCopy');
            if (!this.model.id) {
                if (!isCopy) {
                    this.isNew = true;
                }
            }
        },
        onRender: function(){
            
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
            // cache original mentiuni
            this.existing = this.model.get('Mentiuni').toJSON()
            //if record is in update state we enable buttons and render child records and "mentiuni" property
            if (!this.model.isNew()) {
                this.renderfiles();
                this.renderMentiuni();
                if(!this.isClient){
                    this.renderatributes();
                    vehicul.loadListeAnvelope(this.model, this.renderanvelope);
                }
                // this.renderanvelope();
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
            this.$el.find('.w2ui-panel-title').click(function() {
                $(this).next().toggle('fast');
                return false;
            })//.next().hide('fast');
            
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
                element: '#files_list_container',
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
                console.log(self.model.toJSON());
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
        },
        validateWVTA:function(m){
            // if(!this.model.get('id_wvta'))
            //   return true;
            var regex = /([a-z][0-9]{1,2}\*[0-9A-Z]*\/*[0-9]*\*[0-9]{4,5})$/;
      
             var match = regex.exec(m.get('wvta'));
             if(!match){
               $('#wvta').w2tag('Valoare incorecta!',{
                     'class': 'w2ui-error'
                 });
                 $('.save-dosar').attr('disabled',true);
                 return false;
             }else{
               $('#wvta').w2tag().removeClass('w2ui-error');
               $('.save-dosar').attr('disabled',null);
               var selected = $('#wvta').data('selected')
               this.model.set('id_wvta',selected.id)
               this.reset()
               return true;
             }
        },
        extensieChanged:function(d){
            var selected = $('#extensie').data('selected')
            this.model.set('id_extensie',selected.id)
            $('#tip').w2field().reinit()
            //this.reset()
        },
        motorChanged:function(){
            var selected = $('#cod_motor').data('selected')
            this.model.set('motor',selected.id)
        },
        prepareData:function(v){
            var self = this
            var selected = $('#versiune').data('selected')
            this.model.set('id_tvv',selected.id)
            if(!this.model.get('id_tvv') && (this.model.get('versiune') != selected.text)){
                w2confirm('Nu exista Nr. Omologare Parinte pentru acest TVV! Adaugati cerere generare?')
                .yes(function(){
                    self.postCerereParinte.apply(self,arguments)
                })
                .no(function(){
                    w2alert('Pentru a genera numar parinte va trebui sa reintroduceti datele!')
                })
            }
        },

        selectData:function(){
            var selected = $('#versiune').data('selected')
            this.model.set('id_tvv',selected.id)
            // this.renderAnvelope()
            // this.renderAtributes()
            // this.renderMentiuni()
        },

        postCerereParinte:function(){
            var self = this
            $.ajax({
                type:'POST',
                url: root + 'individuale/createCerereParinte',
                data: self.model.toJSON(),
                success: function(response) {
                    w2alert('Cererea a fost generata cu datele introduse! Dupa generarea numarului parinte va trebui sa completati vehiculul cu datele necesare!')
                },
                error:function(){
                    
                }
            })
        },

        reload:function(){
            console.log('reload')
            var self = this;
            var params = {
                id_tvv: this.model.get('id_tvv'),
                id_extensie: this.model.get('id_extensie'),
                id: this.model.id && this.model.id !== 0 ? this.model.id : 0
            };

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
                            $('#cod_motor').w2field().reinit();
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
            
                self.model.get('Atribute').reset();
                $.ajax({
                    url: root + 'individuale/getatributevehicul',
                    data: params,
                    dataType: 'json',
                    type: 'GET',
                    success: function(response) {
                        if(response.error !==''){
                            w2alert(response.error);
                        }
                        if(response.atribute.length == 0){
                            $('#date_tehnice_container').hide()
                            self.model.get('Atribute').reset();
                            return;
                        }else{
                            $('#date_tehnice_container').show()
                        }
                        app.trigger('wltp:changed',response.iswltp == 1);
                        self.model.get('Atribute').reset(response.atribute);
                        if (self.isNew) {
                            self.renderatributes(response.iswltp);
                        }
                        self.model.set('nr_registru',response.nr_registru);
                        // self.model.get('Mentiuni').reset(response.mentiuni);
                        var added = [];
                        
                        response.mentiuni.split('\n').map(function(m,i){
                            added.push({
                                id:null,
                                text:m,
                                id_vehicul:self.model.id,
                                nr_rand:i,
                                nr_identif:self.model.get('vin')
                            })
                        });
                        var currindex = added.length;
                        self.existing.map(function(m){
                            m.nr_rand = currindex;
                            currindex ++;
                        })
                        var ment = added.concat(self.existing)
                        self.model.get('Mentiuni').reset(ment);
                        self.renderMentiuni();
                    },
                    error: function(response) {
                        console.error(response);
                    }
                });
                //reload anvelope
                self.model.get('Anvelope').reset();
                $.ajax({
                    url: root + 'individuale/getanvelopevehicul',
                    data: params,
                    dataType: 'json',
                    type: 'GET',
                    success: function(response) {
                        if(response.length == 0){
                            $('#anvelope_container').hide()
                            self.model.get('Anvelope').reset();
                            return;
                        }else{
                            $('#anvelope_container').show()
                        }
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
         },
        
        updateDateSupl: function() {
            var self = this;
            console.log(self.model)
        },

        reset:function(){
            var self = this;
            var props = ['an_fabr','motor','cod_motor','Atribute','Anvelope','nr_registru','putere_kw','cilindree','serie_motor'];
            props.map(function(prop){
                self.model.unset(prop)
            })
        }


    });
module.exports = EditView;