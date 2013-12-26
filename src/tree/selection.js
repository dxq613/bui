/**
 * @fileOverview 树的选中，跟列表的选中有所差异
 * @ignore
 */

define('bui/tree/selection',['bui/list'],function (require) {


	var BUI = require('bui/common'),
		SimpleList = require('bui/list').SimpleList;

	/**
	 * @class BUI.Tree.Selection
	 * 扩展树的选择
	 */
	var Selection = function(){

	};

	Selection.ATTRS = {};

	BUI.augment(Selection,{
		/**
		 * 获取选中的节点，一般用于多选状态下
		 * @return {Array} 获取选中的节点
		 */
		getSelection : function(){
			var _self = this,
				field = _self.getStatusField('selected'),
				store;
			if(field){
				store = _self.get('store');
				return store.findNodesBy(function(node){
					return node[field];
				});
			}
			return SimpleList.prototype.getSelection.call(this);
		},
		/**
		 * 获取选中的一个节点，如果是多选则返回第一个
		 * @return {Object} 获取选中的一个节点
		 */
		getSelected : function(){
			var _self = this,
				field = _self.getStatusField('selected'),
				store;
			if(field){
				store = _self.get('store');
				return store.findNodeBy(function(node){
					return node[field];
				});
			}
			return SimpleList.prototype.getSelected.call(this);
		}
	});

	return Selection;

});