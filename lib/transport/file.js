/**
 * Module dependencies.
 */

var utils = require('../utils');
var fs  = require('fs');

var default_options = {
    "dir"  : "/tmp/is", 
    "subdir" : {
        "enable" : true,
        "name" : function(src){return utils.crc32(src).substring(0, 2);}
    }
}


function File(options){

    var self = this;
    
     if (options)
        self.opts = utils.merge(default_options, options);
    else
        self.opts = default_options;
        
     fs.mkdir(self.opts.dir, function(e){
         if (!e || (e && e.code === 'EEXIST'))
         ;
         else
            console.log(e);
     });
    
}


/**
* Return read stream
*/
File.prototype.get = function(filename, done){
    var self = this;
    var dir = self.opts.dir;
    
    if (self.opts.subdir.enable){
      var subdir =  self.opts.subdir.name(filename);
      dir = dir +'/'+subdir;
    }
    try {
    
        var file = fs.createReadStream(dir + "/" + filename);
    
        file.on('open', function(){
            done(null, file)
        });
    
        file.on('error', function(err){
            done(err,null)
        });
    }
    catch(e){
        done(e);
    }
    
    return self;
 
};

/**
* Return write stream
*/ 
File.prototype.set = function(filename, stream, done){
    var self = this;
    var dir = self.opts.dir;
    
    if (self.opts.subdir.enable){
        
        var subdir =  self.opts.subdir.name(filename);
        dir = dir +'/'+ subdir;
        
        try {
            
          fs.mkdir(dir, function(e){
            if (!e || (e && e.code === 'EEXIST')){
                    //folder created or exist
                    var file = fs.createWriteStream(dir + "/" +filename);
                    
                    stream.pipe(file);
                    
                    file.on('open', function(){
                        done(null)
                    });
                
                    file.on('error', function(err){
                        done(err)
                    });
                            
            } else {
                //debug
                done(e)
            }
          });
        }
        catch(e){
            done(e);
        }
        
    }  
     
    return self;
};

/**
* Async delete file
*/ 

File.prototype.delete = function(filename, done){
    var self = this;
    var dir = self.opts.dir;
    
    if (self.opts.subdir.enable){
      var subdir =  self.opts.subdir.name(filename);
      dir = dir +'/'+subdir;
    }
    
    fs.unlink(dir + "/" + filename, function (err) {
        done(err,null)
    });

    return self;
};


module.exports = File;