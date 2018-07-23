var Model = require('./../../models/vehiculciv');
var Collection = require('./../../collections/vehiculeciv');
module.exports = Marionette.ItemView.extend({
	
	template:require('./../../templates/arhivare.html'),
	className: 'w2ui-reset w2ui-form page',
	events:{
		'click #btnSave':'arhivare',
		'click #btnClose':'closeView',
		'click #btnNext':'next',
		'click #btnPrev':'prev',
		'click #btnLast':'last',
		'click #btnFirst':'first',
		'keyup #serieciv':'gotofolie',
		//'blur #serieciv':'gotofolie',
		'keyup #vin1':'lookup',
		//'blur #vin1':'lookup',
		'keyup #folie_civ':'gotosave'
	},
	bindings:{
	},

	init:function(){
       
	},

	onShow:function(){
        this.collection = new Collection();
        this.model = new Model();//this.collection.models[0];
		this.controller = this.options.controller;
        this.isAnulare = this.options.isAnulare;
        this.isArhivare = this.options.isArhivare;
        var self = this;
        this.anulari = [];
        //$('#totalciv').text(self.collection.models.length);
        $('input[type=text][readonly]').css({'background-color':'yellow','color':'black'});
        $('textarea[readonly]').css({'background-color':'yellow','color':'black'});
        //self.setupView(true);
        if(self.isArhivare){
            if(self.model.get('serie_civ')){
                $('#folie_civ').focus();
            }else{
                $('#serieciv').focus();
            }	
        }if(self.isAnulare){
            $('#btnSave').text('Anulare');
            this.anulari.push({id:0, text:'Carte anulata cf.proc.Ian.2007'});
            this.anulari.push({id:9, text:'CARTE ANULATA'});
            this.anulari.push({id:1, text:'GRESITA LA ELIBERARE'});
            this.anulari.push({id:2, text:'CIV EXPIRAT'});
            this.anulari.push({id:3, text:'DATE INCORECTE'});
            this.anulari.push({id:4, text:'DATE CORECTATE DE PROPRIETAR'});
            this.anulari.push({id:5, text:'MENTIUNI INCORECTE'});
            this.anulari.push({id:6, text:'ALTE MOTIVE'});
            this.anulari.push({id:7, text:'CIV ANULAT DE PRODUCATOR'});
            this.anulari.push({id:8, text:'CIV ANULAT DE POLITIE'});
        }
        $('#btnClose').remove();
	},


	rebaseIndex:function(){
		this.collection.models.map(function(model,i){
			model.set('currentIndex',i+1);
		});
	},

	setupView:function(link){
		if(!link)
			this.unstickit();
		var self = this;
		var mentiuni = '';
		if(link) self.rebaseIndex();
		if(this.model){
			//this.model.set('currentIndex',this.collection.models.indexOf(this.model)+1);
			if(this.model.get('Modificari')){
                this.model.get('Modificari').map(function(mod){
                    mentiuni += mod.modificare + '\n';
                });
            }
			this.model.set('mentiuni',mentiuni);
			//this.model.unset('folie_civ');
			for(var field in this.model.attributes){
				self.bindings['#'+field] = field;
			}
			$('#btnSave').attr('disabled',null);
		}else{
			this.model = new Model();
			$('#btnSave').attr('disabled',true);
		}
		$('#vin1').val(this.model.get('nr_identif'));
		$('#serieciv').val(this.model.get('serie_civ'));
		//if(link)
		this.stickit();
	},
	
	next:function(e,del){
		var self = this;
		if(del && this.collection.models.length===1){
			this.collection.remove(this.model);
			this.model = null;
			$('#totalciv').text(this.collection.models.length);
			this.setupView();
			w2alert('Nu mai sunt civ-uri de arhivat!');
		}
		if(this.model.get('currentIndex')<this.collection.models.length){
			if(del){
				var currmodel = this.model;
			}
			var nextindex = this.model.get('currentIndex')+1;
			this.model = this.collection.find(function(model) { 
				return model.get('currentIndex') === nextindex;
			});
			if(del){
				this.collection.remove(currmodel);
				this.rebaseIndex();
				if(this.model.get('serie_civ')){
					$('#folie_civ').focus();
				}else{
					$('#serieciv').focus();
				}	
				$('#totalciv').text(this.collection.models.length);
			}
			this.setupView();
		}
	},
	
	prev:function(){
		var self = this;
		if(this.model.get('currentIndex')>1){
			var nextindex = this.model.get('currentIndex')-1;
			this.model = this.collection.find(function(model) { return model.get('currentIndex') ===nextindex; });//this.collection.models[this.model.get('currentIndex')-1];
			this.setupView();
		}
	},
	
	last:function(){       
		this.model = this.collection.models[this.collection.length-1];
		this.setupView();
	},
	
	first:function(){
		this.model = this.collection.models[0];
		this.setupView();
	},
	
	search:function(field,value){
        var self = this;
        w2utils.lock(self.$el,'Se cauta CIV-uri....');
		console.log('searching for ' + value + ' in ' + field);
        var method = this.isAnulare?'/getVehiculeDeAnulat':'/getVehiculeDeArhivat';
        var postData = {};
        postData[field] = value;
        $.ajax({
            url: app.baseUrl + 'vins' + method,
            data:postData,
            type:'POST',
            success:function(data){
                self.collection.reset(data);
                if(self.collection.length === 0){
                    w2alert('Nu s-a gasit CIV');
                    w2utils.unlock(self.$el);
                    $('#totalciv').text('0');
                    self.model = new Model();
                    self.setupView(true);
                    return;
                }
                $('#totalciv').text(self.collection.models.length);
                var  newmodel = self.collection.models[0];
                if((newmodel && field ==='serie_civ') || field === 'nr_identif'){
                    self.model = newmodel;
                    self.setupView(true);
                }else if(!newmodel && field === 'serie_civ'){
                    self.model.set('serie_civ',value);
                }
                w2utils.unlock(self.$el);
            },
            error:function(){
                w2alert('Nu s-a gasit CIV');
                w2utils.unlock(self.$el);
            }
        })
		
	},
	lookup:function(e){
		if((e.which && e.which === 13) || !e.which){
			this.search('nr_identif',$('#vin1').val().toUpperCase());
		}
	},
	arhivare:function(){
		var self = this;
		var method = '', controller = '';
        if(self.isArhivare){
            method = '/arhivareciv';
			if(self.model.get('activitate') == 'e')
				controller = 'individuale';
			else
				controller = 'vehicule';
        }else{
            method = '/anulareciv';
			controller = 'vins';
        }
        
        
        
        if(self.isAnulare){
            w2popup.open({
                title: 'Motiv anulare',
                body: '<div class="w2ui-centered"><p>Alegeti motivul anularii</p><input type="text" id="motivanulare" style="width:250px" /></div>',
                onOpen:function(e){
                    e.onComplete = function(){
                        $('#motivanulare').w2field('list',{items:self.anulari});
                    };
                },
                onClose:function(e){
                    console.log(event);
                    if($(event.target).attr('id') == 'btnCancelAnulare')
                    {}
                    else{
                        var selected = $('#motivanulare').data('selected');
                        if(selected.id){
                            $.ajax({
                                url:app.baseUrl + controller + method,
                                type:'POST',
                                contentType:'application/json',
                                data:JSON.stringify({motiv:selected.id,civ:self.model.get('serie_civ')}),
                                dataType:'json',
                                success:function(data){
                                    self.next(null,true);
                                },
                                error:function(data){
                                    console.log(data.responseJSON);
                                    w2alert(data.responseJSON.message);
                                }
                            });
                        }else{
                            e.preventDefault();
                            w2alert('Nu ati ales motivul anularii!');
                        }
                    }
                },
                buttons   : '<button class="btn btn-blue" onclick="w2popup.close();" id="btnExecuteAnulare">OK</button> '+
                            '<button class="btn btn-red" onclick="w2popup.close();" id="btnCancelAnulare">Cancel</button>',
            });

        }
        else{
            $.ajax({
                url:app.baseUrl + controller + method,
                type:'POST',
                contentType:'application/json',
                data:JSON.stringify(self.model.toJSON()),
                dataType:'json',
                success:function(data){
                    self.next(null,true);
                },
                error:function(data){
                    console.log(data.responseJSON);
                    w2alert(data.responseJSON.message);
                }
            });
        }
		
	},

	gotofolie:function(e){
		var myString = $('#serieciv').val().toUpperCase();
		if(!myString) return;
		if((e.which && e.which === 13) || !e.which){
			$('#serieciv').val(myString);
			var myRegexp = /([A-Z])(-)([0-9]{6})/;
			var match1 = myRegexp.exec(myString);
			if(!match1){
				var myRegexp = /([A-Z])([0-9]+)/;
				var match2 = myRegexp.exec(myString);
				if(!match2){
					alert('Seria CIV nu este introdusa corect!');
					$('#serieciv').focus();
				}else{
					var sc = match2[1] + '-' + match2[2];
					 $('#serieciv').val(sc);
					 this.search('serie_civ',sc);
					 $('#folie_civ').focus();
				}
			}else{
				this.search('serie_civ',myString);
				$('#folie_civ').focus();
			}
		}		
	},

	gotosave:function(e){
		if(e.which === 13){
			$('#btnSave').focus();
		}
	},
	
	closeView: function(e) {
        this.win.destroy();
    }
});