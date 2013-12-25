/**
 * @fileOverview 锚定容器的布局项
 * @ignore
 */

define('bui/layout/anchoritem',['bui/common','bui/layout/baseitem'],function (require) {

	var BUI = require('bui/common'),
		Base = require('bui/layout/baseitem');

	//转换anchor的值
	function parseValue(value,type){
		if(BUI.isNumber(value)){
			if(value > 0){ //大于0的正数，返回
				return value;
			}else{
				return '{' + type + '}' + value;
			}
		}
		if(BUI.isString(value) && value.indexOf('-') == 0){
			return '{' + type + '}' + value;
		}
		return value;
	}
	/**
	 * @class BUI.Layout.Item.Anchor
	 * 锚定布局项
	 */
	var Anchor = function(config){
		Anchor.superclass.constructor.call(this,config);
	};

	Anchor.ATTRS = {
		/**
		 * 锚定容器的方式，有以下几种方式：
		 *
		 *  - 默认方式： ['100%'] 宽度100%,高度auto
		 *  - 指定宽高： ['100%','50%'] 宽100%, 高 100%
		 *  - 指定数值:  [100,100] 宽高都是100
		 *  - 指定负数:  [-100,-50] 容器宽度减去100,宽度高度减去 50
		 * @type {Array}
		 */
		anchor : {
			value : ['100%']
		}
	};

	BUI.extend(Anchor,Base);

	BUI.augment(Anchor,{

		/**
		 * @protected
		 * @override
		 * @ignore
		 * 覆盖返回的布局相关的属性
		 */
		getLayoutAttrs : function(){
			var _self = this,
				anchor = _self.get('anchor'),
				attrs = BUI.mix({},_self.getAttrVals()),
				width = anchor[0],
				height = anchor[1];

			attrs.width = parseValue(width,'width');
			attrs.height = parseValue(height,'height');

			return attrs;
		}
	});

	return Anchor;
});