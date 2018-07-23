var globals = {
    clipboard:null,
    getClipboard:function(){
        return this.clipboard;
    },
    setClipboard:function(value){
        this.clipboard = value;
    },
    clearClipboard:function(){
        this.clipboard = undefined;
    }
};
module.exports = globals;
