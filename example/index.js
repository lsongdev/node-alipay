const Alipay = require('..');

const alipay = new Alipay({
  appId : '',
  appKey: '',
  alipayPublicKey: ''
});

alipay.create({
  subject: '',
  out_trade_no:'',
  total_amount: 0,
  timeout_expire: 
}).then(function(order){
  console.log(order);
});