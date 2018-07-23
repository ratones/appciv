var r = requireNode('request');
var fs = requireNode('fs');
var path = requireNode('path');
var util = require('./util');
var pfx = fs.readFileSync(path.resolve('./key.pfx'));
var passphrase = 'rarom';
var options = {
    rejectUnauthorized: false,
    // agentOptions: {
    pfx: pfx,
    passphrase: passphrase,
    //cert: cert,
    //key: key

    // proxy: 'http://cristian_mar:Andreia@80.86.99.115:3128'
    // }
};

var request = r.defaults(options);

var notificationInterval;

function startCenter() {
    notificationInterval = setInterval(function() {
        request.get('http://10.2.2.10:8083/dotapi/notifications/getnotifications',
            function(error, response, body) {
                if (response.statusCode === 200) {
                    console.log(body);
                    var data = JSON.parse(body);
                    var opt = {
                        title: data.title,
                        text: data.text,
                        type: 'info-template'
                    };
                    util.showNotification(opt);
                }
            });
    }, 10000);
}

function stopCenter() {
    clearInterval(notificationInterval);
}
