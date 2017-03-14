"use strict";

module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html');
    },
    'GET /blog': async (ctx, next) => {
        ctx.render('blog.html');
    }
};