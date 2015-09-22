/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Opencv - Engine using the opencv image library
 */

/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var opencv = require('opencv');

/**
 * Constructor
 * @param {stream} source - stream image
 */

function Opencv(source){


    Engine.call(this);
    
    this._source = source;

    this._engine = opencv(source);
    
}

util.inherits(Opencv, Engine);


Opencv.prototype.resizeTo = function(width, height){
    //Not implemented yet
    return this;
}


Opencv.prototype.quality = function(pourcent){
    //Not implemented yet
    return this;
}

Opencv.prototype.setFormat = function(type){
    //Not implemented yet
    return this;
}

Opencv.prototype.render = function(){
    //Not implemented yet
}

module.exports = Opencv;