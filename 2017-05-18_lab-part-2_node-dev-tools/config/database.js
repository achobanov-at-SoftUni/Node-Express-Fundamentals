const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, `/database.json`);

let products =[];

function loadProducts() {
    "use strict";
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '[]');
        return [];
    }

    let json = fs.readFileSync(dbPath).toString(); // || '[]'
    products = JSON.parse(json);
}

function saveProducts() {
    "use strict";
    let json = JSON.stringify(products);
    fs.writeFileSync(dbPath, json);
}

module.exports.products = {
    add: (product) => {
        "use strict";
        loadProducts();

        product.id = products.length + 1;
        products.push(product);

        saveProducts();
    },
    findByName: (productName) => {
        "use strict";
        loadProducts();

        for (let product of products) {
            if (product.name === productName) {
                return product;
            }
        }

        return null;
    },
    getProducts: () => {
        "use strict";
        loadProducts();

        return products;
    }
};
