/**
 * @fileOverview 布局插件的子项，用于封装控件，控制控件的位置
 * @ignore
 */

define('bui/layout/baseitem',['bui/common'],function (require) {

	var BUI = require('bui/common');

	function parseValue(attrs,value){
		if(!BUI.isString(value)){ //只转换字符串
			return value;
		}
		if(value.indexOf('{') != -1){ //如果有可替换的值，进行计算
			value = BUI.substitute(value,attrs);
			value = BUI.JSON.looseParse(value); //转成对应的值
		}
		return value;
	}

	/**
	 * @class BUI.Layout.Item
	 * 布局插件的子项，用于操作位置、宽度等
	 * @extends BUI.Base
	 */
	var Item = function(config){
		Item.superclass.constructor.call(this,config);
		this.init();
	};

	Item.ATTRS = {

		/**
		 * 自适应内部控件,自适应的类型,注意设置了适应类型后，不应该再设置控件的对应的宽度或者高度
		 * 
		 *   - none : 内部控件不自适应（默认）
		 *   - width : 内部控件自适应宽度，当layout重新布局时宽度自适应
		 *   - height : 内部控件自适应高度，当layout重新布局时高度自适应
		 *   - both : 内部控件自适应宽高，当layout重新布局时宽度、高度自适应
		 * 	<pre>
		 * <code>
		 *
		 *  new Controller({
		 *    ...
		 *    children : [
		 *    	{
		 *    		xclass : 'grid',
		 *    		layout : {
		 *    			fit : 'width'
		 *    		}
		 *    		//width : '100px',不要再设置宽度
		 *    	}
		 *    ],
		 * 		plugins : [BUI.Layout.Anchor]
		 *  });
		 * </code>
		 * </pre>
		 * 
		 * @cfg {String} fit
		 */
		fit : {
			value : 'none'
		},
		/**
		 * 所属的layout
		 * @readOnly
		 * @type {BUI.Layout.Abstract}
		 */
		layout : {

		},
		/**
		 * 封装的控件
		 * <pre>
		 * <code>
		 *  var control =	item.get('control');
		 * </code>
		 * </pre>
		 * @type {Object}
		 */
		control : {

		},
		/**
		 * 封装控件的容器的样式，默认为空,也可以设置在layout上传递进来
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width',
		 *  		wraperCls : 'b'
		 *  	},
		 *  	itemTpl : '&lt;div class="a">&lt;div class="b">&lt;/div>&lt;/div>'
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @cfg {string} wraperCls
		 */
		wraperCls : {

		},
		/**
		 * 容器
		 * @readOnly
		 * @type {jQuery}
		 */
		container : {

		},
		/**
		 * 如果srcNode指定，那么不会使用container属性，也不会生成DOM
		 * @type {jQuery}
		 */
		srcNode : {

		},
		/**
		 * @protected
		 * 同步的css属性
		 * @type {Array}
		 */
		cssProperties : {
			value : ['width','height']
		},
		/**
		 * @protected
		 * 同步的attributes
		 * @type {Array}
		 */
		attrProperties : {

		},
		/**
		 * @protected
		 * 状态相关的字段
		 * @type {Array}
		 */
		statusProperties : {

		},
		/**
		 * @protected
		 * 附加模板
		 * @type {Object}
		 */
		tplProperties : {

		},
		/**
		 * 当前项的DOM
		 * <pre>
		 * <code>
		 *  var el =	item.get('el');
		 * </code>
		 * </pre>
		 * @type {jQuery}
		 */
		el : {

		},
		/**
		 * 应用的样式
		 * @type {Object}
		 */
		elCls : {

		},
		/**
		 * 模板，也可以直接在layout上设置itemTpl
		 * <pre>
		 * <code>
		 *  var layout = new BUI.Layout.Anchor({
		 *  	defaultCfg : {
		 *  		fit : 'width'
		 *  	},
		 *  	itemTpl : '&lt;div class="a">&lt;div class="b">&lt;/div>&lt;/div>',
		 *  	wraperCls : 'b'
		 *  });
		 *
		 *  new Controller({
		 *    ...
		 * 		plugins : [layout]
		 *  });
		 * </code>
		 * </pre>
		 * @cfg {String} tpl
		 */
		tpl : {

		}
	};

	BUI.extend(Item,BUI.Base);

	BUI.augment(Item,{

		/**
		 * 初始化
		 */
		init : function(){
			var _self = this,
				el = _self._wrapControl();
			_self.set('el',el);
			_self.syncItem();
		},
		/**
		 * 获取选项的DOM节点
		 * <pre>
		 * <code>
		 *  var el =	item.getElement();
		 * </code>
		 * </pre>
		 * @return {jQuery} 操作节点
		 */
		getElement : function(){
			return this.get('el');
		},
		//封装控件
		_wrapControl : function(){
	
			var _self = this,
				control = _self.get('control'),
				controlEl = control.get('el'),
				elCls = _self.get('elCls'),
				container = _self._getContainer(controlEl),
				tpl = BUI.substitute(_self.get('tpl'),_self.getLayoutAttrs()) ,
				node = $(tpl).appendTo(container),
				bodyEl;
			if(elCls){
				node.addClass(elCls);
			}
			bodyEl = _self.getControlContainer(node);
			controlEl.appendTo(bodyEl);
			_self.set('bodyEl',bodyEl);

			return node;
		},
		/**
		 * 获取内部控件的容器
		 * @return {jQuery} 容器
		 */
		getControlContainer : function(el){
			var _self = this,
				wraperCls = _self.get('wraperCls');
			if(wraperCls){
				return el.find('.' + wraperCls);
			}
			return el;
		},
		/**
		 * 同步属性到子项,同步css和attr，一般先设置宽高等信息后,再调用此方法
		 * @protected
		 */
		syncItem : function(attrs){
			attrs = attrs || this.getLayoutAttrs();
			var _self = this,
				el = _self.get('el'),
				css = _self._getSyncCss(attrs),
				attr = _self._getSyncAttr(attrs);
			
			el.css(css);
			el.attr(attr);
			_self.syncStatus(el,attrs); //同步状态
			_self.syncElements(el,attrs); //同步DOM元素
			_self.syncFit(); //同步内部控件的宽高
		},
		/**
		 * 根据属性附加一些元素
		 * @protected
		 */
		syncElements : function(el,attrs){
			var _self = this,
				tplProperties = _self.get('tplProperties');

			if(tplProperties){
				BUI.each(tplProperties,function(item){
					_self.synTpl(el,item,attrs);
				});
			}
		},
		/**
		 * @protected
		 * 同步选项
		 */
		synTpl : function(el,item,attrs){
			var _self = this,
				name = item.name,
				elName = '_'+name + 'El', //title 使用_titleEl作为临时变量存储对应的DOM 
				tpl,
				m, //使用的附加方法
				tplEl = _self.get(elName);
			if(attrs[name]){
				if(!tplEl){
					tpl = _self.get(item.value);
					tpl = BUI.substitute(tpl,attrs);
					m = item.prev ? 'prependTo' : 'appendTo';
					tplEl = $(tpl)[m](el);
					_self.set(elName,tplEl);
				}
			}else if(tplEl){
				tplEl.remove();
			}
		},
		/**
		 * @protected
		 * 同步状态
		 */
    syncStatus : function(el,attrs){
    	el = el || this.get('el');
    	attrs = attrs || this.getLayoutAttrs();
    	var _self = this,
    		statusProperties = _self.get('statusProperties');
    	if(statusProperties){
    		BUI.each(statusProperties,function(status){
    			var value = _self.get(status);
    			if(value != null){
    				var m = value ? 'addClass' : 'removeClass',
    					cls = 'x-' + status;
    				el[m](cls);
    			}
    		});
    	}
		},
		/**
		 * 同步自适应
		 * <pre>
		 * <code>
		 *  var item = layout.getItem(control);
		 *
		 *  item.set('width',width);
		 *
		 *  //也可以设置多个属性
		 *  item.set({
		 *  	height : 100,
		 *  	width : 100
		 *  });
		 *  item.syncFit();
		 * </code>
		 * </pre>
		 */
		syncFit : function(){
			var _self = this,
				control = _self.get('control'),
				fit = _self.get('fit');
			if(fit === 'none'){
				return;
			}
			if(fit === 'width'){
				_self._syncControlWidth(control);
				return;
			}
			if(fit === 'height'){
				_self._syncControlHeight(control);
				return;
			}
			if(fit === 'both'){
				_self._syncControlWidth(control);
				_self._syncControlHeight(control);
			}
		},
		//同步控件的宽度
		_syncControlWidth : function(control){
			var _self = this,
				width = _self.get('width') || _self.get('el').width(),
				appendWidth = control.getAppendWidth();
			control.set('width',width - appendWidth);

		},
		//同步控件的高度
		_syncControlHeight : function(control){
			var _self = this,
				height = _self.getFitHeight(),
				appendHeight = control.getAppendHeight();
			control.set('height',height - appendHeight);
		},
		/**
		 * @protected
		 * 获取内部控件自适应的高度
		 * @return {Number} 自适应的高度
		 */
		getFitHeight : function(){
			var _self = this,
				el = _self.get('el'),
				bodyEl = _self.get('bodyEl'),
				siblings,
				outerHeight = _self.get('height') || el.height(),
				height = outerHeight;
			if(bodyEl[0] == el[0]){ //如果控件的容器等于外层容器
				return outerHeight;
			}
			siblings = bodyEl.siblings(); //获取外层容器减去兄弟元素的高度
			BUI.each(siblings,function(elem){
				var node = $(elem);
				if(node.css('position') !== 'absolute'){
					height -= node.outerHeight();
				}
			});
			return height;
		},
		/**
		 * @protected
		 * 获取布局相关的属性
		 * @return {Object} 获取布局相关的属性
		 */
		getLayoutAttrs : function(){
			return this.getAttrVals();
		},
		//获取需要同步的css属性
		_getSyncCss : function(attrs){
			var _self = this,
				properties = _self.get('cssProperties'),
				dynacAttrs = _self._getDynacAttrs(),
				css = {};

			BUI.each(properties,function(p){
				css[p] = parseValue(dynacAttrs,attrs[p]);
			});
			return css;
		},
		//获取动态的值，进行计算
		_getDynacAttrs : function(){
			var _self = this,
				container = _self.get('container');
			return {
				width : container.width(),
				height : container.height()
			};
		},
		//获取需要
		_getSyncAttr : function(attrs){
			var _self = this,
				properties = _self.get('attrProperties'),
				attr = {};

			BUI.each(properties,function(p){
				attr[p] = attrs[p];
			});
			return attr;
		},
		//获取容器
		_getContainer : function(controlEl){
			var _self = this,
				container = _self.get('container');
			if(container){
				return container;
			}
			return controlEl.parent();
		},	
		/**
		 * 释放
		 */
		destroy : function(){
			var _self = this;
			_self.get('el').remove();
			_self.off();
			_self.clearAttrVals();
		}
	});

	return Item;
});