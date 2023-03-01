const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    // console.log('id: ', data);
    // console.log('text: ', text);

    //items[id] = text;
    var fileName = path.join(exports.dataDir, `${data}.txt`);
    // console.log('path: ', fileName);
    fs.writeFile(fileName, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, {id: data, text});
      }
    });
    //everything should go inside of this
    //fs.writeFile creates a new file path if it does not exist
    //we want to create a new file for every ID
    //in test/testData

  });
};


exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  fs.readdir(exports.dataDir, (err, files) => {
    console.log('files: ', files);
    var result = _.map(files, (file) => {
      var fp = path.join(exports.dataDir, file);
      // console.log('fp: ', fp);
      var id = path.basename(fp, '.txt');
      // console.log('id: ', id);
      return {id: id, text: id};
    });
    callback(null, result);
  });

};
exports.readOne = (id, callback) => {
  var file = id + '.txt';
  var fp = path.join(exports.dataDir, file);
  fs.readFile(fp, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: data.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  var file = id + '.txt';
  var fp = path.join(exports.dataDir, file);
  fs.readFile(fp, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(fp, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
