var ipc = requireNode('ipc');
module.exports = window.Marionette.CompositeView.extend({
    template: require('./../../templates/individuale/vehicule.hts'),
    className: 'page',
    initialize: function (options) {
        var self = this;
        self.caption = 'Lista vehicule operator';
    },
    onRender: function () {
        var self = this;
        self.setPermissions();
    },
    setPermissions: function () {
        this.isOperator = ipc.sendSync('user:request:isuserinrole', [[18], 'appciv']);
    },
    onShow: function () {
        var self = this;
        this.renderGrid();
    },
    renderGrid: function () {
        var self = this;
        if (w2ui.hasOwnProperty('gridVehiculeOperator')) {
            w2ui['gridVehiculeOperator'].render(self.$el);
        } else {
            self.$el.w2grid({
                name: 'gridVehiculeOperator',
                url: app.baseUrl + 'individuale/getvehiculeOperator/',
                method: 'POST', // need this to avoid 412 error on Safari
                recid: 'id',
                show: {
                    toolbar: true,
                    footer: true,
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
                    size: '25%'
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
                    render: function (record) {
                        var cls = 'default',
                            stare = record.motiv_respingere;
                        switch (record.stare) {
                            case 0:
                                stare = 'OK';
                                cls = 'label-default';
                                break;
                            case 1:
                                stare = 'OK';
                                cls = 'label-primary';
                                break;
                            case 2:
                                stare = 'Date eronate';
                                cls = 'label-warning';
                                break;
                            case 3:
                            case 19:
                                stare = 'Tiparit';
                                cls = 'label-danger';
                                break;
                            case 10:
                            case 55:
                                stare = 'Transmis';
                                cls = 'label-waiting';
                                break;
                            case 11:
                                stare = 'Prelucrat OK';
                                cls = 'label-ready';
                                break;
                            case 12:
                                stare = 'Prelucrat OK';
                                cls = 'label-ready';
                                break;
                            case 18:
                                stare = 'Verificat';
                                cls = 'label-danger';
                                break;
                            case 15:
                                stare = 'Tiparit';
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
                    items: [{
                        type: 'button',
                        id: 'btnEditVehicul',
                        caption: 'Detalii',
                        icon: 'w2ui-icon-pencil',
                        disabled: true,
                        onClick: function (event) {
                            var id = w2ui['gridVehiculeOperator'].getSelection();
                            self.destroy();
                            app.module('appciv').router.navigate('appciv/detaliiVehiculIndividuale/' + id, true);
                        }
                    }]
                },
                searches: [{
                    field: 'vin',
                    caption: 'V.I.N. ',
                    type: 'text'
                }],
                parser: function (responseText) {
                    var data = $.parseJSON(responseText);
                    // do other things
                    return {
                        status: 'success',
                        total: data.records,
                        records: data.rows
                    };
                },
                onSelect: function (event) {
                    this.toolbar.enable('btnEditVehicul');
                },
                onUnselect: function () {
                    this.toolbar.disable('btnEditVehicul');
                },
                onDestroy: function () {
                    self.destroy();
                }
            });
        }
    },

    refreshGrid: function () {
        w2ui['gridVehiculeIndividuale_' + this.parentID].reload();
    }
});
