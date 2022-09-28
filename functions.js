var bcrypt = require('bcryptjs');
var Q = require('q');
var config = require('./mongodb-config.js');
// config file contains all tokens and other private info

// MongoDB connection information
var mongodbUrl = config.mongodbHost;
var MongoClient = require('mongodb').MongoClient;

// used in local-signup strategy
exports.localReg = function (username, password) {
    var deferred = Q.defer();
    MongoClient.connect(mongodbUrl, function (err, client) {
        if (err) console.log(err);
        var db = client.db('local');
        db.listCollections({ name: 'users' }).toArray(function (nameErr, collectionInfos) {
            console.log(collectionInfos);
            if (nameErr) console.log(nameErr);
            if (collectionInfos.length === 0) db.createCollection('users', function (createErr, res) {
                if (createErr) console.log(createErr);
                console.log("\nCollection created!");
            })
        });
        var collection = db.collection('users');
        collection.findOne({
            'username': username
        })
            .then(function (result) {
                if (null != result) {
                    console.log("USERNAME ALREADY EXISTS: " + result.username);
                    deferred.resolve(false);
                } else {
                    var hash = bcrypt.hashSync(password, 8);
                    var user = {
                        "username": username,
                        "password": hash
                    }
                    console.log("CREATING USER: " + username);
                    collection.insertOne(user)
                        .then(function () {
                            client.close();
                            deferred.resolve(user);
                        });
                }
            });
    });
    return deferred.promise;
};

// check if user exists
// if user exists check if passwords match
// use bcrypt.compareSync(password, hash)
// true where 'hash' is password in DB
// if password matches take into website
// if user doesn't exist or password doesn't match tell them it failed

exports.localAuth = function (username, password) {
    var deferred = Q.defer();
    MongoClient.connect(mongodbUrl, function (err, client) {
        if (err) console.log(err);
        var db = client.db('local');
        db.listCollections({ name: 'users' }).toArray(function (nameErr, collectionInfos) {
            console.log(collectionInfos);
            if (nameErr) console.log(nameErr);
            if (collectionInfos.length === 0) console.log('\nCollection Not Exist!');
        });
        var collection = db.collection('users');
        collection.findOne({
            'username': username
        })
            .then(function (result) {
                if (null == result) {
                    console.log("USERNAME NOT FOUND: " + username);
                    deferred.resolve(false);
                } else {
                    var hash = result.password;
                    console.log("FOUND USER: " + result.username);
                    if (bcrypt.compareSync(password, hash)) {
                        deferred.resolve(result);
                    } else {
                        console.log("AUTHENTICATION FAILED");
                        deferred.resolve(false);
                    }
                }
                client.close();
            });
    });
    return deferred.promise;
}