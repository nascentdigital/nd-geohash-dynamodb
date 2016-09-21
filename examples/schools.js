(function (global, factory)
{
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.schools = factory()
}(this, function () {
    'use strict';

    var schools = [
        {
            Item: {
                id: 'a',
                name: 'St. Richards',
                type: 'catholic',
                address: '960 Bellamy Rd N, Scarborough, ON M1H 1H1'
            },
            Location: {
                lat: 43.7681320,
                lng: -79.2394290
            }
        },
        {
            Item: {
                id: 'b',
                name: 'St Mary',
                type: 'catholic',
                address: '20 Portugal Square, Toronto, ON M6J 3P2'
            },
            Location: {
                lat: 43.6457480,
                lng: -79.4047650
            }
        },
        {
            Item: {
                id: 'c',
                name: 'Saint Teresa of Avila',
                type: 'catholic',
                address: '6675 Montevideo Rd, Mississauga, ON'
            },
            Location: {
                lat: 43.5912620,
                lng: -79.7517530
            }
        },
        {
            Item: {
                id: 'd',
                name: 'Rowntree Montessori Schools',
                type: 'private',
                address: '3 Sunforest Dr, Brampton, ON L6Z 2Z2'
            },
            Location: {
                lat: 43.7091270,
                lng: -79.7841510
            }
        },
        {
            Item: {
                id: 'e',
                name: 'Aloma Crescent',
                type: 'public',
                address: '57 Aloma Cres., Brampton, ON L6T2N8'
            },
            Location: {
                lat: 43.7075110,
                lng: -79.7039790
            }
        },
        {
            Item: {
                id: 'f',
                name: 'Mount Pleasant Village',
                type: 'public',
                address: '100 Commuter Dr, Brampton, ON L7A 0P7'
            },
            Location: {
                lat: 43.6766740,
                lng: -79.8239750
            }
        },
        {
            Item: {
                id: 'g',
                name: 'Beverley Heights',
                type: 'public',
                address: '26 Troutbrooke Dr, Toronto, ON M3M 1S5'
            },
            Location: {
                lat: 43.7333550,
                lng: -79.5067500
            }
        },
        {
            Item: {
                id: 'h',
                name: 'Greensborough',
                type: 'catholic',
                address: '80 Alfred Paterson Dr, Markham, ON'
            },
            Location: {
                lat: 43.9016270,
                lng: -79.2440160
            }
        },
        {
            Item: {
                id: 'i',
                name: 'Brian W Fleming',
                type: 'public',
                address: '3255 Havenwood Dr, Mississauga, ON L4X 2M2'
            },
            Location: {
                lat: 43.6179960,
                lng: -79.5876220
            }
        },
        {
            Item: {
                id: 'j',
                name: 'Posluns',
                type: 'private',
                address: '18 Neptune Dr, North York, ON M6A 1X1'
            },
            Location: {
                lat: 43.7313640,
                lng: -79.4341290
            }
        },
        {
            Item: {
                id: 'k',
                name: 'Crescent School',
                type: 'private',
                address: '2365 Bayview Ave, North York, ON M2L 1A2'
            },
            Location: {
                lat: 43.7326830,
                lng: -79.3796240
            }
        },
        {
            Item: {
                id: 'l',
                name: 'Bendale Junior',
                type: 'public',
                address: '61 Benshire Dr, Toronto, ON M1H 1M4'
            },
            Location: {
                lat: 43.7326830,
                lng: -79.3796240
            }
        },
        {
            Item: {
                id: 'm',
                name: 'John McCrae',
                type: 'public',
                address: '431 McCowan Rd, Toronto, ON M1J 1J1'
            },
            Location: {
                lat: 43.7440040,
                lng: -79.2408360
            }
        }
    ];

    return schools;
}));