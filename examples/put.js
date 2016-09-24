'use strict';

// imports
const
    _ = require('lodash'),
    Promise = require('bluebird'),
    schools = require('./schools');


// exports
module.exports = function(dynamoDB, geohashClient) {
    return createSchools(dynamoDB, geohashClient);
};


// helper methods
function createSchools(dynamoDB, geohashClient) {

    // add some schools
    return _.reduce(schools, (promise, school) => {

        const location = school.Location;
        return promise.then(() => {
            return geohashClient
                .putAsync('Schools', school.Item, location.lat, location.lng)
                .then(() => console.log('added school: %s', school.Item.name));
        });
    }, Promise.bind(this));
}

