var ipc = requireNode('ipc');
var Globals = require('./../../globals');
var ModelDef = require('./../../models/registru/tvvsextensie');
//var DOIITDef = require('./../../models/vehiculIndividuale')
module.exports = Marionette.LayoutView.extend({
    template: require('./../../templates/registru/tvvform.hbs'),
    attributes: function () {
        return {
            style: 'height:100%'
        }
    },
    initialize: function (options) {
        var self = this;
        this.tip_omol = options.tip_omol;
        this.model = new ModelDef();
        this.listenTo(app, 'globals:copy', this.enablePaste.bind(this))
        this.listenTo(app, 'dosare:resetTVV', this.setModelNew);
        this.listenTo(app, 'dosare:reloadTVV', this.reloadTVV);
        if (options.dialog) {
            this.setPagePermissions();
            this.buildSubViews();



            this.formID = 'formTVV' + this.model.recid;
        } else {
            if (this.options.id_cerere) {
                $.ajax({
                    url: app.baseUrl + 'doiit/getTvvExtensieByCerere/' + this.options.id_cerere,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response) {
                        self.model.set(response)
                        self.setPagePermissions();
                        self.buildSubViews();
                        self.formID = 'formTVV' + self.model.id;
                        self.buildView();
                        self.setButtons();
                        self.attachActions();
                    }
                });
            } else {
                $.ajax({
                    url: app.baseUrl + 'doiit/getNewTvvExtensie/',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response) {
                        self.model.set(response)
                        self.setPagePermissions();
                        self.buildSubViews();
                        self.formID = 'formTVV' + self.model.recid;
                        self.buildView();
                        self.setButtons();
                        self.attachActions();
                    }
                });
            }
        }
    },
    setPagePermissions: function () {
        this.allowUnlock = ipc.sendSync('user:request:isuserinrole', [
            [1, 9], 'appdot'
        ]) && this.model.get('SetDateTVV') && this.model.get('SetDateTVV').get('validat_doiit') === 1;
        this.allowValidate = ipc.sendSync('user:request:isuserinrole', [
            [1, 9, 11], 'appdot'
        ]);
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3, 11], 'appdot'
        ]);
        this.allowCerificateView = ipc.sendSync('user:request:isuserinrole', [
            [1, 3, 9, 11], 'appdot'
        ]);
    },
    toggleValidateButton: function (dirty) {
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if (this.allowValidate) {
            if (dirty)
                box.find('#btnValideaza').prop('disabled', true);
            else
                if (this.model.get('SetDateTVV').id)
                    box.find('#btnValideaza').prop('disabled', false);

        }
        this.toggleFisaButton();
    },
    toggleFisaButton: function () {
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if (this.model.get('SetDateTVV').id)
            box.find('#btnPrintFisa').prop('disabled', false);
        else
            box.find('#btnPrintFisa').prop('disabled', true);
    },
    buildSubViews: function () {
        console.log('Tip Omologare: ',this.tip_omol)
        if (this.model.get('TVV')) {
            var GView = require('./general');
            this.GeneralView = new GView({
                model: this.model.get('TVV'),
                extensie: this.model.get('id_extensie')
            });
        }
        if (this.model.get('SetDateTVV') && this.model.get('SetDateTVV').get('DateTehnice')) {
            var MView = require('./dateTehnice');
            this.MaseView = new MView({
                type: 'mase',
                collection: this.model.get('SetDateTVV').get('DateTehnice'),
                copil:this.tip_omol == "C"
            });
            var PView = require('./dateTehnice');
            this.PoluareView = new PView({
                type: 'poluare',
                iswltp: this.model.get('SetDateTVV').get('iswltp'),
                collection: this.model.get('SetDateTVV').get('DateTehnice'),
                copil:this.tip_omol == "C"
            });
            this.listenTo(app, 'wltp:changed', function (val) {
                if (val) this.model.get('SetDateTVV').set('iswltp', 1);
                else this.model.get('SetDateTVV').set('iswltp', 0);
            });
            var DView = require('./dateTehnice');
            this.DimensiuniView = new DView({
                type: 'dimensiuni',
                collection: this.model.get('SetDateTVV').get('DateTehnice'),
                copil:this.tip_omol == "C" //.byGroup('dimensiuni')
                //collection : _.filter(this.model.get('SetDateTVV').get('DateTehnice').models,function(m){return m.get('grupa') === 'dimensiuni'})
            });
            var AxView = require('./dateTehnice');
            this.AxeView = new AxView({
                type: 'axe',
                collection: this.model.get('SetDateTVV').get('DateTehnice'),
                copil:this.tip_omol == "C" //.byGroup('axe')
            });
            var AlView = require('./dateTehnice');
            this.AlteView = new AlView({
                type: 'altele',
                collection: this.model.get('SetDateTVV').get('DateTehnice'),
                copil:this.tip_omol == "C" //.byGroup('altele')
            });

            var AnView = require('./anvelope');
            this.AnvelopeView = new AnView({
                collection: this.model.get('SetDateTVV').get('Anvelope')
            });
            var TView = require('./dateTehnice');
            this.TransmisieView = new TView({
                type: 'cv',
                collection: this.model.get('SetDateTVV').get('DateTehnice'),
                copil:this.tip_omol == "C" //.byGroup('cv')
            });
        }
        if (this.model.get('SetDateTVV') && this.model.get('SetDateTVV').get('Motoare')) {
            var MView = require('./motoare');
            this.MotoareView = new MView({
                collection: this.model.get('SetDateTVV').get('Motoare')
            });
        }
        if (this.model.get('SetDateTVV') && this.model.get('SetDateTVV').get('Sisteme')) {
            var SView = require('./sisteme');
            this.SistemeView = new SView({
                collection: this.model.get('SetDateTVV').get('Sisteme'),
                categorie: this.model.get('TVV').get('categorie'),
                isnew: this.model.get('TVV').isNew()
            });
        }
        if (this.model.get('SetDateTVV') && this.model.get('SetDateTVV').get('Mentiuni')) {
            var MnView = require('./mentiuni');
            this.MentiuniView = new MnView({
                collection: this.model.get('SetDateTVV').get('Mentiuni')
            });
        }
    },
    open: function () {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'nrRegistruEditor' + self.model.id,
            title: 'Date TVV',
            width: '1000px',
            showMin: true,
            showMax: true,
            height: '650px',
            resizable: true,
            toolbarButtons: (self.allowUnlock ? [{ id: 'unlock', className: 'w2ui-icon-lock', click: self.unlockButtons.bind(self) }] : null),
            onOpen: function (event) {
                event.onComplete = function () {
                    console.log('Opening TVV Form')
                    self.buildView();
                    self.setButtons();
                    self.attachActions();
                    // self.win.buttons = $('#formButtons').html();
                };
            },
            onClose: function (event) {
                self.destroy();
            },
            buttons: self.getButtonsHtml()
        });
    },
    getButtonsHtml: function () {
        return '<div id="formButtons" style="display:none">' +
            '<span id="editButtons">' +
            '<button class="btn btn-blue" id="btnSave"><i class="w2ui-icon-save"></i> Salveaza</button>' +
            '<button class="btn btn-orange" id="btnImportDate"><i class="w2ui-icon-upload"></i> Importa datele de la extensia anterioara</button>' +
            '<button class="btn btn-green" id="btnValideaza"><i class="w2ui-icon-check"></i> Valideaza datele!</button>' +
            '</span>' +
            '<span id="operButtons">' +
            '<button class="btn btn-blue" id="btnPrintCert"><i class="w2ui-icon-print"></i> Certificat</button>  ' +
            '<button class="btn btn-orange" id="btnPrintAtestat"><i class="w2ui-icon-print"></i> Atestat</button>' +
            '</span>' +
            '<button class="btn btn-green" id="btnPrintFisa"><i class="w2ui-icon-print"></i> Fisa</button>' +
            '<button class="btn btn-red" id="btnClose"><i class="w2ui-icon-cross"></i> Inchide</button>' +
            '<button class="btn btn-orange" id="copyButton" style="display:none"><i class="w2ui-icon-copy"></i> Copy</button>' +
            '<button class="btn btn-orange" id="pasteButton" style="display:none"><i class="w2ui-icon-copy"></i> Paste</button>' +
            '</div>';
    },
    onShow: function () {
        // this.$el.css({
        //     'opacity': 0
        // });
        // this.open();
        // this.setButtons();
    },
    setButtons: function () {
        var box = this.$el;//$('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if (this.options.tip_completare === 9) {
            $('#btnImportDate').hide();
            box.find('#editButtons').hide();
            box.find('#copyButton').show();
        } else {
            if (Globals.getClipboard()) {
                box.find('#pasteButton').show();
            }
            if (this.model.get('SetDateTVV').get('importat') || this.model.get('TVV').isNew()) {
                $('#btnImportDate').prop('disabled', true);
            }
            if (this.model.get('SetDateTVV').get('validat_doiit') === 1) {
                box.find('#editButtons').hide();
                if (this.model.get('TVV').get('nr_registru') && this.allowCerificateView) {
                    box.find('#operButtons').show();
                } else {
                }
            } else {
                if (!this.allowValidate) {
                    box.find('#btnValideaza').hide();
                } else {
                    if (!this.model.get('SetDateTVV').id) box.find('#btnValideaza').prop('disabled', true);
                }
                if (this.allowEdit)
                    box.find('#editButtons').show();
                else
                    box.find('#editButtons').hide();
            }
            box.find('#formButtons').show();
            this.toggleFisaButton();
        }
    },
    events: {
        'click #btnSave': 'save',
        'click #btnClose': 'close',
        'click #btnImportDate': 'importDate',
        'click #btnValideaza': 'validareDate',
        'click #btnPrintCert': 'printCerificat',
        'click #btnPrintAtestat': 'printAtestat',
        'click #copyButton': 'copyDate',
        'click #pasteButton': 'pasteDate',
        'click #btnPrintFisa': 'printFisa'
    },
    attachActions: function () {
        var self = this;
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        box.find('#btnSave').on('click', self.save.bind(self));
        box.find('#btnClose').on('click', self.close.bind(self));
        box.find('#btnImportDate').on('click', self.importDate.bind(self));
        box.find('#btnValideaza').on('click', self.validareDate.bind(self));
        box.find('#btnPrintCert').on('click', self.printCerificat.bind(self));
        box.find('#btnPrintAtestat').on('click', self.printAtestat.bind(self));
        box.find('#btnPrintFisa').on('click', self.printFisa.bind(self));
        box.find('#copyButton').on('click', self.copyDate.bind(self));
        box.find('#pasteButton').on('click', self.pasteDate.bind(self));
        box.find('#formButtons').show();
    },
    buildView: function () {
        var tabs;
        var hideTab = this.model.get('SetDateTVV') && this.model.get('SetDateTVV').get('DateTehnice') && this.model.get('SetDateTVV').get('DateTehnice').models.length === 0 || this.options.tip_completare === 1;
        tabs = [{
            id: 'tabTVV',
            caption: 'Date generale',
            hint: 'GeneralView',
            index: 1
        }, {
            id: 'tabMase',
            caption: 'Mase',
            hint: 'MaseView',
            index: 3,
            hidden: hideTab
        }, {
            id: 'tabDimensiuni',
            caption: 'Dimensiuni',
            hint: 'DimensiuniView',
            index: 2,
            hidden: hideTab
        }, {
            id: 'tabAxe',
            caption: 'Axe',
            hint: 'AxeView',
            index: 7,
            hidden: hideTab
        }, {
            id: 'tabAltele',
            caption: 'Alte Date',
            hint: 'AlteView',
            index: 9,
            hidden: hideTab
        }, {
            id: 'tabAnvelope',
            caption: 'Anvelope',
            hint: 'AnvelopeView',
            index: 8,
            hidden: hideTab
        }, {
            id: 'tabTransmisie',
            caption: 'Transmisie',
            hint: 'TransmisieView',
            index: 6,
            hidden: hideTab
        }, {
            id: 'tabMotor',
            caption: 'Motor',
            hint: 'MotoareView',
            index: 4,
            hidden: hideTab
        }, {
            id: 'tabPoluare',
            caption: 'Poluare',
            hint: 'PoluareView',
            index: 5,
            hidden: hideTab
        }, {
            id: 'tabComponente',
            caption: 'Componente/Sisteme',
            hint: 'SistemeView',
            index: 10,
            hidden: hideTab
        }, {
            id: 'tabMentiuni',
            caption: 'Mentiuni',
            hint: 'MentiuniView',
            index: 11,
            hidden: hideTab
        }];


        //setam ordinea de afisare a taburilor
        tabs = _.sortBy(tabs, 'index');
        var me = this;
        //construim forma
        this.$el.find('#tvvForm').w2form({
            name: me.formID,
            tabs: tabs,
            focus: 1000
        });
        w2ui[me.formID].tabs.onClick = this.tabClicked.bind(this);
        this.setRegions();
        // this.GeneralView.setupView();
        if (this.model.get('TVV').get('nr_registru'))
            this.GeneralView.setReadOnly();
        this.$el.css({
            'opacity': 1,
            'height': '100%'
        });

    },
    setRegions: function () {
        this.addRegions({
            'dategenerale': '#tabTVV',
            'dimensiuni': '#tabDimensiuni',
            'mase': '#tabMase',
            'axe': '#tabAxe',
            'altele': '#tabAltele',
            'transmisie': '#tabTransmisie',
            'motor': '#tabMotor',
            'poluare': '#tabPoluare',
            'anvelope': '#tabAnvelope',
            'sisteme': '#tabSisteme',
            'mentiuni': '#tabMentiuni',
        });
        if(this.GeneralView)
            this.dategenerale.show(this.GeneralView);
        if(this.DimensiuniView)
            this.dimensiuni.show(this.DimensiuniView);
        if(this.MaseView)
            this.mase.show(this.MaseView);
        if(this.AxeView)
            this.axe.show(this.AxeView);
        if(this.MotoareView)
            this.motor.show(this.MotoareView);
        if(this.AlteView)
            this.altele.show(this.AlteView);
        if(this.TransmisieView)
            this.transmisie.show(this.TransmisieView);
        if(this.PoluareView)
            this.poluare.show(this.PoluareView);
        if(this.AnvelopeView)
            this.anvelope.show(this.AnvelopeView);
        if(this.SistemeView)
            this.sisteme.show(this.SistemeView);
        if(this.MentiuniView)
            this.mentiuni.show(this.MentiuniView);
    },
    tabClicked: function (tab) {
        var me = this;
        // if (me.forceValidation && me[tab.tab.hint].forceValidation)
        //     me[tab.tab.hint].forceValidation.apply(me[tab.tab.hint], arguments);

        // var div = document.getElementById(tab.target),
        //     divDisplay = div.className,
        //     observer = new MutationObserver(function() {
        //         var currentDisplay = div.className;
        //         if (divDisplay !== currentDisplay && currentDisplay.indexOf('active') !== -1) {
        //             if (me[tab.tab.hint].refreshUI)
        //                 me[tab.tab.hint].refreshUI.apply(me[tab.tab.hint], arguments);
        //         }
        //     });

        // //observe changes
        // observer.observe(div, {
        //     attributes: true
        // });
        // $('.tab.active').removeClass('active');
        // $('#' + tab.target).addClass('active');
        if (me[tab.tab.hint].refreshUI)
            me[tab.tab.hint].refreshUI.apply(me[tab.tab.hint], arguments);
        if (me.forceValidation)
            w2utils.validate(me.model, me.$el);
    },
    unlockButtons: function () {
        var self = this;
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        $.get(app.dotUrl + '/nrom/GetStatusTVV', { id: self.model.get('TVV').get('id') }, function (response) {
            if (response.hasCIV >= 1) {
                self.GeneralView.setReadOnly();
                self.MaseView.setReadOnly();
                self.DimensiuniView.setReadOnly();
                self.AxeView.setReadOnly();
                self.AlteView.setReadOnly();
                self.PoluareView.setReadOnly();
                self.TransmisieView.setReadOnly();
                self.AnvelopeView.enableEdit();
                self.MentiuniView.enableEdit();
            } else {
                self.GeneralView.setReadOnly();
                self.AnvelopeView.enableEdit();
                self.MentiuniView.enableEdit();
            }
            box.find('#editButtons').show();
        })

    },
    onBeforeDestroy: function () {
        var me = this;
        // _.each(w2ui[me.formID].tabs, function(tab) {
        //     // if (me[tab.hint])
        //     //     me[tab.hint].destroy();
        //     tab.destroy()
        // });
        w2ui[me.formID].destroy();
    },
    enableTabs: function () {
        var me = this;
        _.each(w2ui[me.formID].tabs.tabs, function (tab) {
            if (tab.hidden)
                w2ui[me.formID].tabs.show(tab.id);
        });
        var box = $('#nrRegistruEditor' + this.model.id + 'w2ui-window');
        if (!this.model.get('SetDateTVV').get('importat'))
            box.find('#btnImportDate').prop('disabled', false);
    },
    save: function () {
        var self = this;
        //this.forceValidation = true;
        // console.log(self.model.toJSON());
        // return;
        //if (w2utils.validate(this.model, this.$el)) {
        w2utils.lock(self.$el, 'Va rugam asteptati', true);
        var isNew = self.model.get('TVV').isNew() && !self.modifTVVExistent;
        if (!isNew) {
            self.model.get('TVV').set('tip_tvv', 4);
        }
        this.model.save({}, {
            silent: true,
            success: function (response) {
                window.isDirty.dirty = false;
                // if (response.get('SetDateTVV').get('bun') == 0) {
                //     w2alert('ATENTIE!<br>TVV-ul nu este valid deoarece nu indeplineste cerintele ' + response.get('SetDateTVV').get('cineapus_bun') + ' intrate in vigoare la data ' + response.get('SetDateTVV').get('data_bun'));
                // }
                if (isNew) {
                    self.refreshSubviews(response.get('SetDateTVV'));
                    self.SistemeView.options.categorie = self.model.get('TVV').get('categorie');
                    self.SistemeView.options.isnew = false;
                    self.SistemeView.refreshUI();
                    self.enableTabs();
                    app.trigger('dosar:tvv:add', response);
                } else {
                    app.trigger('dosar:tvv:modified', self.model.get('TVV'));
                }
                self.setButtons();
                var opt = {
                    title: 'Notificare',
                    text: 'Inregistrarea a fost salvata!',
                    type: 'success-template'
                };
                ipc.send('app:notification:show', opt);
                w2utils.unlock(self.$el);
            },
            error: function (response) {
                var opt = {
                    title: 'Eroare',
                    text: response,
                    type: 'error-template'
                };
                ipc.send('app:notification:show', opt);
                w2utils.unlock(self.$el);
            }
        });
        //}
        //console.log(this.model.toJSON());

    },
    refreshSubviews: function (data) {
        var self = this;
        self.model.set('SetDateTVV', data);
        self.MaseView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('mase');
        self.MaseView.render();
        // self.MaseView.attachChangeEvent();
        self.DimensiuniView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('dimensiuni');
        self.DimensiuniView.render();
        self.AxeView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('axe');
        self.AxeView.render();
        self.AlteView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('altele');
        self.AlteView.render();
        self.PoluareView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('poluare');
        self.PoluareView.render();
        self.TransmisieView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('cv');
        self.TransmisieView.render();
        self.SistemeView.collection = self.model.get('SetDateTVV').get('Sisteme');
        self.SistemeView.options.categorie = self.model.get('TVV').get('categorie'),
            self.SistemeView.refreshUI();
        self.MentiuniView.collection = self.model.get('SetDateTVV').get('Mentiuni');
        self.MentiuniView.refreshUI();
        self.MotoareView.collection = self.model.get('SetDateTVV').get('Motoare');
        self.MotoareView.refreshUI();
        self.AnvelopeView.collection = self.model.get('SetDateTVV').get('Anvelope');
        self.AnvelopeView.refreshUI();
    },

    reloadTVV: function (tvv) {
        var self = this;
        var oldid = self.model.get('TVV').id;
        //check if we have a set of data with new tvv
        $.get(app.dotUrl + 'nrom/getsetdatetvvextensie', { id_tvv: tvv.id, id_extensie: self.model.get('id_extensie') }, function (set) {
            self.model.set('TVV', tvv);
            self.model.set('id_tvv', tvv.id);
            // self.GeneralView.model = self.model.get('TVV');
            self.GeneralView.refreshModel(tvv);
            if (self.model.get('TVV').get('nr_registru'))
                self.GeneralView.setReadOnly();
            if (set.id) {
                self.refreshSubviews(set);
            }
            // app.trigger('dosar:tvv:edit',{old:oldid,tvv:tvv});
        });

    },

    importDate: function (e) {
        var self = this;
        w2confirm('Sigur doriti aducerea datelor de la extensia anterioara?<br>Datele existente se vor sterge!').yes(function () {
            w2utils.lock(self.$el, 'Va rugam asteptati', true);
            $.ajax({
                type: 'POST',
                url: app.dotUrl + '/nrom/importDateTvv',
                data: {
                    id_tvv: self.model.get('id_tvv'),
                    id_extensie: self.model.get('id_extensie'),
                    nr_registru_curent: self.model.get('TVV').get('nr_registru'),
                    nr_registru_preluat: self.model.get('TVV').get('nr_registru_vechi'),
                    wvta: self.model.get('TVV').get('wvta')
                },
                success: function (response) {
                    //console.log(response);
                    response.importat = 1;
                    response.validat_doiit = 0;
                    response.verificat = '';
                    self.refreshSubviews(response);
                    $(e.target).attr('disabled', true);
                },
                error: function (error) {
                    w2utils.unlock(self.$el);
                    w2alert(error.responseText);
                }
            }).done(function () {
                window.isDirty.dirty = false;
                w2utils.unlock(self.$el);

            });
        });

    },
    validareDate: function () {
        var self = this;
        var host;
        w2confirm('Sigur validati acest numar?').yes(function () {
            if (w2utils.validate(self.model, self.$el)) {
                w2utils.lock(self.$el, 'Va rugam asteptati', true);
                ipc.sendSync('user:request:host', null, function (compname) {
                    host = compname;
                    self.model.get('SetDateTVV')
                        .set('validat_doiit', 1)
                        .set('verificat', host)
                        .set('expert', app.User.expert);
                });
                $.ajax(
                    {
                        dataType: 'json',
                        contentType: 'application/json',
                        type: 'POST',
                        url: app.dotUrl + '/doiit/validaresetdate/' + self.model.id,
                        data: JSON.stringify(self.model.get('SetDateTVV').toJSON()),
                        success: function (response) {
                            // self.model.get('SetDateTVV').set(response.set);
                            if (response.status === 'invalid') {
                                self.model.get('SetDateTVV')
                                    .set('validat_doiit', 0)
                                    .set('verificat', '')
                                    .set('expert', '');
                                w2confirm('ATENTIE!<br>TVV-ul nu este valid deoarece nu indeplineste cerintele ' + response.set.regulament + ' intrate in vigoare la data ' + response.set.data + '<br>Sigur validati?')
                                    .yes(function () {
                                        self.model.get('SetDateTVV')
                                            .set('validat_doiit', 1)
                                            .set('verificat', host)
                                            .set('override_bun', host)
                                            .set('expert', app.User.expert);
                                        $.ajax({
                                            dataType: 'json',
                                            contentType: 'application/json',
                                            type: 'POST',
                                            url: app.dotUrl + '/nrom/overridevalidaresetdate/' + self.model.id,
                                            data: JSON.stringify(self.model.get('SetDateTVV').toJSON()),
                                            success: function (response) {
                                                // self.model.get('SetDateTVV').set(response.set);
                                                app.trigger('dosar:tvv:modified', self.model.get('TVV'));
                                                self.setButtons();
                                                var opt = {
                                                    title: 'Notificare',
                                                    text: 'Datele au fost validate!',
                                                    type: 'success-template'
                                                };
                                                ipc.send('app:notification:show', opt);
                                                w2utils.unlock(self.$el);
                                            }
                                        });
                                    })
                                    .no(function () {
                                        w2utils.unlock(self.$el);
                                    });
                            } else {
                                app.trigger('dosar:tvv:modified', self.model.get('TVV'));
                                self.setButtons();
                                var opt = {
                                    title: 'Notificare',
                                    text: 'Datele au fost validate!',
                                    type: 'success-template'
                                };
                                ipc.send('app:notification:show', opt);
                                w2utils.unlock(self.$el);
                            }
                        }
                    });
            }
        });

    },

    printCerificat: function () {
        var url = app.dotUrl + '/nrom/printcomunicare/?id=' + this.model.id;
        ipc.send('app:request:pdf', url);
    },
    printAtestat: function () {
        var url = app.dotUrl + '/nrom/printatestat/?id=' + this.model.id;
        ipc.send('app:request:pdf', url);
    },
    printFisa: function () {
        //if(!this.model.id){
        //    w2alert('Acest Numar de Registru este generat in sistemul vechi! Va rugam consultati aplicatia APPROVAL!');
        //}else{
        console.log('printfisa');
        var url = app.dotUrl + '/nrom/printfisasistem/?nr_registru=' + this.model.get('nr_registru') + '&extensie=' + this.model.get('extensie') + '&id=' + this.model.id;
        ipc.send('app:request:pdf', url);
        //}
    },
    setModelNew: function (fromClipboard) {
        if (!fromClipboard) {
            this.model.set({
                id: null,
                EntityState: 0,
                id_tvv: 0,
                tip_activ: 0
            });
            this.model.get('SetDateTVV').set({
                EntityState: 0,
                id_tvv: null,
                validat: null,
                validat_doiit: null,
                verificat: ''
            });
        }
        this.model.get('SetDateTVV').get('DateTehnice').each(function (mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Anvelope').each(function (mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Motoare').each(function (mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Mentiuni').each(function (mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Sisteme').each(function (mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });

        this.modifTVVExistent = true;
        this.setButtons();

    },

    enablePaste: function () {
        this.$el.find('#pasteButton').show();
    },
    copyDate: function () {
        $('#copyButton').attr('disabled', true);
        Globals.setClipboard(this.model.get('SetDateTVV'));
    },
    pasteDate: function () {
        var self = this;
        $('#pasteButton').attr('disabled', true);
        var clipboard = Globals.getClipboard();
        if (clipboard) {
            w2confirm('Datele existente se vor sterge! Sigur doriti inlocuirea datelor?').yes(function () {
                $.ajax({
                    type: 'POST',
                    url: app.dotUrl + '/nrom/DeleteSetDateExistent',
                    data: {
                        id_tvv: self.model.get('id_tvv'),
                        id_extensie: self.model.get('id_extensie')
                    },
                    success: function (response) {
                        console.log(response);
                        clipboard.importat = 1;
                        clipboard.validat = 0;
                        clipboard.verificat = '';
                        clipboard.set('id_tvv', response.id_tvv);
                        clipboard.set('id_extensie', response.id_extensie);
                        self.refreshSubviews(clipboard);
                        self.setModelNew(true);
                        Globals.clearClipboard();
                    }
                });

            });

        }
    },

    close: function () {
        window.isDirty.dirty = false;
        this.win.close();
    }
});