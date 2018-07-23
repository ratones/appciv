module.exports = Marionette.CompositeView.extend({
    className: 'form-inline mid-form',
    tagName: 'form',
    events: {
        'click .btnAddValue': 'addValue',
        'click .btnDelValue': 'delValue'
    },
    initialize: function () {
        // this.listenTo(app,'dt:add:value',this.addValue.bind(this));
        // this.listenTo(app,'dt:remove:value',this.delValue.bind(this));
        var self = this;
        this.nedcAtrs = [24, 141, 142, 246, 247, 248];
        this.wltpAtrs = [290,291,292,293,294,295,296,297,298,299,300,301];
        if (this.options.type == 'poluare' || this.options.type == 'wltp') {
            this.listenTo(app,'wltp:changed',this.toggleWltp);
        }
        _.bindAll(this, 'forceValidation');
        self.collection.on('change', function () {
            if (!window.isDirty.dirty) {
                window.isDirty.dirty = true;
            }
        });
        self.collection.on('save', function () {
            if (window.isDirty.dirty) {
                window.isDirty.dirty = false;
            }
        });
    },
    getTemplate: function () {
        var coll = this.collection,
            html = '<form role="form" class="form-inline mid-form"><fieldset style="padding: 10px">';
        if (this.options.type == 'poluare') {
            html += '<div class="common"></div><table style="width:100%" border="1" cellspacing="2">' +
                '<tr><th style="width:50%">OMOLOGARE NEDC</th><th colspan="2"><input type="checkbox" id="enablewltp"/> OMOLOGARE WLTP</th></tr>' +
                '<tr><td></td><td style="width: 269px;text-align: right;padding: 3px 27px 3px 0;">Vehicul Low</td><td style="padding-left: 15px;">Vehicul High</td></tr>'+
                '<tr><td><div class="nedc"></div></td><td colspan="2"><div class="wltp"></div></td></tr></table>';
        }
        html += '</fieldset></form>';
        return html;
    },
    childView: require('./mase'),
    childViewOptions: function (model) {
        model.set('iswltp', this.iswltp);
        return {
            type: this.options.type,
            index: model.cid
        };
    },
    setReadOnly: function () {
        _.each(this.children._views, function (view) {
            $.each(view.$el.find('input,textarea,button.btnAddValue,button.btnDelValue'), function (i, el) {
                //if ($(el).val() !== '') {
                $(el).prop('disabled', true);
                //}
            });
        });
    },

    toggleWltp:function(val){
        var self = this;
        _.each(this.children._views, function (view) {
            if(self.wltpAtrs.indexOf(view.model.get('id_nom')) !== -1){
                $.each(view.$el.find('input,textarea,select,button.btnAddValue,button.btnDelValue'), function (i, el) {
                if (val) {
                        view.model.set('iswltp', true);
                        $(el).prop('disabled', null);
                    }else{
                        view.model.set('iswltp', false);
                        $(el).prop('disabled', true);
                    }
                });
            }
            if(self.nedcAtrs.indexOf(view.model.get('id_nom')) !== -1){
                $.each(view.$el.find('input,textarea,select,button.btnAddValue,button.btnDelValue'), function (i, el) {
                if (val) {
                        view.model.set('iswltp', true);
                        $(el).prop('disabled', true);
                    }else{
                        view.model.set('iswltp', false);
                        $(el).prop('disabled', null);
                    }
                });
            }
        });
    },
    onShow: function () {
        var coll = this.collection;
        if (this.options.type == 'poluare') {
            this.$el.find('#enablewltp').change(function () {
               app.trigger('wltp:changed',this.checked);
            });
            if(this.options.iswltp){
                this.$el.find('#enablewltp').attr('checked',true);
                this.toggleWltp(true);
            }else{
                this.$el.find('#enablewltp').attr('checked',false);
                this.toggleWltp(false);
            }
        }
        this.listenTo(coll, 'change', function () {
            var mt, mpmin, mpmax, mu_model;
            coll.models.map(function (m) {
                if (m.get('id_nom') === 6) {
                    mpmin = m.get('val_min');
                    mpmax = m.get('val_max');
                }
                else if (m.get('id_nom') === 7)
                    mt = m.get('val')
                else if (m.get('id_nom') === 13)
                    mu_model = m;
            });
            if (mu_model) {
                mu_model.set('suggested_valmin', Number(mt) - Number(mpmax));
                mu_model.set('suggested_valmax', Number(mt) - Number(mpmin));
            }
        });
    },
    attachHtml: function (collectionView, itemView, index) {
        if (itemView.model.get('grupa') === this.options.type || (itemView.model.get('grupa') === 'wltp' && this.options.type === 'poluare')) {
            if (this.options.type == 'poluare' || this.options.type == 'wltp') {
                if (this.nedcAtrs.indexOf(itemView.model.get('id_nom')) !== -1) {
                    collectionView.$el.find('fieldset').find('.nedc').append(itemView.el);
                }
                else if (this.wltpAtrs.indexOf(itemView.model.get('id_nom')) !== -1) {
                    collectionView.$el.find('fieldset').find('.wltp').append(itemView.el);
                } else {
                    collectionView.$el.find('fieldset').find('.common').append(itemView.el);
                }
            } else {
                collectionView.$el.find('fieldset').append(itemView.el);
            }
        }
    },

    forceValidation: function () {
        var self = this;
        _.each(self.children._views, function (view) {
            w2utils.validate(view.model, view.$el);
        });
    },
    addValue: function (e) {
        //var e = opt.ev;
        var self = this;
        //e.preventDefault();
        var target = $(e.currentTarget);
        var cid = target.data('model');
        var tehn = this.collection.find(function (m) {
            return m.cid === cid;
        });
        //var val = tehn.get('val');
        var child = this.children.findByModel(tehn);
        var html =
            '<div style="display:inline" id="addValueContainer"><input type="text" id="addMultiValue" />' +
            //'   <button class="btn btn-blue closeMulti" id="btnSaveNewValue"><i class="w2ui-icon-check"></i></button>' +
            '   <button class="btn btn-red closeMulti"><i class="w2ui-icon-cross"></i></button>' +
            '</div>';
        target.w2overlay({
            html: html,
            hideEl: '.closeMulti',
            width: '300px',
            maxHeight: '200px',
            openAbove: true,
            style: 'padding:10px;overflow:auto',
            onShow: function () {
                var self = this;
                if (tehn.get('tip') === 'lista') {
                    var el = '<select id="addMultiValue" placeholder="Selectati din lista"><option value="">--Selectati--</option>';
                    var source = JSON.parse(tehn.get('sursa'));
                    for (var i = 0; i < source.length; i++) {
                        if ($.isPlainObject(source[i]))
                            el += '<option value="' + source[i].id + '">' + source[i].text + '</option>';
                        else
                            el += '<option value="' + source[i] + '">' + source[i] + '</option>';
                    }
                    el += '</select>';
                    $('#addMultiValue').replaceWith(el);
                } else {
                    $('#addMultiValue').on('keyup', function (e) {
                        if (e.which === 13)
                            $(self.hideEl).click();
                    });
                }
            },
            onHide: function (e) {
                if ($('#addMultiValue').val()) {
                    var val = tehn.get('val');
                    if (!val) {
                        val = $('#addMultiValue').val();
                        tehn.set('val', val).set('pseudo', val);
                        child.render();
                    } else if (val.split('|').indexOf($('#addMultiValue').val()) === -1) {
                        val += '|' + $('#addMultiValue').val();
                        tehn.set('val', val).set('pseudo', val);
                        child.render();
                    }
                }
            }
        });

        console.log(child);
    },
    delValue: function (e) {
        //var e = opt.ev;
        var self = this;
        //e.preventDefault();
        var target = $(e.currentTarget);
        var cid = target.data('model');
        var tehn = this.collection.find(function (m) {
            return m.cid === cid;
        });
        var child = this.children.findByModel(tehn);
        var selected = tehn.get('pseudo').replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '');
        if (selected !== tehn.get('val')) {
            var val = tehn.get('val').split('|');
            var newval = [];
            val.map(function (c) {
                newval.push(c.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, ''));
            });
            val = _.without(newval, selected);
            var nval = val.join('|');
            tehn.set('val', nval);
            child.render();
        }

    }
});
