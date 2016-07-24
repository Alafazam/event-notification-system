# demo

A notification system to notify subscribers of changes made in a mongodb database in real-time.


### Why did, I did what I did.
I was a was a bit confused between two approaches, 1. using plain HTTP requests only (for notifications: pinging ```/notifications``` every 2-3 seconds + for subscription: using HTTP verbs for subscribing and subscribing to items) and 2. Using socketIO (for notifications: emitting ```'notifications'``` from server side on each change + for subscription: emitting subscribe/unsubscribe to events).
In 1st approach, notifications part was not good and in 2nd approach subscription part. So I went into crazy mode and combined both of these.
Now for notifications, I have used Socket.IO + node.js-EventEmmiters to notify user (based on their subscriptions) about db changes in real time.
For subscriptions, I have made a REST-full api that front end calls for subscribing/unsubscribing.

I have also made another API for making changes to database. So on one end we can send request to database for adding,updating and deleting item. And on other end some client connected to ```/getting_started``` will receive notifications about these. Sure these two could have been separate, but connecting these two solved the SocketIO-vs-HTTP-only confusion like a boss.

I have used [materialize.css](materializecss.com) for front end because my front end skills are no match for that beautiful library.


### API Usage
 ```/api/items```\
**GET**\
Get all items in database.\
**POST** \
`key`: `name`\
`value`:- `nameforItem` eg G.O.T\
Creates a new Item in database.\

```api/items/:name```\
**GET**\
Get item with `name` in database.\
**PUT** \
Update the Item  with  `name` in database. Here we are just updating its last modified time. Can be exteded to update properties.\
**DELETE**\
Get item with `name` in database.

### Now for actual usage
Just go to ```/getting_statred```, select what you want to subscribe to and wait for changes to occur in db.
List of Items to subscribe to is genrated automatically from db. So to addother item there one must create the item in db.\
#### Endpoints
```/subscribe```\
**GET**\
Get all subscription items.\
**POST** \
Subscribe to somthing.\

```/subscribe/:item_id```\
item_id is Item name\
**GET**\
Tell if your are subscribed to item with `item_id` in database.\
**PUT** \
subscribe to item with `item_id` in database.\
**DELETE**\
unsubscribe to item with `item_id` in database.\

```/subscribe_all```\
**GET**\
subscribe to all items \
**DELETE**\
unsubscribe from all items \

