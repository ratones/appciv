define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    return Marionette.ItemView.extend({

        template : require('text!./../templates/page.hbs'),

        serializeData : function () {
            return {
                'test' : this.options.test
            };
        }
    });

});