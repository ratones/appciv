    var home = window.Marionette.ItemView.extend({

        template: require('./../templates/index.html'),
        className: 'frontpage',
        onShow: function() {
            var self = this;
            //this.buildGrid();
        },

        serializeData: function() {
            return {
                img: 'images/SiglaRAR-scris-gri.png'
            };
        }
    });
    module.exports = home;
