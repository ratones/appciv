var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'fullscreen',
    template: require('./../../templates/registru/anvelope.hbs'),
    initialize: function() {
        this.setPagePermissions();
        this.gridName = this.options.gridName? this.options.gridName:'gridAnvelope'
        //this.collection.setGridName('gridAnvelope');
    },
    // viewShown: function() {
    //     console.log('anvelope');
    //     this.renderGrid();
    // },
    refreshUI: function() {
        // if (!this.isrendered) {
        if (w2ui.hasOwnProperty(this.gridName)) {
            // w2ui[this.gridName].initToolbar();
            // if (w2ui[this.gridName].toolbar != null) w2ui[this.gridName].toolbar.render($('#grid_' + w2ui[this.gridName].name + '_toolbar')[0]);
            w2ui[this.gridName].records = this.collection.toJSON();
            w2ui[this.gridName].refreshFull();
            //console.log(this.collection.toJSON());
        }
        this.isrendered = true;

        // }
        // if (!w2ui.hasOwnProperty('gridSursaAnvelope'))
        //     this.renderSursa();
    },
    onShow: function() {
        this.renderGrid();
         this.collection.on('add remove', function(){
            window.isDirty.dirty = true;
        });
    },
    renderGrid: function() {
        var self = this;
        this.$el.find('#gridAnvelope').w2grid({
            name: self.gridName,
            records: self.collection.toJSON(),
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: self.allowEdit,
                toolbarEdit: self.allowEdit,
                toolbarDelete: self.allowEdit
            },
            toolbar:{
              items:[
                {type:'button',id:'mvUp',icon:'w2ui-icon-upload',onClick:self.mvRecord.bind(self,1)},
                {type:'button',id:'mvDown',icon:'w2ui-icon-download',onClick:self.mvRecord.bind(self,0)}
              ]
            },
            //reorderRows: true,
            onEdit: function(event) {
                self.openEdit(event.recid);
            },
            onAdd: function(event) {
                self.openEdit();
            },
            onDelete: function(event) {
                var ids = this.getSelection();
                event.onComplete = function() {
                    _.each(ids, function(id) {
                        var model = self.collection.find(function(s) {
                            return s.cid === id;
                        });
                        if (model.id)
                            model.set('EntityState', 2);
                        else
                            self.collection.remove(model);
                    });
                };
            },
            onSubmit: function(data) {
                var me = this;
                _.each(data.changes, function(field) {
                    var r = me.get(field.recid);
                    if (typeof field.axa !== 'undefined') {
                        r.axa = field.axa.id;
                    }
                    if (typeof field.id_roata !== 'undefined') {
                        r.id_roata = field.id_roata.id;
                        r.valoare = field.id_roata.text;
                    }
                });
            },
            columns: [{
              field:'ordine_civ',
              caption:'Ordine CIV',
              sortable:true,
              size:'150px'
            },{
                field: 'axa',
                caption: 'Axa',
                sortable: true,
                render: function(record) {
                    switch (Number(record.axa)) {
                        case 1:
                            return 'Fata';
                        case 2:
                            return 'Spate';
                    }
                },
                size: '30%'
            }, {
                field: 'id_roata',
                caption: 'Anvelopa',
                sortable: true,
                render: function(record) {
                    return record.valoare;
                },
                size: '30%'
            }, {
                field: 'janta',
                caption: 'Janta',
                sortable: true,
                size: '30%'
            }]
        });

    },

    mvRecord:function(direction){
      var self = this;
      var obj = w2ui[this.gridName];
      var selLength = obj.getSelection().length;
      var ind1 = obj.get(obj.getSelection()[0],true);
      var tmp = [];
      for (var i = 0; i < selLength; i++) {
        tmp.push(obj.records[obj.get(obj.getSelection()[i],true)]);
      }
      // var tmp = obj.records[ind1];
      var ind2;
      if(direction===1 && ind1 > 0){
          //move up
          obj.records.splice(ind1, selLength);
          ind2 = ind1-1;
          var args = [ind2,0];
          for (var x = 2; x < tmp.length+2; x++) {
            args[x] = tmp[x-2];
          }
          Array.prototype.splice.apply(obj.records,args);
      }else if(direction===0 && ind1 < obj.records.length){
        // move down
        obj.records.splice(ind1, selLength);
        ind2 = ind1;
        var args = [ind2 + 1,0];
        for (var x = 2; x < tmp.length+2; x++) {
          args[x] = tmp[x-2];
        }
        Array.prototype.splice.apply(obj.records,args);
        //obj.records.splice(ind2 + selLength, 0, tmp);
      }else{
        obj.refresh();
        obj.selectNone();
        return;
      }

      obj.selectNone();
    //   if(direction === 1){
    //     tmp.map(function(rec){
    //
    //     });
    //   //obj.select(obj.records[ind2].recid);
    // }
    //   else {
    //     //obj.select(obj.records[ind2+1].recid);
    //   }
        var ids = _.pluck(tmp,'recid');
        obj.select.apply(obj,ids);
        self.collection.each(function(model){
          model.set('ordine_civ',obj.get(model.cid,true)+1);
        });
        obj.refresh();
    },
    renderSursa: function() {
        var me = this;
        $('#gridSursaAnvelope').w2grid({
            name: 'gridSursaAnvelope',
            recid: 'ndelcodroa',
            show: {
                toolbar: true,
                selectColumn: true
            },
            url: app.dotUrl + '/nrom/getAnvelope',
            columns: [{
                field: 'ndelcodroa',
                caption: 'ID',
                hidden: true
            }, {
                field: 'janta',
                caption: 'Janta',
                size: '50%',
                sortable: true
            }, {
                field: 'anvelopa',
                caption: 'Putere(kW)',
                size: '50%',
                sortable: true
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText).data;
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            toolbar: {
                items: [{
                    type: 'button',
                    text: 'Transfera selectia',
                    icon: 'w2ui-icon-upload',
                    onClick: function() {
                        var grid = w2ui.gridSursa;
                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var motor = grid.get(id);
                            var exist = me.collection.find(function(model) {
                                return model.get('id_roata') === motor.ndelcodroa;
                            });
                            if (exist) {
                                w2alert('Anvelopa selectata exista deja!');
                            } else {
                                // var Proto = app.module('appdot.dosare').PrototypeMotor;
                                // var mdl = new Proto({
                                //     id_motor: motor.ndelcodmot,
                                //     cod: motor.cod,
                                //     tip: motor.tip_mot,
                                //     puterecp: motor.p_max_cp,
                                //     puterekw: motor.p_max_kw,
                                //     cilindree: motor.cilindree
                                // });
                                // me.collection.add(mdl);
                            }
                        }
                        grid.refresh();
                        grid.selectNone();
                    }
                }]
            }
        });
    },
    setPagePermissions: function() {
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3], 'appdot'
        ]);

    },
    onBeforeDestroy: function() {
        if (w2ui.hasOwnProperty(this.gridName))
            w2ui[this.gridName].destroy();
        // if (w2ui.hasOwnProperty('gridSursaAnvelope'))
        //     w2ui.gridSursaAnvelope.destroy();
    },
    enableEdit:function(){
      w2ui[this.gridName].toolbar.enable('w2ui-add');
      w2ui[this.gridName].toolbar.enable('w2ui-edit');
    },
    openEdit: function(id) {
        var m,View;
        if (!id) {
            var Model = require('./../../models/registru/anvelopa');
            m = new Model();
            View = require('./anvelopeEditor');
        } else {
            m = this.collection.find(function(s) {
                return s.cid === id;
            });
            View = require('./anvelopa');
        }
        var view = new View({
            model: m,
            collection: this.collection
        });
        app.modal.show(view, {
            preventDestroy: true
        });
    }
});
