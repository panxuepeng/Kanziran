var util = require("util");
var events = require("events");
var _ = require('underscore');
var controllers = {};

var base = {
  help: function(req, res) {
    res.end('help');
  }
}

function Controller(name, obj) {
	if ( typeof obj === 'undefined' ) {
		return controllers[name];
	}
	
	function F() {
		events.EventEmitter.call(this);  
	}  
	
	util.inherits(F, events.EventEmitter); //使这个类继承EventEmitter
	F.fn = F.prototype;
	
	_.extend(obj, base);
	
	_.extend(F.fn, obj);
	F.fn.trigger = F.fn.emit;
	
	controllers[name] = new F();
	return controllers[name];
}

Controller._ = _;

module.exports = Controller;
