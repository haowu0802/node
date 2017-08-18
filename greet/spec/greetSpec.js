'use strict';

let greet = require('../src/greet');

describe('greet', function () {

    it('should greet the given name', function () {
        expect(greet('Hao')).toEqual('Hello Hao!');
    });

    it('should greet no-one specific if no name is given', function () {
        expect(greet()).toEqual('Hello World!');
    });

});