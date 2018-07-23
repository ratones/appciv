var ipc = function() {
    this.returnValue = null;
};

ipc.prototype.on = function(event, callback, context) {
    this.hasOwnProperty('events') || (this.events = {});
    this.events.hasOwnProperty(event) || (this.events[event] = []);
    this.events[event].push([callback, context]);
};
ipc.prototype.init = function(){
    this.events={};
    this.returnValue = null;
};
ipc.prototype.send = function(event) {
    var tail = Array.prototype.slice.call(arguments, 1)[0],
        callbacks = this.events[event];
    for (var i = 0, l = callbacks.length; i < l; i++) {
        var callback = callbacks[i][0],
            context = callbacks[i][1] === undefined ? this : callbacks[i][1];
        callback(context, tail);
    }
};
ipc.prototype.sendSync = function(event) {
    var tail = Array.prototype.slice.call(arguments, 1);
    var arg = tail[0];
    var cb;
    cb = tail.length > 1 ? tail[1] : undefined;
    var callbacks = this.events[event];
    var callback = callbacks[0][0],
        context = callbacks[0][1] === undefined ? this : callbacks[0][1];
    if (typeof(cb) === 'function') {
        callback(context, arg, cb);
    } else {
        callback(context, arg);
        return context.returnValue;
    }
};
ipc.prototype.runLoop = function(loop, event) {
    var tail = Array.prototype.slice.call(arguments, 1);
    var arg = tail[0];
    var cb;
    cb = tail.length > 1 ? tail[1] : undefined;
    var callbacks = this.events[event];
    var callback = callbacks[0][0],
        context = callbacks[0][1] === undefined ? this : callbacks[0][1];

};
ipc.prototype.syncLoop = function(iterations, process, exit) {
    var self = this;
    var index = 0,
        done = false;
    var loop = {
        // Loop structure
        next: function() {
            if (done) {
                if (shouldExit && exit) {
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if (index < iterations) {
                index++; // Increment our index
                process(loop); // Run our process, pass in the loop
                // Otherwise we're done
            } else {
                done = true; // Make sure we say we're done
                if (exit) exit(); // Call the callback on exit
            }
        },
        iteration: function() {
            return index - 1; // Return the loop number we're on
        },
        break: function(end) {
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
        }
    };
    loop.next();
    return loop;
};
module.exports = new ipc();
