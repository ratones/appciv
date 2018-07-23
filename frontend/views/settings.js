var ipc = requireNode('ipc');
   var SettingsView = Marionette.ItemView.extend({
       hasproxy: false,
       template: require('./../templates/settings.html'),
       className: 'page',
       events: {
           'click #btnSaveSettings': 'save',
           'change #setupproxy': 'enableproxysetup',
           'click #btnReset': 'resetapp'
       },
       bindings: {
       	   '#setupproxy': 'setupproxy',
           '#proxy_protocol': 'proxy_protocol',
           '#proxy_user': 'proxy_user',
           '#proxy_pass': 'proxy_pass',
           '#proxy_address': 'proxy_address',
           '#proxy_port': 'proxy_port'
       },
       initialize: function() {
       	   this.model = new Backbone.Model();
           var self = this;
           _.bindAll(this, 'save', 'enableproxysetup', 'resetapp');
       },
       onShow:function(){
       		// this.$el.w2form({
       		// 	name:'settingsForm'
       		// });
       		this.setinitialproxy();
           	this.stickit();
       },
       save:function(){
       		this.setproxy();
       },
       resetapp: function() {
           localStorage.removeItem('proxy');
           this.setinitialproxy();
       },
        enableproxysetup: function(e) {
           var self = this;
           if ($(e.currentTarget).prop('checked')) {
               self.hasproxy = true;
               $('.proxydata').prop('disabled', null);
           } else {
               self.hasproxy = false;
               $('.proxydata').prop('disabled', 'disabled');
           }
       },

       setinitialproxy: function() {
           var setupproxy = localStorage.getItem('proxy') || null;
           if (setupproxy) {
               var newproxy = JSON.parse(ipc.sendSync('app:request:decrypt',setupproxy));
               if(newproxy.enabled){
                this.model.set('setupproxy', newproxy.enabled);
                this.model.set(newproxy);
                $('.proxydata').prop('disabled', null);
               }
           }else if(!setupproxy){
           		 this.model.set('setupproxy', false);
           		 this.model.unset('proxy_protocol');
           		 this.model.unset('proxy_user');
           		 this.model.unset('proxy_pass');
           		 this.model.unset('proxy_address');
           		 this.model.unset('proxy_port');
           		 $('.proxydata').prop('disabled',true);
           }
       },

       setproxy: function() {
           var proxy = {
               enabled: $('#setupproxy').prop('checked'),
               proxy_protocol: $('#proxy_protocol').val(),
               proxy_user: $('#proxy_user').val(),
               proxy_pass: $('#proxy_pass').val(),
               proxy_address: $('#proxy_address').val(),
               proxy_port: $('#proxy_port').val()
           };
           localStorage.setItem('proxy', ipc.sendSync('app:request:encrypt',JSON.stringify(proxy)));
           ipc.sendSync('app:proxy:reset');
       },
   });

   module.exports = SettingsView;