var fs = requireNode('fs');
var r = requireNode('request');
var ipc = requireNode('ipc');
var path = requireNode('path');

var View = {
	setproxy:function(address,callback){
		var self = this;
		console.log(address);
		this.address='';
		this.port = '';
		var expr = /(.+):\s?([0-9]+)/;
		var match  = expr.exec(address);
		if(match){
			this.address = match[1];
			this.port = match[2];
		}else{
			w2alert('Va rugam verificati setarile proxy ale aplicatiei!');
			callback();
		}
		var pfx = fs.readFileSync(path.resolve('./key.pfx'));
		var passphrase = 'rarom';
		var strProxy = localStorage.getItem('proxy');
		var proxy;
		var proxySettings
		if(strProxy){
		    proxySettings=JSON.parse(strProxy);
		    if(proxySettings.enabled){
		        proxy=proxySettings.proxy_protocol+'://'+(proxySettings.proxy_user?proxySettings.proxy_user:'')+(proxySettings.proxy_pass?':'+proxySettings.proxy_pass+'@':'')+proxySettings.proxy_address+ (proxySettings.proxy_port?':'+proxySettings.proxy_port:'');
		    }
		}else{
			//request password here
			proxy = "http://" + this.address + ':' + this.port;
		}
		var options = {
		    rejectUnauthorized: false,
		    // agentOptions: {
		    pfx: pfx,
		    passphrase: passphrase,
		    //cert: cert,
		    //key: key

		     proxy: proxy,
		     timeout :5000
		    // }
		};

		//var request = r.defaults(options);
		this.tryAccess(options,function(result){
			if(result){
				callback();
			}else{
				// var opt = {
				// 	address:address,
					var user = proxySettings?proxySettings.proxy_user:'';
				// };
				self.requestProxyCredentials(self.address,user,function(credentials){
						var proxynew = {
			               enabled: true,
			               proxy_protocol: 'http',
			               proxy_user: credentials.user,
			               proxy_pass: credentials.pass,
			               proxy_address: self.address,
			               proxy_port: self.port
			           };
           				localStorage.setItem('proxy', JSON.stringify(proxynew));
           				ipc.send('app:proxy:reset');
       					options.proxy = "http://"+(credentials.user?credentials.user:'')+(credentials.pass?':'+credentials.pass+'@':'')+self.address + ':' + self.port;
						self.tryAccess(options,function(r){
							if(r){
								callback();
							}else{
								w2alert('Va rugam verificati setarile proxy ale aplicatiei!');
								callback();
							}
						});
           				
						
				});
			}
		});
	},

	tryAccess:function(options,cb){
		var request = r.defaults(options);
		request
  			.get('http://google.ro')
  			.on('response', function(response) {
  				if(response.statusCode === 407){
  					cb(false);
  				}else{
  					cb(true);
  				}
  			})
  			.on('error', function(err) {
    			console.log(err);
    			//if(err.code ==="ETIMEDOUT"){
    				cb(false);
    			//}
  			});
	},

	requestProxyCredentials:function(address,user,cb){
		$('<div class="windowContent w2ui-reset w2ui-form"><div class="w2ui-page page-0 modalContent">'+
			'<div>Serverul proxy '+ address+ ' necesita autentificare!</div>'+
			'<div class="w2ui-field"><label>Username:</label><div><input type="text" id="uname" value="'+user+'" /></div></div>'+
			'<div class="w2ui-field"><label>Password:</label><div><input type="password" id="pwd" /></div></div>'+
			'<div class="w2ui-buttons"><button class="btn btn-blue" id="close" onclick="w2panel.destroy()">Ok</button></div>'+
			'</div></div>').w2panel({
            name: 'proxy',
            title: 'Setari proxy',
            width: '430px',
            height: '250px',
            resizable: false,
            onOpen: function(event) {
                $('#uname').val(user);
            },
            onClose: function(event) {
                var data = {
					user:$('#uname').val(),
					pass:$('#pwd').val()
				};
				cb(data);
            }
        });
		

	}
};

module.exports = View;