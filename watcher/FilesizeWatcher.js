'use strict';

let fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

let FilesizeWatcher = function (path) {
    let self = this;

    if (/^\//.test(path)===false){
        process.nextTick(function () {
            self.emit('error', 'Path does not start with a slash');
        });
        return;
    }

    fs.stat(path, function (err, stats) {
       self.lastfilesize = stats.size;
    });

    self.interval = setInterval(
        function () {
            fs.stat(path, function (err, stats) {
                if(stats.size > self.lastfilesize){
                    self.emit('grew', stats.size - self.lastfilesize);
                    self.lastfilesize = stats.size;
                }
                if(stats.size < self.lastfilesize){
                    self.emit('shrank', self.lastfilesize - stats.size);
                    self.lastfilesize = stats.size;
                }
            }, 1000);
    });
};

// inherits node EventEmitter
FilesizeWatcher.prototype = new EventEmitter();
// equivalent to
//util.inherits(FilesizeWatcher, EventEmitter);

FilesizeWatcher.prototype.stop = function () {
    clearInterval(this.interval);
};

module.exports = FilesizeWatcher;