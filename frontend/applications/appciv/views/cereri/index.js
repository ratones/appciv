var ipc = requireNode('ipc');
var fs = requireNode('fs');

module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/index.hts'),
    className: 'page',
    attributes: function() {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    events: {},
    initialize: function(options) {
        var self = this;
        this.location = options.location;
        _.bindAll(this, 'refreshGrid');
        this.setPermissions();
    },
    setPermissions: function() {
        this.allowSuper = ipc.sendSync('user:request:isuserinrole', [
            [13,1], 'appciv'
        ]);
        this.allowDelete = ipc.sendSync('user:request:isuserinrole', [
            [1], 'appciv'
        ]);
        this.allowPrint = ipc.sendSync('user:request:isuserinrole', [
            [1, 10], 'appciv'
        ]);

    },
    onShow: function() {
        var self = this;
        this.buildUpload();
        this.renderGrid();
    },
    renderGrid: function() {
        var self = this;
        $('#grid').w2grid({
            name: 'gridCereri',
            url: app.baseUrl + 'comenzi/getComenzi',
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            fixedBody: true,
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
                toolbarDelete: self.allowDelete,
                //toolbarSave: true,
                //toolbarEdit: true,
                expandColumn: true
            },
            toolbar: {
                items: [
                    //{type: 'break'},
                    {
                        type: 'button',
                        id: 'btnEdit',
                        caption: w2utils.lang('Editare'),
                        icon: 'w2ui-icon-pencil',
                        onClick: function(event) {
                            app.module('appciv').controller.editCerere(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'button',
                        disabled: true,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                            app.module('appciv').router.navigate('appciv/spreadsheetVehicule/' + w2ui['gridCereri'].getSelection(), true);
                        }
                    }, {
                        type: 'break'
                    }, {
                        type: 'button',
                        id: 'btnJurnal',
                        caption: 'Jurnal',
                        icon: 'w2ui-icon-search',
                        onClick: function(e) {
                            self.getJurnal(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'button',
                        id: 'btnUpload',
                        caption: w2utils.lang('Alege fisier'),
                        icon: 'w2ui-icon-upload',
                        onClick: function(event) {
                            self.choosefile();
                        }
                    }, {
                        type: 'button',
                        id: 'btnPlata',
                        caption: w2utils.lang('Instiintare plata'),
                        icon: 'w2ui-icon-money',
                        onClick: function(e) {
                            app.module('appciv').controller.detaliiPlataCerere(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'menu',
                        id: 'btnRaport',
                        caption: w2utils.lang('Raport'),
                        icon: 'w2ui-icon-file',
                        disabled: true,
                        items: [{
                            type: 'button',
                            id: 'btnRaportSimple',
                            caption: w2utils.lang('Raport'),
                            icon: 'w2ui-icon-print',
                            onClick: function(e) {
                                self.getRaport(w2ui['gridCereri'].getSelection());
                            }
                        },{
                            type: 'button',
                            id: 'btnRaportXLS',
                            caption: w2utils.lang('Raport XLS'),
                            icon: 'w2ui-icon-file',
                            onClick: function(e) {
                                self.getRaportXLS(w2ui['gridCereri'].getSelection());
                            }
                        }]
                    }, {
                        type: 'break'
                    }, {
                        type: 'button',
                        id: 'btnPostComanda',
                        caption: w2utils.lang('Transmite comanda!'),
                        icon: 'w2ui-icon-send',
                        onClick: function(e) {
                            w2confirm(w2utils.lang('Sigur finalizati aceasta comanda?')).yes(function(response) {
                                w2ui.gridCereri.lock();
                                var id = w2ui.gridCereri.getSelection();
                                //alert('ok');
                                app.module('appciv').controller.transmitComanda(id, self.refreshGrid);
                            });
                        }
                    },
                    //(self.allowPrint ?{
                //      type: 'menu',
                //      id: 'btnMeniuCIV',
                //      caption: 'Meniu CIV',
                //      icon: 'w2ui-icon-file',
                //      items: [ (self.allowPrint ? {
                //         type: 'button',
                //         id: 'btnPrintCIV',
                //         caption: 'Tipar',
                //         icon: 'w2ui-icon-print',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.printRaport(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {}),
                //     (self.allowPrint ? {
                //         type: 'button',
                //         id: 'btnVerificCIV',
                //         caption: 'Verificare',
                //         icon: 'w2ui-icon-check',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.verificRaport(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {}),
                //     (self.allowPrint ? {
                //         type: 'button',
                //         id: 'btnArhivareCIV',
                //         caption: 'Arhivare',
                //         icon: 'w2ui-icon-file',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.arhivareCIV(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {}),
                //     (self.allowSuper ? {
                //         type: 'button',
                //         id: 'btnAnulareCIV',
                //         caption: 'Anulare',
                //         icon: 'w2ui-icon-ban',
                //         disabled: true,
                //         onClick: function(e) {
                //             self.anulareCIV(w2ui['gridCereri'].getSelection());
                //         }
                //     } : {})]
                //  }:{})
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnPrintCIV',
                        caption: w2utils.lang('Tipar'),
                        icon: 'w2ui-icon-print',
                        disabled: true,
                        onClick: function(e) {
                            self.printRaport(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnVerificCIV',
                        caption: w2utils.lang('Verificare'),
                        icon: 'w2ui-icon-check',
                        disabled: true,
                        onClick: function(e) {
                            self.verificRaport(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnArhivareCIV',
                        caption: w2utils.lang('Arhivare'),
                        icon: 'w2ui-icon-file',
                        disabled: true,
                        onClick: function(e) {
                            self.arhivareCIV(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowSuper ? {
                        type: 'button',
                        id: 'btnAnulareCIV',
                        caption: w2utils.lang('Anulare'),
                        icon: 'w2ui-icon-ban',
                        disabled: true,
                        onClick: function(e) {
                            self.anulareCIV(w2ui['gridCereri'].getSelection());
                        }
                    } : {})
                ],
                onClick: function(event) {
                         //alert();
                        if (event.target === 'btnRaport:btnRaportSimple') {
                            self.getRaport(w2ui['gridCereri'].getSelection());
                        }else if(event.target === 'btnRaport:btnRaportXLS'){
                            self.getRaportXLS(w2ui['gridCereri'].getSelection());
                        }else if(event.target === 'btnMeniuCIV:btnArhivareCIV'){
                            self.arhivareCIV(w2ui['gridCereri'].getSelection());
                        }else if(event.target === 'btnMeniuCIV:btnAnulareCIV'){
                            self.anulareCIV(w2ui['gridCereri'].getSelection());
                        }
                    }
            },
            onDblClick: function(event) {
                var record = w2ui['gridCereri'].get(event.recid);
                if (record.depusa < 10) {
                    app.module('appciv').controller.editCerere(event.recid);
                }
            },
            multiSearch: true,
            searches: [{
                field: 'id',
                caption: w2utils.lang('Nr.Comanda'),
                type: 'text'
            }, {
                field: 'data_comanda',
                caption: w2utils.lang('Data'),
                type: 'date'
            }, {
                field: 'nr_inreg_soc',
                caption: w2utils.lang('Nr client'),
                type: 'text'
            }, {
                field: 'data_inreg',
                caption: w2utils.lang('Data client'),
                type: 'date'
            }, {
                field: 'societate',
                caption: w2utils.lang('Beneficiar'),
                type: 'text'
            }, {
                field: 'stare_comanda',
                caption: w2utils.lang('Stare'),
                type: 'list',
                options: {
                    items: [{id:'Finalizata',text:w2utils.lang("Finalizata")},{id:'In lucru',text:w2utils.lang("In lucru")}, {id:'Prelucrata',text:w2utils.lang("Prelucrata")}, {id:'Depusa',text:w2utils.lang("Depusa")}]
                }
            }, {
                field: 'vin',
                caption: w2utils.lang('V.I.N.'),
                type: 'text'
            }, {
                field: 'serie_civ',
                caption: w2utils.lang('Serie CIV'),
                type: 'text'
            },{
              field:'nr_registru',
              caption:w2utils.lang('Nr registru'),
              type:'text'
            }],
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
                    // sf['oper'] = sf['operator'];
                    // delete sf['operator'];
                    if (sf.field === 'stare_comanda') {
                        sf.field = 'depusa';
                        switch (sf.value) {
                            case 'In lucru':
                                sf.value = '(0,1,2,3,4)';
                                break;
                            case 'Finalizata':
                                sf.value = '15';
                                break;
                            case 'Depusa':
                                sf.value = '(10,11,12,15)';
                                break;
                            case 'Prelucrata':
                                sf.value = '11';
                                break;
                            default:
                                break;
                        }
                        sf.operator = 'isin';
                    }
                    if(sf.type=='date'){
                        if(sf.operator == 'between'){
                            sf.value[0]=w2utils.formatDate(w2utils.isDate(sf.value[0],null,true),'dd.MM.yyyy')
                            sf.value[1]=w2utils.formatDate(w2utils.isDate(sf.value[1],null,true),'dd.MM.yyyy')
                        }else{
                            sf.value=w2utils.formatDate(w2utils.isDate(sf.value,null,true),'dd.MM.yyyy')
                        }
                    }
                }

            },
            columns: [{
                    field: 'id',
                    caption: w2utils.lang('Nr.Comanda'),
                    size: '150px',
                    sortable: true
                }, {
                    field: 'data_comanda',
                    caption: w2utils.lang('Data'),
                    size: '220px',
                    render:function(rec){
                        return rec.data_comanda?w2utils.formatDate(w2utils.isDate(rec.data_comanda,'dd.MM.yyyy',true)):''
                    },
                    sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_comanda).format('DD.MM.YYYY');
                        //                        }
                }, {
                    field: 'data_transmitere',
                    caption: w2utils.lang('Data transmitere'),
                    size: '220px',
                    render:function(rec){
                        return rec.data_transmitere?w2utils.formatDate(w2utils.isDate(rec.data_transmitere,'dd.MM.yyyy',true)):''
                    },
                    sortable: true
                }, {
                    field: 'nr_inreg_soc',
                    caption: w2utils.lang('Nr client'),
                    size: '100px',
                    sortable: true
                }, {
                    field: 'societate',
                    caption: w2utils.lang('Beneficiar'),
                    size: '30%',
                    sortable: true
                }, {
                    field: 'data_inreg',
                    caption: w2utils.lang('Data client'),
                    size: '120px',
                    render:function(rec){
                        return rec.data_inreg?w2utils.formatDate(w2utils.isDate(rec.data_inreg,'dd.MM.yyyy',true)):''
                    },
                    sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_inreg).format('DD.MM.YYYY');
                        //                        }
                }, {
                    field: 'stare_plata',
                    caption: w2utils.lang('Stare plata'),
                    size: '150px',
                    sortable: true,
                    render: function(record) {
                        switch (record.stare_plata) {
                            case 1:
                                return '<b style="color:green">'+w2utils.lang('ACHITAT')+'</b>';
                            case 2:
                                return '<b style="color:red">'+w2utils.lang('NEACHITAT')+'</b>';
                            case 5:
                                return '<b style="color:blue">'+w2utils.lang('FACTURAT-NEINCASAT')+'</b>';
                            default:
                                return '<b>'+w2utils.lang('NEPRELUCRAT')+'</b>';
                        }
                    }
                }, {
                    field: 'stare_comanda',
                    caption: w2utils.lang('Stare'),
                    size: '25%',
                    sortable: true,
                    render: function(record) {
                        var cls = '',
                            stare = '';
                        switch (record.depusa) {
                            case 0:
                            case 90:
                                cls = 'label label-default';
                                stare = w2utils.lang('Adaugati vehicule');
                                break;
                            case 1:
                            case 91:
                                stare = w2utils.lang('In lucru - OK');
                                cls = 'label label-primary';
                                break;
                            case 2:
                            case 92:
                            case 3:
                            case 93:
                                stare = w2utils.lang('In lucru - Vehicule invalide');
                                cls = 'label label-warning';
                                break;
                            case 4:
                            case 94:
                                stare = w2utils.lang('In lucru - Vehicule invalide');
                                cls = 'label label-danger';
                                break;
                            case 55:
                                stare = w2utils.lang('In curs de transmitere');
                                cls = 'label label-waiting';
                                break;
                            case 10:
                                stare = w2utils.lang('Depusa - asteapta prelucrare');
                                cls = 'label label-waiting';
                                break;
                            case 11:
                                stare = w2utils.lang('Prelucrata - OK');
                                cls = 'label label-ready';
                                break;
                            case 18:
                                stare = '<b style="color:green">'+w2utils.lang('Verificat - OK')+'</b>';
                                cls = 'label label-checked';
                                break;
                            case 19:
                                stare = '<b style="color:green">'+w2utils.lang('Tiparit')+'</b>';
                                cls = 'label label-ready';
                                break;
                            case 12:
                                stare = w2utils.lang('In prelucrare');
                                cls = 'label label-waiting';
                                break;
                            case 9:
                                stare = w2utils.lang('In eroare - vehicule netransmise');
                                cls = 'label label-warning';
                                break;
                            case 15:
                                stare = w2utils.lang('Finalizata');
                                cls = 'label label-success';
                                break;

                        }
                        return '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="' + cls + '">&nbsp;&nbsp;&nbsp;</label>';

                    }
                }, {
                    field: 'countvehicule',
                    caption: w2utils.lang('Nr. Vehicule'),
                    size: '100px',
                    sortable: true
                }

            ],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onAdd: function(event) {
                app.module('appciv').controller.editCerere();
            },
            onSelect: function(e) {
                e.onComplete = function() {
                    var record = w2ui['gridCereri'].get(e.recid);
                    if (record.stare_plata === 2) {
                        w2ui['gridCereri'].toolbar.enable('btnPlata');
                    }
                    if (record.depusa !== 0) {
                        w2ui['gridCereri'].toolbar.enable('btnJurnal');
                    }
                    if (record.depusa === 15 && record.stare_plata === 1) {
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = false;//*/enable('btnArhivareCIV');
                    }
                    if (record.depusa === 15) {
                        w2ui['gridCereri'].toolbar.enable('btnRaport');
                        w2ui['gridCereri'].toolbar.enable('btnRaportXLS');
                    }
                    if (record.depusa == 11) {
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = false;//*/enable('btnPrintCIV');
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[1].disabled = false;//*/enable('btnVerificCIV');
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = false;//*/enable('btnAnulareCIV');

                    }
                    if(record.depusa == 18){
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = false;//*/disable('btnAnulareCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = false;//*/enable('btnPrintCIV');
                    }
                    if(record.depusa == 19){
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = false;//*/disable('btnAnulareCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = false;//*/disable('btnPrintCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[1].disabled = false;//*/disable('btnVerificCIV');
                      w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = false;//*/enable('btnArhivareCIV');
                    }
                    if (record.depusa == 11 || record.depusa === 15) {
                        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = false;//*/enable('btnArhivareCIV');
                    }
                    //comanda nu este depusa, putem face unele actiuni
                    if (record.depusa < 10) {
                        w2ui['gridCereri'].toolbar.enable('btnEdit');
                        w2ui['gridCereri'].toolbar.enable('w2ui-delete');
                        w2ui['gridCereri'].toolbar.enable('btnUpload');
                        w2ui['gridCereri'].toolbar.enable('btnExcel');
                    } else {
                        w2ui['gridCereri'].toolbar.disable('btnEdit');
                        w2ui['gridCereri'].toolbar.disable('w2ui-delete');
                    }
                     if (record.depusa === 1 || record.depusa === 91) {
                        w2ui['gridCereri'].toolbar.enable('btnPostComanda');
                    }
                };
            },
            onLoad: self.disableGridButtons,
            onUnselect: self.disableGridButtons,
            onCollapse: function(event) {
                if (w2ui.hasOwnProperty('gridVehicule_' + event.recid)) {
                    w2ui['gridVehicule_' + event.recid].destroy();
                }
            },
            onExpand: function(event) {
                if (w2ui.hasOwnProperty('gridVehicule_' + event.recid)) {
                    w2ui['gridVehicule_' + event.recid].destroy();
                }
                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '505px'
                }, {
                    duration: 10,
                    complete: function() {
                        var record = w2ui['gridCereri'].get(event.recid);
                        app.module('appciv').controller.listVehicule(event.box_id, {
                            pid: event.recid,
                            canadd: record.depusa < 10 || (record.depusa >=90 && record.depusa<=93),
                            totalVehicule: record.countvehicule
                        });
                        w2ui.layout.resize();
                    }
                });
            },
            onRender: function(event) {
                event.onComplete = function() {
                    //                        onRender: function () {

                    //                        },
                };
            },
            onLoad:function(event){
              event.onComplete = function(){
                if(!self.refreshInterval){
                  self.refreshInterval = setInterval(function(){
                    $.ajax({
                      url:app.baseUrl + 'civutils/getStareComenzi',
                      type:'GET',
                      success:function(data){
                        data.response.map(function(stare){
                          w2ui.gridCereri.set(stare.id,{depusa:stare.depusa,countvehicule:stare.countvehicule,stare_plata:stare.stare_plata});
                        });
                      },
                      error:function(){
                          clearInterval(self.refreshInterval);
                      }
                    });
                  },60000);
                }
              };
            },
            postData:{location:self.location}
        });
        this.disableGridButtons();
        w2ui['gridCereri'].stateRestore();

    },
    raportMenuClick:function(e){
        console.log(e)
    },
    buildUpload: function() {
        var self = this;
        $('#fileupload').fileinput({
            uploadUrl: app.baseUrl + 'CIVFiles/uploadComanda',
            uploadClass: 'btn btn-toolbar',
            uploadTitle: w2utils.lang('Trimite fisier'),
            uploadLabel: w2utils.lang(' Trimite'),
            uploadIcon: '<i class="w2ui-icon-upload"></i>',
            showPreview: false,
            showRemove: false,
            showUpload: false,
            showCaption: false,
            progressClass: 'hide',
            uploadExtraData: function() {
                var id_comanda = w2ui['gridCereri'].getSelection() || null;
                if (id_comanda) {
                    return {
                        id_comanda: id_comanda
                    };
                }
            },
            browseClass: 'btn disabled btn-toolbar',
            browseTitle: w2utils.lang('Alege fisiere'),
            browseLabel: w2utils.lang(' Incarca vehicule'),
            browseIcon: '<i class="w2ui-icon-folder"></i>',
            removeClass: 'btn btn-toolbar',
            removeTitle: 'Reset',
            removeLabel: ' Reset',
            removeIcon: '<i class="w2ui-icon-cross"></i>'
        });

        $('#fileupload')
            .off('fileloaded').on('fileloaded', function() {
                w2ui['gridCereri'].lock();
                $('#fileupload').fileinput('upload');
            })
            .off('filebatchuploadsuccess').on('filebatchuploadsuccess', self.uploadComplete)
            .off('filebatchuploaderror').on('filebatchuploaderror', self.uploadError);
    },
    choosefile: function() {
        var chooser = this.$el.find('#fileupload');
        chooser.trigger('click');
    },
    onBeforeDestroy: function() {
        w2ui['gridCereri'].stateSave();
        for (var i in w2ui['gridCereri'].records) {
            var recid = w2ui['gridCereri'].records[i].recid;
            if (w2ui.hasOwnProperty('gridVehicule_' + recid)) {
                w2ui['gridVehicule_' + recid].destroy();
            }
        }
        w2ui.gridCereri.destroy();
        clearInterval(this.refreshInterval);
    },
    disableGridButtons: function() {
        w2ui['gridCereri'].toolbar.disable('btnPlata');
        w2ui['gridCereri'].toolbar.disable('btnEdit');
        w2ui['gridCereri'].toolbar.disable('w2ui-delete');
        w2ui['gridCereri'].toolbar.disable('btnUpload');
        w2ui['gridCereri'].toolbar.disable('btnJurnal');
        w2ui['gridCereri'].toolbar.disable('btnRaport');
        w2ui['gridCereri'].toolbar.disable('btnRaportXLS');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[0].disabled = true;//*/disable('btnPrintCIV');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[1].disabled = true;//*/disable('btnArhivareCIV');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[2].disabled = true;//*/disable('btnAnulareCIV');
        w2ui['gridCereri'].toolbar./*get('btnMeniuCIV').items[3].disabled = true;//*/disable('btnVerificCIV');
        w2ui['gridCereri'].toolbar.disable('btnPostComanda');
        w2ui['gridCereri'].toolbar.disable('btnExcel');
    },
    getJurnal: function(id) {
        var self = this;
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetJurnalComanda?id=' + id);
    },
    getRaport: function(id) {
        var self = this;
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetRaportComanda?id=' + id);
    },
    getRaportXLS: function(id) {
        chrome.downloads.download({
            url: app.baseUrl + 'civfiles/GetRaportComandaXLS?id=' + id,
            saveAs: true,
            headers: [{
                name: 'Content-Type',
                value: 'application/json'
            }],
            method: 'GET',
        }, function () {
            w2utils.unlock('#main');
            w2alert('Fiserul a fost descarcat!');
        });
        // var self = this;
        // ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetRaportComanda?id=' + id);
    },
    arhivareCIV: function(id) {
        app.module('appciv').controller.arhivareComanda(id);
    },
    anulareCIV: function(id) {
        app.module('appciv').controller.anulareComanda(id,this.refreshGrid);
    },
    verificRaport: function(id){
        var path = app.baseUrl + 'civfiles/GetRaportVerificareCIV?id=' + id;
        ipc.send('app:request:pdf', [path, function(win) {
            win.on('closed', function() {
                w2confirm({msg:'Finalizati verificarea comenzii?',opt:false,no_class:'btn-red',yes_class:'btn-blue'}).no(function() {
                    win.close(true);
                }).yes(function(){
                  $.post(app.baseUrl + 'vehicule/verificatComanda/' + id,{},function(){
                    w2ui.gridCereri.set(id[0],{depusa:18});
                  });
                  win.close(true);
                });
            });
        }]);
    },
    printRaport: function(id) {
        //
        var civnou = localStorage.getItem('civnou') && localStorage.getItem('civnou')=='true';
        var tipciv = civnou?'N':'V';
        var x= 0;
        var y = 0;
        try{
          var configPrinter = JSON.parse(fs.readFileSync( 'configPrinters.json'));
          var active = _.findWhere(configPrinter,{default:true});
          x = active.x;
          y = -active.y;
        }catch(ex){

        }
        var self = this;
        var reprez = ipc.sendSync('user:request:reprezentanta');
        var path = civnou ? app.civUrl + id+'?org=dot&reprez='+reprez + ' - D.O.T.&x=' + x + '&y=' + y : app.baseUrl + 'civfiles/GetTiparCIVComanda?id=' + id+'&x='+x+'&y='+y;
        ipc.send('app:request:pdf', [path, function(win) {
            win.on('closed', function() {
                w2confirm({msg:'Finalizati tiparirea comenzii?',opt:true,opt_text:'Verificat!',no_class:'btn-red',yes_class:'btn-blue' ,opt_class:'btn-orange'}).yes(function() {
                    $.post(app.baseUrl + 'vehicule/finalizeComanda/' + id + '?tipciv=' + tipciv,{},function(){
                      w2ui.gridCereri.set(id[0],{depusa:19});
                    });
                    win.close(true);
                }).no(function() {
                    win.close(true);
                }).opt(function(){
                  $.post(app.baseUrl + 'vehicule/verificatComanda/' + id,{},function(){
                    w2ui.gridCereri.set(id[0],{depusa:18});
                  });
                  win.close(true);
                });
            });
        }]);
    },
    uploadComplete: function(e, data) {
        var response = data.response; //(data.result);
        w2ui['gridCereri'].unlock();
        switch (response.code) {
            case 1: // comanda ok
                ipc.send('app:notification:show', {
                    type: 'success-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 2: //comanda ok, veh in eroare
            case 3:
                ipc.send('app:notification:show', {
                    type: 'warning-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 4: //comanda not ok
                ipc.send('app:notification:show', {
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 6: //comanda not ok
                ipc.send('app:notification:show', {
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            default:
                ipc.send('app:notification:show', {
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
        }
        if (response.comanda) {
            if (response.isNew) {
                w2ui['gridCereri']('add', response.comanda);
            } else {
                w2ui['gridCereri'].set(response.comanda.id, response.comanda);
                if (w2ui.hasOwnProperty('gridVehicule_' + response.comanda.id)) {
                    w2ui['gridVehicule_' + response.comanda.id].reload();
                }
            }

        }
        //app.module('cerere').trigger('vehicule:load', model.id);
    },
    uploadError: function(e, data) {
        $('#fileupload').fileinput('reset');
        w2ui['gridCereri'].unlock();
        ipc.send('app:notification:show', {
            type: 'error-template',
            text: 'Eroare la transmitere! Verificati fisierul!',
            title: 'Notificare'
        });
    },
    refreshGrid: function(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui['gridCereri'].reload();
        }
    }
});
