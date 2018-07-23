 var Backbone = window.Backbone;
 var User = Backbone.SModel.extend({
     defaults: {
         auth: false,
         username: '',
         password: ''
     },
     initialize: function() {},
     fields: [{
         name: 'username',
         el: '#username',
         type: 'text',
         required: true
     }, {
         name: 'password',
         el: '#password',
         type: 'password',
         required: true
     }, {
         name: 'rememberme',
         el: '#rememberme',
         type: 'checkbox'
     }]
 });
 module.exports = User;
