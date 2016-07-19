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
        var item = new Item();
        item.title = req.body.title;
        item.body = req.body.body;
        item.tags = req.body.tags.split(',');

        // save the item and check for errors
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Item created!' });
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

router.route('/items/:item_id')
    .get(function(req, res) {

        Item.findById(req.params.item_id).
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

        Item.findById(req.params.item_id).
        limit(10).
        sort('-date').
        exec(function(err, item) {

            if (err)
                res.send(err);

            item.name = req.body.name;

            // save the item
            item.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Item updated!' });
            });
          });
    })
    // delete the item with this id
    .delete(function(req, res) {
        Item.remove({
            _id: req.params.item_name
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });





module.exports = router;