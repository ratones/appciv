var ipc = requireNode('ipc');
module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/situatie.hts'),
    className: 'page',
    attributes: function() {
        var minWidth = 950;
        var width = $('#main').width();
        var setWidth = width >= minWidth ? width : minWidth;
        return {
            style: 'min-width:' + setWidth + 'px'
        };
    },
    initialize: function(options) {
        var self = this;
        _.bindAll(this, 'refreshGrid');
        // this.setPermissions();
    },
    onShow: function() {
        this.renderGrid();
    },
    renderGrid: function() {
        var self = this;
        var dt = new Date();

        dt.setDate(1); // going to 1st of the month
        dt.setHours(-1);
        var lDay = dt.getDate().pad();
        var prevMonth = Number((dt.getMonth() + 1)).pad();
        var year = dt.getFullYear();

        var fDate = self.fdate = '01.' + prevMonth + '.' + year;
        var lDate = self.lDate = lDay + '.' + prevMonth + '.' + year;

        $('#grid').w2grid({
            name: 'gridSituatie',
            url: app.baseUrl + 'individuale/getSituatieVehicule',
            method: 'POST',
            recid: 'id',
            fixedBody: true,
            enableGrouping: true,
            recid: 'vin',
            show: {
                toolbar: true,
                footer: true
            },
            toolbar: {

                items: [{
                        type: 'button',
                        disabled: false,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                            self.exportxls();
                        }
                    },
                    // {
                    //     type: 'break'
                    // },
                    // {
                    //     type: 'button',
                    //     id: 'btnRaport',
                    //     caption: 'Raport',
                    //     icon: 'w2ui-icon-print',
                    //     disabled: false,
                    //     onClick: function(e) {
                    //         self.printRaport();
                    //     }
                    // }
                ]
            },
            summaryData: {
                gridSummary: [{
                    field: 'vin',
                    summary: 'count'
                }]
            },
            groupData: ['user_displayname'],
            multiSearch: true,
            searches: [{
                    field: 'client',
                    caption: 'Beneficiar',
                    type: 'text'
                },
                {
                    field: 'comanda',
                    caption: 'Nr.Comanda ',
                    type: 'int'
                },
                {
                    field: 'data_tipar',
                    caption: 'Data tipar',
                    type: 'date'
                },
                {
                    field: 'user_displayname',
                    caption: 'Expert DOI',
                    type: 'text'
                },
                {
                    field: 'user_operator',
                    caption: 'Operator',
                    type: 'text'
                }
            ],
            summaryTemplates: [{
                field: 'vin',
                render: function(record) {
                    return '<b>Total CIV-uri: ' + record.vin + '</b>';
                }
            }],
            groupTemplates: [{
                field: 'user_displayname',
                render: function(record) {
                    return '<b >' + record.user_displayname + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'user_operator',
                render: function(record) {
                    return '<b >' + record.user_operator + ' Total(' + record.grpcnt + ')</b>';
                }
            },{
                field: 'comanda',
                render: function(record) {
                    return '<b >' + record.comanda + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'client',
                render: function(record) {
                    return '<b >' + record.client + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'data_tipar',
                render: function(record) {
                    return '<b >' + record.data_tipar + ' Total(' + record.grpcnt + ')</b>';
                }
            }],
            searchData: [{
                field: "data_tipar",
                type: "date",
                operator: "between",
                value: [fDate, lDate]
            }],
            hasInitialSearchData: true,
            onSearch: function(event) {},
            columns: [{
                    field: 'client',
                    caption: 'Beneficiar',
                    size: '350px',
                    sortable: true
                }, {
                    field: 'comanda',
                    caption: 'Nr.Comanda',
                    size: '150px',
                    sortable: true
                }, {
                    field: 'vin',
                    caption: 'Cod VIN',
                    size: '220px',
                    sortable: true
                },
                {
                    field: 'serie_civ',
                    caption: 'Serie CIV',
                    size: '120px',
                    sortable: true
                },
                {
                    field: 'data_tipar',
                    caption: 'Data tipar',
                    size: '120px',
                    sortable: true
                }, {
                    field: 'user_displayname',
                    caption: 'Expert DOI',
                    size: '200px',
                    sortable: true
                },{
                    field: 'user_operator',
                    caption: 'Operator',
                    size: '200px',
                    sortable: true
                },
                 {
                    field: 'nr_crt',
                    caption: 'Numar registru',
                    size: '200px',
                    sortable: true
                },
                 {
                    field: 'factura',
                    caption: 'Factura',
                    size: '200px',
                    sortable: true
                }
            ],
            postData: {
                summaryData: {
                    gridSummary: [{
                        field: 'vin',
                        summary: 'count'
                    }]
                },
            },
            // enableGrouping: true,
            // groupData: ['client'],
            parser: function(response) {
                var data = JSON.parse(response);
                var result = {
                    status: 'success',
                    records: data.rows,
                    summary: data.summary || [],
                    total: data.records
                };
                // if (data.summary) {
                //     data.summary[0].summary = true;
                //     result.records.push(data.summary[0]);
                // }
                return result;
            },
        });
        w2ui['gridSituatie'].stateRestore();
    },
    exportxls: function() {
        var grid = w2ui['gridSituatie'];
        var post = {
            cmd: 'get-xls',
            limit: 35000,
            offset: 0,
            search: grid.searchData,
            searchLogic: "AND"
        };

        //$('#dialog').trigger('click');
        //$('#dialog').off('change').on('change', function(event) {
            ipc.send('app:request:file', {
                url: grid.url,
                method: 'POST',
                data: post,
                filename: ''
            });
         //   $(this).val('');
       // });
    },
    printRaport: function(id) {
        var self = this;
        var grid = w2ui['gridSituatie'];
        var post = {
            cmd: 'get-xls',
            limit: 35000,
            offset: 0,
            search: grid.searchData,
            searchLogic: "AND"
        };
        ipc.send('app:request:pdf', [app.baseUrl + 'individuale/GetRaporSituatie?data=' + JSON.stringify(post), function(win) {}]);
    },
    serialize: function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    },
    onBeforeDestroy: function() {
        w2ui['gridSituatie'].stateSave();
        w2ui.gridSituatie.destroy();
    },
    refreshGrid: function(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui['gridSituatie'].reload();
        }
    }
});
