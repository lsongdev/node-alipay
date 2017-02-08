const fs     = require('fs');
const path   = require('path');
const http   = require('http');
const jade   = require('jade');
const kelp   = require('kelp');
const body   = require('kelp-body');
const send   = require('kelp-send');
const route  = require('kelp-route');
const serve  = require('kelp-static');
const render = require('kelp-render');
const logger = require('kelp-logger');
const Alipay = require('..');

const alipay = new Alipay({
  appId           : '2017013105477647',
  appKey          : fs.readFileSync(path.join(__dirname, 'demo.key')),
  alipayPublicKey : fs.readFileSync(path.join(__dirname, 'alipay.pub'))
});

const app = kelp();

app.use(render({
  extension: 'jade' ,
  templates: path.join(__dirname, 'views'),
  compiler : function(content, filename){
    return function(locals){
      return jade.renderFile(filename, locals);
    }
  }
}));

app.use(logger, body, send, serve(path.join(__dirname, 'public')));
app.use(route('get', '/', function(req, res){
  res.render('index');
}));
app.use(route('post', '/', function(req, res){
  alipay.precreate(req.body)
  .then(function(data){
    res.render('show', data);
  });
}));

app.use(function(req, res){
  res.send(404);
});

const server = http.createServer(app);
server.listen(3000);