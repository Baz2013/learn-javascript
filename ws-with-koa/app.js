'use strict';

const url = require('url');

const ws = require('ws');

const Cookies = require('cookies');

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const WebSocketServer = ws.Server;

const app = new Koa();

// 用来判断是否是生产环境
// const isProduction = process.env.NODE_ENV === 'production';

const isProduction = false;

// log request URL
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);    
    await next();
});

// parse user from cookie;
app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '');
    await next();
});


// static file support
if (!isProduction){
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}


// parse request body
app.use(bodyParser());

// add nunjucks as view
app.use(templating('views',{
    noCache: !isProduction,
    watch: !isProduction
}));

// add controller
app.use(controller('controllers'));

// koa app的listen()方法返回http.Server:
let server = app.listen(3000);

function parseUser(obj){
    if (!obj){
        return;
    }

    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string'){
        s = obj;
    }else if(obj.headers){
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if(s){
        try{
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name},ID: ${user.id}`);
            return user;
        }catch (e){
            //ignore
        }
    }
}


function createWebScoketServer(server, onConnection, onMessage, onClose, onError){
    let wss = new WebSocketServer({
        server: server
    });
    wss.brodcast = function brodcast(data){
        wss.clients.forEach(function each(client){
            client.send(data);
        });
    };
    onConnection = onConnection || function(){
        console.log('[WebScoket] connected');
    };
    onMessage = onMessage || function (msg){
        console.log('[WebScoket] message received: ' + msg);
    };
    onClose = onClose || function (code, message){
        console.log(`[WebScoket] closed: ${code} - ${message}`);
    };
    onError = onError || function (err){
        console.log('[WebScoket] error: ' + err);
    };

    wss.on('connection', function (ws){
        let location = url.parse(ws.upgradeReq.url, true);
        console.log('[WebSocketServer] connection: ' + location.href);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);

        if(location.pathname !== '/ws/chat'){
            ws.close(4000, 'Invalid URL');
        }

        // check user:
        let user = parseUser(ws.upgradeReq);
        if(!user){
            ws.close(4001, 'Invalid user');
        }

        ws.user = user;
        ws.wss = wss;
        onConnection.apply(ws);
    });

    console.log('WebSocketServer was attached.');

    return wss;
}

var messageIndex = 0;

function createMessage(type, user, data){
    messageIndex++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

function onConnect(){
    let user = this.user;
    let msg = createMessage('join', user, `${user.name} joined`);
    this.wss.brodcast(msg);

    let users = this.wss.clients.map(function (client){
        return client.user;
    });

    this.send(createMessage('list', user, users));
}

function onMessage(message){
    console.log(message);
    if (message && message.trim()){
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.brodcast(msg);
    }
}

function onClose(){
    let user = this.user;
    let msg = createMessage('left', user, `${user.name} is left.`);
    this.wss.brodcast(msg);
}

app.wss = createWebScoketServer(server, onConnect, onMessage, onClose);

console.log('app started at port 3000 ...');