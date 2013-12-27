/**
 * @fileOverview 布局模块的入口文件
 * @ignore
 */
(function(){
	var BASE = 'bui/layout/';
	define('bui/layout',['bui/common',BASE + 'abstract',BASE + 'absolute',BASE + 'anchor', BASE + 'flow',BASE + 'columns',BASE + 'table',
		BASE + 'border', BASE + 'accordion',BASE + 'viewport'],function (r) {

		var BUI = r('bui/common');

		var Layout = BUI.namespace('Layout');

		BUI.mix(Layout,{
			Abstract : r(BASE + 'abstract'),
			Anchor : r(BASE + 'anchor'),
			Flow : r(BASE + 'flow'),
			Absolute : r(BASE + 'absolute'),
			Columns : r(BASE + 'columns'),
			Table : r(BASE + 'table'),
			Border :r(BASE + 'border'), 
			Accordion : r(BASE + 'accordion'),
			Viewport : r(BASE + 'viewport')
		});

		return Layout;
	});

})();