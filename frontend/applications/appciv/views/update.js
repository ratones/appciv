var ipc = requireNode('ipc');
   module.exports = Marionette.ItemView.extend({
   	template:require('./../templates/update.html'),
   	events:{

   	},
   	initialize:function(){

   	},
   	onShow:function(){
          var options = {
                uploadUrl: app.baseUrl + 'appdot/civutils/updateapp',
                uploadAsync: false,
                maxFileCount: 10,
                maxFileSize: 10000
            };
            app.Settings.fileinputDefaults.allowedFileExtensions= [
                  "json",
                  "zip",
                  "png",
                  "msi"
               ];
            $.extend(options, app.Settings.fileinputDefaults);
            this.$el.find('#fileupload').fileinput(options);
            this.$el.find('#fileupload').on('filebatchuploadsuccess', function(event, data) {
               
            }).on('fileuploaded', function(event, data) {
                
            });
   	}
   });