'use strict';


// imports
const
    _ = require('lodash'),
    Geohash = require('nd-geohash-core');


// class definition
class DynamoGeospatialClient {

    constructor({ dynamoDB, hashKey = 'hash', rangeKey = 'id', geohashKey = 'geohash', positionKey = 'position',
        hashKeyLength = 10 }) {

        // initialize instance variables
        this.geohashService = new Geohash({ hashKeyLength: hashKeyLength });
        this.dynamoDB = dynamoDB;
        this.hashKey = hashKey;
        this.rangeKey = rangeKey;
        this.geohashKey = geohashKey;
        this.positionKey = positionKey;
    }


    putItem(tableName, item, lat, lng) {

        // TODO: validate location

        // hash location
        const hash = this.geohashService.getHash(lat, lng);
        const hashKey = this.geohashService.getHashKey(hash);

        console.log('created geo hash: %s, %s', hash, hashKey);
    }
}


// exports
module.exports = DynamoGeospatialClient;