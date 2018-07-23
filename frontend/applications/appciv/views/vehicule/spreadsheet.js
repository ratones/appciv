var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'page',
    template: require('./../../templates/vehicule/spreadsheet.hts'),
    events: {
        'click #load': 'loadData',
        'click #save': 'saveData',
        'click #copy': 'duplicateRows',
        'click #back': 'back'
    },
    back: function() {
        window.location.hash = '#appciv/cereri';
    },
    duplicateRows: function() {
        var array = w2ui.spreadsheetVehicule.records;
        var source = $.extend({}, array[0]);
        delete source.vin;
        delete source.recid;
        delete source.culoare;
        delete source.an;
        delete source.serie;

        for (var i = 1; i < array.length; i++) {
            for(var field in array[i]){
              if(array[i][field]){
                delete source[field];
              }
            }
            w2ui.spreadsheetVehicule.set(i, source);
        }
        // w2ui.spreadsheetVehicule.save();
    },
    resetGrid: function() {
        w2ui.spreadsheetVehicule.columns = [];
        w2ui.spreadsheetVehicule.records = [];
        w2ui.spreadsheetVehicule.refresh();
    },
    onShow: function() {
        var self = this;
        // this.validators={};
        this.isValid = true;
        // console.log('spreadsheet');
        this.buildLoad();
        $().w2grid({
            name: 'spreadsheetVehicule',
            show: {
                toolbar: true,
                toolbarAdd: true,
                toolbarDelete: true,
                toolbarSave:true,
                footer: true,
                lineNumbers: true
            },
            selectType: 'cell',
            records: [],
            columns: [],
            toolbar: {
                items: [
                // {
                //     type: 'button',
                //     id: 'save',
                //     text: 'Salveaza',
                //     icon: 'w2ui-icon-check',
                //     onClick: self.saveData.bind(self)
                // },
                 {
                    type: 'button',
                    id: 'load',
                    text: 'Incarca',
                    icon: 'w2ui-icon-upload',
                    onClick: self.loadData.bind(self)
                }, {
                    type: 'button',
                    id: 'multiply',
                    text: 'Multiplica randuri',
                    icon: 'w2ui-icon-list',
                    onClick: self.duplicateRows.bind(self)
                }, {
                    type: 'button',
                    id: 'reset',
                    text: 'Reset',
                    icon: 'w2ui-icon-trash',
                    onClick: self.resetGrid.bind(self)
                }, {
                    type: 'check',
                    id: 'anvoptionale',
                    text: 'Anvelope Optionale',
                    icon: 'w2ui-icon-wrench',
                    onClick: self.activateOptionale.bind(self)
                }]
            },
            onPaste: function(event) {
              var me = this;
              var temp = [];
              event.text.split('\n').map(function(t){
                if(t && t.trim() !== '')
                {
                  temp.push(t);
                }
              });
              event.text = temp.join('\n');

                //var data = event.text.split('\n');
                var index = temp.length;
                //if(!data[index] || data[index] === '') index--;
                for (var i = 1; i < index; i++) {
                    this.add({
                        recid: i
                    },true);
                }
                // event.onComplete = this.save;
            },
            onAdd: function() {
                this.add({
                    recid: this.records.length + 1
                },true)
            },
            onChange: function(e) {
                e.onComplete = function() {
                    var newobj = {};
                    newobj[this.columns[e.column].field] = e.value_new;
                    this.set(e.recid,newobj);
                }
            },
            onSubmit:function(e){
                e.onComplete = function(){
                    self.saveData.apply(self,arguments);
                };
            },
            onDelete: function(event) {
                var array = this.getSelection();
                event.onComplete = function() {
                    var prevrecid;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].recid === prevrecid) continue;
                        prevrecid = array[i].recid;
                        this.remove(prevrecid);
                    }
                    for (var i = 0; i < this.records.length; i++) {
                        this.records[i].recid = i;
                    }
                }
            }

        });
        $('#vehicles').w2render('spreadsheetVehicule');
    },
    activateOptionale: function(e) {
        if (e) {
            e.onComplete = function() {
                var state = w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked;
                if (!state) {
                    for (var i = 2; i < 20; i++) {
                        w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_1');
                        w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_2');
                    }
                } else {
                    for (var i = 2; i < 20; i++) {
                        w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_1');
                        w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_2');
                    }
                }
            }
        } else {
            var state = w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked;
            if (!state) {
                for (var i = 2; i < 20; i++) {
                    w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_1');
                    w2ui.spreadsheetVehicule.hideColumn('anv_'+i+'_2');
                }
            } else {
                for (var i = 2; i < 20; i++) {
                    w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_1');
                    w2ui.spreadsheetVehicule.showColumn('anv_'+i+'_2');
                }
            }
        }
        // w2ui.spreadsheetVehicule.columns
    },
    loadData: function(e) {
        var self = this;
        // var options = {
        // 	  rowHeaders: true,
        //         colHeaders: true,
        //         minSpareRows: 1,
        //         contextMenu: true,
        //         beforeValidate :self.beforeValidate.bind(self)
        //     };
        $.ajax({
            url: app.baseUrl + 'civutils/getdateciv',
            type: 'POST',
            data: {
                id_tvv: $('#versiune').data('selected').id,
                id_extensie: $('#extensie').data('selected').id
            },
            success: function(response) {
                var data = response.data;
                var columns = [],
                    records = [];
                for (var i = 0; i < data.colHeaders.length; i++) {
                    
                    var editOptions = data.columns[i].editor;
                    var editor;

                    if (editOptions) {
                        if (data.columns[i].data === 'culoare') {
                            editor = {
                                type: 'combo'
                            }
                        } else {
                            editor = {
                                type: editOptions === 'select' ? 'select' : 'text',
                            }
                        }
                        if (data.columns[i].selectOptions) {
                            editor.items = [];
                            for (var x = 0; x < data.columns[i].selectOptions.length; x++) {
                                editor.items.push({
                                    id: data.columns[i].selectOptions[x],
                                    text: data.columns[i].selectOptions[x]
                                });
                            }
                        }
                    } else if (data.columns[i].type) {
                        editor = {
                            type: 'float'
                        };
                        if (data.columns[i].interval) {
                            editor.min = Number(data.columns[i].interval[0]);
                            editor.max = Number(data.columns[i].interval[1]);
                        }
                    } else {
                        editor = {
                            type: 'text'
                        };
                    }


                    columns.push({
                        field: data.columns[i].data,
                        caption: data.colHeaders[i],
                        sortable: true,
                        size: data.columns[i].data.search('anv') !== -1 || data.columns[i].data.search('vin') !== -1 ? '230px' : data.columns[i].data.search('culoare') !== -1 ? '150px' : '100px',
                        editable: editor
                    });
                }
                data.data.recid = 0;
                records.push(data.data);

                if (w2ui.hasOwnProperty('spreadsheetVehicule')) {
                    w2ui.spreadsheetVehicule.columns = columns;
                    w2ui.spreadsheetVehicule.records = records;
                    w2ui.spreadsheetVehicule.refresh();
                }
                self.activateOptionale();
            }
        });
    },
    buildLoad:function() {
        var self = this;
        $('#wvta').w2field('list',{url:app.baseUrl + 'civutils/getWVTA',minLength: 0,postData:{idcom:self.options.id_comanda},cascadeTo:['#extensie']});
        $('#extensie').w2field('list',{cascadeTo:['#tip'],url:app.baseUrl + 'civutils/getExtensiiWVTA',minLength: 0,postData:function(){return {id_wvta:$('#wvta').data('selected').id,idcom:self.options.id_comanda};}});
        $('#tip').w2field('list',{cascadeTo:['#varianta'],url:app.baseUrl + 'civutils/gettipuri',minLength: 0,postData:function(){return {id_extensie:$('#extensie').data('selected').id,idcom:self.options.id_comanda};}});
        $('#varianta').w2field('list',{cascadeTo:['#versiune'],url:app.baseUrl + 'civutils/getvariante',minLength: 0,postData:function(){return {idcom:self.options.id_comanda,id_wvta:$('#wvta').data('selected').id,tip:$('#tip').data('selected').id};}});
        $('#versiune').w2field('list',{url:app.baseUrl + 'civutils/getversiuni',minLength: 0,postData:function(){return {idcom:self.options.id_comanda,id_wvta:$('#wvta').data('selected').id,varianta:$('#varianta').data('selected').id,tip:$('#tip').data('selected').id};}});
        $('#versiune').on('change', function() {
            self.loadData();
        });
    },
    validator:function(value, callback) {
        callback(true);
    },
    beforeValidate:function(value, row, prop, source) {
        var interval = this.validators[prop];
        var col = this.hot.propToCol(prop);
        var totalRows = this.hot.countRows();
        if (row < totalRows - 1) {
            if (interval) {
                if (value && value != '' && value >= Number(interval[0]) && value <= Number(interval[1])) {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                } else {
                    if (!value || value === '')
                        $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare obligatorie!');
                    else
                        $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare intre ' + interval[0] + ' si ' + interval[1]);
                    this.isValid = false;
                }
            } else if (prop === 'vin') {
                if (!this.validateVin(value)) {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare invalida!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }

            } else if (prop === 'an') {
                if (value < 1960 || value > new Date().getFullYear()) {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare invalida!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }
            } else {
                if (!value || value === '') {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare obligatorie!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }
            }
        }
    },
    validateRow:function(row, rowindex) {
        var valid = true;
        var grid = w2ui.spreadsheetVehicule;
        var columns = grid.columns;
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var tr = $('#grid_spreadsheetVehicule_rec_'+rowindex);//grid.getCellHTML(rowindex,i);
            var cell = tr.find('td[col="'+i+'"]');
            if (!row[column.field] || row[column.field] === '') {
                /*$('#grid_spreadsheetVehicule_data_'+rowindex+'_'+i)*/cell.w2tag('Camp obligatoriu', {
                    'class': 'w2ui-error'
                });
                valid = false;
            }
            if (column.field === 'vin') {
                valid = this.validateVin(row['vin']);
                if (!valid)
                    /*$('#grid_spreadsheetVehicule_data_'+rowindex+'_'+i)*/cell.w2tag('Valoare incorecta', {
                        'class': 'w2ui-error'
                    });
            }
        }
        return valid;
    },
    saveData:function() {
        var cansave = true;
        var self = this;
        var array = w2ui.spreadsheetVehicule.records;
        self.isValid = true;
        for (var i = 0; i < array.length; i++) {
            if (!self.validateRow(array[i], i)) self.isValid = false;
        }
        if (!self.isValid) {
            var opt = {
                text: 'Vehiculele contin erori!',
                title: 'Notificare',
                type: 'error-template'
            };
            ipc.send('app:notification:show', opt);
            return;
        }
        var postData = {
            id_tvv: $('#versiune').data('selected').id,
            id_extensie: $('#extensie').data('selected').id,
            id_comanda: self.options.id_comanda,
            data: w2ui.spreadsheetVehicule.records,
            optionale:w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked
        }
        if (cansave && self.isValid) {
            $('#validationSummary').empty();
             w2utils.lock('#main', 'Va rugam asteptati...', true);
            $.ajax({
                url: app.baseUrl + 'civutils/saveVehiculeExcel',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                success: function(response) {
                    if (response.errors.length === 0) {
                        $('#validationSummary').empty();
                        var opt = {
                            text: 'Vehiculele au fost adaugate!',
                            title: 'Notificare',
                            type: 'success-template'
                        };
                        ipc.send('app:notification:show', opt);
                    } else {
                        var opt = {
                            text: 'Vehiculele contin erori!',
                            title: 'Notificare',
                            type: 'error-template'
                        };
                        ipc.send('app:notification:show', opt);

                        response.errors.map(function(error) {
                            for (var err in error) {
                                $('#validationSummary').append('<span>' + err + ': ' + error[err] + '</span><br>');
                            }
                        });
                    }
                    response.goodVehicles.map(function(vin) {
                        var rows = w2ui.spreadsheetVehicule.records;
                        for (var row = 0; row < rows.length; row++) {
                            if (rows[row].vin === vin) {
                                w2ui.spreadsheetVehicule.remove(rows[row].recid);
                            }
                        }
                    });
                      w2utils.unlock('#main');
                },
                error: function(data) {
                    w2utils.unlock('#main');
                    data.map(function(err) {
                        $('#validationSummary').append('<span>' + err + ': ' + data[err] + '</span><br>');
                    });
                }
            });
        } else {
            //w2alert('datele nu sunt valide!');
        }
    },
    validateVin:function(value, source) {
        var vin = value; //.toUpperCase();
        var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
        //var wild = /^$/;

        if (vin !== undefined && vin.length > 0) {
            if (regex.test(vin) && vin.length === 17) {
                //app.Util.removeError($('#vin').parent());
                return true;
                //}else if(wild.test(vin)){

            } else {
                return false;
            }
        }
    },
    onBeforeDestroy:function() {
        w2ui.spreadsheetVehicule.destroy();
    }



});
