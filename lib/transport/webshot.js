/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 *
 *
 *  Take a snapshot from url
 * 
 */
var utils = require('../utils');
var phantom = require('phantom-render-stream')();


var default_options = {
    pool        : 5,
    format      : 'jpg', 
    quality     : 85, 
    viewport    : 'lg',
    width       : 1080, //320x480, 800x600, 1080x768, 1920x1080
    height      : 768,
    phantomFlags: ['--ignore-ssl-errors=true']
}
/**
 * Constructor.
 *
 */
 
function Webshot(options){
    
     var self = this;
     
    if (options)
        self.opts = utils.merge(default_options, options);
    else
        self.opts = default_options;
        
  
    switch (self.opts.viewport){
        case 'sm':
             self.opts.width  = self.opts.webshot.viewport.sm.width;
             self.opts.height = self.opts.webshot.viewport.sm.height;
             console.log()
             break;
        case 'md' :
            self.opts.width  = self.opts.webshot.viewport.md.width;
            self.opts.height = self.opts.webshot.viewport.md.height;
            break;
        default :
            self.opts.width  = self.opts.webshot.viewport.lg.width;
            self.opts.height = self.opts.webshot.viewport.lg.height;
    }
        
}

/**
* Return read stream
* @param {string} empty 
* @param {function} done 
*/
Webshot.prototype.get = function(url, done){
    var self = this;
 
   try {
       
      // webshot('google.com', 'google.png', function(err) {
          // screenshot now saved to google.png
      //      console.log("Responded:"+err)
     //    });
       
       
        var file =  phantom(url, {
            pool        : self.opts.pool,
            format      : self.opts.setFormat, 
            quality     : self.opts.quality, 
            width       : self.opts.width, 
            height      : self.opts.height,
            phantomFlags: self.opts.phantomFlags
        });
       
       
        file.once('readable', function(res){
             done(null, file);
        });
        
        file.on('error', function(err){
            done(err, null)
        });
       
    }
    catch(e){
        done(e);
    }
        
    
};

/**
* Return write stream
* @param {string} empty 
* @param {stream} emptyStream 
* @param {function} done - return function when everything is done
*/ 
Webshot.prototype.set = function(empty, emptyStream, done){
    done('Not implemented', null);
};

/**
* Delete
* @param {string} empty 
* @param {function} done - return function when everything is done
*/ 
Webshot.prototype.delete = function(empty, done){
   done('Not implemented', null);
};


module.exports = Webshot;