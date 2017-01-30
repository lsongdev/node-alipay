const https = require('https');

/**
 * [Alipay description]
 * @param {[type]} config [description]
 */
function Alipay(config){
  var defaults = {};
  for(var k in config){
    defaults[ k ] = config[ k ];
  }
  this.config = defaults;
  return this;
};
/**
 * [create description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Alipay.prototype.create = function(tradeNo, subject, totalAmount, timeout){
  var params = {};
  if(typeof tradeNo === 'object'){
    params = tradeNo;
  }else{
    params.out_trade_no    = tradeNo;
    params.subject         = subject;
    params.total_amount    = totalAmount;
    params.timeout_express = timeout;
  }
  return this.execute('alipay.trade.precreate', params);
};
/**
 * [execute description]
 * @param  {[type]} method [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Alipay.prototype.execute =  function(method, params){
  return new Promise(function(accept, reject){
    var req = https.request({}, function(err, res){

    });
  });
};

module.exports = Alipay;