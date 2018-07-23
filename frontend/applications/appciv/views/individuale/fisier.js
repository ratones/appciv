var ipc = requireNode('ipc');
var FisierItemView = window.Marionette.ItemView.extend({
    template:require('./../../templates/individuale/fisier.hts'),
    bindings:{
        '[name="nume_fisier"]':'nume_fisier',
        '[name="slot"]':'slot',
        '[name="preview"]':'preview'
    },
    onRender:function(){
        this.stickit();
        this.$el.find('[name="slot"]').on('click',this.executeFileAction.bind(this));
        if(this.model.get('preview') && this.options.editable){
             this.$el.find('[name="delBtn"]').show();
        }else{
            if(this.options.editable){
                this.$el.on('drop',this.executeFileDrop.bind(this));
                window.ondragover = function(e) { e.preventDefault(); return false };
                // NOTE: ondrop events WILL NOT WORK if you do not "preventDefault" in the ondragover event!!
                window.ondrop = function(e) { e.preventDefault(); return false };
            }
        }
        this.$el.find('[name="delBtn"]').on('click',this.executeDeleteFile.bind(this));
        
    },
    executeFileAction:function(){
        var self = this;
        if(!this.model.get('preview')){
            if(this.options.editable){
            var chooser = this.$el.find('[name="fileDialog"]')
            chooser.unbind('change');
            chooser.change(self.doUpload.bind(self,this));

            chooser.trigger('click');
            }
        }else{
            ipc.send('app:request:pdf', [app.baseUrl + '/individuale/getfullfile/'+self.model.get('id'), function (win) {
                // win.on('closed', function () {
                //     w2confirm({
                //         msg: 'Finalizati tiparirea CIV?',
                //         opt: false,
                //         opt_text: 'Verificat!',
                //         no_class: 'btn-red',
                //         yes_class: 'btn-blue',
                //         opt_class: 'btn-orange'
                //     }).yes(function () {
                //         $.post(app.baseUrl + 'individuale/finalizeCIV/' + id+'?tipciv='+tipciv, {}, function (stare) {
                //             self.model.set('stare',stare);
                //         });
                //         win.close(true);
                //     }).no(function () {
                //         win.close(true);
                //     }).opt(function () {
                //         $.post(app.baseUrl + 'individuale/verificatCIV/' + id, {}, function () {
                //             // w2ui.gridCereri.set(id[0], {
                //             //     depusa: 18
                //             // });
                //         });
                //         win.close(true);
                //     });
                // });
            }]);
            // $.ajax({
            //     url:app.baseUrl + '/individuale/getfullfile/'+self.model.get('id'),
            //     success:function(data){
            //         var template;
            //         if(self.model.get('tip_fisier')=== 'application/pdf'){
            //             template = '<div class="centered"><iframe style="display: block;margin-left: auto;margin-right: auto; width:100%; height:100% ;text-align:center" src="data:'+self.model.get('tip_fisier') +';base64,'+data+'"></iframe></div>';
            //         }else{
            //             template = '<div class="centered"><img style="display: block;margin-left: auto;margin-right: auto;" src="data:'+self.model.get('tip_fisier') +';base64,'+data+'"></img></div>'
            //         }
            //         w2popup.open({
            //             title: self.model.get('nume_fisier'),
            //             body: template ,
            //             showMax: true,
            //             width:800,
            //             height:600
            //         });
            //     }
            // });
        }
        // if(!this.model.get('preview')){
        //     
        // }
    },
    doUpload:function(view,event){
        var el = $(event.target);
        var filePath =  el.val();
        if(filePath){
            var file = el[0].files[0];
            var formData = new FormData();

            // add assoc key values, this will be posts values
            formData.append("file", file, file.name);
            formData.append("id_vehicul", this.model.get('id_vehicul'));
            formData.append('slot',this.model.get('slot'));
            formData.append('tip_fisier', file.type);
            console.log(file);

            $.ajax({
                type: "POST",
                url: app.baseUrl + "/individuale/uploadFile/" + view.model.id,
                // xhr: function () {
                //     var myXhr = $.ajaxSettings.xhr();
                //     if (myXhr.upload) {
                //         myXhr.upload.addEventListener('progress', view.progressHandling, false);
                //     }
                //     return myXhr;
                // },
                success: function (data) {
                    view.$el.find('[name="slot"]').attr('src','data:'+file.type+';base64,'+data.preview);
                    view.model.set(data);
                    view.$el.find('[name="delBtn"]').show();
                },
                error: function (error) {
                    // handle error
                },
                async: true,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            });            
        }
    },
    serializeData: function() {
         var slot;
         switch(this.model.get('slot')){
             case 'placuta':
                slot = 'Placuta constructor'
             break;
             case 'vin':
                slot = 'VIN'
             break;
             case 'semiprofil':
                slot = 'Vedere ansamblu'
             break;
             case 'coc':
                slot = 'COC'
             break;
             default:
                slot = 'Imagine suplimentara'
             break;
         }
         return {
             index: this.options.index,
             slotName:slot,
             preview:this.model.get('preview')? 'data:'+this.model.get('tip_fisier')+';base64,'+this.model.get('preview'):''
         };
     },

     executeDeleteFile:function(){
         var self = this;
         if(self.model.get('slot') == 'suplimentar'){
            self.model.destroy();               
        }else{
            $.ajax({
                type:'POST',
                url:app.baseUrl + 'individuale/deleteFile/' + self.model.id,
                success:function(){
                    self.model.unset('preview');
                    self.$el.find('[name="slot"]').attr('src','');
                    self.$el.find('[name="delBtn"]').hide();
                }
            });
        }
     },

     _arrayBufferToBase64:function( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    },

    executeFileDrop:function(e){
        var view = this;
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        if(file.type !== 'application/pdf' && file.type !=='image/jpeg' && file.type !== 'image/png')
         return;
        if(file.path){
            var formData = new FormData();

            // add assoc key values, this will be posts values
            formData.append("file", file, file.name);
            formData.append("id_vehicul", view.model.get('id_vehicul'));
            formData.append('slot',view.model.get('slot'));
            formData.append('tip_fisier', file.type);
            console.log(file);

            $.ajax({
                type: "POST",
                url: app.baseUrl + "/individuale/uploadFile/" + view.model.id,
                // xhr: function () {
                //     var myXhr = $.ajaxSettings.xhr();
                //     if (myXhr.upload) {
                //         myXhr.upload.addEventListener('progress', view.progressHandling, false);
                //     }
                //     return myXhr;
                // },
                success: function (data) {
                    view.$el.find('[name="slot"]').attr('src','data:'+file.type+';base64,'+data.preview);
                    view.model.set(data);
                    view.$el.find('[name="delBtn"]').show();
                },
                error: function (error) {
                    // handle error
                },
                async: true,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            });            
        }
        console.log(file);
        // reader.readAsDataURL(file);

        return false;
    }

});
module.exports = FisierItemView;