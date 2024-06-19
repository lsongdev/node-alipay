const fs     = require('fs');
const pug    = require('pug');
const path   = require('path');
const http   = require('http');
const kelp   = require('kelp');
const body   = require('kelp-body');
const send   = require('kelp-send');
const serve  = require('kelp-static');
const render = require('kelp-render');
const logger = require('kelp-logger');

const Router  = require('kelp-router');

const router = new Router();

const Alipay = require('..');

const alipay = new Alipay({
  gateway         : 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  appId           : '2019032563747119',
  appKey          : fs.readFileSync(path.join(__dirname, 'demo.key')),
  alipayPublicKey : fs.readFileSync(path.join(__dirname, 'alipay.pub'))
});

const app = kelp();

app.use(
  body,
  send, 
  logger,
  serve(path.join(__dirname, 'public')),
  render({
    extension: 'pug',
    templates: path.join(__dirname, 'views'),
    renderer : pug.compileFile
  }),
  router,
);

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', (req, res) => {
  alipay.precreate(req.body)
  .then(function(data){
    res.render('show', data);
  });
});

app.use(function(req, res){
  res.send(404);
});

http.createServer(app).listen(3000);