'use strict';

const
    AWS = require('aws-sdk'),
    geohash = require('../index');


const geohashClient = new geohash.DynamoGeospatialClient({
    dynamoDB: new AWS.DynamoDB({
        endpoint: new AWS.Endpoint('http://192.168.100.10:8000'),
        region: 'us-east-1'
    })
});

const school = {
    name: 'St. Richards',
    type: 'catholic',
    address: '960 Bellamy Rd N, Scarborough, ON M1H 1H1'
};
geohashClient.putItem('Schools', school, 43.7681320, -79.2394290);