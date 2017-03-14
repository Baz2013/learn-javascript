'use strict';

function sum(...rest){
    var s = 0;
    if ( 0 === rest.length ) {
        return s;
    }

    for ( var key of rest){
        s += key;
    }

    return s;
}

function fib(n) {
    if ( 1 === n || 2 === n){
        return 1;
    }

    return n;
}

module.exports = {
    sum: sum,
    fib: fib
}