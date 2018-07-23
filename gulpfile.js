var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var clean = require('del');
var processhtml = require('gulp-processhtml');
var merge = require('merge-stream');
var del = require('del'); // rimraf directly
var fs = require('fs');
var exec = require('child_process').exec;

var base = '';


gulp.task('clean-dist', function() {
    del('dist/**/*');
});
gulp.task('clean-release', function() {
    del('release/**/*');
});

gulp.task('scripts', function() {
    var target = process.argv;
    console.log(target);
    if (target.indexOf('--linux') !== -1) {
        base = '/home/cristi/Documents/Projects';
    } else if (target.indexOf('--win') !== -1) {
        base = 'd:/Projects/Client/GitResources';
    } else if (target.indexOf('--mac') !== -1) {
        base = '/Volumes/Data/Projects';
    }  else if(target.indexOf('--remote') !== -1){
        base = 'Q/GitResources';
    }else {
        base = 'd:/Projects/Client/GitResources';
    }
    var bundles = [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/underscore/underscore.js',
        'node_modules/backbone.marionette/node_modules/backbone/backbone.js',
        'node_modules/backbone.marionette/node_modules/backbone.babysitter/lib/backbone.babysitter.js',
        'node_modules/backbone.marionette/node_modules/backbone.wreqr/lib/backbone.wreqr.js',
        'node_modules/backbone.marionette/lib/core/backbone.marionette.js',
        'node_modules/handsontable/dist/zeroclipboard/Zeroclipboard.js',
        'node_modules/handsontable/dist/handsontable.full.min.js',
        base + '/nwbundles/backbone-associate/src/backbone.associate.js',
        base + '/nwbundles/bootstrap-fileinput/js/fileinput.js',
        base + '/nwbundles/stickit/backbone.stickit.js',
        base + '/nwbundles/extensions/bb.extensions.js',
        base + '/nwbundles/extensions/m.extensions.js',
        base + '/nwbundles/filemenu/src/js/fileMenu.js',
        base + '/nwbundles/w2ui/dist/w2ui.js',
        base + '/nwbundles/nicedit/nicEdit.js'
        // base + '/nwbundles/jsPDF/dist/jspdf.min.js',
        // base + '/nwbundles/jsPDF/plugins/from_html.js',
        // base + '/nwbundles/jsPDF/plugins/split_text_to_size.js',
        // base + '/nwbundles/jsPDF/plugins/standard_fonts_metrics.js'
    ];
    return gulp.src(bundles)
        .pipe(concat('bundles.js'))
        .pipe(gulp.dest('build/'));
});

var hbsfy = require("hbsfy").configure({
    extensions: ["html", "hbs", "hts"]
});


gulp.task('browserify', function() {
    return browserify('frontend/index.js')
        .transform(hbsfy)
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('build/'));
});

gulp.task('css', function() {
    var target = process.argv;
    console.log(target);
    if (target.indexOf('--linux') !== -1) {
        base = '/home/cristi/Documents/Projects';
    } else if (target.indexOf('--win') !== -1) {
        base = 'd:/Projects/Client/GitResources';
    } else if (target.indexOf('--mac') !== -1) {
        base = '/Volumes/Data/Projects';
    }
    else if(target.indexOf('--remote') !== -1){
        base = 'Q/GitResources';
    }else {
        base = 'd:/Projects/Client/GitResources';
    }
    console.log(base);
    var src = [
        base + '/nwbundles/bootstrap-fileinput/css/fileinput.css',
        base + '/nwbundles/w2ui/dist/w2ui.css',
        base + '/nwbundles/filemenu/src/css/fileMenu.css',
        'node_modules/handsontable/dist/handsontable.full.min.css',
        // 'frontend/styles/font.css',
        'frontend/styles/main.css',
        'frontend/styles/site.css'
    ];
    return gulp.src(src)
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('build/'));
});

gulp.task('build', ['browserify', 'scripts', 'css']);

gulp.task('watch', function() {
    gulp.watch(['frontend/**/*', 'backend/**/*'], ['build']);
});



gulp.task('compress', function() {
    return gulp.src('build/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
    return gulp.src('build/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['build', 'compress', 'minify-css', 'copy', 'processhtml']);




gulp.task('copy', function() {
    var node = gulp.src([
            'node_modules/ipc/**/*'
        ], {
            base: 'node_modules'
        })
        .pipe(gulp.dest('dist/node_modules'));
    var assets = gulp.src('assets/**/*', {
            base: 'assets'
        })
        .pipe(gulp.dest('dist/assets'));
      var img = gulp.src('frontend/images/**/*', {
            base: ''
        })
        .pipe(gulp.dest('dist/images'));
    // var tools = gulp.src('tools/**/*', {
    //     base: ''
    // })
    // .pipe(gulp.dest('dist/tools'));
    var viewer = gulp.src('pdfviewer/**/*', {
            base: 'pdfviewer'
        })
        .pipe(gulp.dest('dist/pdfviewer'));
    var pack = gulp.src(['package.json', 'key.pfx','ManualCIV.pdf','DocumentatieXSDCIV.pdf'])
        .pipe(gulp.dest('dist'));
    return merge(node, assets,viewer,img, pack);
});

gulp.task('processhtml', function() {
    return gulp.src('index.html')
        .pipe(processhtml())
        .pipe(gulp.dest('dist'));
});
gulp.task('processloginhtml', function() {
    return gulp.src('modals/login/login.html')
        .pipe(processhtml())
        .pipe(gulp.dest('dist/modals/login'));
});

gulp.task('flatten',function(cb){
    exec('flatten-packages dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
  });
});

gulp.task('setVersion', function() {
        var appversion, i = process.argv.indexOf("--appversion");
        var appPath = '';
        //var mainPackageJSON = grunt.file.readJSON('package.json');
        var appPackageJSON = JSON.parse(fs.readFileSync(appPath + 'package.json'));
        if(i>-1) {
            appversion = process.argv[i+1];
        }else{
            var currVers = appPackageJSON.version.split(/[.]+/);
            var version = Number(currVers[0]);
            var release = Number(currVers[1]);
            var modif = Number(currVers[2]);
            modif = modif + 1;
            appversion = version+'.'+release+'.'+modif;
            console.log(modif);
        }
        appPackageJSON.version = appversion;
        fs.writeFileSync('package.json',JSON.stringify(appPackageJSON,null, "\t"));
    });
gulp.task('setUpdateURL', function() {
        var releasetarget, i = process.argv.indexOf("--releasetarget"),manifest,update,apptoolbar;
        if(i>-1) {
            releasetarget = process.argv[i+1];
        }
        var appPath = '';
        var appPackageJSON = JSON.parse(fs.readFileSync(appPath + 'package.json'));
        switch(releasetarget){
            case 'intern':
                manifest = "http://10.1.0.32:8083/Update/appciv/package.json";
                update = "http://10.1.0.32:8083/Update/appciv/app.zip";
                apptoolbar = false;
                break;
            case 'extern':
                manifest = "https://prog.rarom.ro:446/Update/appciv/package.json";
                update = "https://prog.rarom.ro:446/Update/appciv/app.zip";
                apptoolbar = false;
                break;
             case 'dev':
                manifest = "http://10.2.2.10:8083/Update/appciv/package.json";
                update = "http://10.2.2.10:8083/Update/appciv/app.zip";
                apptoolbar = true;
            break;
        }
        appPackageJSON.manifestUrl = manifest;
        appPackageJSON.packages.win.url = update;
        appPackageJSON.window.toolbar = apptoolbar;
        fs.writeFileSync('package.json',JSON.stringify(appPackageJSON,null, "\t"));
    });


gulp.task('cpupdate',function(){
   return gulp.src('package.json')
        .pipe(gulp.dest('release'));
});
gulp.task('archive',['cpupdate'],function() {
    return gulp.src('dist/**/*')
        .pipe(zip('app.zip'))
        .pipe(gulp.dest('release'));
});

gulp.task('rename', ['archive'],function() {
    gulp.src("dist/package.json")
        .pipe(gulp.dest("release"));
    return gulp.src("release/app.zip")
        .pipe(rename("app.nw"))
        .pipe(gulp.dest("release"));

});


 gulp.task('release', ['archive']);

gulp.task('default', ['scripts', 'build', 'css', 'watch']);

/*
        Instructiuni:
            La instalarea initiala trebuie rulat installerul pentru runtime nwjs (Documents/Installers/NW/nwjs-SetupFiles/nwjs.msi)
            Apoi installerul pentru aplicatie(release/RegistruDOT.msi)
            pentru update aplicatie se ruleaza urmatoarele comenzi:
                1. gulp setVersion --appversion x.x.x
                2. gulp setUpdateURL --releasetarget target(intern,extern sau dev)
                3. gulp dist
                4. gulp archive
                5. gulp rename
                6. se modifica versiunea si in installer sa corespunda cu versiunea aplicatiei(proiectul pentru installer este in Documents/Installers/Registru D.O.T.)
                7. se face build la installer
                8. se deschide applicatia la meniul Actualizare si se incarca fisierele package.json si RegistruDOT.msi din folderul release
                9. se reporneste aplicatia

                Update 30.01.2016
                1. Se ruleaza gulp setVersion fara argumente - versiunea se va incrementa automat
                2. gulp setUpdateURL --releasetarget target(intern,extern sau dev)
                3. se ruleaza gulp release - va compila aplicatia
                4. pasul 6 de mai sus.

*/
