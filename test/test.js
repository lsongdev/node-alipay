const fs     = require('fs');
const path   = require('path');
const assert = require('assert');
const Alipay = require('..');

const alipay = new Alipay({
  appId           : '2016073100133470',
  appKey          : fs.readFileSync(path.join(__dirname, 'demo.key')),
  alipayPublicKey : fs.readFileSync(path.join(__dirname, 'alipay.pub')),
  gateway         : 'https://openapi.alipaydev.com/gateway.do'
});

describe('Alipay', function() {
  
  it('alipay#verify', function(){
    assert.ok(alipay.verify({ 
      code: '10000',
      msg: 'Success',
      out_trade_no: '1486372683551',
      qr_code: 'https://qr.alipay.com/bax089368xkiu48vowax0041' 
    }, 'PcvoeswLCqVevtK86zoCsOekGImqKCnGdcnZ7KarmIj1jfitHg8f1tveIsFp2WeSDxGDLKFv3xA/9TrQz0e1K257aP87Ntzp0/FWiyZGJpfcukNHMOhPFjdn7M6g3oNICbB3PRfh/FZ3d8S4tXDP8gQX49ZhGMpb+YwX8Cche7ad7k7Pg6okqt5atRjdQYhduN70i+lC+aJ8WtDcLpPHCNED+efdhnyAQB95efUxyNhZ0omWbCG48CddIT98dNeSuG/3hRrV13fY4/CMOe61P1DyrPkg+H25hpMOdWdsDf3B0z+Q2u30ubbmK/U8RUWczFlDXApVcLHj2AZzAPDEpg==', 'RSA2'));
  });
  
  it('alipay#precreate', function(){
    
    return alipay.precreate({
      subject         : 'Example'
    , out_trade_no    : '1486524664511'
    , total_amount    : '0.1'
    , timeout_express : '10m'
    }).then(function(res){
        assert.ok(res.qr_code);
        assert.equal(res.out_trade_no, '1486524664511');
        assert.equal(res.code, 10000, res.msg);
    });
    
  });

});