"use strict";

var id = 0;

function nextId(){
    id++;
    return 'p' + id;
}

function Product(name, manufacture, price){
    this.id = nextId();
    this.name = name;
    this.manufacture = manufacture;
    this.price = price;
}

var products = [
    new Product('iPhone 7', 'Apple', 6800),
    new Product('ThinkPad T440', 'Lenovo', 5999),
    new Product('LBP2900', 'Canon', 1099)
];


module.exports = {
    getProducts: () => {
        console.log('return product list');
        return products;
    },

    getProduct: (id) => {
        console.log(`return products which id is ${id}`);
        var i;
        for (i = 0; i < products.length; i++){
            if (products[i].id === id){
                return products[i];
            }
        }

        return null;
    },

    createProduct: (name, manufacture, price) => {
        var p = new Product(name, manufacture, price);
        products.push(p);
        return p;
    },

    deleteProduct: (id) => {
        var 
            index = -1,
            i;

        for (i = 0; i < products.length; i++){
            if (products[i].id === id){
                index = i;
                break;
            }
        }

        if ( index >= 0){
            // remove products[index]
            return products.splice(index, 1)[0];
        }

        return null;
    }
};
