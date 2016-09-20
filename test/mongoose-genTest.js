var assert = require('assert');
var spawn  = require('child_process').spawn;
var path   = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var nexpect = require('nexpect');

var binPath = path.resolve(__dirname, '../bin/mongoose-gen');
var tempDir = path.resolve(__dirname, '../temp');

var CLI_PHRASES = {
    AVAILABLE_TYPE: 'Available types : string, number, date, boolean, array, objectId',
    QUESTION_MODEL_NAME: 'Model Name : ',
    QUESTION_FIELD_NAME: 'Field Name (press <return> to stop adding fields) : ',
    QUESTION_FIELD_TYPE: 'Field Type [string] : ',
    QUESTION_FIELD_REF: 'Reference (model name referred by the objectId field) : ',
    QUESTION_GENERATE_REST: 'Generate Rest (yes/no) ? [yes] : ',
    QUESTION_FILES_TREE: 'Files tree generation grouped by Type or by Module (t/m) ? [t] : ',
    ERROR_MODEL_NAME: 'Argument required : Model name',
    ERROR_TYPE_ARGUMENT: 'Invalid Argument : Field type is not allowed',
    ERROR_REST_ARGUMENT: 'Argument invalid : rest',
    ERROR_FILES_TREE_ARGUMENT: 'Argument invalid : file tree generation',
    ERROR_FIELD_REQUIRED: 'Argument required : fields',
    ERROR_FIELD_NAME_REQUIRED: 'Argument required : Field Name',
    ERROR_FIELD_TYPE_REQUIRED: 'Argument required : Field type',
    ERROR_FIELD_TYPE_INVALID: 'Invalid Argument : Field type is not allowed'
};

describe('mongoose-gen', function () {
    describe('Non-interactive mode', function () {
        describe('Error execution', function () {
            it('Require model arg, should print error', function (done) {
                run('', ['-f', 'foo'], function (err, stdout) {
                    assert.ok(/Argument required : Model name/.test(stdout));
                    done();
                });
            });
            it('Require field arg, should print error', function (done) {
                run('', ['-m', 'foo'], function (err, stdout) {
                    assert.ok(/Argument required : fields/.test(stdout));
                    done();
                });
            });
            it('Field type is not allowed, should print error', function(done) {
                run('', ['-m', 'foo', '-f', 'foo:str'], function (err, stdout) {
                    assert.ok(/Invalid Argument : Field type is not allowed/.test(stdout));
                    done();
                });
            });
        });

        describe('Normal execution', function () {
            describe('Basic usage', function () {
                var dir;

                before(function (done) {
                    createEnvironment(function (err, newDir) {
                        if (err) { return done(err); }
                        dir = newDir;
                        done();
                    });
                });
                after(function(done) {
                    this.timeout(300000);
                    cleanup(dir, done);
                });

                it('Should have mongoose model file', function (done) {
                    run(dir, ['-m', 'modelName', '-f', 'fieldName:number'], function (err, stdout) {
                        if (err) { return done(err); }
                        var files = parseCreatedFiles(stdout, dir);
                        assert.equal(files.length, 2);
                        assert.notEqual(files.indexOf('models/modelNameModel.js'), -1);
                        done();
                    });
                });
            });

            describe('-r', function () {
                var files;
                var dir;

                before(function (done) {
                    createEnvironment(function (err, newDir) {
                        if (err) { return done(err); }
                        dir = newDir;
                        done();
                    });
                });
                after(function (done) {
                    this.timeout(300000);
                    cleanup(dir, done);
                });

                it('Should have basic directory', function (done) {
                    run(dir, ['-m', 'modelName', '-f', 'fieldName:number', '-r'], function (err, stdout) {
                        if (err) { return done(err); }
                        files = parseCreatedFiles(stdout, dir);
                        assert.equal(files.length, 6);
                        done();
                    });
                });
                it('Should have model file', function (done) {
                    assert.notEqual(files.indexOf('models/modelNameModel.js'), -1);
                    done();
                });
                it('Should have controller file', function (done) {
                    assert.notEqual(files.indexOf('controllers/modelNameController.js'), -1);
                    done();
                });
                it('Should have router file', function (done) {
                    assert.notEqual(files.indexOf('routes/modelNameRoutes.js'), -1);
                    done();
                });
            });
        });
    });

    describe('Interactive mode', function () {
        describe('Normal execution', function () {
            describe('Basic usage', function () {
                var dir;
                var files;

                before(function (done) {
                    createEnvironment(function (err, newDir) {
                        if (err) { return done(err); }
                        dir = newDir;
                        done();
                    });
                });
                after(function (done) {
                    this.timeout(300000);
                    cleanup(dir, done);
                });

                it('Should print instructions', function (done) {
                    nexpect.spawn(binPath, {cwd: dir})
                        .expect(CLI_PHRASES.QUESTION_MODEL_NAME)
                        .sendline('modelName')
                        .expect(CLI_PHRASES.AVAILABLE_TYPE)
                        .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                        .sendline('fieldName1')
                        .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                        .sendline('string')
                        .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                        .sendline('fieldName2')
                        .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                        .sendline('\r')
                        .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                        .sendline('\r')
                        .expect(CLI_PHRASES.QUESTION_GENERATE_REST)
                        .sendline('no')
                        .expect(CLI_PHRASES.QUESTION_FILES_TREE)
                        .sendline('t')
                        .sendEof()
                        .run(function (err, stdout, exitcod) {
                            if (err) { return done(err); }
                            assert.equal(err, null);
                            files = parseCreatedFiles(stdout, dir);
                            done();
                        });
                });
                it('Should have model file', function (done) {
                    assert.equal(files.length, 2);
                    assert.notEqual(files.indexOf('models/modelNameModel.js'), -1);
                    done();
                });
            });

            describe('Rest', function () {
                var dir;
                var files;

                before(function (done) {
                    createEnvironment(function (err, newDir) {
                        if (err) { return done(err); }
                        dir = newDir;
                        done();
                    });
                });
                after(function (done) {
                    this.timeout(300000);
                    cleanup(dir, done);
                });

                it('Should print instructions', function (done) {
                    nexpect.spawn(binPath, {cwd: dir})
                        .expect(CLI_PHRASES.QUESTION_MODEL_NAME)
                        .sendline('modelName')
                        .expect(CLI_PHRASES.AVAILABLE_TYPE)
                        .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                        .sendline('fieldName1')
                        .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                        .sendline('string')
                        .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                        .sendline('fieldName2')
                        .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                        .sendline('\r')
                        .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                        .sendline('\r')
                        .expect(CLI_PHRASES.QUESTION_GENERATE_REST)
                        .sendline('yes')
                        .expect(CLI_PHRASES.QUESTION_FILES_TREE)
                        .sendline('t')
                        .sendEof()
                        .run(function (err, stdout, exitcod) {
                            if (err) { return done(err); }
                            assert.equal(err, null);
                            files = parseCreatedFiles(stdout, dir);
                            done();
                        });
                });
                it('Should have basic directory', function (done) {
                    assert.equal(files.length, 6);
                    done();
                });
                it('Should have model file', function (done) {
                    assert.notEqual(files.indexOf('models/modelNameModel.js'), -1);
                    done();
                });
                it('Should have controller file', function (done) {
                    assert.notEqual(files.indexOf('controllers/modelNameController.js'), -1);
                    done();
                });
                it('Should have router file', function (done) {
                    assert.notEqual(files.indexOf('routes/modelNameRoutes.js'), -1);
                    done();
                });
            });
        });

        describe('Error execution', function () {
            it('Require model arg, should print error', function (done) {
                nexpect.spawn(binPath)
                    .expect(CLI_PHRASES.QUESTION_MODEL_NAME)
                    .sendline('')
                    .expect(CLI_PHRASES.ERROR_MODEL_NAME)
                    .expect(CLI_PHRASES.QUESTION_MODEL_NAME)
                    .sendline('  ')
                    .expect(CLI_PHRASES.ERROR_MODEL_NAME)
                    .expect(CLI_PHRASES.QUESTION_MODEL_NAME)
                    .sendline('process.exit()')
                    .sendEof()
                    .run(function (err, stdout, exitcod) {
                        if (err) { return done(err); }
                        assert.equal(err, null);
                        done();
                    });
            });
            it('Field type is not allowed, should print error', function (done) {
                nexpect.spawn(binPath)
                    .expect(CLI_PHRASES.QUESTION_MODEL_NAME)
                    .sendline('modelName')
                    .expect(CLI_PHRASES.AVAILABLE_TYPE)
                    .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                    .sendline('fieldName1')
                    .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                    .sendline('foo')
                    .expect(CLI_PHRASES.ERROR_FIELD_TYPE_INVALID)
                    .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                    .sendline('process.exit()')
                    .sendEof()
                    .run(function (err, stdout, exitcod) {
                        if (err) { return done(err); }
                        assert.equal(err, null);
                        done();
                    });
            });
            it('Rest arg no valid, should print error', function (done) {
                nexpect.spawn(binPath)
                    .expect(CLI_PHRASES.QUESTION_MODEL_NAME)
                    .sendline('modelName')
                    .expect(CLI_PHRASES.AVAILABLE_TYPE)
                    .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                    .sendline('fieldName1')
                    .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                    .sendline('string')
                    .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                    .sendline('fieldName2')
                    .expect(CLI_PHRASES.QUESTION_FIELD_TYPE)
                    .sendline('\r')
                    .expect(CLI_PHRASES.QUESTION_FIELD_NAME)
                    .sendline('\r')
                    .expect(CLI_PHRASES.QUESTION_GENERATE_REST)
                    .sendline('foo')
                    .expect(CLI_PHRASES.ERROR_REST_ARGUMENT)
                    .expect(CLI_PHRASES.QUESTION_GENERATE_REST)
                    .sendline('process.exit()')
                    .sendEof()
                    .run(function (err, stdout, exitcod) {
                        if (err) { return done(err); }
                        assert.equal(err, null);
                        done();
                    });
            });
        });
    });

    it('--help, should print help', function (done) {
        run('', ['--help'], function (err, stdout) {
            if (err) { return done(err); }
            assert.ok(/Usage: mongoose-gen \[options\]/.test(stdout));
            assert.ok(/--help/.test(stdout));
            assert.ok(/--version/.test(stdout));
            assert.ok(/-m, --model <modelName>  model name/.test(stdout));
            assert.ok(/-f, --fields <fields>    model fields/.test(stdout));
            assert.ok(/-r, --rest               enable generation REST/.test(stdout));
            assert.ok(/-t, --tree <tree>        files tree generation grouped by <t>ype or by <m>odule/.test(stdout));
            done();
        });
    });
});

/*
 * Original code by TJ Holowaychuk (https://github.com/expressjs/generator/blob/master/test/cmd.js)
 * Copyright (c) 2009-2013 TJ Holowaychuk <tj@vision-media.ca>
 * For the full copyright and license information, please view the MIT LICENSE : http://opensource.org/licenses/MIT
 */
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
        if (err) { return callback(err); }
        callback(null, dir);
    });
}

function parseCreatedFiles(output, dir) {
    var files = [];
    var lines = output;
    if (typeof output === 'string') {
        lines = output.split(/[\r\n]+/);
    }
    var match;

    for (var i = 0; i < lines.length; i++) {
        if ((match = /create.*?: (.*)$/.exec(lines[i]))) {
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
    var exec = process.argv[0];

    var stdout = '';
    var stderr = '';

    var child = spawn(exec, argv, {
        cwd: dir
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function ondata(chunk) {
        stdout += chunk;
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function ondata(chunk) {
        stderr += chunk;
    });

    child.on('error', callback);

    child.on('close', function onclose(code) {
        var err = null;

        try {
            assert.equal(stderr, '');
            assert.strictEqual(code, 0);
        } catch (e) {
            console.log(err);
            err = e;
        }
        callback(err, stdout.replace(/\x1b\[(\d+)m/g, '_color_$1_'));
    });
}
