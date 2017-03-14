"use strict";

const Koa = require('koa');

const controller = require('./controller')

const bodyParser = require('koa-bodyparser');

const templating = require('./templating');

const rest = require('./rest');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// static file support
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

// 给koa安装了一个解析HTTP请求body的处理函数。
// 如果HTTP请求是JSON数据，就可以通过ctx.request.body
// 直接访问解析后的JavaScript对象
app.use(bodyParser());

// add nunjucks as view
app.use(templating('views', {
    noCache: true,
    watch: true
}));

// bind .rest() for ctx
app.use(rest.restify());

// add controllers
app.use(controller('./controllers'));

app.listen(3000);

console.log('app started at port 3000');