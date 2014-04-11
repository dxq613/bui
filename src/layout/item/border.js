/**
 * @fileOverview 边框布局选项
 * @ignore
 */

define('bui/layout/borderitem',['bui/common','bui/layout/baseitem'],function (require) {
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
		 *<ol>
     * <li>fit: 'none', 内部控件不跟随布局项的宽高自适应</li>
     * <li>fit: 'width',内部控件跟随布局项的宽度进行自适应</li>
     * <li>fit: 'height',内部控件跟随布局项的高度进行自适应</li>
     * <li>fit: 'both',内部控件跟随布局项的宽度、高度都进行自适应</li>
     *</ol>
		 * @cfg {String} region
		 */
		region : {

		},
		/**
		 * 标题的模板
		 * <pre><code>
		 * 	children : [{
					layout : {
						title : 'north',
						region : 'north',
						height : 50,
						titleTpl : '&lt;div class="x-border-title x-border-title-{region}">{title}&lt;/div>'
					},
					width : 100,
					height :15,
					elCls : 'red',
					xclass : 'grid',
					content : "无自适应"
				}]
		 * </code></pre>
		 * @cfg {Object} titleTpl
		 */
		titleTpl : {
			value : '<div class="x-border-title x-border-title-{region}">{title}</div>'
		},
		/**
		 * 收缩展开的dom的模板
		 * <pre><code>
		 * 	children : [{
					layout : {
						title : 'north',
						region : 'north',
						height : 50,
						collapsable : true,//只有callapsable:true，collapseTpl才会生效
						collapseTpl : '&lt;s class="x-collapsed-btn x-collapsed-{region}">&lt;/s>'
					},
					width : 100,
					height :15,
					elCls : 'red',
					xclass : 'grid',
					content : "无自适应"
				}]
		 * </code></pre>
		 * @cfg {Object} collapseTpl
		 */
		collapseTpl : {
			value : '<s class="x-collapsed-btn x-collapsed-{region}"></s>'
		},
		/**
		 * 是否可以折叠
		 *  <pre><code>
		 * 	children : [{
					layout : {
						title : 'north',
						region : 'north',
						height : 50,
						collapsable : true
					},
					width : 100,
					height :15,
					elCls : 'red',
					xclass : 'grid',
					content : "无自适应"
				}]
		 * </code></pre>
		 * @cfg {Boolean} collapsable
		 */
		collapsable : {
			value : false
		},
		/**
		 * 是否默认折叠
		 * @cfg {Boolean} collapsed
		 */
		/**
		 * 是否折叠
		 * @type {Boolean}
		 */
		collapsed : {
			value : false
		},
		/**
		 * 收缩后剩余的宽度或者高度，如果存在title，则以title的高度为准
		 * @cfg {Number} leftRange
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
		 * <pre>
		 * <code>
		 * var item = layout.getItemsByRegion('west')[0];
		 * item && item.expand()
		 * </code>
		 * </pre>
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
				left = _self.get('leftRange');
			return left;
		},
		/**
		 * @protected
		 * @ignore
		 */
		getCollapsedRange : function(){
			var _self = this,
				property = _self.getCollapseProperty(),
				el = _self.get('el'),
				val = _self.get(property);
			if(BUI.isString(val)){
				var dynacAttrs = _self._getDynacAttrs();
				if(val.indexOf('{') != -1){
					val = BUI.substitute(val,dynacAttrs);
					val = BUI.JSON.looseParse(val);
				}
				else if(val.indexOf('%') != -1){
					val = parseInt(val,10) * 0.01 * dynacAttrs[property];
				}else{
					val = parseInt(val,10);
				}
			}
			return val - _self._getLeftRange(property);
		},
		/**
		 * 折叠
		 * <pre>
		 * <code>
		 * var item = layout.getItemsByRegion('west')[0];
		 * item && layout.collapseItem(item);
		 * </code></pre>
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