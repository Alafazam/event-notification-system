var express    = require('express');
var _ = require('lodash');
var router = express.Router();

var Item     = require('.././models/item');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/getting_started', function(req, res) {
    var subscribtions = [];
    if (typeof req.session.subscribtion !== 'undefined'){
        subscribtions = req.session.subscribtion;
        eventEmitter.emit('restore subscribtion',  {items: req.session.subscribtion});
    }


    Item.find(function(err, items) {
        if (err)
            res.send(err);

        var items_names = items.map(function(item) {return item.name});
        var chunked = _.chunk(items_names, 2);
        var left_block = chunked[0];
        var right_block = chunked[1];

        // console.log(left_block, right_block);

        res.render('watch',{left_block: left_block, right_block: right_block, subscribtions: subscribtions });
    });
});

router.get('/notifications', function(req, res) {
    if (typeof req.session.lastAccess !== 'undefined')
        cutoff = req.session.lastAccess;
    req.session.lastAccess = Date.now();

    if (typeof req.session.subscribtion === 'undefined') {
        return res.end('You are not subscribed to anything');
    } else {
        // console.log(req.session.subscribtion);
        // return res.end('Subscribed for ' + req.session.subscribtion);
        // return res.json({ message: req.session.__lastAccess });
        Item.find({date: {$gt: cutoff}, name: { $in: req.session.subscribtion} }).
        limit(10).
        sort('-date').
        exec(function(err, items) {
            if (err)
                res.send(err);
            return res.json({ items: items });
        });
    }
});

router.route('/subscribe')
    // create a new subscribtion
    .post(function(req, res) {
        subscribtion = req.body.title;
        if (typeof req.session.subscribtion === 'undefined') {
            req.session.subscribtion = [subscribtion];
            eventEmitter.emit('subscribtion added',  {item: subscribtion});
            return res.json({ message: 'Subscribtion added for ' + req.session.subscribtion });
        } else {
            if (req.session.subscribtion.indexOf(subscribtion) > -1)
                return res.json({ message: 'Already subscribed to ' + subscribtion });

            req.session.subscribtion.push(subscribtion);
            console.log(req.session.subscribtion);
            return res.json({ message: 'Subscribtion added for ' + req.session.subscribtion });
        }
    })
    // get all the items
    .get(function(req, res) {
        if (typeof req.session.subscribtion === 'undefined') {
            return res.json({ message: 'You are not subscribed to anything' });
        } else {
            return res.json({subscribtions : req.session.subscribtion });
        }
    });

router.route('/subscribe/:item_id')
    .get(function(req, res) {
        if (typeof req.session.subscribtion === 'undefined') {
            return res.json({ message: 'You are not subscribed to anything' });
        } else {
            if (req.session.subscribtion.indexOf(req.params.item_id) > -1)
                return res.json({ status: true });
            else
                return res.json({ status: false });
        }
    })
    .put(function(req, res) {
        subscribtion = req.params.item_id;
        if (typeof req.session.subscribtion === 'undefined') {
            req.session.subscribtion = [subscribtion];
            eventEmitter.emit('subscribtion added',  {item: subscribtion});
            return res.json({ message: 'Subscribtion added for ' + req.params.item_id });

        } else {
            if (req.session.subscribtion.indexOf(req.params.item_id) == -1){
                req.session.subscribtion.push(subscribtion);
                console.log(req.session.subscribtion);
                eventEmitter.emit('subscribtion added',  {item: subscribtion});
                return res.json({ message: 'Subscribtion added for ' + req.params.item_id });
            } else {
                return res.json({ message: 'Already Subscribed to ' + req.params.item_id });
            }
        }
    })
    .delete(function(req, res) {
        subscribtion = req.params.item_id;
        if (typeof req.session.subscribtion === 'undefined') {
            return res.json({ message: 'You are not subscribed to anything' });
        } else {
            var index = req.session.subscribtion.indexOf(req.params.item_id);
            if (index == -1){
                return res.json({ message: 'Not Subscribed to ' + req.params.item_id });
            } else {
                // remove all occurances of this item_id
                _.pull(req.session.subscribtion,req.params.item_id);
                eventEmitter.emit('subscribtion removed',  {item: req.params.item_id});
                res.json({ message: 'Successfully deleted subscribtion for ' + req.params.item_id});
            }
        }

    });


router.route('/subscribe_all')
    .get(function(req, res) {
        Item.find(function(err, items) {
            if (err)
                res.send(err);
            var all_items = items.map(function(item) {return item.name});
            req.session.subscribtion = all_items;
            eventEmitter.emit('subscribe all',  {items: all_items});
            return res.json({ message: 'Subscribed all' });
        });
    })
    .delete(function(req, res) {
        if (typeof req.session.subscribtion !== 'undefined') {
            delete req.session.subscribtion;
        };
        eventEmitter.emit('unsubscribe all');
        return res.json({ message: 'Unsubscribed all' });
    });


module.exports = router;