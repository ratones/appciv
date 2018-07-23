var ipc = requireNode('ipc');
var fs = requireNode('fs');

module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/individuale/index.hts'),
    className: 'page',
    attributes: function () {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    events: {},
    initialize: function (options) {
        var self = this;
        //this.location = options.location;
        this.gridName = 'gridIndividuale';
        _.bindAll(this, 'refreshGrid');
        this.setPermissions();
    },
    setPermissions: function () {
        this.allowSuper = ipc.sendSync('user:request:isuserinrole', [
            [16, 1], 'appciv'
        ]);
        this.allowDelete = ipc.sendSync('user:request:isuserinrole', [
            [1], 'appciv'
        ]);
        this.allowPrint = ipc.sendSync('user:request:isuserinrole', [
            [1, 15], 'appciv'
        ]);

    },
    onShow: function () {
        var self = this;
        this.renderGrid();
    },
    renderGrid: function () {
        if (w2ui.hasOwnProperty(this.gridName)) {
            w2ui[this.gridName].render($('#grid'));
        } else {
            var self = this;
            $('#grid').w2grid({
                name: self.gridName,
                url: app.baseUrl + 'individuale/getComenzi',
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
                            caption: 'Editare',
                            icon: 'w2ui-icon-pencil',
                            onClick: function (event) {
                                app.module('appciv').controller.editIndividuale(w2ui[self.gridName].getSelection());
                            }
                        }, {
                            type: 'break'
                        }, {
                            type: 'button',
                            id: 'btnJurnal',
                            caption: 'Jurnal',
                            icon: 'w2ui-icon-search',
                            onClick: function (e) {
                                self.getJurnal(w2ui[self.gridName].getSelection());
                            }
                        },{
                            type: 'button',
                            id: 'btnPlata',
                            caption: 'Instiintare plata',
                            icon: 'w2ui-icon-money',
                            onClick: function (e) {
                                app.module('appciv').controller.detaliiPlataIndividuale(w2ui[self.gridName].getSelection());
                            }
                        },/* {
                            type: 'button',
                            id: 'btnRaport',
                            caption: 'Raport',
                            icon: 'w2ui-icon-print',
                            disabled: true,
                            onClick: function (e) {
                                self.getRaport(w2ui[self.gridName].getSelection());
                            }
                        }, */{
                            type: 'break'
                        }, {
                            type: 'button',
                            id: 'btnPostComanda',
                            caption: 'Transmite comanda!',
                            icon: 'w2ui-icon-send',
                            onClick: function (e) {
                                w2confirm('Sigur finalizati aceasta comanda?').yes(function (response) {
                                    w2ui[self.gridName].lock();
                                    var id = w2ui[self.gridName].getSelection();
                                    //alert('ok');
                                    app.module('appciv').controller.transmitIndividuale(id, self.refreshGrid);
                                });
                            }
                        },
                        (self.allowPrint ? {
                            type: 'button',
                            id: 'btnPrintCIV',
                            caption: 'Tipar',
                            icon: 'w2ui-icon-print',
                            disabled: true,
                            onClick: function (e) {
                                self.printRaport(w2ui[self.gridName].getSelection());
                            }
                        } : {}),
                        (self.allowPrint ? {
                            type: 'button',
                            id: 'btnArhivareCIV',
                            caption: 'Arhivare',
                            icon: 'w2ui-icon-file',
                            disabled: true,
                            onClick: function (e) {
                                self.arhivareCIV(w2ui[self.gridName].getSelection());
                            }
                        } : {}),
                        (self.allowSuper ? {
                            type: 'button',
                            id: 'btnAnulareCIV',
                            caption: 'Anulare',
                            icon: 'w2ui-icon-ban',
                            disabled: true,
                            onClick: function (e) {
                                self.anulareCIV(w2ui[self.gridName].getSelection());
                            }
                        } : {})
                    ]
                },
                onDblClick: function (event) {
                    var record = w2ui[self.gridName].get(event.recid);
                    if (record.depusa < 10) {
                        app.module('appciv').controller.editIndividuale(event.recid);
                    }
                },
                multiSearch: true,
                searches: [{
                    field: 'id',
                    caption: 'Nr.Comanda ',
                    type: 'text'
                }, {
                    field: 'data_comanda',
                    caption: 'Data',
                    type: 'date'
                }, {
                    field: 'nr_inreg_soc',
                    caption: 'Nr client',
                    type: 'text'
                }, {
                    field: 'data_inreg',
                    caption: 'Data client',
                    type: 'date'
                }, {
                    field: 'societate',
                    caption: 'Beneficiar',
                    type: 'text'
                }, {
                    field: 'stare_comanda',
                    caption: 'Stare',
                    type: 'list',
                    options: {
                        items: ['Finalizata', 'In lucru', 'Prelucrata', 'Depusa']
                    }
                }, {
                    field: 'vin',
                    caption: 'V.I.N.',
                    type: 'text'
                }, {
                    field: 'serie_civ',
                    caption: 'Serie CIV',
                    type: 'text'
                }, {
                    field: 'nr_registru',
                    caption: 'Nr registru',
                    type: 'text'
                },{
                    field: 'cod_judet',
                    caption: 'Reprezentanta',
                    type: 'text'
                    //hidden:!self.allowSuper
                }],
                onSearch: function (event) {
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
                    }

                },
                columns: [{
                        field: 'id',
                        caption: 'Nr.Comanda',
                        size: '150px',
                        sortable: true
                    }, {
                        field: 'data_comanda',
                        caption: 'Data',
                        size: '220px',
                        sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_comanda).format('DD.MM.YYYY');
                        //                        }
                    }, {
                        field: 'data_transmitere',
                        caption: 'Data transmitere',
                        size: '220px',
                        sortable: true
                    }, {
                        field: 'nr_inreg_soc',
                        caption: 'Nr client',
                        size: '100px',
                        sortable: true
                    }, {
                        field: 'societate',
                        caption: 'Beneficiar',
                        size: '30%',
                        sortable: true
                    }, {
                        field: 'data_inreg',
                        caption: 'Data client',
                        size: '120px',
                        sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_inreg).format('DD.MM.YYYY');
                        //                        }
                    }, {
                        field: 'stare_plata',
                        caption: 'Stare plata',
                        size: '150px',
                        sortable: true,
                        render: function (record) {
                            switch (record.stare_plata) {
                                case 1:
                                    return '<b style="color:green">ACHITAT</b>';
                                case 2:
                                    return '<b style="color:red">NEACHITAT</b>';
                                case 5:
                                    return '<b style="color:blue">FACTURAT-NEINCASAT</b>';
                                default:
                                    return '<b>NEPRELUCRAT</b>';
                            }
                        }
                    }, {
                        field: 'stare_comanda',
                        caption: 'Stare',
                        size: '25%',
                        sortable: true,
                        render: function (record) {
                            var cls = '',
                                stare = '';
                            switch (record.depusa) {
                                case 0:
                                case 90:
                                    cls = 'label label-default';
                                    stare = 'Adaugati vehicule';
                                    break;
                                case 1:
                                case 91:
                                    stare = 'In lucru - OK';
                                    cls = 'label label-primary';
                                    break;
                                case 2:
                                case 92:
                                case 3:
                                case 93:
                                    stare = 'In lucru - Vehicule invalide';
                                    cls = 'label label-warning';
                                    break;
                                case 4:
                                case 94:
                                    stare = 'In lucru - Vehicule invalide';
                                    cls = 'label label-danger';
                                    break;
                                case 55:
                                case 5:
                                    stare = 'In curs de transmitere';
                                    cls = 'label label-waiting';
                                    break;
                                case 10:
                                    stare = 'Depusa - asteapta prelucrare';
                                    cls = 'label label-waiting';
                                    break;
                                case 11:
                                    stare = 'Prelucrata - OK';
                                    cls = 'label label-ready';
                                    break;
                                case 18:
                                    stare = '<b style="color:green">Verificat - OK</b>';
                                    cls = 'label label-checked';
                                    break;
                                case 19:
                                    stare = '<b style="color:green">Tiparit</b>';
                                    cls = 'label label-ready';
                                    break;
                                case 12:
                                    stare = 'In prelucrare';
                                    cls = 'label label-waiting';
                                    break;
                                case 9:
                                    stare = 'In eroare - vehicule netransmise';
                                    cls = 'label label-warning';
                                    break;
                                case 15:
                                    stare = 'Finalizata';
                                    cls = 'label label-success';
                                    break;

                            }
                            return '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="' + cls + '">&nbsp;&nbsp;&nbsp;</label>';

                        }
                    }, {
                        field: 'countvehicule',
                        caption: 'Nr. Vehicule',
                        size: '100px',
                        sortable: true
                    },{
                    field: 'cod_judet',
                    caption: 'Reprezentanta',
                    type: 'text',
                    size:'120px',
                    hidden:!self.allowSuper,
                    sortable:true
                }

                ],
                parser: function (responseText) {
                    var data = $.parseJSON(responseText);
                    // do other things
                    return {
                        status: 'success',
                        total: data.records,
                        records: data.rows
                    };
                },
                onAdd: function (event) {
                    app.module('appciv').controller.editIndividuale();
                },
                onSelect: function (e) {
                    e.onComplete = function () {
                        var record = w2ui[self.gridName].get(e.recid);
                        if (record.stare_plata === 2) {
                            w2ui[self.gridName].toolbar.enable('btnPlata');
                        }
                        if (record.depusa !== 0) {
                            w2ui[self.gridName].toolbar.enable('btnJurnal');
                        }
                        if (record.depusa === 15 && record.stare_plata === 1) {
                            w2ui[self.gridName].toolbar.enable('btnArhivareCIV');
                        }
                        // if (record.depusa === 15) {
                        //     w2ui[self.gridName].toolbar.enable('btnRaport');
                        // }
                        if (record.depusa == 11) {
                            w2ui[self.gridName].toolbar.enable('btnPrintCIV');
                            w2ui[self.gridName].toolbar.enable('btnAnulareCIV');

                        }
                        if (record.depusa == 18) {
                            w2ui[self.gridName].toolbar.disable('btnAnulareCIV');
                            w2ui[self.gridName].toolbar.enable('btnPrintCIV');
                        }
                        if (record.depusa == 19) {
                            w2ui[self.gridName].toolbar.disable('btnAnulareCIV');
                            w2ui[self.gridName].toolbar.disable('btnPrintCIV');
                            w2ui[self.gridName].toolbar.enable('btnArhivareCIV');
                        }
                        if (record.depusa == 11 || record.depusa === 15) {
                            w2ui[self.gridName].toolbar.enable('btnArhivareCIV');
                        }
                        //comanda nu este depusa, putem face unele actiuni
                        if (record.depusa < 10 || (record.depusa >30 && record.depusa < 100)) {
                            w2ui[self.gridName].toolbar.enable('btnEdit');
                            w2ui[self.gridName].toolbar.enable('w2ui-delete');
                            // w2ui[self.gridName].toolbar.enable('btnUpload');
                            // w2ui[self.gridName].toolbar.enable('btnExcel');
                        } else {
                            w2ui[self.gridName].toolbar.disable('btnEdit');
                            w2ui[self.gridName].toolbar.disable('w2ui-delete');
                        }
                        if (record.depusa === 1 || record.depusa === 91) {
                            w2ui[self.gridName].toolbar.enable('btnPostComanda');
                        }
                    };
                },
                onLoad: self.disableGridButtons.bind(self),
                onUnselect: self.disableGridButtons.bind(self),
                onCollapse: function (event) {
                    if (w2ui.hasOwnProperty('gridVehiculeIndividuale_' + event.recid)) {
                        w2ui['gridVehiculeIndividuale_' + event.recid].destroy();
                    }
                },
                onExpand: function (event) {
                    if (w2ui.hasOwnProperty('gridVehiculeIndividuale_' + event.recid)) {
                        w2ui['gridVehiculeIndividuale_' + event.recid].destroy();
                    }
                    $('#' + event.box_id).css({
                        margin: '0px',
                        padding: '0px',
                        width: '100%'
                    }).animate({
                        height: '505px'
                    }, {
                        duration: 10,
                        complete: function () {
                            var record = w2ui[self.gridName].get(event.recid);
                            app.module('appciv').controller.listVehiculeIndividuale(event.box_id, {
                                pid: event.recid,
                                canadd: record.depusa < 10 || (record.depusa >= 90 && record.depusa <= 93),
                                totalVehicule: record.countvehicule
                            });
                            w2ui.layout.resize();
                        }
                    });
                },
                onRender: function (event) {
                    event.onComplete = function () {
                        //                        onRender: function () {

                        //                        },
                    };
                },
                // onLoad: function (event) {
                //     event.onComplete = function () {
                //         if (!self.refreshInterval) {
                //             self.refreshInterval = setInterval(function () {
                //                 $.ajax({
                //                     url: app.baseUrl + 'civutils/getStareComenzi',
                //                     type: 'GET',
                //                     success: function (data) {
                //                         data.response.map(function (stare) {
                //                             w2ui[self.gridName].set(stare.id, {
                //                                 depusa: stare.depusa,
                //                                 countvehicule: stare.countvehicule,
                //                                 stare_plata: stare.stare_plata
                //                             });
                //                         });
                //                     },
                //                     error: function () {
                //                         clearInterval(self.refreshInterval);
                //                     }
                //                 });
                //             }, 60000);
                //         }
                //     };
                // }
            });
            this.disableGridButtons();
        }

    },
    disableGridButtons: function() {
        w2ui[this.gridName].toolbar.disable('btnPlata');
        w2ui[this.gridName].toolbar.disable('btnEdit');
        w2ui[this.gridName].toolbar.disable('w2ui-delete');
        // w2ui[this.gridName].toolbar.disable('btnUpload');
        w2ui[this.gridName].toolbar.disable('btnJurnal');
        w2ui[this.gridName].toolbar.disable('btnRaport');
        w2ui[this.gridName].toolbar.disable('btnPrintCIV');
        w2ui[this.gridName].toolbar.disable('btnArhivareCIV');
        // w2ui[this.gridName].toolbar.disable('btnExcel');
        w2ui[this.gridName].toolbar.disable('btnPostComanda');
        w2ui[this.gridName].toolbar.disable('btnAnulareCIV');
    },
    refreshGrid: function(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui[this.gridName].reload();
        }
    },
    onBeforeDestroy: function() {
        // for (var i in w2ui[this.gridName].records) {
        //     var recid = w2ui[this.gridName].records[i].recid;
        //     if (w2ui.hasOwnProperty('gridVehiculeIndividuale_' + recid)) {
        //         w2ui['gridVehiculeIndividuale_' + recid].destroy();
        //     }
        // }
        // w2ui[this.gridName].destroy();
    },
    printRaport: function(id) {
        var civnou = localStorage.getItem('civnou') && localStorage.getItem('civnou')=='true';
        var tipciv = civnou?'N':'V';
        //
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
        var path = civnou?app.civUrl + id + '?org=dot&reprez='+reprez + '&x=' + x + '&y=' + y:app.baseUrl + 'individuale/GetTiparCIVComanda?id=' + id+'&x='+x+'&y='+y;
        //civ nou http://10.2.2.84/restservice/api/printciv/1234?org=dot 
        ipc.send('app:request:pdf', [path, function(win) {
            win.on('closed', function() {
                w2confirm({msg:'Finalizati tiparirea comenzii?',no_class:'btn-red',yes_class:'btn-blue' ,opt_class:'btn-orange'}).yes(function() {
                    $.post(app.baseUrl + 'individuale/finalizeComanda/' + id + '?tipciv='+tipciv,{},function(){
                      w2ui[self.gridName].set(id[0],{depusa:19});
                    });
                    win.close(true);
                }).no(function() {
                    win.close(true);
                });
            });
        }]);
    },
    arhivareCIV: function(id) {
        app.module('appciv').controller.arhivareComandaIndividuale(id);
    },
});