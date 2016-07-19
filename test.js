var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var mongoDB_url = 'mongodb://localhost:27017/social_cops';

// Use connect method to connect to the server
MongoClient.connect(mongoDB_url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected succesfully to server");

// add
	db.collection('inserts').insertOne({a:1}, function(err, r) {
	    assert.equal(null, err);
	    assert.equal(1, r.insertedCount);
	    console.log("Inserted");
	});


	var col = db.collection('inserts');

// find
	col.find().limit(2).toArray(function(err, docs) {
      assert.equal(null, err);
      // assert.equal(2, docs.length);
      console.log(docs);
  });

// delete
  col.deleteOne({a:1}, function(err, r) {
    assert.equal(null, err);
    assert.equal(1, r.deletedCount);
    console.log(r);
  });
	col.find().limit(2).toArray(function(err, docs) {cz
      assert.equal(null, err);
      // assert.equal(2, docs.length);
      console.log(docs);
  });

// // delte many
// 	col.deleteMany({a:1}, function(err, r) {
//     assert.equal(null, err);
//     assert.equal(2, r.deletedCount);
//   });


  db.close();
});
