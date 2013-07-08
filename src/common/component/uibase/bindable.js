/**
 * @fileOverview bindable extension class.
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/bindable',function(){
	
	/**
		* bindable extension class.
		* 使控件绑定store，处理store的事件 {@link BUI.Data.Store}
		* @class BUI.Component.UIBase.Bindable
		*/
	function bindable(){
		
	}

	bindable.ATTRS = 
	{
		/**
		* 绑定 {@link BUI.Data.Store}的事件
		* @cfg {BUI.Data.Store} store
		*/
		/**
		* 绑定 {@link BUI.Data.Store}的事件
		* @type {BUI.Data.Store}
		*/
		store : {
			
		},
		/**
		* 加载数据时，是否显示等待加载的屏蔽层
		* @cfg {Boolean|Object} loadMask
		*/
		/**
		* 加载数据时，是否显示等待加载的屏蔽层
		* @type {Boolean|Object} 
		*/
		loadMask : {
			value : false
		}
	};


	BUI.augment(bindable,
	/**
	* @lends BUI.Data.Bindable.prototype
	* @ignore
	*/	
	{

		__bindUI : function(){
			var _self = this,
				store = _self.get('store'),
				loadMask = _self.get('loadMask');
			if(!store){
				return;
			}
			store.on('beforeload',function(){
				if(loadMask && loadMask.show){
					loadMask.show();
				}
			});
			store.on('load',function(e){
				_self.onLoad(e);
				if(loadMask && loadMask.hide){
					loadMask.hide();
				}
			});
			store.on('exception',function(e){
				_self.onException(e);
				if(loadMask && loadMask.hide){
					loadMask.hide();
				}
			});
			store.on('add',function(e){
				_self.onAdd(e);
			});
			store.on('remove',function(e){
				_self.onRemove(e);
			});
			store.on('update',function(e){
				_self.onUpdate(e);
			});
			store.on('localsort',function(e){
				_self.onLocalSort(e);
			});
		},
		__syncUI : function(){
			var _self = this,
				store = _self.get('store');
			if(!store){
				return;
			}
			if(store.get('autoLoad') && store.hasData()){
				_self.onLoad();
			}
		},
		/**
		* @protected
    * @template
		* after store load data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-load}
		*/
		onLoad : function(e){
			
		},
		/**
		* @protected
    * @template
		* occurred exception when store is loading data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-exception}
		*/
		onException : function(e){
			
		},
		/**
		* @protected
    * @template
		* after added data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-add}
		*/
		onAdd : function(e){
		
		},
		/**
		* @protected
    * @template
		* after remvoed data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-remove}
		*/
		onRemove : function(e){
		
		},
		/**
		* @protected
    * @template
		* after updated data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-update}
		*/
		onUpdate : function(e){
		
		},
		/**
		* @protected
    * @template
		* after local sorted data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-localsort}
		*/
		onLocalSort : function(e){
			
		}
	});

	return bindable;
});