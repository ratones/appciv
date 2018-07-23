var ipc = requireNode('ipc');
module.exports = Marionette.ItemView.extend({
	className:'page',
	template:require('./../../templates/vehicule/spreadsheet.hts'),
	events:{
		'click #load':'loadData',
		'click #save':'saveData',
		'click #copy' :'duplicateRows',
		'click #back':'back'
	},
	back:function(){
		window.location.hash='#appciv/cereri';
	},
	duplicateRows:function(){
		var source = this.hot.getDataAtRow(0);
		for(var i=1;i<this.hot.countRows()-1;i++){
			for(var x = 4;x<=this.hot.countCols();x++){
				var val = this.hot.getDataAtCell(0,x);
				this.hot.setDataAtCell(i,x,val);
			}
		}
	},
	onShow:function(){
		var self = this;
		this.validators={};
		this.isValid = true;
		console.log('spreadsheet');
		this.buildLoad();
		var container = document.getElementById('vehicles');
		var autosave = document.getElementById('autosave');
		this.hot = new Handsontable(container, {
                  startRows: 1,
                  startCols: 6,
                  rowHeaders: true,
                  colHeaders: true,
                  minSpareRows: 0,
                  contextMenu: true,
                  search:true,
                //   afterChange: function (change, source) {
                //     if (source === 'loadData') {
                //       return; //don't save this change
                //     }
                // }

        });
        var searchFiled = document.getElementById('search_field');
        Handsontable.Dom.addEvent(searchFiled,'keyup', function (event) {
		    var queryResult = self.hot.search.query(this.value);
		    var first = queryResult[0];
		    self.hot.render();
		  });
	},
	loadData:function(e){
		var self = this;
		var options = {
			  rowHeaders: true,
	          colHeaders: true,
	          minSpareRows: 1,
	          contextMenu: true,
	          beforeValidate :self.beforeValidate.bind(self)
	      };
		$.ajax({
			url:app.baseUrl+'appciv/civutils/getdateciv',
			type:'POST',
			data:{id_tvv:$('#versiune').data('selected').id,id_extensie:$('#extensie').data('selected').id},
			success:function(data){
				$.extend(options,data.data);
				data.data.columns.map(function(column){
					column.validator = self.validator.bind(self);
					if(column.interval){
						self.validators[column.data] = column.interval;
					}
				});
				//self.hot = $('#vehicles').handsontable(options);
				self.hot.updateSettings(options);
			}
		});
	},
	buildLoad:function(){
		$('#wvta').w2field('list',{url:app.baseUrl + '/civutils/getWVTA',minLength: 0,cascadeTo:['#extensie']});
		$('#extensie').w2field('list',{cascadeTo:['#tip'],url:app.baseUrl + '/civutils/getExtensiiWVTA',minLength: 0,postData:function(){return {id_wvta:$('#wvta').data('selected').id};}});
		$('#tip').w2field('list',{cascadeTo:['#varianta'],url:app.baseUrl + '/civutils/gettipuri',minLength: 0,postData:function(){return {id_extensie:$('#extensie').data('selected').id};}});
		$('#varianta').w2field('list',{cascadeTo:['#versiune'],url:app.baseUrl + '/civutils/getvariante',minLength: 0,postData:function(){return {id_wvta:$('#wvta').data('selected').id,tip:$('#tip').data('selected').id};}});
		$('#versiune').w2field('list',{url:app.baseUrl + '/civutils/getversiuni',minLength: 0,postData:function(){return {id_wvta:$('#wvta').data('selected').id,varianta:$('#varianta').data('selected').id,tip:$('#tip').data('selected').id};}});
	},
	validator:function(value,callback){
		callback(true);
	},
	beforeValidate:function(value,row,prop,source){
		var interval = this.validators[prop];
		var col = this.hot.propToCol(prop);
		var totalRows = this.hot.countRows();
		if(row<totalRows-1){
			if(interval){
				if(value && value !='' && value >= Number(interval[0]) && value <= Number(interval[1])){
					$(this.hot.getCell(row,col)).w2tag();
					this.isValid=true;
				}
				else{
					if(!value || value === '')
						$(this.hot.getCell(row,col)).attr('id','field'+row+'-'+col).w2tag('Valoare obligatorie!');
					else
						$(this.hot.getCell(row,col)).attr('id','field'+row+'-'+col).w2tag('Valoare intre '+interval[0] +' si '+ interval[1]);
					this.isValid=false;
				}
			}else if(prop==='vin'){
				if(!this.validateVin(value)){
					$(this.hot.getCell(row,col)).attr('id','field'+row+'-'+col).w2tag('Valoare invalida!');
					this.isValid=false;
				}
				else{
					$(this.hot.getCell(row,col)).w2tag();
					this.isValid=true;
				}

			}else if(prop==='an'){
				if(value<1960 || value>new Date().getFullYear()){
					$(this.hot.getCell(row,col)).attr('id','field'+row+'-'+col).w2tag('Valoare invalida!');
					this.isValid=false;
				}else{
					$(this.hot.getCell(row,col)).w2tag();
					this.isValid=true;
				}
			}else{
				if(!value || value === ''){
						$(this.hot.getCell(row,col)).attr('id','field'+row+'-'+col).w2tag('Valoare obligatorie!');
						this.isValid=false;
					}
					else{
						$(this.hot.getCell(row,col)).w2tag();
						this.isValid=true;
					}
			}
		}
	},
	saveData:function(){
		var cansave=true;
		var self = this;
		this.hot.validateCells(function(valid){
			if(valid){
				var hot = self.hot;
				var arr = [];
				for(var i =0;i<hot.countRows()-1;i++){
					var obj = {};
					for(var x=0;x<=hot.countCols();x++){
						var prop = hot.colToProp(x);
						obj[prop] = hot.getDataAtRowProp(i,prop);
						// if(!obj[prop] || obj[prop]===''){
						// 	cansave=false;
						// }
					}
					if(obj.vin)
						arr.push(obj);
				}
				var postData={
					id_tvv:$('#versiune').data('selected').id,
					id_extensie:$('#extensie').data('selected').id,
					id_comanda:self.options.id_comanda,
					data:arr
				}
				if(cansave && self.isValid){
					$('#validationSummary').empty();
					$.ajax({
						url:app.baseUrl + '/civutils/saveVehiculeExcel',
						type:'POST',
						contentType:'application/json',
						data:JSON.stringify(postData),
						success:function(response){
							if(response.errors.length===0){
								$('#validationSummary').empty();
								var opt = {
			                        text: 'Vehiculele au fost adaugate!',
			                        title:'Notificare',
			                        type: 'success-template'
			                    };
			                    ipc.send('app:notification:show', opt);
			                    self.hot.loadData([]);
							}else{
								var opt = {
			                        text: 'Vehiculele contin erori!',
			                        title:'Notificare',
			                        type: 'error-template'
			                    };
               					ipc.send('app:notification:show', opt);

								response.errors.map(function(error){
									for(var err in error){
										$('#validationSummary').append('<span>'+err + ': ' + error[err] + '</span><br>');
									}
								});
								response.goodVehicles.map(function(vin){
									for(var row = 0; row<=self.hot.countRows();row++){
										if(self.hot.getDataAtCell(row,0)===vin){
											self.hot.alter('remove_row', row);
										}
									}
								});

							}
						},
						error:function(data){
							data.map(function(err){
								$('#validationSummary').append('<span>'+err + ': ' + data[err] + '</span><br>');
							});
						}
					});
				}else{
					//w2alert('datele nu sunt valide!');
				}
			}
		});

		//}else{
			//w2alert('datele nu sunt valide!');
		//}
		//TODO: save data to server
	},
	validateVin:function(value,source){
			var vin = value;//.toUpperCase();
            var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
            //var wild = /^$/;

            if (vin !== undefined && vin.length > 0) {
                if (regex.test(vin) && vin.length === 17) {
                    //app.Util.removeError($('#vin').parent());
                    return true;
                    //}else if(wild.test(vin)){

                } else {
                    return false;
                }
		}
	}
});
