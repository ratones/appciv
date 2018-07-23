var Globals = require('./../../globals');
var ipc = requireNode('ipc');
module.exports = Marionette.LayoutView.extend({
    expandedGrid: '',
    template: require('./../../templates/registru/index.hbs'),
    attributes: function() {
        return {
            style: 'height:100%'
        };
    },
    initialize: function(options) {
        this.id_cerere = options.id;
    },

    onShow: function(){
        //build page layout and regions
        var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
        this.$el.w2layout({
            name:'nrRegLayout',
            panels:[
                {type:'top', style:pstyle,resizable:false,size:'50px', toolbar: {
                    items: [
                        { type: 'check',  id: 'item1', caption: 'Vezi date existente', img: 'icon-page', checked: false },
                        { type: 'break',  id: 'break0' },
                        // { type: 'menu',   id: 'item2', caption: 'Drop Down', img: 'icon-folder', items: [
                        //     { text: 'Item 1', icon: 'icon-page' }, 
                        //     { text: 'Item 2', icon: 'icon-page' }, 
                        //     { text: 'Item 3', value: 'Item Three', icon: 'icon-page' }
                        // ]},
                        // { type: 'break', id: 'break1' },
                        // { type: 'radio',  id: 'item3',  group: '1', caption: 'Radio 1', img: 'icon-page', hint: 'Hint for item 3', checked: true },
                        // { type: 'radio',  id: 'item4',  group: '1', caption: 'Radio 2', img: 'icon-page', hint: 'Hint for item 4' },
                        // { type: 'spacer' },
                        // { type: 'button',  id: 'item5',  caption: 'Item 5', icon: 'w2ui-icon-check', hint: 'Hint for item 5' }
                    ],
                    onClick: function (event) {
                        w2ui['nrRegLayout'].toggle('preview')
                    }
                }},
                { type: 'main', style: pstyle, content: '<div id="workRegion" class="page">Work area</div>', title:'Zona Lucru' },
                { type: 'preview', size: '50%', resizable: true, hidden: false, style: pstyle, content: '<div id="resourceRegion" class="page">Resource Area</div>', title:'Zona date WVTA' },
            ]
        })
        this.addRegions({
            work: '#workRegion',
            resource: '#resourceRegion'
        });
        var TVVFormView = require('./tvvform');
        var tvvform = new TVVFormView({id_cerere : this.id_cerere});
        this.work.show(tvvform)
        w2ui['nrRegLayout'].toggle('preview')
    },

    onBeforeDestroy: function() {
        w2ui['nrRegLayout'].destroy()
    }

});
