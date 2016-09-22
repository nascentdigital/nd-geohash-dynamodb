'use strict';

const
    _ = require('lodash'),
    geohash = require('../index'),
    schools = require('./schools');

module.exports = function(dynamoDB) {
    return querySchools(dynamoDB);
};


function querySchools(dynamoDB) {

    // FIXME: simulate cache for now
    const geohashCache = new Set();

    // create client
    const geohashClient = new geohash.DynamoGeospatialClient({
        dynamoDB: dynamoDB,
        cache: geohashCache
    });

    // populate cache
    _.forEach(schools, (school) => {
        geohashCache.add(geohashClient.getHashKey(school.Location.lat, school.Location.lng));
    });
    console.log('cache size: ' + geohashCache.size);

    // add some schools
    return geohashClient
        .queryAsync('Schools',
            43.60311967129431, -79.72756247167979,
            43.752101797181005, -79.45290426855479)
        .then((schools) => {
            console.log('found %d schools', schools.length);
            _.forEach(schools, (school) => console.log('   %s', school.name))
        });
}

