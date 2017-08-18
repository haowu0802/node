'use strict';

let FilesizeWatcher = require('./FilesizeWatcher-self');
const { exec } = require('child_process');

describe('FilesizeWatcher', function () {
    let watcher;

    afterEach(function () {
       watcher.stop();
    });

    it('should fire a grew event when the file grew in size', function (done) {
        let path = './tmp/filesizewatcher.test';
        exec('echo grew', function () {
           watcher = new FilesizeWatcher(path);
           watcher.on('grew', function (gain) {
               expect(gain).toBe(5);
               done();
           });
           exec('echo "test" > ' + path, function () {
               
           });
        });
    });

    it('should fire a shrank event when the file shrank in size', function (done) {
        let path = './tmp/filesizewatcher.test';
        exec('echo shrank', function () {
            watcher = new FilesizeWatcher(path);
            watcher.on('shrank', function (loss) {
                expect(loss).toBe(3);
                done();
            });
            exec('echo "a" > ' + path, function () {

            });
        });
    });

    it('should fire error if path does not start with a slash', function (done) {
        let path = './tmp/filesizewatcher.test';
        watcher = new FilesizeWatcher(path);
        watcher.on('error', function (err) {
            expect(err).toBe('Path does not start with a slash');
            done();
        });

    });
});