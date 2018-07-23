module.exports = Marionette.ItemView.extend({
    template: require('./../../templates/individuale/anvelopaEditor.hbs'),
    attributes: function() {
        return {
            id: 'anvelopa' + this.cid
        };
    },
    roatafata:undefined,
    roataspate:undefined,
    initialize:function(){
        
    },
    className: 'windowContent w2ui-reset w2ui-form',
    ui: {
        'save': '.save-anvelopa',
        'cancel': '.cancel-anvelopa'
    },
    events: {
        'click @ui.save': 'save',
        'click @ui.cancel': 'closeView',
        'change #idemspate':'setIdemSpate'
    },
    onShow: function() {
        var self = this;
        this.win = self.$el.w2panel({
            name: 'anvelopaEditor' + self.cid,
            title: 'Editor',
            width: '400px',
            showMin: true,
            showMax: false,
            height: '300px',
            startZ: 1200,
            resizable: false,
            onOpen: function(event) {
                self.setupView();
                event.onComplete = function() {
                    w2panel.setActive('anvelopaEditor' + self.cid);
                };

            },
            onClose: function(event) {
                self.destroy();
            }
        });
    },
    save: function() {
        var self = this;
        app.trigger('app:mentiuni:addanvelope',{model:self.model,roatafata:self.roatafata,roataspate:self.roataspate});
        self.closeView();
        //}
    },
    setupView:function(){
        console.log('here');
        var self = this;
        this.$el.find('#id_roataf').w2field('list',{
            url: app.baseUrl + '/individuale/getAnvelope',
            minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.roatafata = e.item.text;
            }
        });
         this.$el.find('#id_roatas').w2field('list',{
            url: app.baseUrl + '/individuale/getAnvelope',
             minLength:0,
            renderDrop: function(e) {
                    return '<td>' + e.text + '</td><td>' +  e.janta + '</td>';
                },
            onChange:function(e){
                self.roataspate = e.item.text;
            }
        });
         this.$el.find('#id_roataf').parent().find('.w2ui-field-helper').width('300px');
         this.$el.find('#id_roatas').parent().find('.w2ui-field-helper').width('300px');
         $(this.$el).find('.w2ui-field').each(function(i,el){
            var label = $(el).find('label');
            label.text(w2utils.lang(label.text()));
        });
        this.$el.find('.button-translate button').each(function(i,b){
            b.textContent = w2utils.lang(b.textContent)
        });
    },
    setIdemSpate:function(){
        if($('#idemspate').is(':checked')){
            this.roataspate = this.roatafata;
            this.$el.find('#id_roatas').data('selected',this.$el.find('#id_roataf').data('selected')).trigger('change');
        }
    },
    closeView: function(e) {
        this.win.destroy();
        this.destroy();
    }
});
