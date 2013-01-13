/*!
 * jQuery.validate  0.5
 *
 * Copyright 2012, panxuepeng
 * Dual licensed under the MIT and GPL licenses.
 * author: panxuepeng
 * blog: http://dushii.blog.163.com
 * date: 2012-05-07
 * last: 2012-05-15
 */
(function($) {

// jQuery 插件的使用方式
$.extend($.fn, {
	validate: function(options) {
		var o, form = this[0];
		o = new validator( options, form );
		this.data('validator', o);
		return o;
	},
	
	// 针对表单项增加或删除规则
	rules: function(command, argument) {
		var el = this[0], form = $(el).closest('form'), self = form.data('validator'),
			rules = self.settings.rules,
			messages = self.settings.messages;
		if (command) {
			switch(command) {
				case "add":
					rules[el.name] = argument;
					messages[el.name] = argument.messages;
					delete rules[el.name].messages;
					break;
				case "remove":
					rules[el.name] = null;
					break;
			}
		}
	}
});

// 外部接口
$.validator = function(){}
$.extend($.validator, {
	addMethod: function( obj ){
		$.extend(validator.prototype.methods, obj);
	},
	
	setDefaults: function(obj){
		$.extend(true, validator.defaults, obj);
	},
	
	test: function(form){
		var self = form.data('validator'), bool = true, names = {};
		// 循环遍历所有表单项
		// 注意，对于多个表单name相同的情况，需要过滤一下
		$(':input', form).each(function(i, el){
			if( !names[el.name] ){
				var isok = self.check( this );
				if( bool && !isok ){
					bool = false;
				}
				names[el.name] = 1;
			}
		});
	}
});

// 内部对象
var validator = function( options, form ) {
	this.settings = $.extend( true, {}, validator.defaults, options );
	this.currentForm = form;
	this.init();
}

validator.format = function(){
	
}

validator.getLength = function(value, element) {
	switch( element.nodeName.toLowerCase() ) {
	case 'select':
		return $("option:selected", element).length;
	case 'input':
		if( $( element).is(':radio, :checkbox') )
			return this.findByName(element.name).filter(':checked').length;
	}
	return value.length;
}

$.extend(validator, {
	defaults: {
		rules: {},
		messages: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
		onsubmit: true,
		errorPlacement: null
		/*,
		groups: {},
		ignore: ":hidden",
		ignoreTitle: false,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onfocusin: function(element, event) {
			
		},
		onfocusout: function(element, event) {
			
		},
		onkeyup: function(element, event) {
			
		},
		onclick: function(element, event) {
			
		}*/
	},
	
	// 此项没用，仅供参考
	messages: {
	/*
		required: "必选字段",
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: "请输入一个长度最多是 {0} 的字符串",
		minlength: "请输入一个长度最少是 {0} 的字符串",
		rangelength: "请输入一个长度介于 {0} 和 {1} 之间的字符串",
		range: "请输入一个介于 {0} 和 {1} 之间的值",
		max: "请输入一个最大为 {0} 的值",
		min: "请输入一个最小为 {0} 的值",
		pattern: "请输入合法的格式"
	*/
	}
});

validator.prototype = {
	/*
	* 触发错误信息的事件机制
	* 1、第一次获取焦点，输入，按键抬起默认不触发验证
	* 2、失去焦点触发验证
	* 3、已经显示错误信息后，按键抬起触发验证
	*/
	init: function(){
		var self = this;
		// 绑定事件
		
		// 表单提交事件
		$(self.currentForm).submit(function(){
			var bool = true, names = {};
			// 循环遍历所有表单项
			// 注意，对于多个表单name相同的情况，需要过滤一下
			$(':input', self.currentForm).each(function(i, el){
				if( !names[el.name] ){
					var isok = self.check( this );
					if( bool && !isok ){
						bool = false;
					}
					names[el.name] = 1;
				}
			});
			return bool;
		});
		
		// 失去焦点和按键抬起事件
		$(self.currentForm).delegate(':input', 'blur', function(){
			if( $.trim($(this).val()) ){
				self.check( this );
			}
		}).delegate(':input', 'keyup', function(){
			if( $(this).hasClass('error') ){
				self.check( this );
			}
		});
		
		// 对于选择框，需要在点击时触发验证方法
		$(self.currentForm).delegate(':radio, :checkbox', 'click', function(){
			self.check( this );
		})
	},
	
	getValueByName: function(name){
		var self = this, value;
		els = $(self.currentForm).find(':input[_name='+name+']');
		if( els.size() === 1 ){
			if( els.is(':radio, :checkbox') ){
				value = els.is(':checked') ? (els.attr("value") || true) : '';
			}else{
				value = els.val();
			}
		}else if( els.size() > 1 ){
			// 单选框
			if( els.is(':radio') ){
				value = els.filter(":checked").val();
			}else if( els.is(':checkbox') ){
				value = [];
				els.filter(":checked").each(function(i, el){
					var v = $.trim($(el).val()) || true;
					value.push( v );
				});
			}else{
				// 其他
				value = [];
				els.each(function(i, el){
					var v = $.trim($(el).val());
					if(v) value.push( v );
				});
			}
		}
		
		return value;
	},
	
	// 验证
	// 对每一个存在验证规则的表单项执行验证操作
	check: function( el ){
		var bool = true,
			self = this,
			o = $(el),
			name = o.attr('name'),
			value = null,
			rules = self.settings.rules, rule,
			messages = self.settings.messages, msg="";
		
		
		rule_name = name.replace(/\[\d*\]/g, "");
		
		name = name.replace(/[\[\]]/g, '_');
		o.attr("_name", name);
		rule = rules[rule_name];
		// 规则不存在 或 是不可见元素，则跳过
		if( !rule || o.closest(":hidden").size() ){
			return true;
		}
		value = self.getValueByName(name);
		
		
		try{
			var typeof_rule = typeof rule;
			if (typeof_rule  === 'string'){
				if( typeof self.methods[rule] === 'function' ){
					bool = self.methods[rule].call(self, value, el );
					if( !bool ){
						msg = messages[rule_name];
						
						// 兼容规则是字符串，提示信息是对象的情况
						// rules
						// name: "required"
						
						// messages
						// name: {
						//		required: '...'
						// }
						
						if( typeof msg === 'object' ){
							msg = msg[rule];
						}
					}
				}
			}else if(rule && typeof_rule  === 'object'){
				for(var methodName in rule){
					msg = messages[rule_name][methodName];
					
					if( !self.methods[methodName].call(self, value, el, rule[methodName], msg ) ){
						bool = false;
						break;
					}else{
						msg = "";
					}
				}
			}
		}catch(e){
			
		}
		
		self.showLabel(el, msg);
		return bool;
	},
	
	// 在显示错误信息时，即时创建lavel标签
	showLabel: function(el, msg){
		var self = this, label = self.errorsFor( el ), errorClass = self.settings.errorClass,
			name = $(el).attr('name');
		if ( label.length ) {
			// refresh error/success class
			label.removeClass( self.settings.validClass ).addClass( errorClass );

			// check if we have a generated label, replace the message then
			label.attr("generated") && label.html(msg);
		}else{
			// create label
			label = $("<" + self.settings.errorElement + "/>")
				.attr({"for":  $(el).attr('name'), generated: true})
				.addClass(errorClass)
				.html(msg || "");
				
			// 将label放到合适的位置
			var els = $(self.currentForm).find(':input[name='+name+']');
			if( typeof self.settings.errorPlacement === 'function'){
				self.settings.errorPlacement(label, $(el) )
			}else if( els.size()> 1 ){
				$(el).closest("td,div,li,dl,dd,p").append("<br />").append(label);
			}else{
				$(el).closest("td,div,li,dl,dd,p").append(label);
			}
			
			if ( !msg ) {
				label.text("");
			}
		}
		
		if ( msg ) {
			$(el).addClass(errorClass);
		}else{
			$(el).removeClass(errorClass);
			label.text("");
		}
	},
	
	errorsFor: function(el) {
		var name = $(el).attr("name");
		return $("label[for]").filter(function() {
			return $(this).attr('for') == name;
		});
	},
	

	
	/**
	(1) required:true 必输字段 
	(2) remote:"check.php" 使用ajax方法调用check.php验证输入值 
	(3) email:true 必须输入正确格式的电子邮件 
	(4) url:true 必须输入正确格式的网址 
	(5) date:true 必须输入正确格式的日期 
	(6) dateISO:true 必须输入正确格式的日期(ISO)，例如：2009-06-23，1998/01/22 只验证格式，不验证有效性 
	(7) number:true 必须输入合法的数字(负数，小数) 
	(8) digits:true 必须输入整数 
	(9) creditcard: 必须输入合法的信用卡号 
	(10) equalTo:"#field" 输入值必须和#field相同 
	(11) accept: 输入拥有合法后缀名的字符串（上传文件的后缀） 
	(12) maxlength:5 输入长度最多是5的字符串(汉字算一个字符) 
	(13) minlength:10 输入长度最小是10的字符串(汉字算一个字符) 
	(14) rangelength:[5,10] 输入长度必须介于 5 和 10 之间的字符串")(汉字算一个字符) 
	(15) range:[5,10] 输入值必须介于 5 和 10 之间 
	(16) max:5 输入值不能大于5 
	(17)min:10 输入值不能小于10

	* 表单字段数据验证方法
	* 这些方法都有3个参数
	* value: 当前表单项的值
	* element: 当前表单项
	* param: 规则里面指定的参数，如equalTo: '#password'这里的 #password 就是 param
	* 
	*/
	methods: {
		required: function(value, element, param) {
			if( typeof value === 'string' ){
				value = $.trim(value);
			}
			
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			case 'input':
				value.length > 0;
			default:
				return value.length > 0;
			}
		},
		
		equalTo: function(value, element, param) {
			var target = $(param);
			return value == target.val();
		},
		
		remote: function(value, element, param, msg) {
			
			var self = this, data={}, old = $(element).attr("old"),
				bool = $(element).data('bool');
			if(value === old){
				// bool is false
				if( !(bool === true) ){
					self.showLabel(element, msg);
				}
				return bool;
			}else{
				$(element).attr("old", value);
				data[ element.name ] = value;
				$.ajax($.extend(true, {
					data: data,
					cache: false,
					dataType: "json",
					success: function(bool) {
						$(element).data('bool', bool);
						if( !(bool === true) ){
							self.showLabel(element, msg);
						}
					}
				}, param));
				return true;
			}
		},
		
		// 
		minlength: function(value, element, param) {
			return validator.getLength($.trim(value), element) >= param;
		},

		// 
		maxlength: function(value, element, param) {
			return validator.getLength($.trim(value), element) <= param;
		},

		// 
		rangelength: function(value, element, param) {
			var length = validator.getLength($.trim(value), element);
			return ( length >= param[0] && length <= param[1] );
		},

		// 
		min: function( value, element, param ) {
			return value >= param;
		},

		// 
		max: function( value, element, param ) {
			return value <= param;
		},

		// 
		range: function( value, element, param ) {
			return ( value >= param[0] && value <= param[1] );
		},
		
		// 
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// 
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return  /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},
		
		// 
		date: function(value, element) {
			return !/Invalid|NaN/.test(new Date(value));
		},

		// 
		dateISO: function(value, element) {
			return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
		},

		// 
		number: function(value, element) {
			return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},

		// 
		digits: function(value, element) {
			return /^\d+$/.test(value);
		},
			
		creditcard: function(value, element) {
			// accept only spaces, digits and dashes
			if (/[^0-9 -]+/.test(value))
				return false;
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				var nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9)
						nDigit -= 9;
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) == 0;
		},
		accept: function(value, element, param) {
			param = (typeof param == "string") ? param.replace(/,/g, '|') : "png|jpe?g|gif";
			return value.match(new RegExp(".(" + param + ")$", "i"));
		},
		pattern: function(value, element, param) {
			param = new RegExp(param[0],param[1]);
			return param.test(value);
		}
	}
}


})(jQuery);