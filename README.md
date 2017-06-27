## alipay ![alipay@1.0.0](https://img.shields.io/npm/v/alipay2.svg)

> alipay sdk for nodejs

### Installation

```bash
$ npm i alipay2
```

### Example

```js
const fs     = require('fs');
const path   = require('path');
const Alipay = require('alipay2');

const alipay = new Alipay({
  appId           : '2016073100133470',
  appKey          : fs.readFileSync(path.join(__dirname, 'demo.key')),
  alipayPublicKey : fs.readFileSync(path.join(__dirname, 'alipay.pub')),
});

alipay.precreate({
  subject         : 'Example'
, out_trade_no    : '1486524664511'
, total_amount    : '0.1'
, timeout_express : '10m'
}).then(function(res){
  console.log('https://api.lsong.org/qr?text=%s', res.qr_code);
});

```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### MIT

Copyright (c) 2016 Lsong &lt;song940@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---