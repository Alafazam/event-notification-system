var express    = require('express');


var Item     = require('.././models/item');
var Bear     = require('.././models/bear');

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Show Api Doc here' });
});

router.route('/items')
    // create a item
    .post(function(req, res) {
        var timestamp = Date.now();
        Item.findOneAndUpdate(
          { name: req.body.name },
          { date:  timestamp},
          { new: true, upsert: true },
          function(err,item) {
            if (err)
                res.send(err);
            new_item = {name: item.name,date: item.date};
            eventEmitter.emit('dbchange',{operation:"create", value:req.body.name, timestamp:timestamp});
            res.json({ message: 'Item Updated!',item: new_item });
        });
    })
    // get all the items
    .get(function(req, res) {
        Item.find(function(err, items) {
            if (err)
                res.send(err);

            res.json(items);
        });
    });

router.route('/items/:name')
    .get(function(req, res) {
        Item.find({name: req.params.name}).
        limit(10).
        sort('-date').
        exec(function(err, item) {
            if (err)
                res.send(err);
            res.json(item);
        });
    })
    //  put for updating the item
    .put(function(req, res) {
        var timestamp = Date.now();
        Item.findOneAndUpdate(
          { name: req.params.name },
          { date: timestamp },
          { new: false, upsert: false },
          function(err, item) {
            if (err)
                res.send(err);
            if(!item)
                return res.json({ message: 'No Such Item!'});

            new_item = {name: item.name,date: item.date};
            eventEmitter.emit('dbchange',{operation:"update",value:req.params.name,timestamp:timestamp});
            res.json({ message: 'Item Updated!', item: new_item});
        });
    })
    // delete the item with this id
    .delete(function(req, res) {
        var timestamp = Date.now();
        Item.remove({
            name: req.params.name
        }, function(err, item) {
            if (err)
                res.send(err);

            eventEmitter.emit('dbchange',{operation:"delete",value:req.params.name,timestamp:timestamp});
            res.json({ message: 'Successfully deleted',item: item});
        });
    });



module.exports = router;