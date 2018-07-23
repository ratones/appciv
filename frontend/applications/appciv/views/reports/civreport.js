var fs = requireNode('fs');
var config = require('./config');
var gui = requireNode('nw.gui');
var PDFDocument = requireNode('pdfkit');
var blobStream  = requireNode('blob-stream');

var CIV = function(vehicule){
	this.vehicule=vehicule;
	this.config = JSON.parse(fs.readFileSync( 'configReports.json'));
}

CIV.prototype.buildDoc = function(){
	var self = this;
	var mywindow = window.open('', 'Raport CIV', 'fullscreen,height=800,width=600');
    mywindow.document.write('<html><head><title>Raport CIV</title><style type="text/css" media="print">div.print {position:relative; page-break-after: always; } #btnprint{display:none}</style>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body>');
	this.vehicule.map(function(vehicul,i){
    	mywindow.document.write('<button id="btnprint" style="position:fixed;bottom:10px;right:100px;" onclick="window.print();window.close()">Print</button>'+
    								'<div id="civ'+vehicul.nr_identif+'" class="'+(i < self.vehicule.length -1 ? 'print' : '')+'" style="position:relative; width:297mm;height:200mm;margin:0;">');
		self.config.civ.elements.map(function(element){
			var txtValue='';
			if(typeof element.field === 'object'){
				var separator = element.separator?element.separator:'';
				element.field.map(function(field){
					txtValue += vehicul[field]+separator;
				});
				var pos = txtValue.lastIndexOf(separator);
				txtValue = txtValue.substring(0,pos);
			}else{
				txtValue = element.field?String(vehicul[element.field]):'NEDEFINIT';
			}
			var txt = element.text ?  txtValue + element.text : txtValue;	
    		var el = $('<div></div>').css(element.style).text(txt);//.appendTo('#civ'+vehicul.nr_identif);
    		mywindow.document.write(el.prop('outerHTML'));
		});
    	mywindow.document.write('</div>');
	});
	mywindow.document.write('</body></html>');

    //mywindow.document.close(); // necessary for IE >= 10
    //mywindow.focus(); // necessary for IE >= 10

    //mywindow.print();
    //mywindow.close();

}

CIV.prototype.buildDocPDF = function(){
	var self = this;
	//var doc = jsPDF('l','pt','a4');
	var doc = new PDFDocument({layout:'landscape',size:'A4'});
	// doc.addFont('TwCenMT-Condensed', 'Tw Cen MT Condensed', 'normal');
	doc.registerFont('Tw Cen MT Condensed', 'Fonts/TCCM____.ttf');
	// doc.setFont("Tw Cen MT Condensed");
 //    doc.setFontType("normal");
 //    doc.setFontSize(10);
 	var stream = doc.pipe(blobStream());

    this.vehicule.map(function(vehicul,i){
		self.config.civ.elements.map(function(element){
			var txtValue='';
			if(typeof element.field === 'object'){
				var separator = element.separator?element.separator:' ';
				element.field.map(function(field){
					txtValue += String(vehicul[field])+separator;
				});
				var pos = txtValue.lastIndexOf(separator);
				txtValue = txtValue.substring(0,pos);
			}else{
				txtValue = vehicul[element.field]?String(vehicul[element.field]):'';
			}
			var txt = element.text ? txtValue + element.text : txtValue;
			// doc.setFont(element.style['font-family']);
   //  		doc.setFontType(element.style['font-weight']);
   //  		doc.setFontSize(element.style['font-size'].replace('pt',''));
			// doc.text(
			// 	Math.floor(element.style.left),
			// 	Math.floor(element.style.top),
			// 	txt);
			doc.fontSize(element.style['font-size'].replace('pt',''));
			doc.font(element.style['font-family'])
				.text(txt,Math.floor(element.style.left),Math.floor(element.style.top));
		});
		if(i < self.vehicule.length-1)
			doc.addPage();
    });
	
	//var civdesign = require('./civdesign');
	//var view = new civdesign().render().el;
    // doc.text(20, 20, 'This is the default font.');

    // doc.setFont("courier");
    // doc.setFontType("normal");
    // doc.text(20, 30, 'This is courier normal.');

    // doc.setFont("times");
    // doc.setFontType("italic");
    // doc.text(20, 40, 'This is times italic.');

    // doc.setFont("helvetica");
    // doc.setFontType("bold");
    // doc.text(20, 50, 'This is helvetica bold.');

    // doc.setFont("courier");
    // doc.setFontType('italic');
    // doc.text(20, 70, 'This is courier italic.');
    //doc.fromHTML(view,100,0,{});
 //console.log(doc.output('datauristring'));
 doc.end();
 stream.on('finish', function(){
	  var url = stream.toBlobURL('application/pdf');
	  // var pdfWindow = gui.Window.open('pdfviewer/index.html', {
   //              width: 800,
   //              height: 600,
   //              },function(win){
   //                  win.data={file:url};
   //              });
   //          });
   // return doc;
   		window.open(url);
	});
};

module.exports = CIV;