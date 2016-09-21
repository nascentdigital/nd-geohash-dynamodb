'use strict';

const
    _ = require('lodash'),
    geohash = require('../index');

module.exports = function(dynamoDB) {
    return querySchools(dynamoDB);
};


function querySchools(dynamoDB) {

    // create client
    const geohashClient = new geohash.DynamoGeospatialClient({ dynamoDB: dynamoDB});

    // add some schools
    return geohashClient
        .queryAsync('Schools',
            43.878940675173695, -79.32474502978516,
            44.02723709958617, -79.05008682666016)
        .then((schools) => _.forEach(schools, (school) => console.log('found school: %s', school.name)));
}

