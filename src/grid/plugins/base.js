/**
 * @fileOverview 表格插件的入口
 * @author dxq613@gmail.com, yiminghe@gmail.com
 * @ignore
 */

define('bui/grid/plugins',function (require) {
	var BUI = require('bui/common'),
		Selection = require('bui/grid/plugins/selection'),

		Plugins = {};

		BUI.mix(Plugins,{
			CheckSelection : Selection.CheckSelection,
			RadioSelection : Selection.RadioSelection,
			Cascade : require('bui/grid/plugins/cascade'),
			CellEditing : require('bui/grid/plugins/cellediting'),
			RowEditing : require('bui/grid/plugins/rowediting'),
			DialogEditing : require('bui/grid/plugins/dialogediting'),
			GridMenu : require('bui/grid/plugins/menu'),
			Summary : require('bui/grid/plugins/summary')
		});
		
	return Plugins;
});