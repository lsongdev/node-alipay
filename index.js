const qs     = require('querystring')
const URI    = require('url');
const https  = require('https');
const crypto = require("crypto");

/**
 * [Alipay description]
 * @param {[type]} config [description]
 */
function Alipay(config){
  if(!(this instanceof Alipay)){
    return new Alipay(config);
  }
  var defaults = {
    gateway: 'https://openapi.alipay.com/gateway.do'
  };
  for(var k in config)
    defaults[ k ] = config[ k ];
  this.config = defaults;
  return this;
};
/**
 * [TYPES description]
 * @type {Object}
 */
Alipay.TYPES = {
  RSA : 'RSA-SHA1',
  RSA2: 'RSA-SHA256'
};
/**
 * [Error description]
 * @param {[type]} err [description]
 */
Alipay.Error = function(err){
  var error = new Error(err.sub_msg, err.sub_code);
  error.type = err.msg;
  error.code = err.code;
  error.origin = err;
  return error;
};

/**
 * [merge description]
 * @param  {[type]} o1 [description]
 * @param  {[type]} o2 [description]
 * @return {[type]}    [description]
 */
Alipay.merge = function(o1, o2){
  var obj = {};
  for(var k in o1) obj[k] = o1[k];
  for(var k in o2) obj[k] = o2[k];
  return obj;
};

/**
 * [timestamp description]
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
Alipay.timestamp = function(date){
  date = date || new Date;
  var MM = date.getMonth() + 1;
  var dd = date.getDate();
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
  return [ date.getFullYear(),
    (MM > 9 ? '' : '0') + MM,
    (dd > 9 ? '' : '0') + dd
  ].join('-') + ' ' + [
    (hh > 9 ? '' : '0') + hh,
    (mm > 9 ? '' : '0') + mm,
    (ss > 9 ? '' : '0') + ss
  ].join(':');
};

/**
 * [createSignatureWithRSA description]
 * @docs https://doc.open.alipay.com/docs/doc.htm?docType=1&articleId=106118
 * @param  {[type]} content  [description]
 * @param  {[type]} signType [description]
 * @param  {[type]} charset  [description]
 * @return {[type]}          [description]
 */
Alipay.prototype.createSignatureWithRSA = function(content, signType, charset){
  signType = signType || 'RSA2';
  charset  = charset  || 'utf8';
  var rsa = crypto.createSign(Alipay.TYPES[ signType ]);
  rsa.update(content, charset);
  return rsa.sign(this.config.appKey, 'base64');
};
/**
 * [verify description]
 * @docs https://doc.open.alipay.com/docs/doc.htm?docType=1&articleId=106120
 * @param  {[type]} content [description]
 * @param  {[type]} sign    [description]
 * @return {[type]}         [description]
 */
Alipay.prototype.verify = function(params, sign, signType, charset){
  charset  = charset || 'utf8';
  if(typeof sign === 'undefined' && params.sign && params.sign_type){
    sign     = params.sign;
    signType = params.sign_type;
    delete params.sign;
    delete params.sign_type;
  }
  if(typeof sign     === 'undefined') throw new TypeError('sign must be string');
  if(typeof signType === 'undefined') throw new TypeError('signType must be string');
  var content = JSON.stringify(params).replace(/\//g, "\\/");
  var rsa = crypto.createVerify(Alipay.TYPES[ signType ]);
  rsa.update(content, charset);
  return rsa.verify(this.config.alipayPublicKey, sign, 'base64');
};

/**
 * [stringify description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Alipay.stringify = function(params){
  return Object.keys(params).filter(function(key){
    if(key == 'sign')     return false;
    if(params[key] == '') return false;
    return true;
  }).sort().map(function(key){
    return [ key, params[ key ] ].join('=');
  }).join('&');
};
/**
 * [createBaseParams description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Alipay.prototype.createBaseParams = function(method, params){
  var self = this, obj = {
      app_id     : this.config.appId
    , method     : method
    , version    : '1.0'
    , format     : 'JSON'
    , charset    : 'utf8'
    , sign_type  : 'RSA2'
    , timestamp  : Alipay.timestamp()
    , notify_url : 'https://api.lsong.org'
  };
  Object.keys(obj).forEach(function(key){
    obj[ key ] = self.config[ key ] ||  obj[ key ];
  });
  return obj;
};

/**
 * [execute description]
 * @param  {[type]} method [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Alipay.prototype.execute =  function(method, params){
  var self = this;
  var base = this.createBaseParams(method, params);
  params = { biz_content: JSON.stringify(params) };
  var content = Alipay.stringify(Alipay.merge(base, params));
  var signature  = this.createSignatureWithRSA(content, base.sign_type, base.charset);
  var url = this.config.gateway;
  url += '?' + qs.stringify(base);
  url += '&sign=' + encodeURIComponent(signature);
  var options = URI.parse(url);
  options.method = 'POST';
  return new Promise(function(accept, reject){
    var req = https.request(options, function(res){
      var buffer = '';
      res
      .on('error', reject)
      .on('data', function(chunk){
        buffer += chunk;
      }).on('end', function(){
        console.log('end', buffer);
        var response = JSON.parse(buffer);
        var rootNodeName = method.replace(/\./g, "_") + "_response";
        var result = response[ rootNodeName ];
        if(typeof response.sign === 'undefined'){
          return reject(new Alipay.Error(result));
        }
        if(self.verify(result, response.sign, base.sign_type, base.charset)){
          accept(result);
        }else{
          reject(new Error('verify signature faile', response));
        }
        
      });
    });
    req.setHeader('content-type', 'application/x-www-form-urlencoded')
    req.end(qs.stringify(params));
  }.bind(this));
};

/**
 * [create description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 *
 * @docs https://doc.open.alipay.com/doc2/apiDetail.htm?spm=a219a.7629065.0.0.PlTwKb&apiId=862&docType=4
 */
Alipay.prototype.precreate = function(tradeNo, subject, totalAmount, timeout){
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
 * [query description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Alipay.prototype.query = function(params){
  return this.execute('alipay.trade.query', params);
};

Alipay.prototype.create = function(params){
  return this.execute('alipay.trade.create', params);
};

Alipay.prototype.pay = function(params){
  return this.execute('alipay.trade.pay', params);
};

Alipay.prototype.cancel = function(params){
  return this.execute('alipay.trade.cancel', params);
};

/**
 * [refund description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Alipay.prototype.refund = function(params){
  return this.execute('alipay.trade.refund', params);
};

module.exports = Alipay;