'use strict';

// imports
const
    AWS = require('aws-sdk'),
    Promise = require('bluebird'),
    geohash = require('../index'),
    prepareExample = require('./prepare'),
    putExample = require('./put'),
    queryExample = require('./query');


// initialize dynamodb
const dynamoDB = new AWS.DynamoDB({
    endpoint: new AWS.Endpoint('http://10.210.210.10:8000'),
    region: 'us-east-1'
});
dynamoDB.listTablesAsync = Promise.promisify(dynamoDB.listTables, { context: dynamoDB });
dynamoDB.createTableAsync = Promise.promisify(dynamoDB.createTable, { context: dynamoDB });
dynamoDB.deleteTableAsync = Promise.promisify(dynamoDB.deleteTable, { context: dynamoDB });

// FIXME: simulate cache for now
const geohashCache = {
    hashHints: new Map(),
    getHashHints: function(tableName) {
        return geohashCache.hashHints.get(tableName);
    },
    setHashHints: function(tableName, hints) {
        geohashCache.hashHints.set(tableName, hints);
    }
};

// create client
const geohashClient = new geohash.DynamoGeospatialClient({
    dynamoDB: dynamoDB,
    cache: geohashCache
});

// run scenarios
prepareExample(dynamoDB, geohashClient)
    .then(() => putExample(dynamoDB, geohashClient))
    .then(() => queryExample(dynamoDB, geohashClient))
    .then(() => console.log('completed running examples'))
    .catch((error) => console.error('error running example: %s', error.message))
    .finally(() => process.exit());