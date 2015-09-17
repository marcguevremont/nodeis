/**
 * Module dependencies.
 */



function Dummy(){}

/**
* Return read stream
*/


Dummy.prototype.get = function(empty, done){
    done('dummy transport', null);
};

/**
* Return write stream
*/ 

Dummy.prototype.set = function(empty, done){
    done('dummy transport', null);
};

/**
* Async delete file
*/ 

Dummy.prototype.delete = function(empty, done){
   done('dummy transport', null);
};


module.exports = Dummy;