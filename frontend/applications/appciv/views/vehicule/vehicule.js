var ipc = requireNode('ipc');
module.exports = window.Marionette.CompositeView.extend({
    template: require('./../../templates/vehicule/index.hts'),
    initialize: function(options) {
        var self = this;
        this.parentID = options.parentID;
        this.elid = options.element;
        this.canadd = options.canadd;
        self.caption = 'Lista vehicule atasate comenzii nr.' + self.parentID;
    },
    onRender: function() {
        var self = this;
        self.renderGrid();
    },

    serializeData: function() {
        return {
            'id_comanda': this.parentID
        };
    },
    renderGrid: function() {
        var self = this;
        $(self.elid).w2grid({
            name: 'gridVehicule_' + this.parentID,
            url: app.baseUrl + 'vehicule/getvehicule/' + self.parentID,
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            show: {
                toolbar: true,
                footer: true,
                selectColumn: true
            },
            columns: [{
                field: 'id',
                caption: 'ID',
                sortable: true,
                hidden: true,
                size: '1px'
            }, {
                field: 'nr_registru',
                caption: 'Nr. Omologare',
                sortable: true,
                size: '25%'
            }, {
                field: 'vin',
                caption: 'VIN',
                sortable: true,
                size: '25%'
            }, {
                field: 'wvta',
                caption: 'WVTA',
                sortable: true,
                size: '25%',
                render:function(rec){
                    return rec.wvta + '*' + rec.extensie;
                }
            }, {
                field: 'motiv_respingere',
                caption: 'Stare In Clar',
                sortable: true,
                size: '25%',
                hidden: true,
                searchable: false
            }, {
                field: 'stare',
                caption: 'Status',
                sortable: true,
                size: '25%',
                render: function(record) {
                    var cls = 'default',
                        stare = record.motiv_respingere;
                    switch (record.stare) {
                        case 0:
                            // stare = 'OK';
                            cls = 'label-default';
                            break;
                        case 1:
                            // stare = 'OK';
                            cls = 'label-primary';
                            break;
                        case 2:
                            // stare = 'Date eronate';
                            cls = 'label-warning';
                            break;
                        case 3:
                        case 8:
                            // stare = 'Invalid';
                            cls = 'label-danger';
                            break;
                        case 10:
                        case 55:
                            // stare = 'Transmis';
                            cls = 'label-waiting';
                            break;
                        case 11:
                            // stare = 'Prelucrat OK';
                            cls = 'label-ready';
                            break;
                        case 12:
                            // stare = 'Nu se poate prelucra';
                            cls = 'label-warning';
                            break;
                        case 4:
                            // stare = 'Netransmis';
                            cls = 'label-danger';
                            break;
                        case 15:
                            // stare = 'Tiparit';
                            cls = 'label-success';
                            break;
                        default:
                            break;
                    }
                    var html = '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="label ' + cls + '">&nbsp;&nbsp;&nbsp;</label>';
                    return html;
                }
            }],
            toolbar: {
                //                    onRender: function () {
                //                        if (!self.canadd) {
                //                            this.disable('btnAddVehicul');
                //                        }
                //                        this.disable('btnEditVehicul');
                //                        this.disable('btnDeleteVehicul');
                //                        this.disable('btnDetaliiVehicul');
                //                    },
                items: [{
                    type: 'button',
                    caption: 'Adauga',
                    icon: 'w2ui-icon-plus',
                    id: 'btnAddVehicul',
                    disabled: !self.canadd,
                    onClick: function(e) {
                        self.destroy();
                        app.module('appciv').router.navigate('appciv/addVehicul/' + self.parentID, true);
                    }
                }, {
                    type: 'button',
                    id: 'btnEditVehicul',
                    caption: 'Edit',
                    icon: 'w2ui-icon-pencil',
                    disabled: true,
                    onClick: function(event) {
                        var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                        self.destroy();
                        app.module('appciv').router.navigate('appciv/detaliiVehicul/' + id, true);
                    }
                }, {
                    type: 'button',
                    id: 'btnDeleteVehicul',
                    caption: 'Sterge',
                    icon: 'w2ui-icon-cross',
                    disabled: true,
                    onClick: function(event) {
                        w2ui['gridVehicule_' + self.parentID].delete();
                    }
                }, {
                    type: 'break'
                }, {
                    type: 'button',
                    id: 'btnDetaliiVehicul',
                    icon: 'w2ui-icon-search',
                    caption: 'Detalii',
                    disabled: true,
                    onClick: function(event) {
                        var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetVehiculComplet?id=' + id);
                    }
                },
                {
                    type: 'button',
                    id: 'btnNewWin',
                    icon: 'w2ui-icon-newwindow',
                    caption: 'Detaseaza',
                    disabled: false,
                    onClick: function(event) {
                        var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                        self.win = $(self.elid).w2panel({
                            name: 'listvehicles' + id,
                            showMax: true,
                            showMin: true,
                            preserveContent: true,
                            width: 800,
                            height: 600,
                            resizable: true,
                            maximized: false,
                            onOpen:function(){
                            },
                            onClose:function(){

                            }
                        });
                    }
                }]
            },
            onDblClick: function(event) {
                var b = this.get(event.recid).stare;
                if (b < 10 && (b !== 4 && b !== 3)) {
                    self.destroy();
                    app.module('appciv').router.navigate('appciv/detaliiVehicul/' + event.recid, true);
                }
            },
            multiSearch: false,
            multiSelect: true,
            searches: [{
                field: 'vin',
                caption: 'V.I.N. ',
                type: 'text'
            }, {
                field: 'wvta',
                caption: 'W.V.T.A.',
                type: 'text'
            }, {
                field: 'nr_registru',
                caption: 'Nr. Omologare',
                type: 'text'
            }, {
                field: 'stare',
                caption: 'Status',
                type: 'list',
                options: {
                    items: ['In lucru', 'Remediabile', 'Transmise', 'Prelucrate', 'Invalide', 'Tiparite']
                }
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onDeleted: function(event) {
                var response = JSON.parse(event.xhr.responseText);
                w2ui.gridCereri.get(response.id_comanda).depusa = response.status_comanda;
                w2ui.gridCereri.refreshCell(response.id_comanda, 'stare_comanda');
            },
            onSelect: function(event) {
                if (event.recid) {
                    var b = this.get(event.recid).stare;
                    if (b !== 4 && b !== 3) {
                        this.toolbar.enable('btnDetaliiVehicul');
                    }
                    if (b < 10) {
                        this.toolbar.enable('btnDeleteVehicul');
                        if (b !== 4 && b !== 3) {
                            this.toolbar.enable('btnEditVehicul');
                        }
                    }
                }

            },
            onUnselect: function() {
                this.toolbar.disable('btnEditVehicul');
                this.toolbar.disable('btnDeleteVehicul');
                this.toolbar.disable('btnDetaliiVehicul');
            },
            fixedBody: true,
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
                    // sf['oper'] = sf['operator'];
                    // delete sf['operator'];
                    if (sf.field === 'stare') {
                        switch (sf.value) {
                            case 'In lucru':
                                sf.value = '(0,1,2)';
                                break;
                            case 'Remediabile':
                                sf.value = '(2)';
                                break;
                            case 'Transmise':
                                sf.value = '(10,11,12,15)';
                                break;
                            case 'Prelucrate':
                                sf.value = '11';
                                break;
                            case 'Invalide':
                                sf.value = '(4,12,8,3)';
                                break;
                            case 'Tiparite':
                                sf.value = '15';
                                break;
                            default:
                                break;
                        }
                        sf.operator = 'isin';
                    }
                }

            },

            onLoad:function(event){
              var grid = this;
              event.onComplete = function(){
                if(!self.refreshInterval){
                  self.refreshInterval = setInterval(function(){
                    $.ajax({
                      url:app.baseUrl + 'civutils/getStareVehicule/'+self.parentID,
                      type:'GET',
                      success:function(data){
                        data.response.map(function(stare){
                          grid.set(stare.id,{stare:stare.stare,motiv_respingere:stare.motiv_respingere});
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
            onDestroy:function(){
              self.destroy();
            }
        });


    },
    onBeforeDestroy: function() {
        //w2ui['gridVehicule_' + this.parentID].destroy();
        if(this.win){
            event = {};
            //console.log(event);
            this.win.destroy();
        }
        clearInterval(this.refreshInterval);
    },
    infoVehicul: function(e) {
        e.preventDefault();
        var id = $(e.currentTarget).data('rowid');
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/GetVehiculComplet?id=' + id);
    },
    refreshGrid: function() {
        w2ui['gridVehicule' + this.parentID].reload();
    }
});
