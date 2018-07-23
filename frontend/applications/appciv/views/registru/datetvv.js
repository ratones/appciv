var ipc = requireNode('ipc');
var Globals = require('./../../../../globals');
module.exports = Marionette.BossView.extend({
    template: require('./../../templates/registru/datetvv.hbs'),
    className: 'windowContent w2ui-reset w2ui-form',
    initialize: function() {
        var self = this;
        _.bindAll(this, 'tabClicked');
        this.setPagePermissions();
        this.listenTo(app, 'dosare:resetTVV', this.setModelNew);
        this.listenTo(app, 'dosare:reloadTVV', this.reloadTVV);

        window.isDirty.watch('dirty',function(prop,oldval,newval){
            self.toggleValidateButton(newval);
        });
    },
    setPagePermissions: function() {
        this.allowUnlock = ipc.sendSync('user:request:isuserinrole', [
            [1, 9], 'appdot'
        ]) && this.model.get('SetDateTVV').get('validat') === 1;
        this.allowValidate = ipc.sendSync('user:request:isuserinrole', [
            [1, 9,11], 'appdot'
        ]);
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3,11], 'appdot'
        ]);
        this.allowCerificateView = ipc.sendSync('user:request:isuserinrole', [
            [1, 3, 9,11], 'appdot'
        ]);

    },
    toggleValidateButton:function(dirty){
        if(this.allowValidate){
            if(dirty)
                $('#btnValideaza').prop('disabled',true);
            else
                if(this.model.get('SetDateTVV').id)
                $('#btnValideaza').prop('disabled',false);

        }
        this.toggleFisaButton();
    },
    toggleFisaButton:function(){
        if(this.model.get('SetDateTVV').id)
            $('#btnPrintFisa').prop('disabled',false);
        else
             $('#btnPrintFisa').prop('disabled',true);
    },
    subViews: {
        GeneralView: function() {
            var View = require('./general');
            return new View({
                extensie:this.options.extensie,
                model: this.model.get('TVV')
            });
        },
        MaseView: function() {
            var View = require('./dateTehnice');
            return new View({
                type: 'mase',
                collection: this.model.get('SetDateTVV').get('DateTehnice')//.byGroup('mase')
            });
        },
        PoluareView: function() {
            var View = require('./dateTehnice');
            return new View({
                type: 'poluare',
                collection: this.model.get('SetDateTVV').get('DateTehnice')//.byGroup('poluare')
            });
        },
        DimensiuniView: function() {
            var View = require('./dateTehnice');
            return new View({
                type: 'dimensiuni',
                collection: this.model.get('SetDateTVV').get('DateTehnice')//.byGroup('dimensiuni')
            });
        },
        AxeView: function() {
            var View = require('./dateTehnice');
            return new View({
                type: 'axe',
                collection: this.model.get('SetDateTVV').get('DateTehnice')//.byGroup('axe')
            });
        },
        AlteView: function() {
            var View = require('./dateTehnice');
            return new View({
                type: 'altele',
                collection: this.model.get('SetDateTVV').get('DateTehnice')//.byGroup('altele')
            });
        },
        AnvelopeView: function() {
            var View = require('./anvelope');
            return new View({
                collection: this.model.get('SetDateTVV').get('Anvelope')
            });
        },
        TransmisieView: function() {
            var View = require('./dateTehnice');
            return new View({
               type:'cv',
                collection: this.model.get('SetDateTVV').get('DateTehnice')//.byGroup('cv')
            });
        },
        MotoareView: function() {
            var View = require('./motoare');
            return new View({
                collection: this.model.get('SetDateTVV').get('Motoare')
            });
        },
        SistemeView: function() {
            var View = require('./sisteme');
            return new View({
                collection: this.model.get('SetDateTVV').get('Sisteme'),
                categorie: this.model.get('TVV').get('categorie'),
                isnew: this.model.get('TVV').isNew()
            });
        },
        MentiuniView: function() {
            var View = require('./mentiuni');
            return new View({
                collection: this.model.get('SetDateTVV').get('Mentiuni')
            });
        },
    },
    subViewContainers: {
        GeneralView: '#tabTVV',
        DimensiuniView: '#tabDimensiuni',
        MaseView: '#tabMase',
        MotoareView: '#tabMotor',
        PoluareView: '#tabPoluare',
        TransmisieView: '#tabTransmisie',
        AxeView: '#tabAxe',
        AlteView: '#tabAltele',
        AnvelopeView: '#tabAnvelope',
        SistemeView: '#tabComponente',
        MentiuniView: '#tabMentiuni'
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
    subViewEvents:{
        '* render': 'onSubViewRendered'
    },
    onSubViewRendered:function(view){
        if(view.onViewAttached)
            view.onViewAttached.apply(view,arguments);
        if(view.attachChangeEvent)
            view.attachChangeEvent.apply(view,arguments);
    },
    unlockButtons:function(){
      var self = this;
      $.get(app.dotUrl + '/nrom/GetStatusTVV',{id:self.model.get('TVV').get('id')},function(response){
        if(response.hasCIV >= 1){
          self.GeneralView.setReadOnly();
          self.MaseView.setReadOnly();
          self.DimensiuniView.setReadOnly();
          self.AxeView.setReadOnly();
          self.AlteView.setReadOnly();
          self.PoluareView.setReadOnly();
          self.TransmisieView.setReadOnly();
          self.AnvelopeView.enableEdit();
          self.MentiuniView.enableEdit();
        }else{
          self.GeneralView.setReadOnly();
          self.AnvelopeView.enableEdit();
          self.MentiuniView.enableEdit();
        }
        self.$el.find('#editButtons').show();
      })

    },
    open: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'nrRegistruEditor' + self.model.id,
            title: 'Date TVV',
            width: '950px',
            showMin: true,
            showMax: true,
            height: '650px',
            resizable: true,
            toolbarButtons:(self.allowUnlock ? [{id:'unlock',className:'w2ui-icon-lock',click:self.unlockButtons.bind(self)}]:null),
            onOpen: function(event) {
                event.onComplete=function(){
                    self.buildView();
                };
            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },
    onShow: function() {
        this.open();
        this.setButtons();
    },
    setButtons: function() {
        if(this.options.tip_completare === 9){
            $('#btnImportDate').hide();
            this.$el.find('#operButtons').hide();
            this.$el.find('#editButtons').hide();
            this.$el.find('#copyButton').show();
        }else{
            if(Globals.getClipboard()){
                this.$el.find('#pasteButton').show();
            }
            if (this.model.get('SetDateTVV').get('importat') || this.model.get('TVV').isNew()) {
                $('#btnImportDate').prop('disabled', true);
            }
            if (this.model.get('SetDateTVV').get('validat') === 1) {
                this.$el.find('#editButtons').hide();
                if (this.model.get('TVV').get('nr_registru') && this.allowCerificateView) {
                    this.$el.find('#operButtons').show();
                } else {
                    this.$el.find('#operButtons').hide();
                }
            } else {
                if (!this.allowValidate) {
                    this.$el.find('#btnValideaza').hide();
                }else{
                    if(!this.model.get('SetDateTVV').id)this.$el.find('#btnValideaza').prop('disabled',true);
                }
                if (this.allowEdit)
                    this.$el.find('#editButtons').show();
                else
                    this.$el.find('#editButtons').hide();
                this.$el.find('#operButtons').hide();
            }
            this.toggleFisaButton();
        }
    },
    buildView: function() {
        var tabs;
        var hideTab = this.model.get('SetDateTVV').get('DateTehnice').models.length === 0;
        tabs = [{
            id: 'tabTVV',
            caption: 'Date generale',
            hint: 'GeneralView',
            index: 1
        },
        {
            id: 'tabDimensiuni',
            caption: 'Dimensiuni',
            hint: 'DimensiuniView',
            index: 2,
            hidden: hideTab
        },{
            id: 'tabMase',
            caption: 'Mase',
            hint: 'MaseView',
            index: 3,
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
            id: 'tabTransmisie',
            caption: 'Transmisie',
            hint: 'TransmisieView',
            index: 6,
            hidden: hideTab
        }, {
            id: 'tabAxe',
            caption: 'Axe',
            hint: 'AxeView',
            index: 7,
            hidden: hideTab
        }, {
            id: 'tabAnvelope',
            caption: 'Anvelope',
            hint: 'AnvelopeView',
            index: 8,
            hidden: hideTab
        }, {
            id: 'tabAltele',
            caption: 'Alte Date',
            hint: 'AlteView',
            index: 9,
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
        //construim taburile
        $('#tvvtabs').w2tabs({
            name: 'tabsTVV' + this.cid,
            active: 'tabTVV',
            tabs: tabs,
            onClick: me.tabClicked
        });
        //this.GeneralView.setupView();
        if (this.model.get('TVV').get('nr_registru'))
            this.GeneralView.setReadOnly();

    },
    tabClicked: function(tab) {
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
        $('.tab.active').removeClass('active');
        $('#' + tab.target).addClass('active');
        if (me[tab.tab.hint].refreshUI)
            me[tab.tab.hint].refreshUI.apply(me[tab.tab.hint], arguments);
        if (me.forceValidation)
            w2utils.validate(me.model, me.$el);

    },
    onBeforeDestroy: function() {
        var me = this;
        _.each(w2ui['tabsTVV' + me.cid].tabs, function(tab) {
            if (me[tab.hint])
                me[tab.hint].destroy();
        });
        w2ui['tabsTVV' + me.cid].destroy();
    },
    enableTabs: function() {
        var me = this;
        _.each(w2ui['tabsTVV' + me.cid].tabs, function(tab) {
            if (tab.hidden)
                w2ui['tabsTVV' + me.cid].show(tab.id);
        });
        if (!this.model.get('SetDateTVV').get('importat'))
            $('#btnImportDate').prop('disabled', false);
    },
    save: function() {
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
                success: function(response) {
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
                    }
                    app.trigger('dosar:tvv:modified', self.model.get('TVV').get('tip_tvv'));
                    self.setButtons();
                    var opt = {
                        title: 'Notificare',
                        text: 'Inregistrarea a fost salvata!',
                        type: 'success-template'
                    };
                    ipc.send('app:notification:show', opt);
                    w2utils.unlock(self.$el);
                },
                error: function(response) {
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
    refreshSubviews: function(data) {
        var self = this;
        self.model.set('SetDateTVV', data);
        self.MaseView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('mase');
        self.MaseView.render();
        self.MaseView.attachChangeEvent();
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
        self.SistemeView.options.categorie= self.model.get('TVV').get('categorie'),
        self.SistemeView.refreshUI();
        self.MentiuniView.collection = self.model.get('SetDateTVV').get('Mentiuni');
        self.MentiuniView.refreshUI();
        self.MotoareView.collection = self.model.get('SetDateTVV').get('Motoare');
        self.MotoareView.refreshUI();
        self.AnvelopeView.collection = self.model.get('SetDateTVV').get('Anvelope');
        self.AnvelopeView.refreshUI();
    },

    reloadTVV:function(tvv){
        this.model.set('TVV', tvv);
        this.GeneralView.model = this.model.get('TVV');
        this.GeneralView.render();
        if(this.model.get('TVV').get('nr_registru'))
          this.GeneralView.setReadOnly();
    },

    importDate: function(e) {
        var self = this;
        w2confirm('Sigur doriti aducerea datelor de la extensia anterioara?<br>Datele existente se vor sterge!').yes(function() {
            w2utils.lock(self.$el, 'Va rugam asteptati', true);
            $.ajax({
                type: 'POST',
                url: app.dotUrl + '/nrom/importDateTvv',
                data: {
                    id_tvv: self.model.get('id_tvv'),
                    id_extensie: self.model.get('id_extensie'),
                    nr_registru_curent:self.model.get('TVV').get('nr_registru'),
                    nr_registru_preluat:self.model.get('TVV').get('nr_registru_vechi'),
                    wvta: self.model.get('TVV').get('wvta')
                },
                success: function(response) {
                    //console.log(response);
                    response.importat = 1;
                    response.validat = 0;
                    response.verificat = '';
                    self.refreshSubviews(response);
                    $(e.target).attr('disabled', true);
                },
                error: function(error) {
                    w2utils.unlock(self.$el);
                    w2alert(error.responseText);
                }
            }).done(function() {
                window.isDirty.dirty = false;
                w2utils.unlock(self.$el);

            });
        });

    },
    validareDate: function() {
        var self = this;
        var host;
        w2confirm('Sigur validati acest numar?').yes(function(){
            if (w2utils.validate(self.model, self.$el)) {
            w2utils.lock(self.$el, 'Va rugam asteptati', true);
                ipc.sendSync('user:request:host', null, function(compname) {
                        host = compname;
                        self.model.get('SetDateTVV')
                            .set('validat', 1)
                            .set('verificat', host)
                            .set('expert', app.User.expert);
                        });
                $.ajax(
                    {
                        dataType:'json',
                        contentType:'application/json',
                        type:'POST',
                        url:app.dotUrl + '/nrom/validaresetdate/'+self.model.id,
                        data:JSON.stringify(self.model.get('SetDateTVV').toJSON()),
                        success: function(response) {
                            // self.model.get('SetDateTVV').set(response.set);
                            if (response.status === 'invalid') {
                                self.model.get('SetDateTVV')
                                .set('validat', 0)
                                .set('verificat', '')
                                .set('expert', '');
                                w2alert('ATENTIE!<br>TVV-ul nu este valid deoarece nu indeplineste cerintele ' + response.set.regulament + ' intrate in vigoare la data ' + response.set.data);
                                    // .yes(function() {
                                    //        self.model.get('SetDateTVV')
                                    //         .set('validat', 1)
                                    //         .set('verificat', host)
                                    //         .set('override_bun',host)
                                    //         .set('expert', app.User.expert);
                                    //         $.ajax({
                                    //             dataType:'json',
                                    //             contentType:'application/json',
                                    //             type:'POST',
                                    //             url:app.dotUrl + '/nrom/overridevalidaresetdate/'+self.model.id,
                                    //             data:JSON.stringify(self.model.get('SetDateTVV').toJSON()),
                                    //             success:function(response){
                                    //                 // self.model.get('SetDateTVV').set(response.set);
                                    //                 app.trigger('dosar:tvv:modified', self.model.get('TVV').get('tip_tvv'));
                                    //                 self.setButtons();
                                    //                 var opt = {
                                    //                     title: 'Notificare',
                                    //                     text: 'Datele au fost validate!',
                                    //                     type: 'success-template'
                                    //                 };
                                    //                 ipc.send('app:notification:show', opt);
                                    //                 w2utils.unlock(self.$el);
                                    //             }
                                    //         });
                                    // })
                                    // .no(function() {
                                        w2utils.unlock(self.$el);
                                    // });
                            } else {
                                     app.trigger('dosar:tvv:modified', self.model.get('TVV').get('tip_tvv'));
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

    printCerificat: function() {
        var url = app.dotUrl + '/nrom/printcomunicare/?id=' + this.model.id;
        ipc.send('app:request:pdf', url);
    },
    printAtestat: function() {
        var url = app.dotUrl + '/nrom/printatestat/?id=' + this.model.id;
        ipc.send('app:request:pdf', url);
    },
    printFisa: function() {
        //if(!this.model.id){
        //    w2alert('Acest Numar de Registru este generat in sistemul vechi! Va rugam consultati aplicatia APPROVAL!');
        //}else{
            console.log('printfisa');
            var url = app.dotUrl + '/nrom/printfisasistem/?nr_registru=' + this.model.get('nr_registru')+'&extensie='+this.model.get('extensie') + '&id=' + this.model.id;
            ipc.send('app:request:pdf', url);
        //}
    },
    setModelNew: function(fromClipboard) {
        if(!fromClipboard){
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
                verificat: ''
            });
        }
        this.model.get('SetDateTVV').get('DateTehnice').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Anvelope').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Motoare').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Mentiuni').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });
        this.model.get('SetDateTVV').get('Sisteme').each(function(mdl) {
            mdl.set({
                id: null,
                EntityState: 0,
                id_set: null
            })
        });

        this.modifTVVExistent = true;
        this.setButtons();

    },

    copyDate:function(){
        $('#copyButton').attr('disabled',true);
        Globals.setClipboard(this.model.get('SetDateTVV'));
    },
    pasteDate:function(){
        var self = this;
        $('#pasteButton').attr('disabled',true);
        var clipboard = Globals.getClipboard();
        if(clipboard){
            w2confirm('Datele existente se vor sterge! Sigur doriti inlocuirea datelor?').yes(function(){
                $.ajax({
                    type: 'POST',
                    url: app.dotUrl + '/nrom/DeleteSetDateExistent',
                    data: {
                        id_tvv: self.model.get('id_tvv'),
                        id_extensie: self.model.get('id_extensie')
                    },
                    success: function(response) {
                        console.log(response);
                        clipboard.importat = 1;
                        clipboard.validat = 0;
                        clipboard.verificat = '';
                        clipboard.set('id_tvv',response.id_tvv);
                        clipboard.set('id_extensie',response.id_extensie);
                        self.refreshSubviews(clipboard);
                        self.setModelNew(true);
                        Globals.clearClipboard();
                    }
                });

            });

        }
    },

    close: function() {
        window.isDirty.dirty = false;
        this.win.close();
    }
});
