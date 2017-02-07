const fs     = require('fs');
const Alipay = require('..');

const alipay = new Alipay({
  appId           : '2016073100133470',
  appKey          : fs.readFileSync('rsa_private_key.pem'),
  alipayPublicKey : fs.readFileSync('sandbox.pub'),
  
  gateway: 'https://openapi.alipaydev.com/gateway.do'
});

alipay.create({
  subject: 'Test',
  out_trade_no: '1486372683551',
  total_amount: '0.1',
  timeout_express: '1m'
}).then(function(res){
  console.log(res);
});