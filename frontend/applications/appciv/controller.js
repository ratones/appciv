/**
 * @author cristian_mar
 */
/**
 * Application controller
 * @type:{Marionette.Controller}
 * Handles public methods
 */
var ipc = requireNode('ipc');
var HomeView = require('./views/home');
var gui = requireNode('nw.gui');
var controller = window.Marionette.Controller.extend({
    initialize: function (options) {
        this.app = options.app;
    },
    closeapp: function () {
        this.app.execute('activeModule:stop');
    },
    openHelp: function () {
        //app.Util.printPDF(application.paths.staticFiles + '/Manuale/Manual.pdf', true);
    },
    request: function () {
        console.info('Action requested on appciv controller');
    },
    /**
     * navigate to home page
     */
    home: function () {
        app.container.show(new HomeView());
    },
    cereri: function (options) {
        console.log(options);
        var IndexView = require('./views/cereri/index');
        app.container.show(new IndexView({
            location: options
        }));
    },
    plati: function (options) {
        var IndexView = require('./views/cereri/plati');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    situatie: function (options) {
        var IndexView = require('./views/cereri/situatie');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    editCerere: function (id) {
        var EditorView = require('./views/cereri/editor');
        var Model = require('./models/cerere');
        var m = new Model({
            id: id
        });
        app.modal.show(new EditorView({
            model: m
        }), {
            preventDestroy: true
        });
    },

    arhivareComanda: function (id) {
        var Coll = require('./collections/vehicule');
        var EditorView = require('./views/reports/arhivare');
        $.get(app.baseUrl + 'vehicule/getvehiculecomanda/' + id, function (data) {
            //var collection = new Coll(data);
            var view = new EditorView({
                data: data,
                controller:'vehicule'
            });
            app.modal.show(view, {
                preventDestroy: true
            });
            //var doc = view.buildDoc();//new jsPDF();
            //doc.output('dataurlnewwindow');
            // var pdfWindow = gui.Window.open('pdfviewer/index.html', {
            //     width: 800,
            //     height: 600,
            //     },function(win){
            //         win.data={file:doc.output('datauristring')};
            //     });
        });
        // var Model = require('./models/cerere');
        // var m = new Model({
        //     id: id
        // });
        // app.modal.show(new EditorView({
        //     model: m
        // }), {
        //     preventDestroy: true
        // });

        // var view = new EditorView(id);
        // var doc = view.buildDoc();//new jsPDF();

        //doc.output('dataurlnewwindow');
    },
    anulareComanda: function (id, callback) {
        w2confirm('Sigur doriti anularea comenzii?').yes(function () {
            $.post(app.baseUrl + 'comenzi/anulare/' + id, function () {
                callback();
            });
        })
    },

    configTiparCIV: function () {
        var EditorView = require('./views/reports/civdesign');
        app.modal.show(new EditorView(), {
            preventDestroy: true
        });
    },

    updateApp: function () {
        var View = require('./views/update');
        app.container.show(new View());
    },
    /**
     * open payment view
     * @param  {[type]} argument id comanda
     * @return {[type]}          [description]
     */
    detaliiPlataCerere: function (argument) {
        // var u = ipc.sendSync('user:request:isinrole', [4]);
        // if (u) {
        ipc.send('app:request:pdf', app.baseUrl + 'civfiles/getplatacomanda/?id=' + argument);
        // } else {
        //     var Model = require('./models/plata');
        //     var plata = new Model({
        //         'id_comanda': argument
        //     });
        //     plata.fetch({
        //         data: {
        //             id_comanda: argument
        //         }
        //     }).then(function() {
        //         var PlataLayout = require('./views/cereri/plataLayout');
        //         app.modal.show(new PlataLayout({
        //             model: plata
        //         }));
        //     });
        // }
    },
    listVehicule: function (gridRowid, options) {
        var elem = '#' + gridRowid;
        var IndexView = require('./views/vehicule/vehicule');
        var mainView = new IndexView({
            element: elem,
            parentID: options.pid,
            canadd: options.canadd,
            totalItems: options.totalVehicule
        });
        mainView.render();
    },

    spreadsheetVehicule: function (id) {
        var View = require('./views/vehicule/spreadsheet');
        app.container.show(new View({
            id_comanda: id
        }));
    },

    detaliiVehicul: function (id) {
        var Model = require('./models/vehicul');
        var View = require('./views/vehicule/vehicul');
        var m = new Model({
            id: id
        });
        m.fetch().then(function () {
            $.get(app.baseUrl + 'vehicule/getRelatedVehicles/' + m.get('id_comanda'), null, function (ids) {
                app.container.show(new View({
                    model: m,
                    relatedVehicles: ids
                }));
            });
        });

    },
    addVehicul: function (id_comanda) {
        var Model = require('./models/vehicul');
        var View = require('./views/vehicule/vehicul');
        var m = new Model({
            id_comanda: id_comanda
        });
        app.container.show(new View({
            model: m
        }));
    },
    renderAtributes: function (argument) {
        var AtributeAccordionView = require('./views/vehicule/atribute');
        var atrView = new AtributeAccordionView({
            collection: argument.atributes,
            iswltp : argument.iswltp
        });
        $(argument.element).html(atrView.render().el);
    },

    renderAtributeTvv: function (argument) {
        var AtributeAccordionView = require('./views/registru/atribute');
        var atrView = new AtributeAccordionView({
            collection: argument.atributes,
            iswltp : argument.iswltp
        });
        $(argument.element).html(atrView.render().el);
    },

    renderAnvelope: function (argument) {
        AnvelopeAccordionView = require('./views/vehicule/anvelope');
        var anvView = new AnvelopeAccordionView({
            collection: argument.anvelope
        });
        var el = anvView.render().el;
        $(argument.element).html(el);
        app.module('appciv').trigger('anvelopeView:setSelect');
    },
    loadListeAnvelope: function (model, callback) {
        var NAnvelopeCollection = require('./collections/nanvelope');
        var Globals = require('./globals');
        var self = this;
        $.ajax({
            url: self.app.baseUrl + 'vehicule/GetListaAvelope',
            data: {
                id_tvv: model.get('id_tvv'),
                id_extensie: model.get('id_extensie')
            },
            success: function (response) {
                //source = response;
                var n_anv_fata = new NAnvelopeCollection(response.anvelopef),
                    n_anv_spate = new NAnvelopeCollection(response.anvelopes);

                Globals.anvelopefata = n_anv_fata;
                Globals.anvelopespate = n_anv_spate;

                //dezactivam optiunile existente, pentru a nu mai putea fi alese
                // var existingf = _.pluck(model.get('Anvelope').undeleted().toJSON(), 'id_roataf');
                // var availablef = _.pluck(n_anv_fata.toJSON(), 'id');
                // var todisable = _.intersection(existingf, availablef);
                // for (var id in todisable) {
                //     Globals.anvelopefata.get(todisable[id]).set('disabled', true);
                // }
                // var existings = _.pluck(model.get('Anvelope').undeleted().toJSON(), 'id_roatas');
                // var availables = _.pluck(n_anv_spate.toJSON(), 'id');
                // var todisables = _.intersection(existings, availables);
                // for (var x in todisables) {
                //     Globals.anvelopespate.get(todisables[x]).set('disabled', true);
                // }
                if (callback) {
                    callback();
                }
            }
        });
    },
    listVins: function () {
        var IndexView = require('./views/vehicule/sfarsitSerie');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    transmitComanda: function (id, callback) {
        $.ajax({
            type: 'POST',
            url: app.baseUrl + 'comenzi/processcomanda/' + id,
            success: function (response) {
                if (response.stare_comanda === 'Erori la depunere') {
                    w2alert('Eroare la transmitere, va rugam incercati din nou!<br>Daca eroarea persista contactati personalul RAR!')
                }
                callback();
            },
            error: function (response) {
                callback();
            }
        });
    },


    /**
     * CIV INDIVIDUAL
     */

    listCIVIndividual: function () {
        var IndexView = require('./views/individuale/index');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },


    editIndividuale: function (id) {
        var EditorView = require('./views/individuale/editor');
        var Model = require('./models/cerereIndividuale');
        var m = new Model({
            id: id
        });
        app.modal.show(new EditorView({
            model: m
        }), {
            preventDestroy: true
        });
    },

    listVehiculeIndividuale: function (gridRowid, options) {
        var elem = '#' + gridRowid;
        var IndexView = require('./views/individuale/vehicule');
        var mainView = new IndexView({
            element: elem,
            parentID: options.pid,
            canadd: options.canadd,
            totalItems: options.totalVehicule
        });
        mainView.render();
    },
    detaliiVehiculIndividuale: function (id) {
        var Model = require('./models/vehiculIndividuale');
        var View = require('./views/individuale/vehicul1');
        var m = new Model({
            id: id
        });
        m.fetch().then(function () {
            $.get(app.baseUrl + 'individuale/getRelatedVehicles/' + m.get('id_comanda'), null, function (ids) {
                app.container.show(new View({
                    model: m,
                    relatedVehicles: ids
                }));
            });
        });

    },
    addVehiculIndividuale: function (id_comanda) {
        var Model = require('./models/vehiculIndividuale');
        var View = require('./views/individuale/vehicul1');
        var m = new Model({
            id_comanda: id_comanda,
            stare:1
        });
        app.container.show(new View({
            model: m
        }));
    },
    renderFiles: function (options) {
        var FisiereView = require('./views/individuale/fisiere');
        var Fisiere = require('./collections/fisiere');
        var files = new Fisiere();
        $.ajax({
            url: app.baseUrl + 'individuale/getVehiculFiles/' + options.id_vehicul,
            success: function (data) {
                if (data.length > 0) {
                    files.reset(data);
                    if (!files.findWhere({
                            slot: 'placuta'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'placuta'
                    });
                    if (!files.findWhere({
                            slot: 'vin'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'vin'
                    });
                    if (!files.findWhere({
                            slot: 'semiprofil'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'semiprofil'
                    });
                    if (!files.findWhere({
                            slot: 'coc'
                        })) files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'coc'
                    });
                } else {
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'placuta'
                    });
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'vin'
                    });
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'semiprofil'
                    });
                    files.add({
                        id_vehicul: options.id_vehicul,
                        slot: 'coc'
                    });
                }
                var atrView = new FisiereView({
                    collection: files,
                    editable:options.editable
                });
                $(options.element).html(atrView.render().el);
            }
        });
    },
    renderMentiuni: function (options) {
        var MentiuniView = require('./views/individuale/mentiuni');
        var atrView = new MentiuniView({
                    collection: options.mentiuni,
                    editable:options.editable,
                    vin:options.vin
                });
        
        $(options.element).html(atrView.render().el);
    },
    transmitIndividuale:function(id,cb){
        $.post(app.baseUrl + 'individuale/postcomanda/' + id,null,cb);
    },
    arhivareComandaIndividuale: function (id) {
        //var Coll = require('./collections/vehicule');
        var EditorView = require('./views/reports/arhivare');
        $.get(app.baseUrl + 'individuale/getvehiculecomanda/' + id, function (data) {
            //var collection = new Coll(data);
            var view = new EditorView({
                data: data,
                controller:'individuale'
            });
            app.modal.show(view, {
                preventDestroy: true
            });
            //var doc = view.buildDoc();//new jsPDF();
            //doc.output('dataurlnewwindow');
            // var pdfWindow = gui.Window.open('pdfviewer/index.html', {
            //     width: 800,
            //     height: 600,
            //     },function(win){
            //         win.data={file:doc.output('datauristring')};
            //     });
        });
        // var Model = require('./models/cerere');
        // var m = new Model({
        //     id: id
        // });
        // app.modal.show(new EditorView({
        //     model: m
        // }), {
        //     preventDestroy: true
        // });

        // var view = new EditorView(id);
        // var doc = view.buildDoc();//new jsPDF();

        //doc.output('dataurlnewwindow');
    },
    arhivareCIVIndividuale: function (id,vin) {
        //var Coll = require('./collections/vehicule');
        var EditorView = require('./views/reports/arhivare');
        $.get(app.baseUrl + 'individuale/getvehiculecomanda/' + id + '?vin=' + vin, function (data) {
            //var collection = new Coll(data);
            var view = new EditorView({
                data: data,
                controller:'individuale'
            });
            app.modal.show(view, {
                preventDestroy: true
            });
            //var doc = view.buildDoc();//new jsPDF();
            //doc.output('dataurlnewwindow');
            // var pdfWindow = gui.Window.open('pdfviewer/index.html', {
            //     width: 800,
            //     height: 600,
            //     },function(win){
            //         win.data={file:doc.output('datauristring')};
            //     });
        });
        // var Model = require('./models/cerere');
        // var m = new Model({
        //     id: id
        // });
        // app.modal.show(new EditorView({
        //     model: m
        // }), {
        //     preventDestroy: true
        // });

        // var view = new EditorView(id);
        // var doc = view.buildDoc();//new jsPDF();

        //doc.output('dataurlnewwindow');
    },
    arhivareCIVNou:function(){
        var EditorView = require('./views/reports/operatiiciv');
        // $.get(app.baseUrl + 'vins/getvehiculedearhivat', function (data) {
        //     //var collection = new Coll(data);
            var view = new EditorView({
                isArhivare:true
            });
            app.container.show(view);
        //});
    },
    anulareCIVNou:function(){
        var EditorView = require('./views/reports/operatiiciv');
        // $.get(app.baseUrl + 'vins/getvehiculedeanulat', function (data) {
        //     //var collection = new Coll(data);
            var view = new EditorView({
                isAnulare:true
            });
            app.container.show(view);
        //});
    },
    situatieCIVIndividual:function(){
        var IndexView = require('./views/individuale/situatie');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    listaOperator:function(){
        var IndexView = require('./views/individuale/operator');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },

    /**
     * *****************CERERI NR. OMOLOGARE
     */
    newCerereOmol:function(){

    },

    listaCereriOmologare:function(){
        var IndexView = require('./views/registru/cereri');
        app.container.show(new IndexView({
            message: 'Hello new module!'
        }));
    },
    editCerereOmologare:function(id){
        var IndexView = require('./views/registru/index');
        app.container.show(new IndexView({
            message: 'Hello new module!',
            id:id=='new'?null:id,
            tip:'C'
        }));
    },
    editCerereIndividuale:function(id){
        var IndexView = require('./views/registru/index');
        app.container.show(new IndexView({
            message: 'Hello new module!',
            id:id=='new'?null:id,
            tip:'C'
        }));
    },
    editCerereCOC:function(id){
        var Model = require('./models/vehiculIndividuale');
        var m = new Model({
            id_comanda: 0,
            stare:1,
            is_nr_reg:true
        });
        var IndexView = require('./views/registru/cerereCOC');
        app.container.show(new IndexView({
            message: 'Hello new module!',
            model: m,
            id:id=='new'?null:id,
            tip:'C'
        }));
    },
    editCerereArtizanala:function(id){
        var IndexView = require('./views/registru/index');
        app.container.show(new IndexView({
            message: 'Hello new module!',
            id:id=='new'?null:id,
            tip:'A'
        }));
    }
});
module.exports = controller;