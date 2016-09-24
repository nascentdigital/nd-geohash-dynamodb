'use strict';


// imports
const
    _ = require('lodash'),
    Promise = require('bluebird'),
    AWS = require('aws-sdk'),
    Geohash = require('nd-geohash-core');


// constants
const CACHE_TABLE_SUFFIX = 'Cache';

// class definition
class DynamoGeospatialClient {

    constructor({ dynamoDB, cache, cacheTableName = 'nd-geohash_HashKeyCache',
        hashKey = 'hash', geohashKey = 'geohash', geohashIndex = 'index.geohash', locationKey = 'location',
        hashKeyLength = 6}) {

        // initialize instance variables
        this.geohashService = new Geohash({ hashKeyLength: hashKeyLength });
        this.dbClient = new AWS.DynamoDB.DocumentClient({ service: dynamoDB});
        this.cache = cache;
        this.cacheTableName = cacheTableName;
        this.hashKey = hashKey;
        this.geohashKey = geohashKey;
        this.geohashIndex = geohashIndex;
        this.locationKey = locationKey;

        // promisify as required
        this.dbClient.putAsync = Promise.promisify(this.dbClient.put, { context: this.dbClient });
        this.dbClient.queryAsync = Promise.promisify(this.dbClient.query, { context: this.dbClient });
        this.dbClient.updateAsync = Promise.promisify(this.dbClient.update, { context: this.dbClient });
    }

    static createCacheTableAsync(dynamoDB, cacheTableName = 'nd-geohash_HashKeyCache') {

        // promisify as required
        if (_.isUndefined(dynamoDB.createTableAsync)) {
            dynamoDB.createTableAsync = Promise.promisify(dynamoDB.createTable, { context: dynamoDB });
        }

        // create table
        return dynamoDB.createTableAsync({
            TableName: cacheTableName,
            KeySchema: [
                {AttributeName: 'tableName', KeyType: 'HASH'},
                {AttributeName: 'hash', KeyType: 'RANGE'}
            ],
            AttributeDefinitions: [
                {AttributeName: 'tableName', AttributeType: 'S'},
                {AttributeName: 'hash', AttributeType: 'S'}
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        });
    }

    getHash(lat, lng) {
        this.geohashService.getHash(lat, lng);
    }

    getHashKey(lat, lng) {
        const hash = this.geohashService.getHash(lat, lng);
        return this.geohashService.getHashKey(hash);
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
        let promise = this.dbClient
            .putAsync({
                TableName: tableName,
                Item: item
            });

        // add cache update if there is one
        if (this.cache) {

            promise = this.dbClient
                .updateAsync({
                    TableName: this.cacheTableName,
                    Key: {
                        tableName: tableName,
                        hash: hashKey
                    },
                    UpdateExpression: 'ADD itemCount :i',
                    ExpressionAttributeValues: {
                        ":i": 1
                    },
                    ReturnValues: 'ALL_NEW'
                })
                .tap(() => {
                    const hints = this.cache.getHashHints(tableName) || new Set();
                    hints.add(hashKey);
                    this.cache.setHashHints(tableName, hints);
                });
        }

        // return final promise
        return promise;
    }

    queryAsync(tableName, south, west, north, east) {

        // start query by trying to fetch hash hints
        return fetchHashHints(this, tableName)

            // start queries (throttled)
            .then((hashHints) => {
                const hashRanges = this.geohashService.getHashRanges(south, west, north, east, hashHints);
                console.log('querying %s with %d range values', tableName, hashRanges.length);
                return Promise.map(hashRanges, (hashRange) => queryHashRange(this, tableName, hashRange),
                    { concurrency: 3 });
            })

            // process query results
            .then((itemsArrays) => {

                // flatten items
                const items = _.flatten(itemsArrays);

                // filter items
                const filteredItems = this.geohashService.filterItems(items, this.locationKey, south, west, north, east);
                return filteredItems;
            });
    }
}

// helper methods
function fetchHashHints(geospatialClient, tableName) {

    // bail out immediately if there is no registered cache
    if (!geospatialClient.cache) {
        return Promise.resolve(null);
    }

    // return hints if already loaded
    let hashHints = geospatialClient.cache.getHashHints(tableName);
    if (hashHints) {
        return Promise.resolve(hashHints);
    }

    // load hints if there is no set yet
    return geospatialClient.dbClient
        .queryAsync({
            TableName: geospatialClient.cacheTableName,
            KeyConditionExpression: 'tableName = :t',
            ExpressionAttributeValues: {
                ':t': tableName
            }
        })
        .then((result) => {

            // extract keys into hints set
            const hashKeys = _.map(result.Items, (item) => item[geospatialClient.hashKey]);
            const hints = new Set(hashKeys);

            // persist hints into cache
            geospatialClient.cache.setHashHints(tableName, hints);

            // return hints
            return hints;
        });
}
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