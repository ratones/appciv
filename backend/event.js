var Evented = {

    off: function(event) {
        if (this.events.hasOwnProperty(event))(this.events[event] = []);
    },
    on: function(event, callback, context) {
        this.hasOwnProperty('events') || (this.events = {});
        this.events.hasOwnProperty(event) || (this.events[event] = []);
        this.events[event].push([callback, context]);
    },
    fire: function(event) {
        var tail = Array.prototype.slice.call(arguments, 1),
            callbacks = this.events[event];
        for (var i = 0, l = callbacks.length; i < l; i++) {
            var callback = callbacks[i][0],
                context = callbacks[i][1] === undefined ? this : callbacks[i][1];
            callback.apply(context, tail);
        }
    }
};

module.exports = Evented;
