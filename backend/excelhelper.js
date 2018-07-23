 // var xl = requireNode('xlgen');
// var json2xls = requireNode('json2xls');
var json2csv = require('json2csv');
var fs = requireNode('fs');
var Excel = function(){
	this.fieldMap = {};
	this.json = [];	
};


Excel.prototype.export= function(filename,options){
    var self = this;
    var fields=[];
    if(options && options.fieldMap){
        options.fieldMap.map(function(field){
            if(!field.hidden)
                // self.fieldMap[field.field] = field.caption;
                fields.push({label:field.caption,value:field.field,default:'NULL'});
        });
    }
    this.json = options.json || [];
    w2utils.lock('body');
    json2csv({ data: this.json, fields: fields }, function(err, csv) {
      if (err) console.log(err);
      fs.writeFile(filename, csv, function(err) {
        if (err) {
            throw err;
            w2utils.unlock('body');
           w2alert('Eroare la generarea fisierului!');
        }
        w2utils.unlock('body');
        w2alert('Fisierul a fost generat cu succes!');
        console.log('file saved');
      });
    });
};

// Excel.prototype.exports=function(filename,options){
// 	    var self = this;
// 	    w2utils.lock('body');
// 		var xlg = xl.createXLGen(filename);
//         //register formats
//         // var fmtDate0 = xlg.addFormat(xl.formatStrings.date0);
//         // var fmtDate1 = xlg.addFormat(xl.formatStrings.date1);
//         // var fmtDate2 = xlg.addFormat(xl.formatStrings.date2);
//         // var custfmtDate = xlg.addFormat('0.0000E+00');
//         // var genFormat =xlg.addFormat('General');
        
//         //this.fieldMap = options? options.fieldMap || {} : {};
//         var sht = xlg.addSheet('Sheet1');
//         if(options && options.fieldMap){
//         options.fieldMap.map(function(field){
//             if(!field.hidden)
//                 self.fieldMap[field.field] = field.caption;
//         });
//     }
//     this.json = options.json || [];
//         //console.log(xl.formatStrings);//print all standard format strings
//         var x=0,firstrow = true;
//         $.each(this.json,function(i,row){
//             try{
//                 //var row = this.json[i];
//                 var colindex= 0;
//                 if(firstrow){
//                     //build header  
//                     $.each(row,function(key,value){
//                     	// var header = self.fieldMap[key]
//                         // if(header){
//                         	sht.cell(0, colindex, key);
//                         	sht.cell(1, colindex,value || 'NODATA');
//                         	colindex ++;
//                         // }
//                     });
//                     firstrow=false;
//                 }else{
//                     // $.each(row,function(key,value){
//                     // 	// var header = self.fieldMap[key]
//                     //     // if(header){
//                     //     	sht.cell(x, colindex, value || 'NODATA');
//                     //     	colindex ++;
//                     //     // }
//                     // });
//                 }
//             x++;
//             }catch(e){
//                console.log(e.name, e.message);
//             }
//         });
//         xlg.end(function(err){
//            if(err){ 
//            	console.log(err.name, err.message);
//            	w2alert('Eroare la generarea fisierului!');
//            }
//            else{ 
//            	w2alert('Fisierul a fost generat cu succes!');
//            	console.log('complete');
//            }
//            w2utils.unlock('body');
//         });
// 	};
module.exports=Excel;