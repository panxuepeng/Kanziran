var crypto = require('crypto')
  , config = process.appConfig

// 加密规则
// 例如 value = 'a'
// str = '{"key":"a","type":"string"}'
// code = encrypt(str, config.cookieSecret+req.ip)
// cookieValue = md5(str) + md5(code) + code
exports.setCookie = function(req, res, name, value, maxAge) {
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
	var code = encrypt(value, config.cookieSecret + req.ip);
	code = md5(value) + md5(code) + code;
	res.cookie(name, code, {path: '/', maxAge: maxAge});

	return true;
}

exports.getCookie = function(req, name) {
	var code = req.cookies[name]
	, decodeStr = ''
	, value = ''
	, md5Value = ''
	, md5Code = ''

	if ( code && code.length > 64 ) {
		md5Value = code.substr(0, 32)
		md5Code = code.substr(32, 32)
		code = code.substr(64)
		
		if ( md5Code !== md5(code) ) {
			return false;
		}
		
		decodeStr = decrypt(code, config.cookieSecret + req.ip);
		
		if ( md5Value !== md5(decodeStr) ) {
			return false;
		}
		
		var o = null;
		try {
			// 当 decodeStr 不能正确解析时会抛异常，这里直接忽略掉这个异常
			o = JSON.parse(decodeStr);
		} catch(e){
			// log
			value = false;
		}

		if ( o && o.key ) {
			value = o.key;
			if (o.type === 'object') {
				value = JSON.parse(value);
			} else if (o.type === 'number') {
				value = parseInt(value, 10);
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
