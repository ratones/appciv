var ipc = requireNode('ipc');
var UUID;
$(document).ajaxStart(function() {
    w2utils.lock('#main', 'Va rugam asteptati...', true);
});
$(document).ajaxStop(function() {
    w2utils.unlock('#main');
});
window.onerror = function() {
    w2utils.unlock('#main');
};
// $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
//
//     // Don't infinitely recurse
//     originalOptions._retry = isNaN(originalOptions._retry) ? 1 : originalOptions._retry - 1;
//
//     // set up to date authorization header with every request
//     jqXHR.setRequestHeader("X-ApiKey", app.User.api);
//
//     // save the original error callback for later
//     if (originalOptions.error)
//         originalOptions._error = originalOptions.error;
//
//     // overwrite *current request* error callback
//     options.error = $.noop();
//
//     // setup our own deferred object to also support promises that are only invoked
//     // once all of the retry attempts have been exhausted
//     var dfd = $.Deferred();
//     jqXHR.done(dfd.resolve);
//
//     // if the request fails, do something else yet still resolve
//     jqXHR.fail(function() {
//         var args = Array.prototype.slice.call(arguments);
//
//         if (jqXHR.status === 401 && originalOptions._retry > 0) {
//             // refresh the oauth credentials for the next attempt(s)
//             // (will be stored and returned by Common.auth.getAuthorizationHeader())
//
//             var a = document.createElement('a');
//             a.href = options.url;
//             var moduleName = a.pathname.split('/')[1];
//
//             // ipc.sendSync('user:request:sync', moduleName, function(user) {
//             //     if (user.auth) { //we have an authenticated user
//             //         app.User = user;
//             //         app.trigger('user:updated');
//             //         UUID = user.api;
//             //         $.ajax(originalOptions).then(dfd.resolve, dfd.reject);
//             //     } else {
//                     app.controller.login(moduleName, function(result) {
//                         if (result) {
//                             $.ajax(originalOptions).then(dfd.resolve, dfd.reject);
//                         } else {
//                           if (originalOptions._error)
//                               dfd.fail(originalOptions._error);
//                           dfd.rejectWith(jqXHR, args);
//                         }
//                     });
//                 // }
//               // });
//
//             // retry with our modified
//             // $.ajax(originalOptions).then(dfd.resolve, dfd.reject);
//
//         } else {
//             // add our _error callback to our promise object
//             if (originalOptions._error)
//                 dfd.fail(originalOptions._error);
//             dfd.rejectWith(jqXHR, args);
//         }
//     });
//
//     // NOW override the jqXHR's promise functions with our deferred
//     return dfd.promise(jqXHR);
// });


$.ajaxPrefilter(function(opts, originalOpts, jqXHR) {
    // you could pass this option in on a "retry" so that it doesn't
    // get all recursive on you.
    if (opts.refreshRequest) {
        return;
    }

    // our own deferred object to handle done/fail callbacks
    var dfd = $.Deferred();

    // if the request works, return normally
    jqXHR.done(dfd.resolve);

    // if the request fails, do something else
    // yet still resolve
    jqXHR.fail(function() {
        var args = Array.prototype.slice.call(arguments);
        if (jqXHR.status === 401) {
            // $.ajax({
            //     url: '/refresh',
            //     refreshRequest: true,
            //     error: function() {
            //         // session can't be saved
            //         alert('Your session has expired. Sorry.');
            //         // reject with the original 401 data
            //         dfd.rejectWith(jqXHR, args);
            //     },
            //     success: function() {
            //         // retry with a copied originalOpts with refreshRequest.
            //         var newOpts = $.extend({}, originalOpts, {
            //             refreshRequest: true
            //         });
            //         // pass this one on to our deferred pass or fail.
            //         $.ajax(newOpts).then(dfd.resolve, dfd.reject);
            //     }
            // });
            app.controller.login(moduleName, function(result) {
               if (result) {
                         // retry with a copied originalOpts with refreshRequest.
                         var newOpts = $.extend({}, originalOpts, {
                             refreshRequest: true
                         });
                         // pass this one on to our deferred pass or fail.
                         $.ajax(newOpts).then(dfd.resolve, dfd.reject);
               } else {
                 dfd.rejectWith(jqXHR, args);
               }
           });
        } else {
            dfd.rejectWith(jqXHR, args);
        }
    });

    // NOW override the jqXHR's promise functions with our deferred
    return dfd.promise(jqXHR);
});

















// $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
//
//   originalOptions._error = originalOptions.error;
//   jqXHR.setRequestHeader("X-ApiKey", app.User.api);
//    // overwrite error handler for current request
//    options.error = function( _jqXHR, _textStatus, _errorThrown ){
//    setTimeout(function(){},10000);
//    if (jqXHR.status === 401){
//      app.controller.login('appciv', function(result) {
//           if (result) {
//               $.ajax(originalOptions);
//           } else {
//             if( originalOptions._error ) originalOptions._error( _jqXHR, _textStatus, _errorThrown );
//             return;
//           }
//       });
//       }else{
//         if( originalOptions._error ) originalOptions._error( _jqXHR, _textStatus, _errorThrown );
//         return;
//       }
//
//       // else... Call AJAX again with original options
//
//    };
// });
