'use strict';


// imports
const
    _ = require('lodash'),
    Promise = require('bluebird'),
    AWS = require('aws-sdk'),
    Geohash = require('nd-geohash-core');


// class definition
class DynamoGeospatialClient {

    constructor({ dynamoDB, hashKey = 'hash', geohashKey = 'geohash', geohashIndex = 'index.geohash',
        locationKey = 'location', hashKeyLength = 6 }) {

        // initialize instance variables
        this.geohashService = new Geohash({ hashKeyLength: hashKeyLength });
        this.dbClient = new AWS.DynamoDB.DocumentClient({ service: dynamoDB});
        this.hashKey = hashKey;
        this.geohashKey = geohashKey;
        this.geohashIndex = geohashIndex;
        this.locationKey = locationKey;

        // add async method to db client
        this.dbClient.putAsync = Promise.promisify(this.dbClient.put, { context: this.dbClient });
        this.dbClient.queryAsync = Promise.promisify(this.dbClient.query, { context: this.dbClient });
    }

    putAsync(tableName, item, lat, lng) {

        // TODO: validate location

        // generate hash values
        const hash = this.geohashService.getHash(lat, lng);
        const hashKey = this.geohashService.getHashKey(hash);

        // update item
        item[this.hashKey] = hashKey;
        item[this.geohashKey] = hash;
        item[this.locationKey] = {
            lat: lat,
            lng: lng
        };

        // persist item
        return this.dbClient.putAsync({
            TableName: tableName,
            Item: item
        });
    }

    queryAsync(tableName, south, west, north, east) {
        console.log('querying');
        console.log('   table:  %s', tableName);
        console.log('   bounds: (%d, %d, %d, %d)', south, west, north, east);

        // get hash ranges
        const hashRanges = this.geohashService.getHashRanges(south, west, north, east);

        return Promise
            .map(hashRanges, (hashRange) => queryHashRange(this, tableName, hashRange), { concurrency: 3 })
            .then((itemsArrays) => _.flatten(itemsArrays));
        // // create query promises
        // const queries = _.map(hashRanges, (hashRange) => {
        //     return queryHashRange(this, tableName, hashRange);
        // });
        //
        // // stitch together all results
        // return Promise
        //     .all(queries)
        //     .then((itemsArrays) => _.flatten(itemsArrays));
    }
}

// helper methods
function queryHashRange(geospatialClient, tableName, hashRange, continuationKey) {

    // create base query
    const query = {
        TableName: tableName,
        IndexName: geospatialClient.geohashIndex,
        KeyConditionExpression: '#hashKey = :hash AND #geohashKey BETWEEN :min AND :max',
        ExpressionAttributeNames: {
            '#hashKey': geospatialClient.hashKey,
            '#geohashKey': geospatialClient.geohashKey
        },
        ExpressionAttributeValues: {
            ':hash': hashRange.hashKey,
            ':min': hashRange.min,
            ':max': hashRange.max
        }
    };

    // add continuation (if available)
    if (continuationKey) {
        query.ExclusiveStartKey = continuationKey;
    }

    // execute query
    return geospatialClient.dbClient
        .queryAsync(query)
        .then((data) => data.Items || []);
}


// exports
module.exports = DynamoGeospatialClient;