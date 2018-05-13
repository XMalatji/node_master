const fs = require('fs');
const path = require('path');





var lib = {

};

// base dir 

lib.baseDir = path.join(__dirname, '/../.data/')

  
// Write data to a file
lib.create = function(dir,file,data,callback){
  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData,function(err){
        if(!err){
          fs.close(fileDescriptor,function(err){
            if(!err){
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  })
}

// Delete a file
lib.delete = function(dir,file,callback){

  // Unlink the file from the filesystem
  fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
    if(!err){
      callback('false')
    }
    callback(err);
  });

};



lib.read = function(dir, file, callback){
  fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', function(err,data){
    callback(err,data)
  })
}

lib.update = function(dir,file,data,callback){
  // open file for writing

  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', function(err,fileDescriptor){
    if(!err && fileDescriptor){
      var stringPayload = JSON.stringify(data);

      //trunc file
      fs.truncate(fileDescriptor, function(err){
        if(!err){
            fs.writeFile(fileDescriptor,stringPayload, function(err){
              if(!err){
                //dclose flie
                fs.close(fileDescriptor, function(err){
                  if(!err){
                    callback(false)
                  }
                  else{
                    callback('error closing file')
                  }
                })
                 
              }
              else{
                callback('error updating to file')
              }
            })
        }
        else{
          callback('Error truncating')
        }
      })
    }
    else{
      console.log(fileDescriptor,'file dont exist')
    }
  })
}
module.exports = lib;
