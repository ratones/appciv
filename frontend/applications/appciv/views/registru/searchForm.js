var ItemView = Marionette.ItemView.extend({
  className: 'flexSearch',
  attributes: function () {
    return {
      style: 'display:flex;margin:5px'
    };
  },
  events: {
    'click #delFilter': 'deleteFilter'
  },
  bindings: {
    '#field': 'field',
    '#oper': 'oper',
    '#value': 'value'
  },
  getTemplate: function () {
    return '<div>' +
      '<div class="">' +
      '<div><input type="text" id="field"></div>' +
      '</div>' +
      '<div class="">' +
      '<div><input type="text" id="oper"></div>' +
      '</div>' +
      '<div class="">' +
      '<div><input type="text" id="value"></div>' +
      '</div>' +
      '<div><button class="btn btn-red btn-icon-only" id="delFilter"><i class="w2ui-icon-cross"></i></button></div>' +
      '</div>';
  },
  initialize: function (options) {
    this.sourceFields = [
      { text: 'Nr. Registru', id: 'nr_registr' },
      { text: 'WVTA', id: 'wvta' },
      { text: 'Extensie', id: 'extensie' },
      { text: 'Categorie EU', id: 'categ_euro' },
      { text: 'Categorie folosinta', id: 'cat' },
      { text: 'Caroserie', id: 'scat' },
      { text: 'Tip', id: 'tip' },
      { text: 'Varianta', id: 'varianta' },
      { text: 'Versiune', id: 'versiune' },
      { text: 'Marca', id: 'marca' },
      { text: 'Den. Comerciala', id: 'tipcom' },
      { text: 'Cod Motor', id: 'cod' },
      { text: 'Cilindree', id: 'cilindree' },
      { text: 'Putere max. Kw', id: 'p_max_kw' },
      { text: 'Combustibil', id: 'combustib' },
      { text: 'Masa proprie', id: 'masa' },
      // { text: 'Masa Reala', id: 'masa_reala' },
      // { text: 'Masa Totala', id: 'masa_totala' },
      { text: 'Lungime', id: 'lungmax' },
      { text: 'Latime', id: 'latmax' },
      { text: 'Inaltime', id: 'hmax' },
      { text: 'An fabricatie', id: 'an_fabr' },
      { text: 'Locuri fata', id: 'locurif' },
      { text: 'Locuri scaune', id: 'locurisc' },
      { text: 'Locuri total', id: 'locuri' },
      { text: 'Locuri picioare', id: 'locuripi' },
      { text: 'Masa axa fata', id: 'masf' },
      { text: 'Masa axa spate', id: 'mass' },
      { text: 'Masa rem cu disp', id: 'masrec' },
      { text: 'Masa rem fara disp', id: 'masrecf' },
      { text: 'Masa rem fara disp', id: 'masrecf' },
      { text: 'Anvel. standard fata', id: 'anvelopa' },
      { text: 'Anvel. standard spate', id: 'roatas' },
      { text: 'Viteza max', id: 'vitezamax' },
      { text: 'Numar axe', id: 'nr_axe' }
    ]
    this.operators = [
      '=',
      '<>',
      '>',
      '<',
      '<=',
      '>=',
      'contine'
    ]
  },
  onShow: function () {
    var self = this
    this.$('#field').w2field('list', { items: this.sourceFields }).on('change', function (event) {
      var selected = $(this).data('selected')
      self.model.set('field', selected.id)
    });
    this.$('#oper').w2field('list', { items: this.operators });
    this.stickit()
  },
  deleteFilter: function () {
    this.trigger('delFilter', this.model)
  }
})
var FieldModel = Backbone.Model.extend({

})
var FieldCollection = Backbone.Collection.extend({
  model: FieldModel
})


/****************************
 * 
 * Collection View
 * 
 */
module.exports = Marionette.CompositeView.extend({
  expandedGrid: '',
  template: require('./../../templates/registru/searchForm.hbs'),
  initialize: function (options) {
    var self = this;
    this.tip_omologare = options.tip_omologare;
    this.searchFields = []

    this.collection = new FieldCollection()
    this.listenTo(app,'search:request', this.showNavigation.bind(this));
    // this.listenTo(app, 'search:toggleNav', this.toggleNavigation.bind(this));
    // this.listenTo(app, 'search:toggleCopy', this.toggleCopy.bind(this));
  },

  attributes: function () {
    return {
      style: 'height:100%'
    };
  },
  childView: ItemView,
  onShow:function(){
    this.toggleCopy({enable:false})
    this.toggleNavigation({prev:false,next:false})
  },
  events: {
    'click #addfield': 'addField',
    'click #searchBtn': 'search',
    'click #closeBtn' : 'close',
    'click #nextBtn':'nextRec',
    'click #prevBtn': 'prevRec',
    'click #copyBtn' : 'copyData'
  },
  attachHtml: function (collectionView, itemView, index) {
    var self = this
    collectionView.$('#searchFields').append(itemView.el) 
    itemView.on('delFilter', function (filter) {
      self.collection.remove(filter)
    })
  },
  addField: function () {
    this.collection.add(new FieldModel({ 'field': '', 'oper': '', 'value': '' }))
  },
  search: function() {
    console.log('search button press')
    var filters = this.collection.toJSON()
    app.trigger('search:performSearch',filters)
  },
  close:function() {
    app.trigger('search:close');
  },
  showNavigation:function(data){
    this.$el.find('#crtPage').html(data.page+1)
    this.$el.find('#totalRecords').html(data.total)
    if(data.page >= data.total){
      this.toggleNavigation({prev:true,next:false})
    }else if(data.page == 0){
      this.toggleNavigation({prev:false,next:true})
    }else{
      this.toggleNavigation({prev:true,next:true})
    }
    if(data.total > 0){
      this.toggleCopy({enable:true});
    }
  },
  nextRec: function(){
    app.trigger('search:next');
  },
  prevRec: function(){
    app.trigger('search:prev');
  },
  copyData:function(){
    app.trigger('search:copydata')
  },
  toggleCopy:function(data){
    if(data.enable){
      this.$el.find('#copyBtn').prop('disabled',false);
    }else{
      this.$el.find('#copyBtn').prop('disabled',true);
    }
  },
  toggleNavigation:function(data){
    if(data.prev){
      this.$el.find('#prevBtn').prop('disabled',false);
    }else{
      this.$el.find('#prevBtn').prop('disabled',true);
    }
    if(data.next){
      this.$el.find('#nextBtn').prop('disabled',false);
    }else{
      this.$el.find('#nextBtn').prop('disabled',true);
    }
  }
})