'use strict';

// for getting file size async
let fs = require('fs');

// constructor function, create obj by passing path
let FilesizeWatcher = function (path) {
    // access instantiated object within callback functions, where 'this' would point to another object
    let self = this;

    // associative array, store the callback to each event.
    self.callbacks = {};

    if(/^\//.test(path) === false){
        // put error check to next event loop so error handler is then registered,
        // otherwise error event will trigger before attached
        process.nextTick(function () {
            self.callbacks['error']('Path does not start with a slash');
        });
        return;
    }

    // get initial value of file size for future comparison
    fs.stat(path, function (err, stats) {
        self.lastfilesize = stats.size
    });

    // start watch logic
    self.interval = setInterval(
        function () {
            fs.stat(path, function (err, stats) {
                // case grew
                if (stats.size > self.lastfilesize){
                    // call grew event
                    self.callbacks['grew'](stats.size - self.lastfilesize);
                    self.lastfilesize = stats.size;
                }
                // case shrink
                if (stats.size < self.lastfilesize){
                    // call shrank event
                    self.callbacks['shrank'](self.lastfilesize - stats.size);
                    self.lastfilesize = stats.size;
                }
            }, 1000);// 1 second interval for scan filesize
        });
};

// register event handlers
FilesizeWatcher.prototype.on = function (eventType, callback) {
    this.callbacks[eventType] = callback;
};

// cancel interval to stop
FilesizeWatcher.prototype.stop = function () {
    clearInterval(this.interval);
};

module.exports = FilesizeWatcher;