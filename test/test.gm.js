var should = require("should");
var gm = require("gm");
var dir = __dirname + '/imgs';


describe('Gm', function() {

    before(function(done) {
       
            done();
    });

    after(function(done) {
       
        done();
    });

    beforeEach(function(done) {
    
         done();
        
    });

    it('Test dynamic call', function(done) {
   
        //"test".should.eql('test');
        //console.log(dir);
        //args= {};
        //args['colorize']()
          var fun = gm(dir + '/input.jpg');
          fun['colorize'].apply(fun, [80, 0, 30]);
          fun['thumbnail'].apply(fun, [150,150]);
          fun['write'](dir + '/colorize.jpg', function(err){
            if (err) return console.dir(arguments)
           // console.log(this.outname + ' created  :: ' + arguments[3])

          }
        ) ;
        //console.log("   test: ", "test");
        done();
       
    });

    afterEach(function(done) {
       
            done();
        
     });

});
