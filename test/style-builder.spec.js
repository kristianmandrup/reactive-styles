/*
 * style-builder
 * https://github.com/kristianmandrup/style-builder
 *
 * Copyright (c) 2016, Kristian Mandrup
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.should();

var style-builder = require('../lib/style-builder.js');

describe('style-builder module', function() {
    describe('#awesome()', function() {
        it('should return a hello', function() {
            expect(style-builder.awesome('livia')).to.equal('hello livia');
        });
    });
});
