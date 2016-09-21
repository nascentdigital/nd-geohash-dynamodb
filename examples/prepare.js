// imports
const
    _ = require('lodash'),
    Promise = require('bluebird');


// exports
module.exports = function (dynamoDB) {

    return deleteTables(dynamoDB)
        .then(() => createTables(dynamoDB));
};


// helper methods
function deleteTables(dynamoDB) {

    // query database
    return dynamoDB.listTablesAsync()
        .then((result) => {

            // iterate through table names
            let promise = null;
            _.forEach(result.TableNames, (tableName) => {

                // skip if table name isn't recognized
                if (tableName != 'Schools') {
                    return;
                }

                // delete table
                promise = (promise || Promise.bind(this))
                    .then(() => dynamoDB.deleteTableAsync({TableName: tableName}))
                    .then(() => console.log('deleted table: %s', tableName));
            });

            // return promise (if any)
            return promise;
        });
}

function createTables(dynamoDB) {

    return dynamoDB
        .createTableAsync({
            TableName: 'Schools',
            KeySchema: [
                {AttributeName: "hash", KeyType: "HASH"},
                {AttributeName: "id", KeyType: "RANGE"}
            ],
            AttributeDefinitions: [
                {AttributeName: "hash", AttributeType: "S"},
                {AttributeName: "id", AttributeType: "S"},
                {AttributeName: "geohash", AttributeType: "S"}
            ],
            LocalSecondaryIndexes: [
                {
                    IndexName: 'index.geohash',
                    KeySchema: [
                        {AttributeName: "hash", KeyType: "HASH"},
                        {AttributeName: "geohash", KeyType: "RANGE"}
                    ],
                    Projection: {
                        ProjectionType: 'ALL'
                    }
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 1
            }
        })
        .then(() => console.log('created table: Schools'));
}