
/**
 * @fileOverview 布局内部存在可折叠的项
 * @ignore
 */

define('bui/layout/collapsable',['bui/common'],function (require) {

	var BUI = require('bui/common');
	
	/**
	 * @class BUI.Layout.Collapsable
	 * 可以展开、折叠的布局的扩展类
	 */
	var Collapsable = function(){

	};

	Collapsable.ATTRS = {

		/**
		 * 触发展开折叠的样式
		 * @type {String}
		 */
		triggerCls : {
			
		},
		/**
		 * 动画的持续时间
		 * @type {Number}
		 */
		duration : {
			value : 400
		},
		/**
		 * 是否只能展开一个
		 * @type {String}
		 */
		accordion : {
			value : false
		}

	};

	BUI.augment(Collapsable,{
		//绑定展开折叠事件
		bindCollapseEvent : function(){
			var _self = this,
				triggerCls = _self.get('triggerCls'),
				el = _self.get('container');
			el.delegate('.' + triggerCls,'click',function(ev){
				var sender = $(ev.currentTarget),
					item = _self.getItemByElement(sender);
				_self.toggleCollapse(item);
			});
		},
		/**
		 * 获取展开的选项
		 * @return {BUI.Layout.Item} 选项
		 */
		getExpandedItem : function(){
			return this.getItemBy(function(item){
				return !item.get('collapsed')
			});
		},
		/**
		 * 展开
		 * @param  {BUI.Layout.Item} item 选项
		 */
		expandItem : function(item){
			var _self = this,
				duration = _self.get('duration'),
				range = _self.getCollapsedRange(item),
				activeItem;
			if(item.get('collapsed')){
				if(_self.get('accordion')){ //如果是互斥的收缩，将展开的收缩掉
					activeItem = _self.getExpandedItem();
					if(activeItem){
						_self.beforeCollapsed(activeItem,range);
						activeItem.collapse(duration,function(){
							_self.afterCollapsed(activeItem);
						});
					}
				}
				_self.beforeExpanded(item,range);
				item.expand(range,duration,function(){
					_self.afterExpanded(item);
				});
			}
		},
		/**
		 * 展开选项后
		 */
		afterExpanded : function(item){

		},
		/**
		 * 展开选项前
		 */
		beforeExpanded : function(item,range){

		},
		/**
		 * 收缩
		 * @param  {BUI.Layout.Item} item 选项
		 */
		collapseItem : function(item){
			var _self = this,
				duration = _self.get('duration'),
				range = _self.getCollapsedRange(item),
				nextItem;
			if(!item.get('collapsed')){
				if(_self.get('accordion')){ //如果是互斥的收缩，展开下一项
					nextItem = _self.getNextItem(item);
					_self.beforeExpanded(nextItem,range);
					nextItem.expand(range,duration,function(){
						_self.afterExpanded(nextItem);
					});
				}
				_self.beforeCollapsed(item,range);
				item.collapse(duration,function(){
					_self.afterCollapsed(item);
				});
			}
		},
		/**
		 * 折叠选项前
		 */
		beforeCollapsed : function(item,range){

		},
		/**
		 * 折叠选项后
		 */
		afterCollapsed : function(item){

		},
		/**
		 * @protected
		 * 获取折叠的数值范围
		 * @return {Number} 获取折叠的数值范围
		 */
		getCollapsedRange : function(item){

		},
		/**
		 * 展开折叠选项
		 * @param  {BUI.Layout.Item} item 选项
		 */
		toggleCollapse : function(item){
			var _self = this;
			if(item.get('collapsed')){
				_self.expandItem(item);
			}else{
				_self.collapseItem(item);
			}
		}
	});

	return Collapsable;
});