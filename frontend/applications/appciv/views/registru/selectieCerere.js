module.exports = Marionette.LayoutView.extend({
  initialize:function() {},
  template:require('./../../templates/registru/selectieCerere.hbs'),
  onShow: function() {
    this.open();
  },
  open: function() {
    var self = this;
    this.win = self.$el.w2panel({
      name: 'selectieCererePanel',
      title: w2utils.lang('Cerere Nr. Omologare'),
      width: '600px',
      showMin: false,
      showMax: false,
      height: '400px',
      resizable: false,
      //toolbarButtons:[{id:'unlock',className:'w2ui-icon-lock',click:self.unlockButtons.bind(self)}],
      onOpen: function (event) {
        event.onComplete = function () {
          self.buildView();
          self.attachEvents();
        };
      },
      onClose: function (event) {
        // w2ui.searchViewLayout.destroy();
        self.destroy();
      },
      buttons:self.getButtonsHtml()
    });
  },
  getButtonsHtml: function () {
    return '<div id="formButtons">' +
      '<button class="btn btn-green" id="btnSave"><i class="w2ui-icon-save"></i> Salveaza</button>' +
      '<button class="btn btn-red" id="btnClose"><i class="w2ui-icon-cross"></i> Inchide</button>' +
      '</div>';
  },
  buildView: function() {
    var box = this.$el.find('#selectForm');   
    box.find('#tip_cerere').w2field('list',{
      items:[
        { id: 'W', text: 'INREGISTRARE DE TIP' },
        { id: 'Y', text: 'INREGISTRARE DE TIP (TIP NOU)' },
        { id: '1', text: 'ATESTAT TEHNIC (TIP NOU)'},
        { id: '4', text: ' '},
        { id: '5', text: ' '},
        { id: '6', text: 'CONSTATARE TEHNICA'},
        { id: '7', text: 'VERIFICARE TEHNICA'},
        { id: 'B', text: 'OMOLOGARE ARTIZANALA'},
        { id: 'C', text: 'OMOLOGARE CU COC'},
        { id: 'D', text: 'OMOLOGARE SCHIMBARE CAROSERIE'},
        { id: 'E', text: 'OMOLOGARE CU COC (TIP NOU)'},
        { id: 'G', text: 'OMOLOGARE FARA COC (TIP NOU)'},
        { id: 'H', text: 'OMOLOGARE SCHIMBARE CAROSERIE (TIP NOU)'},
        { id: 'J', text: 'OMOLOGARE FARA COC'},
        { id: 'K', text: 'OMOLOGARE ARTIZANALA (TIP NOU)'},
        { id: 'N', text: 'OMOLOGARE SCHIMBARE MOTOR'},
        { id: 'P', text: 'OMOLOGARE MULTIETAPA (TIP NOU)'},
        { id: 'R', text: 'OMOLOGARE MULTIETAPA'},
        { id: 'U', text: 'OMOLOGARE TIP'},
        { id: 'V', text: 'OMOLOGARE TIP (TIP NOU)'},
        { id: 'X', text: 'ATESTAT TEHNIC'},
        { id: 'Z', text: 'OMOLOGARE SCHIMBARE MOTOR (TIP NOU)'}
      ]
    })
  },
  attachEvents: function() {
    var self = this;
    var box = $('#selectieCererePanelw2ui-window');
    box.find('#btnClose').on('click', self.close.bind(self));
    box.find('#btnSave').on('click', self.save.bind(self));
  },
  close:function() {
    this.win.close()
  },
  save: function() {
    app.appciv.controller.editCerereOmologare()
  }
})