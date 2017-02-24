'use strict';

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const app = new Koa();

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
    await next();
});

// parse request body
app.use(bodyParser());

// add controllers and regist routes
app.use(controller('controllers'));

app.listen(3000);
console.log('app started at port 3000 ...');