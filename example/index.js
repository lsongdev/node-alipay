const fs     = require('fs');
const path   = require('path');
const Alipay = require('..');

const alipay = new Alipay({
  appId           : '2017013105477647',
  appKey          : fs.readFileSync(path.join(__dirname, 'demo.key')),
  alipayPublicKey : fs.readFileSync(path.join(__dirname, 'alipay.pub')),
  gateway         : 'https://openapi.alipay.com/gateway.do'
});

alipay.precreate({
  subject         : 'Example'
, out_trade_no    : '1486524664511'
, total_amount    : '0.01'
, timeout_express : '10m'
}).then(function(res){
  console.log('http://api.lsong.org/qr?text=%s', res.qr_code);
});