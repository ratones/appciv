var ModelDef = require('./../../models/registru/tvvsextensie')
var Globals = require('./../../globals')

module.exports = Marionette.LayoutView.extend({
  initialize: function (options) {
    this.filter = options.filter;
    this.page = 0;
    this.totalRecords = 100;
    this.formID = "searchFormResults";
    this.arraydata = []
    // this.buildSubViews()
  },
  template: require('./../../templates/registru/searchResults.hbs'),
  onShow: function () {
    // this.$el.css({
    //   'opacity': 0
    // });
    // this.open();
    // // this.setButtons();
    this.listenTo(app,'search:performSearch', this.searchRequested.bind(this))
    this.listenTo(app,'search:next', this.nextRecord.bind(this))
    this.listenTo(app,'search:prev', this.previousRecord.bind(this))
    this.listenTo(app,'search:copydata', this.copyData.bind(this))
    // self.setButtons();
    // self.attachActions();
  },
  open: function () {
    var self = this;
    this.win = self.$el.w2panel({
      name: 'searchResultsForm',
      title: w2utils.lang('Date TVV'),
      width: '1000px',
      showMin: true,
      showMax: true,
      height: '650px',
      resizable: true,
      //toolbarButtons:[{id:'unlock',className:'w2ui-icon-lock',click:self.unlockButtons.bind(self)}],
      onOpen: function (event) {
        event.onComplete = function () {
          // self.buildView();
          // self.setButtons();
          self.attachActions();
          //self.requestData();
          // self.win.buttons = $('#formButtons').html();
        };
      },
      onClose: function (event) {
        w2ui[self.formID].destroy()
        self.destroy();
      },
      buttons: self.getButtonsHtml()
    });
  },
  getButtonsHtml: function () {
    return '<div id="formButtons">' +
      '<span id="navInfo">Rezultat <span id="pageNr"></span> din <span id="totRec"></span></span>'+
      '<span id="navButtons">' +
      '<button class="btn btn-default" id="btnPrev">Anterior</button>' +
      '<button class="btn btn-default" id="btnNext">Urmator</button>' +
      '</span>' +
      '<button class="btn btn-green" id="btnFisa"><i class="w2ui-icon-print"></i> Fisa</button>' +
      '<button class="btn btn-red" id="btnClose"><i class="w2ui-icon-cross"></i> Inchide</button>' +
      '<button class="btn btn-orange" id="btnCopy"><i class="w2ui-icon-copy"></i> Copy</button>' +
      '</div>';
  },
  attachActions: function () {
    var self = this;
    var box = $('#searchResultsFormw2ui-window');
    box.find('#btnPrev').on('click', self.previousRecord.bind(self));
    box.find('#btnClose').on('click', self.close.bind(self));
    box.find('#btnNext').on('click', self.nextRecord.bind(self));
    box.find('#btnFisa').on('click', self.fisa.bind(self));
    box.find('#btnCopy').on('click', self.copy.bind(self));
  },
  events: {},
  previousRecord: function () {
    if (this.page > 0) {
      this.page -= 1
      this.model = new ModelDef(this.arraydata[this.page]);
      if(!this.viewRendered)
          this.buildSubViews()
        else
          this.refreshSubViews()
      app.trigger('search:request',{page:this.page,total:this.totalRecords})
    }
  },

  nextRecord: function () {
    if (this.page < this.totalRecords - 1) {
      this.page += 1
      if(this.arraydata.length >= this.page){
      //this.requestData();
      this.model = new ModelDef(this.arraydata[this.page]);
      if(!this.viewRendered)
          this.buildSubViews()
        else
          this.refreshSubViews()
      app.trigger('search:request',{page:this.page,total:this.totalRecords})
      }else{
        this.requestData()
      }
    }
  },

  close: function () {
    this.win.close();
  }, 

  copy: function () {
    console.log(this.filter, this.page)
  },

  fisa: function () { },
  searchRequested:function(filter){
    this.page = 0;
    this.arraydata = [];
    this.totalRecords = 0;
    this.filter = filter
    this.requestData();
  },
  requestData: function () {
    w2utils.lock('#searchResultForm', 'Searching...', true);
    var self = this;
    var data = {
      page: this.page,
      filter: this.filter
    }
    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      url: app.baseUrl + 'doiit/getSearchData',
      data: JSON.stringify(data),
      success: function (response) {
        self.arraydata = self.arraydata.concat(response.tvvext);
        self.model = new ModelDef(response.tvvext[0]);
        self.totalRecords = response.total
        self.showInfo();
        app.trigger('search:request',{page:self.page,total:self.totalRecords})
        if(!self.viewRendered)
          self.buildSubViews()
        else
          self.refreshSubViews()
        w2utils.unlock('#searchResultForm');
      },
      error: function (response) {
        w2alert(response.ExceptionMessage)
        w2utils.unlock('#searchResultForm');
      }
    })
  },
  showInfo: function(){
    var self = this
    $('#pageNr').html(self.page+1)
    $('#totRec').html(self.totalRecords)
  },
  buildSubViews: function () {
    var GView = require('./general');
    this.GeneralView = new GView({
      model: this.model.get('TVV'),
      extensie: this.model.get('id_extensie')
    });
    var MView = require('./dateTehnice');
        this.MaseView = new MView({
            type: 'mase',
            collection: this.model.get('SetDateTVV').get('DateTehnice'), //.byGroup('mase')
            copil:true
        });
        var PView = require('./dateTehnice');
        this.PoluareView = new PView({
            type: 'poluare',
            iswltp: this.model.get('SetDateTVV').get('iswltp'),
            collection: this.model.get('SetDateTVV').get('DateTehnice'), //.byGroup('poluare')
            copil:true
        });
        this.listenTo(app, 'wltp:changed', function (val) {
            if (val) this.model.get('SetDateTVV').set('iswltp', 1);
            else this.model.get('SetDateTVV').set('iswltp', 0);
        });
        var DView = require('./dateTehnice');
        this.DimensiuniView = new DView({
            type: 'dimensiuni',
            collection: this.model.get('SetDateTVV').get('DateTehnice'), //.byGroup('dimensiuni')
            copil:true
            //collection : _.filter(this.model.get('SetDateTVV').get('DateTehnice').models,function(m){return m.get('grupa') === 'dimensiuni'})
        });
        var AxView = require('./dateTehnice');
        this.AxeView = new AxView({
            type: 'axe',
            collection: this.model.get('SetDateTVV').get('DateTehnice'), //.byGroup('axe')
            copil:true
        });
        var AlView = require('./dateTehnice');
        this.AlteView = new AlView({
            type: 'altele',
            collection: this.model.get('SetDateTVV').get('DateTehnice'), //.byGroup('altele')
            copil:true
        });

        var AnView = require('./anvelope');
        this.AnvelopeView = new AnView({
            collection: this.model.get('SetDateTVV').get('Anvelope'),
            gridName:"searchAnvelopeGrid",
        });
        var TView = require('./dateTehnice');
        this.TransmisieView = new TView({
            type: 'cv',
            collection: this.model.get('SetDateTVV').get('DateTehnice'), //.byGroup('cv')
            copil:true
        });
        var MView = require('./motoare');
        this.MotoareView = new MView({
            collection: this.model.get('SetDateTVV').get('Motoare'),
            gridName:"searchMotoareGrid",
            sourceGridName:"searchMotoareSourceGrid"
        });
        // var SView = require('./sisteme');
        // this.SistemeView = new SView({
        //     collection: this.model.get('SetDateTVV').get('Sisteme'),
        //     categorie: this.model.get('TVV').get('categorie'),
        //     isnew: this.model.get('TVV').isNew()
        // });
        // var MnView = require('./mentiuni');
        // this.MentiuniView = new MnView({
        //     collection: this.model.get('SetDateTVV').get('Mentiuni')
        // });
    this.buildView();
  },
  buildView: function () {
    var tabs;
    var hideTab = this.model.get('SetDateTVV').get('DateTehnice').models.length === 0 || this.options.tip_completare === 1;
    tabs = [{
      id: 'tabTVV',
      caption: 'Date generale',
      hint: 'GeneralView',
      index: 1
    }, {
      id: 'tabMase',
      caption: 'Mase',
      hint: 'MaseView',
      index: 3,
      hidden: hideTab
    }, {
      id: 'tabDimensiuni',
      caption: 'Dimensiuni',
      hint: 'DimensiuniView',
      index: 2,
      hidden: hideTab
    }, {
      id: 'tabAxe',
      caption: 'Axe',
      hint: 'AxeView',
      index: 7,
      hidden: hideTab
    }, {
      id: 'tabAltele',
      caption: 'Alte Date',
      hint: 'AlteView',
      index: 9,
      hidden: hideTab
    }, {
      id: 'tabAnvelope',
      caption: 'Anvelope',
      hint: 'AnvelopeView',
      index: 8,
      hidden: hideTab
    }, {
      id: 'tabTransmisie',
      caption: 'Transmisie',
      hint: 'TransmisieView',
      index: 6,
      hidden: hideTab
    }, {
      id: 'tabMotor',
      caption: 'Motor',
      hint: 'MotoareView',
      index: 4,
      hidden: hideTab
    }, {
      id: 'tabPoluare',
      caption: 'Poluare',
      hint: 'PoluareView',
      index: 5,
      hidden: hideTab
    }, {
      id: 'tabComponente',
      caption: 'Componente/Sisteme',
      hint: 'SistemeView',
      index: 10,
      hidden: hideTab
    }, {
      id: 'tabMentiuni',
      caption: 'Mentiuni',
      hint: 'MentiuniView',
      index: 11,
      hidden: hideTab
    }];


    //setam ordinea de afisare a taburilor
    tabs = _.sortBy(tabs, 'index');
    var me = this;
    //construim forma
    this.$el.find('#searchResultData').w2form({
      name: me.formID,
      tabs: tabs,
      focus: 1000
    });
    w2ui[me.formID].tabs.onClick = this.tabClicked.bind(this);
    this.setRegions();
    // this.GeneralView.setupView();
    if (this.model.get('TVV').get('nr_registru'))
      this.GeneralView.setReadOnly();
    this.$el.css({
      'opacity': 1
    });
    this.viewRendered = true;
  },
  refreshSubViews:function(data){
    var self = this;
    var GView = require('./general');
    this.GeneralView = new GView({
      model: this.model.get('TVV'),
      extensie: this.model.get('id_extensie')
    });
    this.dategenerale.show(this.GeneralView);
    self.MaseView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('mase');
    self.MaseView.render();
    // self.MaseView.attachChangeEvent();
    self.DimensiuniView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('dimensiuni');
    self.DimensiuniView.render();
    self.AxeView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('axe');
    self.AxeView.render();
    self.AlteView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('altele');
    self.AlteView.render();
    self.PoluareView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('poluare');
    self.PoluareView.render();
    self.TransmisieView.collection = self.model.get('SetDateTVV').get('DateTehnice');//.byGroup('cv');
    self.TransmisieView.render();
    // self.SistemeView.collection = self.model.get('SetDateTVV').get('Sisteme');
    // self.SistemeView.options.categorie = self.model.get('TVV').get('categorie'),
    // self.SistemeView.refreshUI();
    // self.MentiuniView.collection = self.model.get('SetDateTVV').get('Mentiuni');
    // self.MentiuniView.refreshUI();
    self.MotoareView.collection = self.model.get('SetDateTVV').get('Motoare');
    self.MotoareView.refreshUI();
    self.AnvelopeView.collection = self.model.get('SetDateTVV').get('Anvelope');
    self.AnvelopeView.refreshUI();
  },
  setRegions: function () {
    this.addRegions({
      'dategenerale': '#search_tabTVV',
      'dimensiuni': '#search_tabDimensiuni',
      'mase': '#search_tabMase',
      'axe': '#search_tabAxe',
      'altele': '#search_tabAltele',
      'transmisie': '#search_tabTransmisie',
      'motor': '#search_tabMotor',
      'poluare': '#search_tabPoluare',
      'anvelope': '#search_tabAnvelope',
      'sisteme': '#search_tabSisteme',
      'mentiuni': '#search_tabMentiuni',
    });
    this.dategenerale.show(this.GeneralView);
    this.dimensiuni.show(this.DimensiuniView);
    this.mase.show(this.MaseView);
    this.axe.show(this.AxeView); 
    this.motor.show(this.MotoareView);
    this.altele.show(this.AlteView);
    this.transmisie.show(this.TransmisieView);
    this.poluare.show(this.PoluareView);
    this.anvelope.show(this.AnvelopeView);
    // this.sisteme.show(this.SistemeView);
    // this.mentiuni.show(this.MentiuniView);
  },
  tabClicked: function (tab) {
    var me = this;
    if (me[tab.tab.hint].refreshUI)
      me[tab.tab.hint].refreshUI.apply(me[tab.tab.hint], arguments);
    if (me.forceValidation)
      w2utils.validate(me.model, me.$el);
  },

  copyData:function(){
    // var copyModel = this.model.toJSON();
    Globals.setClipboard(this.model.get('SetDateTVV'));
    app.trigger('globals:copy')
  },
  onBeforeDestroy:function() {
    if(w2ui.hasOwnProperty(this.formID))
      w2ui[this.formID].destroy();
  }
})