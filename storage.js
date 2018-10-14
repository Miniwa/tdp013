var mongo = require("mongodb");

class Storage {
    constructor(host, port, dbName) {
        this.host = host;
        this.port = port;
        this.dbName = dbName;
    }

    connect() {
        let dbName = this.dbName;
        return new Promise((resolve, reject) => {
            var url = "mongodb://" + this.host + ":" + this.port;
            var mongoClient = new mongo.MongoClient(url);
            mongoClient.connect(function(err, client) {
                if(err != null) {
                    reject(err);
                    return;
                }
                resolve(client.db(dbName));
            });
        });
    }

    createMessage(message) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let formatted = {
                    "message": message.message,
                    "created": Date.now(),
                    "flag": true,
                };
                db.collection("messages").insertOne(formatted, (err, result) => {
                    if(err != null) {
                        reject(err);
                        return;
                    }
                    resolve(result.insertedId.toString());
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    setMessageRead(id) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection("messages").updateOne({"_id": mongo.ObjectId(id)}, {$set: {"flag": false}}, (err, result) => {
                    if(err != null) {
                        reject(err);
                        return;
                    }
                    if(result.modifiedCount != 1) {
                        reject(new Error("Non-existant message id."));
                    }
                    resolve();
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    getMessages() {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection("messages").find({}).toArray((err, result) => {
                    if(err != null) {
                        reject(err);
                        return;
                    }
                    let sorted = result.sort((a, b) => {
                        if(a.created > b.created) {
                            return -1;
                        } else if(a.created === b.created) {
                            return 0;
                        } else {
                            return 1;
                        }
                    });
                    resolve(sorted);
                });
            });
        });
    }
}

module.exports = {Storage};
