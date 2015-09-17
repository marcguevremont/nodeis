/**
 * Module dependencies.
 */

function Engine(){
    
    this._source = null;
    this._engine = {};
    this.support_webp = false;
    
}
 
/**
 * If engine do not implement a method try to call native function
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

module.exports = Engine;