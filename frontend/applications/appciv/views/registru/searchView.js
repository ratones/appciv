module.exports = Marionette.LayoutView.extend({
  template: require('./../../templates/registru/searchView.hbs'),
  initialize: function(options) {

  },
  onShow: function() {
    this.$el.css({
      'opacity': 1,
      'height':'100%'
    });
    this.open();
    // this.setButtons();
  },

  open: function() {
    var self = this;
    this.win = self.$el.w2panel({
      name: 'searchFormWindow',
      title: w2utils.lang('Cautare Nr. Omologare'),
      width: '1200px',
      showMin: true,
      showMax: true,
      height: '800px',
      resizable: true,
      //toolbarButtons:[{id:'unlock',className:'w2ui-icon-lock',click:self.unlockButtons.bind(self)}],
      onOpen: function (event) {
        event.onComplete = function () {
          self.buildLayout();
          self.attachEvents();
        };
      },
      onClose: function (event) {
        w2ui.searchViewLayout.destroy();
        self.destroy();
      },
    });
  },

  buildLayout: function() {
    var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
        this.$el.w2layout({
            name:'searchViewLayout',
            panels:[
                { type: 'main', style: pstyle, content: '<div id="searchResults" class="page"></div>', title:'Rezultate cautare' },
                { type: 'preview', size: '30%', resizable: false, hidden: false, style: pstyle, content: '<div id="searchForm" class="page"></div>', title:'Criterii cautare' },
            ]
        })
        this.addRegions({
            results: '#searchResults',
            form: '#searchForm'
        });
        var SearchResults = require('./searchResults')
        var SearchForm = require('./searchForm')
        var sres = new SearchResults(); 
        var searchForm = new SearchForm({tip_omologare:'coc'});
        this.results.show(sres);
        this.form.show(searchForm);
  },

  attachEvents:function() {
    this.listenTo(app, 'search:close', this.win.close);
  },

})