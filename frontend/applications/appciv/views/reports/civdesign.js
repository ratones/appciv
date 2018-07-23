var fs = requireNode('fs');

var PrinterConfig = window.Marionette.ItemView.extend({
	getTemplate:function(){return '<div></div>';},
	className:'page',
	indexConfig:0,
	events:{
		'click #printBtn':'print'
	},
	initialize:function(){
		this.config = JSON.parse(fs.readFileSync( 'configPrinters.json'));
		this.records = [];
		console.log(this.config);
		for(var i in this.config){
			var configuration = this.config[i];
			configuration.recid = i;
			this.records.push(configuration);
			this.indexConfig ++;
		}
	},
	onShow:function(){
		this.open();
	},
	open: function() {
	    var self = this;
	    this.win = self.$el.w2panel({
	        name: 'civReport' + self.cid,
	        title: 'Configurari Imprimante',
	        width: '1000',
	        showMin: true,
	        showMax: true,
	        height: '800',
	        resizable: true,
	        onOpen: function(event) {
	            self.setupView();
	        },
	        onClose: function(event) {
	            self.destroy();
	        }
	    });
    },
    setupView:function(){
			 var self = this;
				this.$el.w2grid({
					name:'priterConfigGrid',
					show:{
						toolbar:true,
						toolbarAdd:true,
						toolbarDelete:true,
						toolbarSave:true
					},
					columns:[
						{field:'recid',caption:'ID',size:'100px'},
						{field:'name',caption:'Nume imprimanta',size:'30%',editable:{type:'text'}},
						{field:'x',caption:'Pozitie x(mm)',size:'150px',editable:{type:'text'}},
						{field:'y',caption:'pozitie y(mm)',size:'150px',editable:{type:'text'}},
						{field:'default',caption:'Activ',size:'100px',editable:{type:'checkbox'}}
					],
					records:self.records,
					onAdd:function(){
						this.add({recid:self.indexConfig + 1});
					},
					onSubmit:function(event){
						event.onComplete = function(){
							var newConfig = {};
							this.records.map(function(rec){
								newConfig[rec.recid] = rec;
							});
							fs.writeFileSync('configPrinters.json',JSON.stringify(newConfig, null, "\t"));
						}
					}
				});
    },

    onBeforeDestroy: function() {
       //fs.writeFileSync('configPrinters.json',JSON.stringify(this.config, null, "\t"));
       //$(document).off('keydown',self.moveElement);
       //$(document).off('keyup',self.checkCTRL);
			 w2ui.priterConfigGrid.destroy();
    },

    closeView: function(e) {
        this.win.destroy();
    },

    checkCTRL:function(e){

    },

    moveElement:function(e){

    },
    print:function(){

    }
});
module.exports = PrinterConfig;
