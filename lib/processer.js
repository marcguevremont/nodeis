/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Processer - Fetch or Upload image, render image, save  image, cache image, return image
 
 */
 
/**
 * Module dependencies.
 */

var utils       = require('./utils');
var config      = require('../etc/config');
var Imager      = require('./imager');
var Transporter = require('./transporter');
var formidable  = require('formidable');
var Pass        = require('stream').PassThrough;
/**
 * Constructor.
 *
 * @param {Objectr} req - req object from server with param with options
 * @param {Object} [res] - res object from server
 * @param {function} isdone - return function when everything is done
 */
 
function processer(req, res, isdone) {
    

   
  	var self = this;
  	
  	var query = req.query;
  	var method = req._method_;
  	self.webp  = req.webp;
  	self.req = req;
  	self.res = res;
  	
  	self.done_called = false;
  	
  	self.done = function(err, resp){
  	  
  	  if (self.done_called == false)
  	    isdone(err, resp);
  	  
  	  self.done_called = true;
  	
  	} 
  	
    self.format =  config.options.setFormat || null;
  	
  	if (self.webp)
  	  self.format = "webp";
  	  
  	self.req.format = self.format;
  	  
  	self.transporter = new Transporter({'method':method,'query':query});

    if (method == 'fetch' || (method == 'image' && req.method == "GET")){
      
      self.transporter.get(query['src'], function(err, img, from){
      
        if (!err)
        {
            if (from == 'cache'){
              
              self.render(img,{'query':query},  function(err,image){
                if (err) return self.done(err,null);
                
                self.display(image, self.done);
                
              });
            }
            else if (from == 'store'){
              // Cache the image and render
               self.render(img,{'query':query},  function(err,image){
                  if (err) return self.done(err,null);
                  
                  self.display(image, self.done);
                  
                });
                
               if (self.transporter.opts.cache)
                self.cache(img, function(err){if (err) return self.done(err)});
              
            }
            else if (from == 'url') 
            {
              if ((/\/(gif|jpg|jpeg|png)$/i).test(img.headers['content-type']))
              {
                
                if (!self.format)
                  self.format = img.headers['content-type'];
                  
                 self.render(img, {}, function(err, image){
                  if (err) return self.done(err);
                  
                  if (!query.opt)
                     self.display(image, self.done);
                  
                      
                  // Store and cache the original image
                  if (self.transporter.opts.cache)
                    self.cache(image, function(err){if (err)return self.done(err)});
                  
                  
                    
                  var save = query['save'] || config.options.save;
                  
                    
                  if (save == 1 || save == true)  
                    if (self.transporter.opts.store)
                      self.store(image, function(err){if (err)return self.done(err)});  
               
                });
      
                if (query.opt){
                  self.render(img, {'query':query}, function(err,image){
                    if (err) return self.done(err);
                    
                    self.display(image, self.done);
                    
                  });
                }
               
              }
              else 
              {
                var e = new Error('Invalid media format')
                e.status = 405;
                return self.done(e);
              }
        
            }
        }
        else
        {
          
          return self.done(err);
          
        }
      });
  
    }
    else if (method == "image" && req.method == "POST"){
      
        
         var form = new formidable.IncomingForm();
         form.parse(req);
         
         if (form.type == "multipart"){
           
           form.onPart = function(img) {
              if (img.filename) {
                  /**
                 *  We store the uploaded file in temp folder
                 *  We add temp to the file name if it is not specified to saveUpload
                 *  Used to transform image later with params. Like croping profile picture ... 
                 */ 
                 var save = req.query['save'] || config.options.saveUpload;
                 
                 if (!save)
                  req.query['src'] += ".temp";
                  
                 self.render(img, {}, function(err, image){
                    if (err) return self.done(err);
                    
                    
                    // Cache the original image
                    if (self.transporter.opts.cache)
                      self.cache(image, function(err){if (err) return self.done(err)});
                      
                    if (save)
                      if (self.transporter.opts.store)
                        self.store(image, function(err){if (err) return self.done(err)});
                    
                    self.done(null, image);
                    
                });
      
              }
           }
         }
         else if (form.type == null){
            //Get the temp image apply transformation and save
            self.transporter.get(query['src'], function(err, img, from){
              
                if (err) return self.done(err);
                  req.query['src'] = req.query['src'].replace('.temp','');
                
                 self.render(img, {'query':query}, function(err, image){
                   if (err){ return self.done(err)}
                   
                    // Cache the original image
                    if (self.transporter.opts.cache)
                      self.cache(image, self.done);
                      
                   
                    if (self.transporter.opts.store)
                      self.store(image, function(err){if (err)return self.done(err)});
                 });
            });
           
         }
         
         console.log(form.type);
         
        
      
    }
      
}

/**
 * Render
 *
 * @param {stream} source - image to render
 * @param {Object} options - options for transformation
 * @param {function} done - return function when everything is done
 */

processer.prototype.render = function(source, options, done){
  var self = this;
  
  var params = {"query":options.query};
    
   
  var p = new Pass();
  source.pipe(p);
  
  new Imager(params).render(p, function(err, image){
    if (err) 
    {
       done(err);
        return;
    }
        
    done(null, image);
       
  });
}

/**
 * Store the image
 * @param {stream} img - image to store
 * @param {function} done - return function when is done
 */

processer.prototype.store = function(img, done){
   var self = this;
   
   var p = new Pass();
   img.pipe(p);
   
   self.transporter.store.set(utils.getFilenameBySrc(self.req.query['src'], self.format), p, function(err){
        if (err)  
          return done(err);
        
        done(null);               
  });
}

/**
 * Cache the image
 * @param {stream} img - image to cache
 * @param {function} done - return function when is done
 */

processer.prototype.cache = function(img, done){
  var self = this;

  var p = new Pass();
  img.pipe(p);
  
  self.transporter.cache.set(utils.getFilenameBySrc(self.req.query['src'], self.format),p , function(err, cache_file){
         if (err)  
          return done(err);
      
        done(null);
  });
}

/**
 * Display the image
 * @param {stream} img - image to store
 * @param {function} done - return function when is done
 */
processer.prototype.display = function(img, done){
  var self = this;
  // Call webp if browser accept it && is enabled in config
  if (self.webp)
  {
    var p = new Pass();
    img.pipe(p);
    
    new Imager({}).webp(p, function(err, webp_){
      
      if (err){ done(err); return}
    
      done(null, webp_);
    
    });
  }
  else {
    
    done(null, img);
  }

}



	

module.exports = processer;


