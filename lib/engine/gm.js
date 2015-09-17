/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var gm  = require('gm');

function Gm(source){

    Engine.call(this);
    
    this._source = source;
    
    this._engine = gm(source);
    
}

util.inherits(Gm, Engine);


Gm.prototype.resizeTo = function(width, height){
    
     if (!width || !height)  return this;
   
     this._engine.noProfile();
    
     this._engine.thumbnail(width +'>',height + '>');
    
    return this;
}

Gm.prototype.cropTo = function(width, height){
   
     if (!width || !height)  return this;
   
    this._engine.noProfile();
    this._engine.gravity('center');
    this._engine.extent(width, height + '>');
    this._engine.thumbnail(width, height + '>');
    
    return this;
}

Gm.prototype.quality = function(pourcent){
   
    this._engine.quality(pourcent);
    
    return this; 
}

Gm.prototype.setFormat = function(format){
    
    this._engine.setFormat(format);
    return this; 
} 

Gm.prototype.render = function(done){
   var self = this;
   self._engine.stream(function (err, stdout, stderr) {
       
        done(err, stdout, stderr);
    });
}



module.exports = Gm;