var AnvelopaItemView = require('./anvelopa'),
    AnvelopaModel = require('./../../models/anvelopa'),
    Globals = require('./../../globals'),
    AnvelopeAccordionView = Marionette.CompositeView.extend({
        className: 'accordion',
        initialize: function() {
            this.listenTo(app.module('appciv'), 'anvelopeView:setSelect', this.onShow);
        },
        childView: AnvelopaItemView,
        ui: {
            'add': '#btnAddAnvelopa'
        },
        events: {
            'click @ui.add': 'add'
        },
        add: function() {
            //conditii de adaugare anvelopa
            var prevSelected = true;
            for (var i in this.collection.models) {
                var anv = this.collection.models[i];
                if ((Globals.anvelopefata.length>0 && anv.get('id_roataf') === 0) || (Globals.anvelopespate.length > 0 &&  anv.get('id_roatas') === 0)) {
                    prevSelected = false;
                }
            }

            if (this.collection.models.length < 5 && prevSelected) { //nr maxim de anvelope
                if (true) {
                    this.collection.add(new AnvelopaModel({
                        nivel_echipare: 1,
                        EntityState: 0
                    }));
                    this.onShow();
                }
            } else {
                setTimeout(function() {
                    $('#btnAddAnvelopa').w2tag();
                }, 3000);
                $('#btnAddAnvelopa').w2tag('Nu sunt indeplinite conditiile de adaugare anvelope optionale!');
            }

        },
        getTemplate: function() {
            //var html = '' //'<script id="layout-anvelope-template" type="text/template">'
            var html = '<div>';
            html +=
                '<div class="panel panel-primary">' +
                '   <div class="w2ui-panel-title">'+w2utils.lang('Anvelope echipare standard')+'</div>' +
                '   <div class="panel-body" id="standard"></div>' +
                '</div>' +
                '<div class="panel panel-primary">' +
                '   <div class="w2ui-panel-title">'+w2utils.lang('Anvelope echipare optionala')+'</div>' +
                '   <div class="panel-body" id="optionale">' +
                '       <button class="btn btn-green btn-icon-only" id="btnAddAnvelopa"><i class="w2ui-icon-plus"></i></button>' +
                '   </div>' +
                '</div>';
            html +='</div>';
            //+ '</script>';
            return html;
        },
        childViewOptions: function(model) {
            return {
                index: this.collection.indexOf(model)
            };
        },
        attachHtml: function(collectionView, itemView, index) {
            if (itemView.model.get('EntityState') !== 2) {
                itemView.model.set('index', index);
                //itemView.$el.find('input').attr('id', 'Anvelope_' + index + '__id_roataf');
                //itemView.$el.find('input').attr('id', 'Anvelope_' + index + '__id_roatas');
                var echipare = itemView.model.get('nivel_echipare'),
                    container = '';
                switch (echipare) {
                    case 0:
                        container = 'standard';
                        break;
                    case 1:
                        container = 'optionale';
                        break;
                }
                collectionView.$('#' + container).append(itemView.render().el);
            }
        },
        onRender: function() {
            //initialize accordion effect
            this.listenTo(app.module('appciv.vehicule'), 'anvelopa:remove', function(model) {
                //daca modelul nu este nou
                //declansam doar evenimentul, pentru a nu elimina definitiv modelul din colectie
                //modelul este doar marcat pentru a fi sters de pe server la salvare, dar vizual el va fi
                //sters din collectie. La refresh , daca nu s-a salvat inregistrarea, va reapare.
                console.log('del set anv');
                if (!model.id) {
                    this.collection.remove(model);
                } else {
                    this.collection.trigger('remove', model);
                }
                // marcam selectiile curente ale modelului ca selectabile
                //TODO: trebuie refacute cumva sursele pentru select-uri....
                // try {
                //     Globals.anvelopefata
                //         .get(model.get('id_roataf'))
                //         .unset('disabled');
                //     Globals.anvelopefata.trigger('update');

                //     Globals.anvelopespate
                //         .get(model.get('id_roatas'))
                //         .unset('disabled');
                //     Globals.anvelopespate.trigger('update');
                // } catch (ex) {}
            });
            this.$el.find('.w2ui-panel-title').click(function() {
                $(this).next().toggle('fast');
                return false;
            }).next().hide('fast');
        },
        // onAddChild: function(itemView) {
        //         itemView.setSelect();
        //         itemView.setView();
        //     }
        onShow: function() {
            // this.children.each(function(view) {
            //     view.setSelect();
            // });

        }
    });
module.exports = AnvelopeAccordionView;
