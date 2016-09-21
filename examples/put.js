'use strict';

// imports
const
    _ = require('lodash'),
    geohash = require('../index'),
    schools = require('./schools');


// exports
module.exports = function(dynamoDB) {
    return createSchools(dynamoDB);
};


// helper methods
function createSchools(dynamoDB) {

    // create client
    const geohashClient = new geohash.DynamoGeospatialClient({ dynamoDB: dynamoDB});

    // add some schools
    return _.reduce(schools, (promise, school) => {

        const location = school.Location;
        return geohashClient
            .putAsync('Schools', school.Item, location.lat, location.lng)
            .then(() => console.log('added school: %s', school.Item.name));
    }, Promise.bind(this));
}

