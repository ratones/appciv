var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'fullscreen',
    template: require('./../../templates/registru/sisteme.hbs'),
    initialize: function() {
        this.setPagePermissions();
        this.collection.setGridName('gridSisteme');
        //this.categorie = this.options.categorie;
    },
    refreshUI: function() {
        // if (!this.isRendered) {
        if (w2ui.hasOwnProperty('gridSisteme')){
            w2ui.gridSisteme.records = this.collection.toJSON();
            w2ui.gridSisteme.refreshFull();
        }
        if (w2ui.hasOwnProperty('gridSursaSist')){
            w2ui.gridSursaSist.refreshFull();
        }
        else
            this.renderSursa();
        this.isRendered = true;
        // }
    },
    onViewAttached: function() {
        var self = this;
        this.renderGrid();
        if (!this.options.isnew)
            this.renderSursa();
        self.collection.on('add remove', function(){
                window.isDirty.dirty = true;
        });
    },
    renderGrid: function() {
        console.log('render motor');
        var self = this;
        this.$el.find('#gridSisteme').w2grid({
            name: 'gridSisteme',
            show: {
                toolbar: true,
                toolbarDelete: self.allowEdit,
                selectColumn: true
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
                field: 'directiva',
                caption: 'Directiva',
                size: '30%',
                sortable: true
            }, {
                field: 'categorie',
                caption: 'Aplicare',
                size: '60%',
                sortable: true
            }, {
                field: 'datain',
                caption: 'Data',
                size: '10%',
                sortable: true,
                type: 'date'
            }]
        });
    },
    renderSursa: function() {
        var me = this;
        this.$el.find('#gridSursaSist').w2grid({
            name: 'gridSursaSist',
            recid: 'id_limitare',
            show: {
                toolbar: true,
                toolbarAdd: me.allowEdit,
                toolbarSave: me.allowEdit,
                toolbarDelete: me.allowEdit,
                selectColumn: true
            },
            onAdd: function() {
                this.add({
                    recid: 0
                });
            },
            url: app.baseUrl + '/nrom/getsisteme',
            columns: [{
                field: 'id_limitare',
                caption: 'ID',
                hidden: true
            }, {
                field: 'directiva',
                caption: 'Directiva',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            }, 
            {
                field:'id_litera',
                caption:'Litera',
                size:'10%',
                editable:{
                    type:'list',
                    items:['A','B']
                }
            },
            {
                field: 'categorie',
                caption: 'Aplicare',
                size: '50%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            }, {
                field: 'datain',
                caption: 'Data',
                size: '10%',
                sortable: true,
                type: 'date',
                editable: {
                    type: 'date'
                }
            }, {
                field: 'categorie_ue',
                caption: 'Categorii',
                size: '20%',
                sortable: true,
                type: 'text',
                editable: {
                    type: 'text'
                }
            }],
            postData: {
                extra: [{
                    field: 'categorie_ue',
                    value: me.options.categorie
                }]
            },
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
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
                        console.log('sisteme');
                        var grid = w2ui.gridSursaSist;
                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var comp = grid.get(id);
                            var exist = me.collection.find(function(model) {
                                return model.get('id_comp') === comp.id_limitare;
                            });
                            if (exist) {
                                w2alert('Componenta selectata exista deja!');
                            } else {
                                var Proto = app.module('appdot.dosare').PrototypeSistem;
                                var mdl = new Proto({
                                    id_comp: comp.id_limitare,
                                    directiva: comp.directiva,
                                    datain: comp.datain,
                                    categorie: comp.categorie
                                });
                                me.collection.add(mdl);
                            }
                        }
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
        if (w2ui.hasOwnProperty('gridSisteme'))
            w2ui.gridSisteme.destroy();
        if (w2ui.hasOwnProperty('gridSursaSist'))
            w2ui.gridSursaSist.destroy();
    },
});
