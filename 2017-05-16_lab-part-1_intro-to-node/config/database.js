let products =[];
let count = 1;

module.exports.products = {
    getAll: () => {
        "use strict";
        return products;
    },
    add: (product) => {
        "use strict";
        product.id = count++;
        products.push(product);
    },
    findByName: (productName) => {
        "use strict";
        for (let product of products) {
            if (product.name === productName) {
                return product;
            }
        }

        return null;
    }
};
