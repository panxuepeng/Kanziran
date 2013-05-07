var crypto = require('crypto')
  , config = process.appConfig

//
exports.setCookie = function(res, name, value, maxAge) {
  if (!name) {
    return false;
  }
  
  maxAge = maxAge || config.cookieExpires;
  var type = typeof value;
  if (type === 'object') {
    value = JSON.stringify(value);
  }
  var o = {key: value, type: type};
  
  value = JSON.stringify(o);
  var code = encrypt(value, config.cookieSecret);
  res.cookie(name, code, {path: '/', maxAge: maxAge});
  
  return true;
}

exports.getCookie = function(req, name ) {
  var code = req.cookies[name]
    , str = ''
    , value = ''
  
  if ( code ) {
    str = decrypt(code, config.cookieSecret);
    var o;
    try {
        // 当 str 不能正确解析时会抛异常
        // 这里直接忽略掉这个异常
        o = JSON.parse(str);
    } catch(e){
      // log
    }
    
    if ( o && o.key ) {
      value = o.key;
      if (o.type !== 'string') {
        value = JSON.parse(value);
      }
    }
  }
  
  return value;
}



var encrypt = function (str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

var decrypt = function (str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

var md5 = function (str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

var randomString = function(size) {
  size = size || 4;
  var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'
    , len = str.length + 1
    , s = ''
  
  while (size > 0) {
    s += str.charAt(Math.floor(Math.random() * len));
    size--;
  }
  return s;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.md5 = md5;
exports.randomString = randomString;
