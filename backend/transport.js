var ipc = requireNode('ipc');
var User = require('./user');
var UUID;
// $(document).ajaxStart(function(data) {
//     w2utils.lock('#main', 'Va rugam asteptati...', true);
// });
// $(document).ajaxStop(function() {
//     w2utils.unlock('#main');
// });
window.onerror = function() {
    w2utils.unlock('#main');
};
$.ajaxTransport('+*', function(options, originalOptions, jqXHR) {
    var callback;
    // Cross domain only allowed if supported through XMLHttpRequest
    if (true) {
        return {
            send: function(headers, complete) {
                var i;
                var xhr = options.xhr();
                var reloadXHR = options.xhr();
                // id = ++xhrId;

                xhr.open(options.type, options.url, options.async, options.username, options.password);

                // Apply custom fields if provided
                if (options.xhrFields) {
                    for (i in options.xhrFields) {
                        xhr[i] = options.xhrFields[i];
                    }
                }

                // Override mime type if needed
                if (options.mimeType && xhr.overrideMimeType) {
                    xhr.overrideMimeType(options.mimeType);
                }

                // X-Requested-With header
                // For cross-domain requests, seeing as conditions for a preflight are
                // akin to a jigsaw puzzle, we simply never set it to be sure.
                // (it can always be set on a per-request basis or even using ajaxSetup)
                // For same-domain requests, won't change header if already provided.
                if (!options.crossDomain && !headers['X-Requested-With']) {
                    headers['X-Requested-With'] = 'XMLHttpRequest';
                }
                headers['X-ApiKey'] = app.User.api;
                headers['X-IPDOMAIN'] = User.getIpDomain();

                // Set headers
                for (i in headers) {
                    xhr.setRequestHeader(i, headers[i]);
                }

                // Callback
                callback = function(type) {
                    return function() {
                        if (callback) {
                            callback = xhr.onload = xhr.onerror = null;

                            if (type === 'abort') {
                                xhr.abort();
                            } else if (type === 'error') {
                                complete(
                                    xhr.status,
                                    xhr.statusText
                                );
                            } else {
                                if (xhr.status === 401) {
                                    //first request failed with unauthorized - we request user from server (login by UUID)
                                    //get the application that sent the request
                                    var a = document.createElement('a');
                                    a.href = options.url;
                                    var moduleName = a.pathname.split('/')[1];

                                    ipc.sendSync('user:request:sync', moduleName, function(user) {
                                        if (user.auth) { //we have an authenticated user
                                            app.User = user;
                                            app.trigger('user:updated');
                                            UUID = user.api;
                                            resend();
                                        } else {
                                            app.controller.login(moduleName, function(result) {
                                                if (result) {
                                                    resend();
                                                } else {
                                                    complete(
                                                        xhr.status,
                                                        xhr.statusText
                                                    );
                                                }
                                            });
                                        }
                                    });


                                    function resend() {
                                        //we have to resend the request in a new xhr, with new credentials
                                        reloadXHR.open(options.type, options.url, options.async, options.username, options.password);
                                        if (options.xhrFields) {
                                            for (var i in options.xhrFields) {
                                                reloadXHR[i] = options.xhrFields[i];
                                            }
                                        }
                                        if (options.mimeType && xhr.overrideMimeType) {
                                            reloadXHR.overrideMimeType(options.mimeType);
                                        }
                                        if (!options.crossDomain && !headers['X-Requested-With']) {
                                            headers['X-Requested-With'] = 'XMLHttpRequest';
                                        }
                                        headers['X-ApiKey'] = app.User.api;
                                        headers['X-IPDOMAIN'] = User.getIpDomain();
                                        for (var x in headers) {
                                            reloadXHR.setRequestHeader(x, headers[x]);
                                        }
                                        reloadXHR.send(options.hasContent && options.data || null);
                                    }

                                    //on load second request
                                    reloadXHR.onload = function() {
                                        if (reloadXHR.status === 401) {
                                           //app.execute('app:user:login',moduleName);
                                            //user failed authentication by uuid - we request login window
                                            //and wait for response - here we have to resend request with user
                                            // -- may be we should handle this on node side...
                                            //for now we end original request
                                            complete(
                                                xhr.status,
                                                xhr.statusText
                                            );

                                        }
                                        var data = JSON.parse(reloadXHR.responseText);
                                        complete(reloadXHR.status,
                                            reloadXHR.statusText,
                                            typeof reloadXHR.responseText === 'string' ? {
                                                text: reloadXHR.responseText
                                            } : undefined,
                                            reloadXHR.getAllResponseHeaders());
                                    };


                                } else { //first request is ok - we complete the request
                                    complete(
                                        xhr.status,
                                        xhr.statusText,
                                        typeof xhr.responseText === 'string' ? {
                                            text: xhr.responseText
                                        } : undefined,
                                        xhr.getAllResponseHeaders()
                                    );
                                }
                            }
                        }
                    };
                };


                // Listen to events

                xhr.onload = callback();

                xhr.onerror = callback('error');

                // Create the abort callback
                callback /*= xhrCallbacks[id] */ = callback('abort');

                try {
                    // Do send the request (this may raise an exception)
                    xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                    // #14683: Only rethrow if this hasn't been notified as an error yet
                    if (callback) {
                        console.info(e.message);
                    }
                }


            },

            abort: function() {
                if (callback) {
                    callback();
                }
            }
        };
    }
});
