var Util = require('./util');
var ConnProxy = function(){
}
ConnProxy.prototype.requestCredentials = function() {
        var deferred = $.Deferred();

        console.log('proxy req');
        var content =
            '<div>'+
        '<p style="text-align:center">Serverul proxy necesita autentificare!</p>'+
        '<div class="w2ui-field">'+
          '<label>Username:</label>'+
          '<div>'+
            '<input type="text" id="uname" value="" />'+
          '</div>'+
        '</div>'+
        '<div class="w2ui-field">'+
         '<label>Password:</label>'+
          '<div>'+
            '<input type="password" id="pwd" />'+
          '</div>'+
        '</div>'+
    '</div>';
        $(content).w2popup({
            modal: true,
            width: '400px',
            height: '300px',
            buttons: '<button class="w2ui-btn" onclick="w2popup.close();">Ok</button> ',
            onClose: function() {
                var data = {
                    proxy_user: $('#uname').val(),
                    proxy_pass: $('#pwd').val()
                };
                deferred.resolve(data);
                var currproxy = localStorage.getItem('proxy');
                if(currproxy){
                    try{
                        var newproxy = JSON.parse(Util.decrypt(currproxy,true));
                        newproxy.proxy_user = data.proxy_user;
                        newproxy.proxy_pass = data.proxy_pass;
                        newproxy.enabled = true;
                        localStorage.setItem('proxy', Util.encrypt(JSON.stringify(newproxy)));
                    }catch(err){
                        localStorage.setItem('proxy', Util.encrypt(JSON.stringify(data)));
                    }
                }else{
                    localStorage.setItem('proxy', Util.encrypt(JSON.stringify(data)));
                }
                
            }
        });
        return deferred.promise();
    };


module.exports = new ConnProxy();
