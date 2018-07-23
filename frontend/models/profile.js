var Profile = Backbone.SModel.extend({
    idAttribute: 'id_user',
    urlRoot: function() {
        return app.baseUrl + '/users/profile';
    }
});
module.exports = Profile;
