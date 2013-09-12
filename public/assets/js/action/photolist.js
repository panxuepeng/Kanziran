define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, template = require('artTemplate');
  
  exports.tmpl = 'photolist';
  
  exports.show = function( ){
	if(Config.cache.topiclist['news']) {
		initData(Config.cache.topiclist['news']);
	} else {
		$.getJSON(Config.serverLink('topics'), function(data){
			initData(data);
			Config.cache.topiclist['news'] = data;
		});
	}
  }
  
  function initData(data){
	var html = '';
	
	if( data && typeof data=== 'object' && data.list ){
		html = template.render('tmpl-photolist', data);
	}
	$("#photolist").html( html );
	
	if(data.pageCount){
		$('#pagination').pagination(data.topicCount, {
			items_per_page: 12,
			num_display_entries: 10,
			current_page: 0,
			num_edge_entries: 1,
			link_to: "javascript:void(0)",
			prev_text: "上一页",
			next_text: "下一页",
			ellipse_text: "...",
			prev_show_always: true,
			next_show_always: true,
			callback: function(page, component) {
				location = Config.link('photolist/'+page);
			}
		}).show();
	}
  }
  
  exports.init = function( ){
	// init ...
	
  }
  
});
