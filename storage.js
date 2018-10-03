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
                db.collection("messages").insertOne(message, (err, result) => {
                    if(err != null) {
                        reject(err);
                        return;
                    }
                    resolve(result.insertedId);
                });
            }); 
        });
    }
    
    updateMessage(message, callback) {
        this.connect((err, db) => {
            if(err != null) {
                callback(err);
                return;
            }
            db.collection("messages").updateOne({_id: message.id}, message, (err, result) => {
                if(err != null) {
                    callback(err);
                    return;
                }
                callback(null, message);
            })
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
                    resolve(result);
                });
            });
        });
    }

    getMessage(id) {

    }

    deleteMessage(id, callback) {
        this.connect((err, db) => {
            if(err != null) {
                callback(err);
                return;
            }
            db.collection("messages").deleteOne({_id: id}, (err, result) => {
                if(err != null) {
                    callback(err);
                    return;
                }
                callback(null, id);
            })
        });
    }
}

module.exports = {
    "Storage": Storage
};
