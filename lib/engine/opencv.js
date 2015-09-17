/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var opencv = require('opencv');



function Opencv(source){


    var self = this;

    Engine.call(this);
    
    self._source = source;
    
    self._engine = {};/*gm(source);*/
    
    this._engine = opencv(source);
    
}

util.inherits(Opencv, Engine);


Opencv.prototype.render = function(){}

module.exports = Opencv;