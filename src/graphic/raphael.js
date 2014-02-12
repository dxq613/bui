define('bui/graphic/raphael',['bui/graphic/raphael/core','bui/graphic/raphael/svg','bui/graphic/raphael/vml'],function (require) {
	
	var Raphael = require('bui/graphic/raphael/core');
	require('bui/graphic/raphael/svg');
	require('bui/graphic/raphael/vml');
	return Raphael;
});