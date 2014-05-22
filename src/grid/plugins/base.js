/**
 * @fileOverview 表格插件的入口
 * @author dxq613@gmail.com, yiminghe@gmail.com
 * @ignore
 */
;(function(){
var BASE = 'bui/grid/plugins/';
define('bui/grid/plugins',['bui/common',BASE + 'selection',BASE + 'cascade',BASE + 'cellediting',BASE + 'rowediting',BASE + 'autofit',
	BASE + 'dialogediting',BASE + 'menu',BASE + 'summary',BASE + 'rownumber',BASE + 'columngroup',BASE + 'rowgroup',BASE + 'columnresize'],function (r) {
	var BUI = r('bui/common'),
		Selection = r(BASE + 'selection'),

		Plugins = {};

		BUI.mix(Plugins,{
			CheckSelection : Selection.CheckSelection,
			RadioSelection : Selection.RadioSelection,
			Cascade : r(BASE + 'cascade'),
			CellEditing : r(BASE + 'cellediting'),
			RowEditing : r(BASE + 'rowediting'),
			DialogEditing : r(BASE + 'dialogediting'),
			AutoFit : r(BASE + 'autofit'),
			GridMenu : r(BASE + 'menu'),
			Summary : r(BASE + 'summary'),
			RowNumber : r(BASE + 'rownumber'),
			ColumnGroup : r(BASE + 'columngroup'),
			RowGroup : r(BASE + 'rowgroup'),
			ColumnResize : r(BASE + 'columnresize')
		});
		
	return Plugins;
});
})();
