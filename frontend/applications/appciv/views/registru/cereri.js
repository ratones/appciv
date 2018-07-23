var ipc = requireNode('ipc')

module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/registru/cereri.hbs'),
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
        this.location = options.location;
        _.bindAll(this, 'refreshGrid');
        this.setPermissions();
    },
    setPermissions: function() {
        this.allowSuper = ipc.sendSync('user:request:isuserinrole', [
            [13,1], 'appciv'
        ]);
        this.allowDelete = ipc.sendSync('user:request:isuserinrole', [
            [1], 'appciv'
        ]);
        this.allowPrint = ipc.sendSync('user:request:isuserinrole', [
            [1, 10], 'appciv'
        ]);

    },
    onShow: function() {
        var self = this;
        this.renderGrid();
    },
    renderGrid:function(){
        var self = this;
        $('#cereriNrOmGrid').w2grid({
            name: 'gridCereriOmologare',
            url: app.dotUrl + 'doiit/getComenzi',
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            fixedBody: true,
            show:{
                toolbar:true,
                toolbarAdd:true,
                toolbarEdit:true,
                toolbarDelete:true,
                footer:true
            },
            onAdd:function(){},
            onEdit:function(data){
                app.router.navigate('appciv/editCerereOmologare/'+data.recid,{trigger:true})
            },
            onDelete:function(data){
                console.log(data);
            },
            columns:[
                {field:'id', caption:'Nr. Cerere', size:'20%'},
                {field:'wvta', caption:'WVTA', size:'20%'},
                {field:'marca', caption:'Marca', size:'20%'},
                {field:'tip', caption:'Tip', size:'20%'},
                {field:'varianta', caption:'Varianta', size:'20%'},
                {field:'versiune', caption:'Versiune', size:'20%'},
                {field:'denumire_comerciala', caption:'Denumire', size:'20%'},
                {field:'nr_registru', caption:'Nr. Omologare', size:'20%'},
            ],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
        })
    },
    refreshGrid:function(){},
    onBeforeDestroy:function(){
        w2ui['gridCereriOmologare'].destroy()
    }
});