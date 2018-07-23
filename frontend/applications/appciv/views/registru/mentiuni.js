var ipc = requireNode('ipc');
module.exports = Marionette.CompositeView.extend({
    template: require('./../../templates/registru/mentiuni.hbs'),
    initialize: function() {
        var self = this;
        this.setPagePermissions();
        _.bindAll(this, 'concatenate');
        this.collection.comparator = function(model) {
            return model.get('id');
        };

        // call the sort method
        this.collection.sort();
        this.collection.on('change add remove', this.concatenate);
        this.listenTo(app, 'mentiune:remove', function(model) {
            var view = self.children.findByModel(model);
            view.destroy();
            window.isDirty.dirty = true;
            self.concatenate();
        });
    },
    attachHtml: function(collectionView, itemView, index) {
        if (itemView.model.get('EntityState') !== 2)
            collectionView.$el.append(itemView.el);
    },
    childView: require('./mentiune'),
    refreshUI: function() {
        if (w2ui.hasOwnProperty('gridSursaMentiuni')) {
            w2ui.gridSursaMentiuni.refreshFull();
        }
        this.concatenate();
    },
    concatenate: function() {
        var str = '';
        this.collection.each(function(model) {
            if (model.get('EntityState') !== 2) {
                var ment = model.get('mentiune') ? model.get('mentiune') : '';
                var vs = model.get('val_sup') ? model.get('val_sup') : '';
                str += ment + vs;
            }
        });
        var splittedArray = str.match(/.{1,50}/g) || [];

        var words = splittedArray.length > 0 ? splittedArray.join('\n') : '';
        $('#preview').text(words);

    },
    onShow: function() {
        var self = this;
        this.setSursa();
        this.concatenate();
        self.collection.on('add remove', function(){
                window.isDirty.dirty = true;
        });

    },
    enableEdit:function(){
      w2ui.gridSursaMentiuni.toolbar.enable('w2ui-add');
      w2ui.gridSursaMentiuni.toolbar.enable('w2ui-save');
      w2ui.gridSursaMentiuni.toolbar.enable('w2ui-delete');
    },
    setSursa: function() {
        var self = this;
        this.$el.find('#sursaMentiuni').w2grid({
            name: 'gridSursaMentiuni',
            url: app.dotUrl + '/nrom/getmentiuni',
            show: {
                toolbar: true,
                toolbarAdd: self.allowEdit,
                toolbarSave: self.allowEdit,
                toolbarDelete: self.allowEdit
            },
            onAdd: function() {
                this.add({
                    recid: 0
                });
            },
            recid: 'id',
            columns: [{
                field: 'id',
                hidden: true
            }, {
                field: 'mentiune',
                sortable: true,
                size: '100%',
                editable: {
                    type: 'text'
                }
            }],
            toolbar: {
                items: [{
                    type: 'button',
                    text: 'Adauga mentiunea',
                    icon: 'w2ui-icon-download',
                    onClick: function() {
                        var grid = w2ui.gridSursaMentiuni;

                        for (var i in grid.getSelection()) {
                            var id = grid.getSelection()[i];
                            var comp = grid.get(id);
                            console.log(comp);
                            var exist = self.collection.find(function(model) {
                                return model.get('id_mentiune') === comp.id && model.get('EntityState') !== 2;
                            });
                            if (exist) {
                                w2alert('Componenta selectata exista deja!');
                            } else {
                                var Proto = require('./../../models/registru/mentiune');
                                var mdl = new Proto({
                                    id_mentiune: comp.id,
                                    mentiune: comp.mentiune,
                                    val_sup: ''
                                });
                                self.collection.add(mdl);
                            }
                        }
                        grid.selectNone();
                    }
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
        });
    },
    setPagePermissions: function() {
        this.allowEdit = ipc.sendSync('user:request:isuserinrole', [
            [1, 3], 'appdot'
        ]);
    },
    onBeforeDestroy: function() {
        if (w2ui.hasOwnProperty('gridSursaMentiuni'))
            w2ui.gridSursaMentiuni.destroy();

    },
});
