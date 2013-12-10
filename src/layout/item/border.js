/**
 * @fileOverview 边框布局选项
 * @ignore
 */

define('bui/layout/borderitem',function (require) {
	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem'),
		CLS_COLLAPSED = 'x-collapsed',
		REGINS = {
			NORTH : 'north',
			EAST : 'east',
			SOUTH : 'south',
			WEST : 'west',
			CENTER : 'center'
		};
		

	/**
	 * 边框布局选项
	 * @class BUI.Layout.Item.Border
	 * @extends BUI.Layout.Item
	 */
	var Border = function(config){
		Border.superclass.constructor.call(this,config);
	};

	Border.ATTRS = {

		/**
		 * 位置
		 * @type {String}
		 */
		region : {

		},
		/**
		 * 标题的模板
		 * @type {Object}
		 */
		titleTpl : {
			value : '<div class="x-border-title x-border-title-{region}">{title}</div>'
		},
		/**
		 * 附加元素
		 * @type {Object}
		 */
		collapseTpl : {
			value : '<s class="x-collapsed-btn x-collapsed-{region}"></s>'
		},
		/**
		 * 是否可以折叠
		 * @type {String}
		 */
		collapsable : {
			value : false
		},
		/**
		 * 是否折叠
		 * @type {String}
		 */
		collapsed : {
			value : false
		},
		/**
		 * 收缩后剩余的宽度或者高度，如果存在title，则以title的高度为准
		 * @type {Object}
		 */
		leftRange : {
			value : 28
		},
		/**
		 * 附加模板
		 * @type {Object}
		 */
		tplProperties : {
			value : [
				{name : 'title',value : 'titleTpl',prev : true},
				{name : 'collapsable',value : 'collapseTpl',prev : true}
			]
		},
		statusProperties : {
			value : ['collapsed']
		}
	};

	Border.REGINS = REGINS;

	BUI.extend(Border,Base);

	BUI.augment(Border,{
		/**
		 * 根据属性附加一些元素
		 * @protected
		 */
		syncElements : function(el,attrs){
			Border.superclass.syncElements.call(this,el,attrs);
			var _self = this,
				el = _self.get('el'),
				property = _self.getCollapseProperty();
			if(_self.get('collapsed') && _self.get(property) == el[property]()){
				_self.collapse(0);
			}
		},
		/**
		 * 展开
		 */
		expand : function(range,duration,callback){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el'),
				toRange = _self.get(property),
				css = {};
			css[property] = toRange;

			el.animate(css,duration,function(){
				_self.set('collapsed',false);
				el.removeClass(CLS_COLLAPSED);
				callback && callback();
			});
		},
		//获取折叠的属性，width,length
		getCollapseProperty : function(){
			var _self = this,
				region = _self.get('region');
			if(region == REGINS.SOUTH || region == REGINS.NORTH){
				return 'height';
			}
			return 'width';
		},
		//获取剩余的宽度或者高度
		_getLeftRange : function(){
			var _self = this,
				el = _self.get('el'),
				left = _self.get('leftRange'),
				titleEl = _self.get('_titleEl');
			return left;
		},
		/**
		 * @protected
		 * @ignore
		 */
		getCollapsedRange : function(){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el');
			return _self.get(property) - _self._getLeftRange(property);
		},
		/**
		 * 折叠
		 */
		collapse : function(duration,callback){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el'),
				left = _self._getLeftRange(property),
				css = {};
			css[property] = left;
			el.animate(css,duration,function(){
				_self.set('collapsed',true);
				el.addClass(CLS_COLLAPSED);
			  if(callback){
			  	callback();
			  }
			});
		}
	});



	return Border;
});