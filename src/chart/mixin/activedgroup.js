/**
 * @fileOverview 子元素可以被激活
 * @ignore
 */

define('bui/chart/activedgroup',function  (require) {
	
	/**
	 * @class BUI.Chart.ActivedGroup
	 * @protected
	 * 元素可以激活的容器扩展
	 */
	var Group = function(){

	};

	Group.ATTRS = {

	};

	BUI.augment(Group,{

		/**
		 * @protected
		 * 是否激活
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
		 */
		isItemActived : function(item){
			return item.isActived();
		},
		/**
		 * @protected
		 * 获取可以被激活的元素
		 * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
		 */
		getActiveItems : function(){
			return this.get('children');
		},
		/**
		 * @protected
		 * 设置激活状态
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 * @param {Boolean} actived 是否激活
		 */
		setItemActived : function(item,actived){
			if(actived){
				item.setActived();
			}else{
				item.clearActived();
			}
		},
		/**
		 * 设置激活的元素
		 * @param {BUI.Chart.Actived} item 可以被激活的元素
		 */
		setActived : function(item){
			var _self = this;

			_self.clearActived();
			if(item && !_self.isItemActived(item)){
				_self.setItemActived(item,true);
			}
			
		},
		/**
		 * 获取激活的元素
		 * @return {BUI.Chart.Actived} 激活的元素
		 */
		getActived : function(){
			var _self = this,
				items = _self.getActiveItems(),
				rst = null;

			BUI.each(items,function(item){
				if(_self.isItemActived(item)){
					rst = item;
					return false;
				}
			});

			return rst;
		},
		/**
		 * 清除激活的元素
		 */
		clearActived : function(){
			var _self = this,
				item = _self.getActived();
			item && _self.setItemActived(item,false);
		}

	});

	return Group;
});