const fs = require('fs');

let storage = {};

const valid_key_type = `string`;
const not_found = -1;
const file_path = `./storage.dat`;

function validateKeyType(key) {
    "use strict";
    if (typeof key !== valid_key_type) {
        throw new TypeError(`Invalid key type: ${typeof key}`);
    }
}

function handleDuplicateKeys(key) {
    "use strict";
    if (key in storage) {
        throw new ReferenceError(`Entry with key: ${key} already exists.`);
    }
}

function handleNonExistingKey(key) {
    "use strict";
    if (!(key in storage)) {
        throw new ReferenceError(`Entry with key: ${key} does not exist.`)
    }
}

function emptyStorage() {
    "use strict";
    storage = {};
}

module.exports = {
    put: (key, value) => {
        "use strict";
        validateKeyType(key);
        handleDuplicateKeys(key);

        storage[key] = value;
        console.log(storage);
    },
    get: (key) => {
        "use strict";
        validateKeyType(key);
        handleNonExistingKey(key);

        return storage[key];
    },
    update: (key, value) => {
        "use strict";
        validateKeyType(key);
        handleNonExistingKey(key);

        storage[key] = value;
        console.log(storage);
    },
    delete: (key) => {
        "use strict";
        validateKeyType(key);
        handleNonExistingKey(key);

        delete storage[key];
        console.log(storage);
    },
    clear: () => {
        "use strict";
        emptyStorage();
        console.log(`\nCLEAR\n %j`, storage);
    },
    save: () => {
        "use strict";
        let jsonData = JSON.stringify(storage);
        fs.writeFileSync(file_path, jsonData, (err) => {
            if (err) {
                return console.log(err);
            }

            console.log(`Storage saved!`);
        });

        emptyStorage();
        console.log(storage);
    },
    loadPromise: () => {
        "use strict";
        return new Promise((resolve, reject) => {
            fs.readFile(file_path, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                storage = JSON.parse(data);
                resolve();
                console.log(storage);
            })
        })
    },
    loadSync: () => {
        "use strict";
        let data = fs.readFileSync(file_path);
        storage = JSON.parse(data);

        console.log(`\nLOADED:\n %j`, storage);
    },
};