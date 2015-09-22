/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 *
 *
 *  Dummy - Empty transport
 * 
 */

/**
 * Constructor.
 *
 */
 
function Dummy(){}

/**
* Return read stream
* @param {string} empty 
* @param {function} done 
*/
Dummy.prototype.get = function(empty, done){
    done('dummy transport', null);
};

/**
* Return write stream
* @param {string} empty 
* @param {stream} emptyStream 
* @param {function} done - return function when everything is done
*/ 
Dummy.prototype.set = function(empty, emptyStream, done){
    done('dummy transport', null);
};

/**
* Delete
* @param {string} empty 
* @param {function} done - return function when everything is done
*/ 
Dummy.prototype.delete = function(empty, done){
   done('dummy transport', null);
};


module.exports = Dummy;