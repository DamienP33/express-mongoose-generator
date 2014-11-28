var assert = require('assert');
var spawn  = require('child_process').spawn;
var path   = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');//var cliStyles = require('../lib/cliStyles');

var binPath = path.resolve(__dirname, '../bin/mongoose-gen');
var tempDir = path.resolve(__dirname, '../temp');


describe('mongoose-gen', function(){
    describe('non-interactive mode', function(){
        describe('Error execution', function(){
            it('require model arg, should print error', function(done){
                run('', ['-f', 'foo'], function (err, stdout) {
                    assert.ok(/Argument required : Model name/.test(err.message));
                    done();
                });
            });
            it('require field arg, should print error', function(done){
                run('', ['-m', 'foo'], function (err, stdout) {
                    assert.ok(/Argument required : fields/.test(err.message));
                    done();
                });
            });
            it('Field type is not allowed, should print error', function(done){
                run('', ['-m', 'foo', '-f', 'foo:str'], function (err, stdout) {
                    assert.ok(/Invalid Argument : Field type is not allowed/.test(err.message));
                    done();
                });
            });
        });

        describe('Normal execution', function(){
            describe('basic usage', function(){
                var dir;

                before(function (done) {
                    createEnvironment(function (err, newDir) {
                        if (err) return done(err);
                        dir = newDir;
                        done();
                    });
                });
                after(function (done) {
                    this.timeout(300000);
                    cleanup(dir, done);
                });

                it('Should have mongoose model file', function(done){
                    run(dir, ['-m', 'modelName', '-f', 'fieldName:number'], function (err, stdout) {
                        if (err) return done(err);
                        var files = parseCreatedFiles(stdout, dir);
                        assert.equal(files.length, 2);
                        assert.notEqual(files.indexOf('models/modelNameModel.js'), -1);
                        done();
                    });
                });
            });

            describe('-r', function(){
                var files;
                var dir;

                before(function (done) {
                    createEnvironment(function (err, newDir) {
                        if (err) return done(err);
                        dir = newDir;
                        done();
                    });
                });
                after(function (done) {
                    this.timeout(300000);
                    cleanup(dir, done);
                });

                it('Should have basic directory', function(done){
                    run(dir, ['-m', 'modelName', '-f', 'fieldName:number', '-r'], function (err, stdout) {
                        if(err){ return done(err); }
                        files = parseCreatedFiles(stdout, dir);
                        assert.equal(files.length, 6);
                        done();
                    });
                });
                it('Should have model file', function(done){
                    assert.notEqual(files.indexOf('models/modelNameModel.js'), -1);
                    done();
                });
                it('Should have controller file', function(done){
                    assert.notEqual(files.indexOf('controllers/modelNameController.js'), -1);
                    done();
                });
                it('Should have router file', function(done){
                    assert.notEqual(files.indexOf('routes/modelNames.js'), -1);
                    done();
                });
            });
        });
    });

    it('--help, should print help', function(done){
        run('', ['--help'], function (err, stdout) {
            if (err) return done(err);
            assert.ok(/Usage: mongoose-gen \[options\]/.test(stdout));
            assert.ok(/--help/.test(stdout));
            assert.ok(/--version/.test(stdout));
            assert.ok(/-m, --model <modelName>  model name/.test(stdout));
            assert.ok(/-f, --fields <fields>    model fields/.test(stdout));
            assert.ok(/-r, --rest               enable generation REST/.test(stdout));
            done();
        });
    });
});

function cleanup(dir, callback) {
    if (typeof dir === 'function') {
        callback = dir;
        dir = tempDir;
    }

    rimraf(tempDir, function (err) {
        callback(err);
    });
}

function createEnvironment(callback) {
    var num = process.pid + Math.random();
    var dir = path.join(tempDir, ('app-' + num));

    mkdirp(dir, function ondir(err) {
        if (err) return callback(err);
        callback(null, dir);
    });
}

function parseCreatedFiles(output, dir) {
    var files = [];
    var lines = output.split(/[\r\n]+/);
    var match;

    for (var i = 0; i < lines.length; i++) {
        if ((match = /create\:\_color\_39\_(.*)$/.exec(lines[i]))) {
            var file = match[1];

            if (dir) {
                file = path.resolve(dir, file);
                file = path.relative(dir, file);
            }

            file = file.replace(/\\/g, '/');
            files.push(file);
        }
    }

    return files;
}

function run(dir, args, callback) {
    var argv = [binPath].concat(args);
    var chunks = [];
    var exec = process.argv[0];
    var stderr = [];

    var child = spawn(exec, argv, {
        cwd: dir
    });

    child.stdout.on('data', function ondata(chunk) {
        chunks.push(chunk);
    });
    child.stderr.on('data', function ondata(chunk) {
        stderr.push(chunk);
    });

    child.on('error', callback);
    child.on('exit', function onexit() {
        var err = null;
        var stdout = Buffer.concat(chunks)
            .toString('utf8')
            .replace(/\x1b\[(\d+)m/g, '_color_$1_');

        try {
            assert.equal(Buffer.concat(stderr).toString('utf8'), '');
        } catch (e) {
            err = e;
        }

        callback(err, stdout);
    });
}