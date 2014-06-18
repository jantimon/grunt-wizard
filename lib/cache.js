var path = require('path');
var fs = require('fs');
var Cache = require('cache-storage');
var FileStorage = require('cache-storage/Storage/FileSyncStorage');

/**
 * Creates the temp directory
 * @returns string
 */
function createTempDirectory() {
  var tempFilePath = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(tempFilePath)) {
    fs.mkdirSync(tempFilePath, 0766, function (err) {
      if (err) {
        throw ("Can't create temp directory " + tempFilePath);
      }
    });
  }
  return tempFilePath;
}

// Export the cache-storage
// @see https://www.npmjs.org/package/cache-storage
module.exports = function(){
  return new Cache(new FileStorage(createTempDirectory()), 'grunt-wizard');
};