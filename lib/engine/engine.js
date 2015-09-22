/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Engine - Super constructor. Engine should extend this 
 */



/**
 * Constructor
 */
function Engine(){
    
    this._source = null;
    this._engine = {};
    this.support_webp = false;
    
}
 
/**
 * If engine do not implement a method try to call native function from the library
 */ 
Engine.prototype.__callNative__ = function(method, args){
    if (this._engine[method])  {
        
         for (var a in  args){
           
            if (!isNaN(args[a]))
                 args[a] = parseInt(args[a])
         }
         
         this._engine[method].apply(this._engine,args);
    }
        
    
    return this;
}

/**
 * Engine should implement these functions
 */ 
 
Engine.prototype.render = function(){}

Engine.prototype.resizeTo = function(width, height){}

Engine.prototype.quality = function(pourcent){}

Engine.prototype.setFormat = function(type){}

module.exports = Engine;