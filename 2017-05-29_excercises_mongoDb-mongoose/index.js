let database = require('./database');
let instanodeDb = require('./instanode-db');

const MIN_DATE = new Date(-8640000000000000);
const MAX_DATE = new Date(8640000000000000);

let minDate = '';
let maxDate = '';


database()
    .then(() => {
        instanodeDb.filter(null, '2017-05-29T18:57:29.284Z').then((images) => {
            images.forEach(i => console.log(i))
        });
    });

// Write test code here :)) Have a nice day!d