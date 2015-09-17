var Is = require('../index');
var fs = require('fs');
var path = require('path');
rootPath = path.normalize(__dirname + '/..');
imagePath = rootPath + '/test/imgs';


describe('Is', function() {

    before(function(done) {
       
            done();
    });

    after(function(done) {
       
        done();
    });

    beforeEach(function(done) {
    
         done();
        
    });

    it('is.reader with url', function(done) {
   
       var is = new Is();
       var writeStream  = fs.createWriteStream(imagePath + '/output.jpg');

       is.reader('url','http://connection.so/img/picture.jpg', 20000)
       .pipe(writeStream);

        writeStream.on('finish', function(){
            console.log('done')
            done();
        });
    });

    it('is.reader with options object', function(done) {
   
       var is = new Is();
       var writeStream  = fs.createWriteStream(imagePath + '/output-object.jpg');

       is.reader({'method':'file','args':[imagePath + '/input.jpg']})
       .pipe(writeStream);

        writeStream.on('finish', function(){
            console.log('done')
            done();
        });
    });

    it('is.reader with file', function(done) {
   
       var is = new Is();
       var writeStream  = fs.createWriteStream(imagePath + '/output.jpg');

       is.reader('file', imagePath + '/input.jpg')
       .pipe(writeStream);

        writeStream.on('finish', function(){
            console.log('done')
            done();
        });
    });


    it('is.imager with file', function(done) {
    
       
       var is = new Is();
    
       is.reader('file', imagePath + '/input.jpg')
       .pipe(is.imager())
       .pipe(is.storer('file', imagePath + '/output-imager.jpg'));

        is.on('end', function(){
            console.log('done')
            done();
        });
    });



    it('is.store with file', function(done) {
    
       
       var is = new Is();
    
       is.reader('file', imagePath + '/input.jpg')
       .pipe(is.storer('file', imagePath + '/output.jpg'));

        is.on('end', function(){
            console.log('done')
            done();
        });
    });


      it('is.store pipe', function(done) {
    
       
       var is = new Is();

       var writeStream  = fs.createWriteStream(imagePath + '/output-store-piped.jpg');

    
       is.reader('file', imagePath + '/input.jpg')
       .pipe(is.storer('file', imagePath + '/output-store.jpg'))
       .pipe(writeStream);

        is.on('end', function(){
            console.log('done')
            done();
        });
    });

    afterEach(function(done) {
       
            done();
        
    });

});