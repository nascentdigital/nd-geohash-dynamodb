'use strict';

// imports
const
    AWS = require('aws-sdk'),
    Promise = require('bluebird'),
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


// run scenarios
prepareExample(dynamoDB)
    .then(() => putExample(dynamoDB))
    .then(() => queryExample(dynamoDB))
    .then(() => console.log('completed running examples'))
    .catch((error) => console.error('error running example: %s', error.message))
    .finally(() => process.exit());