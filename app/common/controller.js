var util = require("util")
  , async = require('async')
  , events = require("events")
  , _ = require('underscore')
  , controllers = {}

var base = {
	
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

Controller.async = async;
Controller._ = _;

module.exports = Controller;
