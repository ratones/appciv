var gui = require('nw.gui');
var path,viewer;//unescape(gui.App.argv[0]);
// var appwin = window.frames['webview'].contentWindow;

 var setupview = function(){
	var param = parseQueryString(viewer.src);
	var accept = param.accept;
	console.log(accept);
	if (!accept || accept === '1') {
        document.getElementById('acceptDeviz').style.display = 'none';
        if(accept === '1' )
        	global.app.execute('app:refresh:devize');
    }else {
    	document.getElementById('acceptDeviz').style.display = 'block';
        document.getElementById('acceptDeviz').addEventListener('click', function() {
            viewer.src = path.replace('true', '1');
        });
    }
    viewer.insertCSS({code:'body{display:flex;flex-direction:column;align-items:center;justify-content:center}'});
    // viewer.insertCSS('body{display:flex;flex-direction:column;align-items:center;justify-content:center}');
};

var startup = function(){
    // nw.Window.get().cookies.set(nw.Window.get().data.cookie);
    viewer = document.getElementById('webview');
    // viewer.insertCSS({code:'body{display:flex;flex-direction:column;align-items:center;justify-content:center}'});
    // console.log(sdsd);
    viewer.request.onBeforeSendHeaders.addListener(
    function (details) {
        if(details.requestHeaders.indexOf('Cookie') < 0)
            details.requestHeaders.push({name:'Cookie',value:''});
        details.requestHeaders.forEach(function (header) {
            if (header.name === "Cookie") {
                var cookies = header.value.split(";");
                var valid_cookies = cookies.filter(function (cookie) {
                    return cookie && cookie.indexOf(".authDOT") < 0;
                });
                valid_cookies.push(".authDOT=" + nw.Window.get().data.cookie.value);
                header.value = valid_cookies.join("; ");
            }
        });
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);

	path = unescape(gui.Window.get().data.file);
	viewer.addEventListener('loadstop',function(){setupview();});
    viewer.src = path;

};




function parseQueryString(query) {
    var parts = query.split('&');
    var params = {};
    for (var i = 0, ii = parts.length; i < ii; ++i) {
        var param = parts[i].split('=');
        var key = param[0].toLowerCase();
        var value = param.length > 1 ? param[1] : null;
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return params;
}
