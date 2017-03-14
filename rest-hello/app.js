"use strict";

const Koa = require('koa');

const controller = require('./controller')

const bodyParser = require('koa-bodyparser');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// 给koa安装了一个解析HTTP请求body的处理函数。
// 如果HTTP请求是JSON数据，就可以通过ctx.request.body
// 直接访问解析后的JavaScript对象
app.use(bodyParser());

app.use(controller('./controllers'));

app.listen(3000);

console.log('app started at port 3000');