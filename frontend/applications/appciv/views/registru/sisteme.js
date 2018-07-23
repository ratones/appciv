var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
    className: 'fullscreen',
    template: require('./../../templates/registru/sisteme.hbs'),
    initialize: function() {
        this.setPagePermissions();
        //this.collection.setGridName('gridSisteme');
    },
    refreshUI: function() {
    	var self = this;
    	if (w2ui.hasOwnProperty('gridSisteme')){
            w2ui.gridSisteme.records = this.collection.toJSON();
            w2ui.gridSisteme.refreshFull();
        }
        if (w2ui.hasOwnProperty('gridSursaSist')){
             w2ui.gridSursaSist.refresh();
        }
         else
         	$.get(app.dotUrl + '/nrom/getlimitari/'+self.options.categorie,null,function(response){
        		self.sourceItems=response;
        		self.renderSursa();
        	});
        this.isRendered = true;
    },
    onShow: function() {
        var self = this;
        this.renderGrid();
        if (!this.options.isnew){
        	$.get(app.dotUrl + '/nrom/getlimitari/'+self.options.categorie,null,function(response){
        		response.map(function(s){
        			s.recid = s.id;
        			s.items = s.cerinte;
        			return s;
        		});
        		self.sourceItems=response;
        		self.renderSursa();
        	});

        }
        self.collection.on('add remove', function(){
                window.isDirty.dirty = true;
        });
    },
     renderGrid: function() {
        var self = this;
        this.$el.find('#gridSisteme').w2grid({
            name: 'gridSisteme',
            show: {
                toolbar: true,
                toolbarDelete:true,
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
            	field:'id_comp',
            	hidden:true,
            },{
            	field:'id_cerinta',
            	hidden:true,
            },{
                field: 'act_normativ',
                caption: 'Act normativ',
                size: '30%',
                sortable: true
            }, {
                field: 'categorie',
                caption: 'Aplicare',
                size: '60%',
                sortable: true
            }, {
                field: 'cerinta',
                caption: 'Cerinta',
                size: '30%',

            },
            {
                field: 'datain',
                caption: 'Data Aplicarii',
                size: '10%',
                sortable: true,
                type: 'date'
            },
            {
                field: 'data_exp',
                caption: 'Data Expirarii',
                size: '10%',
                sortable: true,
                type: 'date'
            }]
        });
    },
    renderSursa:function(){
    	var me = this;
        this.$el.find('#gridSursaSist').w2grid({
            name: 'gridSursaSist',
            recid: 'id',
            show: {
                toolbar: true,
                selectColumn:true
            },
            records:me.sourceItems,
            // url: app.dotUrl + '/nrom/getsisteme',
            columns: [{
                field: 'id',
                hidden: true
            },{
                field: 'id_cerinta',
                hidden: true
            },
            {
                field: 'coloana',
                caption:'Coloana',
                size:'100px',
                sortable:true
            },{
                field: 'act_normativ',
                caption: 'Act normativ',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            },
            {
            	field:'cerinta',
            	caption:' <b style="color:red">CERINTA SE SELECTEAZA DIN LISTA DACA E CAZUL!</b>',
            	size:'30%',
            	 editable:{
            		type:'list',
            		onChange:function(e){
            			var selected = e.item;
            			if(e.item.id){
	            			console.log(selected.data_exp);
	            			var grid = w2ui.gridSursaSist;
	            			var recid = grid.getSelection()[0];
	            			grid.set(recid,{data_exp:e.item.data_exp,cerinta:e.item.text,id_cerinta:e.item.id});
	            		}
            		}
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
                caption: 'Data aplicarii',
                size: '10%',
                sortable: true,
                type: 'date',
                editable: {
                    type: 'date'
                }
            },
             {
                field: 'data_exp',
                caption: 'Data expirarii',
                size: '10%',
                sortable: true,
                type: 'date',
                editable: {
                    type: 'date'
                }
            },{
                field: 'categorie_ue',
                caption: 'Categorii',
                size: '20%',
                sortable: true,
                type: 'text',
                editable: {
                    type: 'text'
                }
            }],
     //        onEditField:function(event){
     //        	event.onComplete=function(data){
					// var record = this.get(data.recid);
					// var tr = $('#grid_' + this.name + '_rec_' + w2utils.escapeId(data.recid));
	    //         	var el = tr.find('[col=' + data.column + '] > div');
	    //         	var input = $(el).find('input').get(0);
	    //         	console.log(record);
	    //         	switch(this.columns[data.column].field){
	    //         		case 'litera':
	    //         			$(input).w2field().options.items=['C','D'];
	    //         			break;
	    //         	}
     //        	}

     //        },
            // onExpand:function(event){
            // 	if (w2ui.hasOwnProperty('gridCerinte_' + event.recid)) {
            //         w2ui['gridCerinte_' + event.recid].destroy();
            //     }
            //     $('#' + event.box_id).css({
            //         margin: '0px',
            //         padding: '0px',
            //         width: '100%',
            //         'min-height':'200px'
            //     }).animate({
            //         height: '200px'
            //     }, {
            //         duration: 10,
            //         complete: function() {
            //             var record = w2ui['gridSursaSist'].get(event.recid);
            //             record.cerinte.map(function(c){
            //             	c.recid = c.id;
            //             	return c;
            //             });
            //             $('#' + event.box_id).w2grid({
            //             	name:'gridCerinte_' + event.recid,
            //             	show:{
            //             		toolbar:false,
            //             		selectColumn:true
            //             	},
            //             	multiSelect:false,
            //             	records:record.cerinte,
            //             	columns:[
            //             		{field:'id'},
            //             		{field:'cerinta',caption:'Cerinta',size:'20%'},
            //             		{field:'datain',caption:'Data',size:'20%'},
            //             		{field:'data_exp',caption:'Data Exp',size:'20%'}
            //             	]
            //             });
            //         }
            //     });
            // },
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
                                return model.get('id_comp') === comp.id;
                            });
                            if (exist) {
                                w2alert('Componenta selectata exista deja!');
                            }else if(!comp.cerinta){
                                w2alert('Va rog selectati o valoare in coloana "CERINTA"');
                            }else {
                                var Proto = require('./../../models/registru/sistem')
                                var mdl = new Proto({
                                    id_comp: comp.id,
                                    act_normativ: comp.act_normativ,
                                    datain: comp.datain,
                                    data_exp:comp.data_exp,
                                    cerinta:comp.cerinta,
                                    id_cerinta:comp.id_cerinta,
                                    categorie: comp.categorie
                                });
                                me.collection.add(mdl);
                                w2ui.gridSisteme.add(mdl.toJSON())
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
    }
});
