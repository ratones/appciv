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
            url: app.baseUrl + 'vehicule/getSituatieVehicule',
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
            groupData: ['ptlucru'],
            multiSearch: true,
            searches: [{
                    field: 'client',
                    caption: w2utils.lang('Beneficiar'),
                    type: 'text'
                },
                {
                    field: 'comanda',
                    caption: w2utils.lang('Nr.Comanda'),
                    type: 'int'
                },
                {
                    field: 'data_tipar',
                    caption: w2utils.lang('Data tipar'),
                    type: 'date'
                },
                {
                    field: 'ptlucru',
                    caption: w2utils.lang('Punct de lucru'),
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
                field: 'ptlucru',
                render: function(record) {
                    return '<b >' + record.ptlucru + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
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
            onSearch: function(event) {
                for (var i in event.searchData) {
                    var sf = event.searchData[i];
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
                    field: 'client',
                    caption: w2utils.lang('Beneficiar'),
                    size: '350px',
                    sortable: true
                }, {
                    field: 'comanda',
                    caption: w2utils.lang('Nr.Comanda'),
                    size: '150px',
                    sortable: true
                }, {
                    field: 'vin',
                    caption: w2utils.lang('Cod VIN'),
                    size: '220px',
                    sortable: true
                },
                {
                    field: 'serie_civ',
                    caption: w2utils.lang('Serie CIV'),
                    size: '120px',
                    sortable: true
                },
                {
                    field: 'data_tipar',
                    caption: w2utils.lang('Data tipar'),
                    size: '120px',
                    sortable: true
                }, {
                    field: 'ptlucru',
                    caption: w2utils.lang('Punct de lucru'),
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
            }
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

        $('#dialog').trigger('click');
        $('#dialog').off('change').on('change', function(event) {
            ipc.send('app:request:file', {
                url: grid.url,
                method: 'POST',
                data: post,
                filename: $(this).val()
            });
            $(this).val('');
        });
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
        ipc.send('app:request:pdf', [app.baseUrl + 'vevicule/GetRaporSituatie?data=' + JSON.stringify(post), function(win) {}]);
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
