var ipc = requireNode('ipc');
module.exports = window.Marionette.ItemView.extend({
    template: require('./../../templates/cereri/plati.hts'),
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
        _.bindAll(this,'refreshGrid');
        this.setPermissions();
    },
    setPermissions:function(){

    },
    onShow: function() {
        var self = this;
        this.renderGrid();
    },
    renderGrid: function() {
        var self = this;
        var dt = new Date();
       
        dt.setDate(1); // going to 1st of the month
        dt.setHours(-1);
        var lDay = dt.getDate().pad();
        var prevMonth = Number((dt.getMonth()+1)).pad();
        var year = dt.getFullYear();

        var fDate = self.fdate = '01.'+ prevMonth +'.'+ year;
        var lDate = self.lDate = lDay + '.' + prevMonth + '.' + year;
        
        
        $('#grid').w2grid({
            name: 'gridPlati',
            url: app.baseUrl + 'comenzi/getPlati',
            method: 'POST', 
            recid: 'id',

            fixedBody: true,
            groupData: ['locatie'],
            show: {
                toolbar: true,
                footer: true,
                rowExpand:true
            },
            toolbar: {

                items: [
                    {
                        type: 'button',
                        disabled: false,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                           self.exportxls();
                        }
                    },
                    {
                        type: 'break'
                    }, 
                    {
                        type: 'button',
                        id: 'btnRaport',
                        caption: w2utils.lang('Raport'),
                        icon: 'w2ui-icon-print',
                        disabled:false,
                        onClick: function(e) {
                            self.printRaport();
                        }
                    }
                ]
            },
            summaryData: {
                gridSummary: [
                     {
                        field: 'locatie',
                        summary: 'count'
                    },
                     {
                        field: 'suma',
                        summary: 'sum'
                    }, {
                        field: 'nrbuc',
                        summary: 'sum'
                    }                   
                ]
            },
            multiSearch: true,
            searches: [
                 {
                    field: 'client',
                    caption: w2utils.lang('Beneficiar'),
                    type: 'text'
                },{
                    field: 'locatie',
                    caption: w2utils.lang('Punct de lucru'),
                    type: 'text'
                }, {
                    field: 'id',
                    caption: w2utils.lang('Nr.Comanda'),
                    type: 'int'
                }, 
                {
                    field: 'data_factura',
                    caption: w2utils.lang('Data factura'),
                    type: 'date'
                }
            ],
            summaryTemplates: [
                 {
                field: 'locatie',
                render: function(record) {
                    return '<b>Total Facturi: ' + record.locatie + ' buc</b>';
                }
            },
               {
                field: 'suma',
                render: function(record) {
                    return '<b>Total Incasari: ' + record.suma + ' Lei</b>';
                }
            }, {
                field: 'nrbuc',
                render: function(record) {
                    return '<b>Total CIV: ' + record.nrbuc + ' buc</b>';
                }
            }],
            searchData : [              
                 {field: "data_factura", type: "date", operator: "between", value: [fDate, lDate]}
            ],
            groupTemplates: [{
                field: 'beneficiar',
                render: function(record) {
                    return '<b >' + record.beneficiar + ' Total(' + record.grpcnt + ')</b>';
                }
            },
             {
                field: 'locatie',
                render: function(record) {
                    return '<b >' + record.locatie + ' Total(' + record.grpcnt + ')</b>';
                }
            },
             {
                field: 'id',
                render: function(record) {
                    return '<b >' + record.id + ' Total(' + record.grpcnt + ')</b>';
                }
            }, {
                field: 'data_factura',
                render: function(record) {
                    return '<b >' + record.data_factura + ' Total(' + record.grpcnt + ')</b>';
                }
            }],
            hasInitialSearchData:true,
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
            columns: [
            {
                field: 'client',
                caption: w2utils.lang('Beneficiar'),
                size: '350px',
                sortable: true
            }, {
                field: 'id',
                caption: w2utils.lang('Nr.Comanda'),
                size: '150px',
                sortable: true
            }, {
                field: 'nr_factura',
                caption: w2utils.lang('Nr factura'),
                size: '220px',
                sortable: true
            },
            {
                field: 'serie_factura',
                caption: w2utils.lang('Serie factura'),
                size: '120px',
                sortable: true
            },
            {
                field: 'data_factura',
                caption: w2utils.lang('Data factura'),
                size: '120px',
                sortable: true
            }, {
                field: 'nrbuc',
                caption: w2utils.lang('Numar bucati'),
                size: '200px',
                sortable: true
            }, {
                field: 'suma',
                caption: w2utils.lang('Suma incasata'),
                size:'200px',
                sortable: true
            },
            {
                field: 'locatie',
                caption: w2utils.lang('Punct de lucru'),
                size: '150px',
                sortable: true
            }

            ],
            postData:{
                summaryData: {
                    gridSummary: [
                        {
                            field: 'suma',
                            summary: 'sum'
                        }, {
                            field: 'nrbuc',
                            summary: 'sum'
                        },
                        {
                        field: 'locatie',
                        summary: 'count'
                    }
                    ]
                },
            },
            enableGrouping: true,
            groupData: ['locatie'],
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
        // w2ui['gridPlati'].stateRestore();
    },
    exportxls:function(){
        var grid = w2ui['gridPlati'];
        var post = {
            cmd:'get-xls',
            limit:35000,
            offset:0,
            search:grid.searchData,
            searchLogic:"AND"
        };
        
        // $('#dialog').trigger('click');
        //   $('#dialog').off('change').on('change', function (event) {
            ipc.send('app:request:file',{url:grid.url,method:'POST',data:post,filename:'export.xls'});
        //     $(this).val('');
        //   });
     },
     printRaport:function(id){
        var self = this;
        var grid = w2ui['gridPlati'];
        var post = {
            cmd:'get-xls',
            limit:35000,
            offset:0,
            search:grid.searchData,
            searchLogic:"AND"
        };
        ipc.send('app:request:pdf', [app.baseUrl + 'comenzi/GetRaportPlati?data='+JSON.stringify(post), function(win){}]);
    },
    serialize :function(obj) {
      var str = [];
      for(var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    },
    onBeforeDestroy: function() {
        w2ui['gridPlati'].stateSave();
        w2ui.gridPlati.destroy();
    },   
    refreshGrid: function(error) {
        if(error){
            w2alert(error);
        }
        else{
            w2ui['gridPlati'].reload();
        }
    }
});
