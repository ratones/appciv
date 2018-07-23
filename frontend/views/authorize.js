 var ipc = requireNode('ipc');
   module.exports = Marionette.ItemView.extend({
   	attributes:function(){
   		return {style:'text-align:center;width:600px;margin:0 auto'};
   	},
   	template:require('./../templates/authorize.html'),
   	events:{
   		'click #btnAuthorize':'generateUUID'
   	},
   	initialize:function(){
   		_.bindAll(this,'generateUUID');
   	},
   	onShow:function(){
   		$('#userlist').w2field('list',{
   			url:app.baseUrl + 'appdot/users/getuserlist',
   			minLength:0
   		})
   	},
   	generateUUID:function(){
   		var guid,self=this ;
   		guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
		   return  v.toString(16);
		    
		});
   		console.log(guid);
		   		self.authorizeUser(guid);
   	},
   	authorizeUser:function(guid){
   		var userid;
   		var selected = $('#userlist').data('selected');
   		if(!selected.id){
   			w2alert('Va rugam selectati un utilizator!');
   			return;
   		}
   		$.ajax({
   			url:app.baseUrl+'common/users/authorizeUser/'+selected.id,
   			dataType:'json',
   			contentType:'application/json',
   			type:'POST',
   			data:JSON.stringify({guid:guid}),
   			success:function(){
   				localStorage.setItem('permSession',guid);
   				w2alert('Utilizatorul a fost autorizat!');
   			},
   			error:function(){
   				w2alert('Operatia a esuat! Va rugam incercati din nou!');
   			}
   		});
   	}
   });