var ipc = requireNode('ipc');

var gui = requireNode('nw.gui');
var pkg = gui.App.manifest; // Insert your app's manifest here
var path = require('path');
var updater = requireNode('node-webkit-updater');
var request = require('./proxy');
var upd = new updater(pkg,{request:request});
var copyPath, execPath;
var getDirname = function(pathname, separator) {
    var dirname = pathname.split(separator).slice(0, -1).join(separator)+separator
    return dirname;
};
var Updater = function () {
	this.update = function(callback){
		var env, x=gui.App.argv.indexOf("dev");
        // skip update if in dev mode or, for now, in extern test"
        if(x>-1) {
             callback();
            return;
        }
	        upd.checkNewVersion(function(error, newVersionExists, manifest) {
	            if (!error && newVersionExists) {
	                console.log('update needed');
	                w2utils.unlock('body');
	                w2utils.lock('body', '<i style="color:red">Va rugam asteptati!<br>Aplicatia se actualizeaza<br>si ve reporni in cateva <br>momente!</i>', true);
	                // ------------- Step 2 -------------
	                console.log('start download');
	                upd.download(function(error, filename) {
	                    if (!error) {
	                        console.log('downloaded');

	                        if(path.extname(filename)!=='.zip'){
	                        	gui.Shell.openItem(filename);
	                        	gui.App.quit();
	                        	return;
	                        }
	                        // // ------------- Step 3 -------------
	                        upd.unpack(filename, function(error, newAppPath) {
	                        	
	                             if (!error) {
	                             	//original location
	                             	var appPath = path.dirname(global.process.mainModule.filename);
	                             	var separator = newAppPath.indexOf('\\')>-1?'\\':'/';
	                             	//path to unpacked app
	                        		var dirname = newAppPath.split(separator).slice(0, -1).join(separator)
	                                //original executable 
	                                var origexec = path.join(appPath,'AplicatieCIV.exe');
	                                var args = [dirname,gui.App.argv[0]];
	                                console.log(args);
	                                console.log(upd.getAppExec());
	                        //         // ------------- Step 4 -------------
	                                   // upd.runInstaller(upd.getAppExec(), args, {});
	                                   // gui.App.quit();
	                                 upd.copyApp(dirname,appPath,function(){
	                                 	upd.runInstaller(upd.getAppExec(), args, {});
	                                 	gui.App.quit();
	                                 });

	                            }
	                        }, manifest);

	                    }else{
                        	w2alert('Eroare de conexiune!');
                        	callback();
                        }
	                }, manifest);

	            } else if (error) {
	                console.info(error);
	                callback(error);
	            } else {
	                console.info('App up to date');
	                callback();
	            }

	        });
	}

};


module.exports = new Updater();
