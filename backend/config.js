var ipc = requireNode('ipc');
var Util = require('./util');
var gui = requireNode('nw.gui');
var config = {
    modules: {
        user: {
            active: false
        },
        // common:{
        //     active:true,
        //     name:'common',
        //     external_server: 'https://prog.rarom.ro:446/common/',
        //     intranet_server: 'http://10.1.0.32:8083/common/',
        //     dev_server: 'http://localhost:8083/common/',
        // },
        appciv: {
            name: 'appciv',
            title: 'Cereri C.I.V.',
            active: true,
            external_server: 'https://prog.rarom.ro:446/civapi/',
            intranet_server: 'http://10.1.0.32:8083/civapi/',
            dev_server: 'http://10.2.2.10:8083/civapi/',
            civ_server: 'http://10.1.0.32:8104/restservice/api/printciv/',// //10.2.2.84

            'menuDescriptor': [{
                label: w2utils.lang('Comenzi C.I.V.'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:isAuthenticated', 'appciv') && !ipc.sendSync('user:request:isuserinrole', [
                        [15, 16, 18], 'appciv'
                    ]);
                },
                submenu: [{
                    icon: 'w2ui-icon-plus',
                    type: 'normal',
                    label: w2utils.lang('Comanda noua'),
                    click: function () {
                        window.location.hash = '#appciv/editCerere';
                    }
                }, {
                    label: w2utils.lang('Lista comenzi Grivita'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri/grivita';
                    }
                },
                {
                    label:  w2utils.lang('Lista comenzi Voluntari'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri/voluntari';
                    }
                },
                {
                    label:  w2utils.lang('Lista comenzi Pitesti'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri/pitesti';
                    }
                },
                {
                    label:  w2utils.lang('Toata lista'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/cereri';
                    }
                },
                {
                    label:  w2utils.lang('Situatie plati'),
                    type: 'normal',
                    icon: 'w2ui-icon-money',
                    click: function () {
                        window.location.hash = '#appciv/plati';
                    }
                }, {
                    label:  w2utils.lang('Situatie CIV-uri'),
                    type: 'normal',
                    icon: 'w2ui-icon-list',
                    click: function () {
                        window.location.hash = '#appciv/situatie';
                    }
                }]
            }, {
                label:  w2utils.lang('Sfarsit serie'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:isAuthenticated', 'appciv') && !ipc.sendSync('user:request:isuserinrole', [
                        [15, 16, 18], 'appciv'
                    ]);
                },
                submenu: [{
                    label:  w2utils.lang('Lista vehicule'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/listVins';
                    }
                }]
            }, {
                label:  w2utils.lang('CIV Individual'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:request:isuserinrole', [
                        [1, 14, 15, 18], 'appciv'
                    ]);
                },
                submenu: [{
                    label:  w2utils.lang('Lista comenzi'),
                    type: 'normal',
                    icon: 'w2ui-icon-columns',
                    click: function () {
                        window.location.hash = '#appciv/listCIVIndividual';
                    },
                    show: function () {
                        return !ipc.sendSync('user:request:isuserinrole', [
                            [18], 'appciv'
                        ]);
                    },
                }, {
                    label:  w2utils.lang('Situatie CIV'),
                    type: 'normal',
                    icon: 'w2ui-icon-list',
                    click: function () {
                        window.location.hash = '#appciv/situatieCIVIndividual';
                    },
                    show: function () {
                        return !ipc.sendSync('user:request:isuserinrole', [
                            [18], 'appciv'
                        ]);
                    },
                }, {
                    label: w2utils.lang('Cauta VIN'),
                    type: 'normal',
                    icon: 'w2ui-icon-search',
                    click: function () {
                        window.location.hash = '#appciv/listaOperator';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1, 18], 'appciv'
                        ]);
                    },
                }]
            }, {
                label: w2utils.lang('Operatii CIV'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:request:isuserinrole', [
                        [1, 17, 16, 99], 'appciv'
                    ]);
                },
                submenu: [{
                    label: w2utils.lang('Arhivare'),
                    type: 'normal',
                    icon: 'w2ui-icon-check',
                    click: function () {
                        window.location.hash = '#appciv/arhivareCIVNou';
                    }
                },
                {
                    label: w2utils.lang('Anulare'),
                    type: 'normal',
                    icon: 'w2ui-icon-ban',
                    click: function () {
                        window.location.hash = '#appciv/anulareCIVNou';
                    }
                }]
            },
            {
                label: w2utils.lang('Cereri Nr. Omologare'),
                type: 'normal',
                show: function () {
                    return ipc.sendSync('user:isAuthenticated', 'appciv') && ipc.sendSync('user:request:isuserinrole', [
                        [999], 'appciv'
                    ]);
                },
                submenu: [{
                    icon: 'w2ui-icon-plus',
                    type: 'normal',
                    label: w2utils.lang('Cerere noua'),
                    click: function () {
                        window.location.hash = '#appciv/newCerereOmol';
                    }
                },
                {
                    icon: 'w2ui-icon-list',
                    type: 'normal',
                    label: w2utils.lang('Lista'),
                    click: function () {
                        window.location.hash = '#appciv/listaCereriOmologare';
                    }
                }]
            }, {
                label: w2utils.lang('Utilizator'),
                type: 'normal',
                enabled: true,
                submenu: [{
                    label: w2utils.lang('Autentificare'),
                    icon: 'w2ui-icon-lock',
                    show: function () {
                        return !ipc.sendSync('user:isAuthenticated', 'appciv');
                    },
                    click: function () {
                        app.execute('app:user:login', 'appciv');
                    }
                }, {
                    type: 'separator'
                }, {
                    label: w2utils.lang('Profil'),
                    show: function () {
                        return ipc.sendSync('user:isAuthenticated', 'appciv');
                    },
                    click: function () {
                        // app.execute('app:user:profile', 'appciv');
                        window.location.hash = '#profile'
                    },
                    icon: 'w2ui-icon-user'
                }, {
                    label: w2utils.lang('Inchide sesiunea'),
                    icon: 'w2ui-icon-lock',
                    show: function () {
                        return ipc.sendSync('user:isAuthenticated', 'appciv');
                    },
                    click: function () {
                        app.execute('app:user:logout', 'appciv');
                    }
                },
                {
                    label: w2utils.lang('Setari proxy'),
                    click: function () {
                        // app.execute('app:user:profile', 'appciv');
                        window.location.hash = '#settings'
                    },
                    icon: 'w2ui-icon-settings'
                }]
            }, {
                label: w2utils.lang('Ajutor'),
                type: 'normal',
                enabled: true,
                submenu: [{
                    label: w2utils.lang('Manual utilizare'),
                    type: 'normal',
                    icon: 'w2ui-icon-question-circle',
                    click: function () {
                        gui.Window.open(Util.getAppPath() + 'ManualCIV.pdf')
                    }
                }, {
                    label: 'Info',
                    type: 'normal',
                    icon: 'w2ui-icon-info',
                    enabled: true,
                    click: function () {
                        app.execute('app:request:info');
                    }
                },]
            }, {
                label: 'Administrare',
                show: function () {
                    return ipc.sendSync('user:request:isuserinrole', [
                        [1], 'appciv'
                    ]);
                },
                type: 'normal',
                enabled: true,
                submenu: [{
                    label: 'Users',
                    icon: 'w2ui-icon-users',
                    click: function () {
                        window.location.hash = '#appciv/listaUseri';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1], 'appciv'
                        ]);
                    },
                }, {
                    label: 'Actualizare aplicatie',
                    icon: 'w2ui-icon-upload',
                    click: function () {
                        window.location.hash = '#appciv/updateApp';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1], 'appciv'
                        ]);
                    }
                }, {
                    label: 'Autorizare utilizator',
                    icon: 'w2ui-icon-lock',
                    click: function () {
                        window.location.hash = '#appciv/autorizareUser';
                    },
                    show: function () {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1, 33], 'appciv'
                        ]);
                    }
                }/*,{
                    label: 'Config Tipar CIV',
                    icon: 'w2ui-icon-settings',
                    click: function() {
                        app.execute('app:page:configciv','appciv');
                    },
                    show: function() {
                        return ipc.sendSync('user:request:isuserinrole', [
                            [1,33], 'appciv'
                        ]);
                    }
                }*/]
            }]
        }

    },
    serverURL: '',
    "fileinputDefaults": function () {
        return {
            "allowedFileExtensions": [
                "pdf",
                "xml",
                "jpg",
                "gif",
                "png"
            ],
            "allowedPreviewTypes": [
                "image",
                "pdf"
            ],
            "fileActionSettings": {
                "removeTitle": w2utils.lang("Sterge fisier"),
                "uploadTitle": w2utils.lang("Incarca fisier"),
                "indicatorNewTitle": w2utils.lang("Fisier neincarcat inca..."),
                "indicatorSuccessTitle": w2utils.lang("Incarcat"),
                "indicatorErrorTitle": w2utils.lang("Eroare incarcare"),
                "indicatorLoadingTitle": w2utils.lang("Se incarca ...")
            },
            "uploadTitle": w2utils.lang("Incarca"),
            "uploadLabel": w2utils.lang(" Incarca"),
            "browseTitle": w2utils.lang("Alege fisiere"),
            "browseLabel": w2utils.lang(" Alege..."),
            "removeTitle": w2utils.lang("Reset"),
            "removeLabel": w2utils.lang(" Reset"),
            "dropZoneTitle": w2utils.lang("Trageti fisiere aici"),
            "previewTemplates": {
                "other": "<div class=\"file-preview-frame\" id=\"{previewId}\" data-fileindex=\"{fileindex}\"><div class=\"file-preview-other\"><i class=\"w2ui-icon-file\"></i>\n</div>\n{footer}</div>"
            }
        }
    }
};
module.exports = config;
