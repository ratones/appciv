var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'fullscreen',
    template: require('./../../templates/registru/motoare.hbs'),
    initialize: function() {
        this.setPagePermissions();
        this.gridName = this.options.gridName?this.options.gridName:'gridMotoare'
        this.sourceGridName = this.options.sourceGridName?this.options.sourceGridName:'gridSursa'
        //this.collection.setGridName('gridMotoare');
    },
    refreshUI: function() {
        // if (!this.isrendered) {
        if (w2ui.hasOwnProperty(this.gridName)){
            w2ui[this.gridName].records = this.collection.toJSON();
            w2ui[this.gridName].refreshFull();
        }
        if (w2ui.hasOwnProperty(this.sourceGridName))
            w2ui[this.sourceGridName].refreshFull();
        this.isrendered = true;
        // }
    },
    onShow: function() {
        var self = this;
        this.renderGrid();
        this.renderSursa();
        self.collection.on('add remove', function(){
            window.isDirty.dirty = true;
        });
    },
    renderGrid: function() {
        console.log('render motor');
        var self = this;
        this.$el.find('#gridMotoare').w2grid({
            name: self.gridName,
            show: {
                toolbar: true,
                toolbarDelete: self.allowEdit
            },
            records: self.collection.toJSON(),
            onDelete: function(event) {
                var ids = this.getSelection();
                event.onComplete = function() {
                    window.isDirty.dirty = true;
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
            columns: [{
                field: 'cod',
                caption: 'Cod motor',
                size: '20%',
                sortable: true
            }, {
                field: 'puterekw',
                caption: 'Putere(kW)',
                size: '20%',
                sortable: true
            }, {
                field: 'puterecp',
                caption: 'Putere(CP)',
                size: '20%',
                sortable: true
            }, {
                field: 'rot_p_max',
                caption: 'Turatie putere',
                size: '20%',
                sortable: true
            },{
                field: 'cilindree',
                caption: 'Cilindree',
                size: '20%',
                sortable: true
            }, {
                field: 'tip',
                caption: 'Tip motor',
                size: '20%',
                sortable: true
            },
            {
                field: 'cod_poansonat',
                caption: 'Cod poansonat',
                size: '20%',
                sortable: true,
                editable:{
                    type:'text'
                }
            }],
            onChange: function(event) {
                event.onComplete= function(e){
                    console.log(event.value_new);
                    var model = self.collection.find(function(s) {
                        return s.cid === event.recid;
                    });
                    model.set('cod_poansonat',event.value_new);
                    w2ui[event.target].save();
                };

            }
        });
    },
    renderSursa: function() {
        var me = this;
        this.$el.find('#gridSursa').w2grid({
            name: me.sourceGridName,
            recid: 'ndelcodmot',
            show: {
                toolbar: true
            },
            url: app.dotUrl + '/nrom/getmotoare',
            columns: [{
                field: 'ndelcodmot',
                caption: 'ID',
                hidden: true
            }, {
                field: 'cod',
                caption: 'Cod motor',
                size: '20%',
                sortable: true
            }, {
                field: 'p_max_kw',
                caption: 'Putere(kW)',
                size: '20%',
                sortable: true
            }, {
                field: 'p_max_cp',
                caption: 'Putere(CP)',
                size: '20%',
                sortable: true
            }, {
                field: 'cilindree',
                caption: 'Cilindree',
                size: '20%',
                sortable: true
            }, {
                field: 'tip_mot',
                caption: 'Tip motor',
                size: '20%',
                sortable: true
            }],
            onExpand: function(event) {
                var motor = this.get(event.recid);
                var DetaliiMotorView = require('./detaliiMotor');
                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%',
                    height: '250px'
                }).animate({
                    height: '250px'
                }, {
                    duration: 10,
                    complete: function() {
                        $.post(app.dotUrl + '/nrom/getdetaliimotor/' + motor.ndelcodmot, null, function(response) {
                            var Model = Backbone.Model.extend();
                            var model = new Model(response.motor);
                            var view = new DetaliiMotorView({
                                model: model
                            });
                            $('#' + event.box_id).html(view.render().el);
                            view.stickit();
                        });

                    }
                });
            },
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
                        var grid = w2ui[me.sourceGridName];
                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var motor = grid.get(id);
                            var exist = me.collection.find(function(model) {
                                return model.get('id_motor') === motor.ndelcodmot;
                            });
                            if (exist) {
                                w2alert('Motorul selectat exista deja!');
                            } else {
                                var Proto = require('./../../models/registru/motor');
                                var mdl = new Proto({
                                    id_motor: motor.ndelcodmot,
                                    cod: motor.cod,
                                    tip: motor.tip_mot,
                                    puterecp: motor.p_max_cp,
                                    rot_p_max:motor.rot_p_max,
                                    puterekw: motor.p_max_kw,
                                    cilindree: motor.cilindree
                                });
                                me.collection.add(mdl);
                                w2ui[me.gridName].add(mdl.toJSON())
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
        if (w2ui.hasOwnProperty(this.sourceGridName))
            w2ui[this.sourceGridName].destroy();
    },
});
