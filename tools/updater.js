// import Util from './util';
var fs = require('fs');
var path = require('path');
var os = require('os');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var Updater = function(writeHTML) {
	this.writeHTML = writeHTML;
    this.manifest = nw.App.manifest;
    this.env = String(nw.App.argv[0]);
    this.newManifest;
    this.needUpdate = false;
};

Updater.prototype.update = function(callback, statusEl,progressEl) {
    var self = this;
    this.statusEl = statusEl;
    this.progressEl = progressEl;
    this.callback = callback;
    this.getManifest(function() {
        self.checkVersion.apply(self, arguments);
        self.performActions.apply(self, arguments);
    });
};


Updater.prototype.getManifest = function(cb) {
    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.manifest.manifest[this.env], true);
    xhr.onload = function(e){
      if (this.status == 200) {
          // get binary data as a response
          self.newManifest = JSON.parse(this.response);
          cb.call();
      }
    };
    xhr.onerror = function(){
      self.statusEl = null;
      self.progressEl= null;
      self.callback.call({message:'could not load update manifest from server'});
    };
    xhr.send();
};

Updater.prototype.checkVersion = function() {
    var regex = /([0-9]*)\.([0-9]*)\.([0-9]*)/;
    var match1 = regex.exec(this.newManifest.version);
    var match2 = regex.exec(this.manifest.version);
    if (match1 && match2) {
        var major, minor, mod, majornew, minornew, modnew;
        major = Number(match2[1]);
        minor = Number(match2[2]);
        mod = Number(match2[3]);
        majornew = Number(match1[1]);
        minornew = Number(match1[2]);
        modnew = Number(match1[3]);
        var sameMajor = major === majornew;
        var gtMajor = major < majornew;
        var sameMinor = minor === minornew;
        var gtMinor = minor < minornew;
        var gtMod = mod < modnew;
        if (gtMajor) {
            this.needUpdate = true;
        } else if (sameMajor) {
            if (gtMinor) {
                this.needUpdate = true;
            } else if (sameMinor) {
                if (gtMod) {
                    this.needUpdate = true;
                } else {
                    this.needUpdate = false;
                }
            } else {
                this.needUpdate = false;
            }
        } else {
            this.needUpdate = false;
        }
    } else {
        //error in versioning
        console.error('Error in versioning application');
        this.needUpdate = false;
    }

};

Updater.prototype.performActions = function() {
    if (this.needUpdate){
        if(this.writeHTML){
    		this.writeHTML.call();
		}
        this.downloadUpdate(this.unpackUpdate.bind(this));
       }
    else {
        this.statusEl = null;
        this.progressEl= null;
        this.callback.call();
    }
};



Updater.prototype.downloadUpdate = function(cb) {
    // this.writeProgressBar();
    var self = this;
    console.log('got here');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.newManifest.packages.win[this.env], true);
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
        if (this.status == 200) {
            // get binary data as a response
            var blob = this.response;
            var fileReader = new FileReader();
            var filepath = path.join(os.tmpdir(), 'test.zip');
            console.log(os.tmpdir());
            fileReader.onload = function() {
                self.statusEl.innerHTML = 'Writing file...';
                fs.writeFileSync(filepath, Buffer(new Uint8Array(this.result)));
                self.statusEl.innerHTML = 'Unpacking update...';
                //self.unpackUpdate();
                cb.call();
            };
            fileReader.readAsArrayBuffer(blob);
            //fs.writeFileSync('test.zip',arrayBuffer);
        }
    };
    xhr.onerror = function() {
        self.statusEl = null;
        self.progressEl= null;
        self.callback.call({message:'Eroare la descarcare update!'});
    };
    xhr.onprogress = function(evt) {
        if (evt.lengthComputable)
            var percentComplete = (evt.loaded / evt.total) * 100;
        self.statusEl.innerHTML = 'Downloading... ' + parseInt(percentComplete) + '%';
        self.progressEl.style.width = parseInt(percentComplete) + '%';
    };

    xhr.send();
};

Updater.prototype.unpackUpdate = function() {
    var self = this;
    var filename = path.join(os.tmpdir(), 'test.zip');
    exec('"' + path.resolve(process.cwd(), 'tools/unzip.exe') + '" -u -o "' +
        filename + '" -d "' + path.join(process.cwd(), '') + '" > NUL',
        function(err) {
            if (err) {
                self.statusEl = null;
                self.progressEl= null;
                self.callback.call(err);
                return;
            } else {
                self.run();
            }
        });
};

Updater.prototype.run = function(options){
  var path = process.execPath;
  var args = [process.cwd(),this.env];
    var opts = {
      detached: true
    };
    for(var key in options){
      opts[key] = options[key];
    }
    var sp = spawn(path, args, opts);
    sp.unref();
    nw.App.quit();
    // return sp;
  };

module.exports = Updater;
