'use strict';

const
    _ = require('lodash'),
    schools = require('./schools');

module.exports = function(dynamoDB, geohashClient) {
    return querySchools(dynamoDB, geohashClient);
};


function querySchools(dynamoDB, geohashClient) {

    // add some schools
    return geohashClient
        .queryAsync('Schools',
            42.590518117714225, -81.93702121386718,
            43.791933329802255, -79.73975558886718)
        .then((schools) => {
            console.log('found %d schools', schools.length);
            _.forEach(schools, (school) => console.log('   %s', school.name))
        });
}

