var MentiuneItemView = window.Marionette.ItemView.extend({
    template:require('./../../templates/individuale/mentiune.hts'),
    events:{
        'click [name="delMentiune"]':'delMentiune',
        'click [name="anvMentiune"]':'anvMentiune'
    },
    bindings:{
        '[name="text"]':'text'
    },
    onRender:function(){
        this.model.set('nr_rand',this.options.index);
        this.stickit();
    },
    delMentiune:function(){
        this.model.set('EntityState',2);
        app.trigger('vehicul:remove:mentiune',this.model);
    },
    anvMentiune:function(){
        app.trigger('vehicul:add:anvelopa',this.model);
    }
});
module.exports = MentiuneItemView;