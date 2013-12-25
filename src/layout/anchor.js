/**
 * @fileOverview 锚定布局，根据容器的边缘自动计算宽高
 * @ignore
 */

define('bui/layout/anchor',['bui/common','bui/layout/abstract','bui/layout/anchoritem'],function (require) {
	var BUI = require('bui/common'),
		Abstract = require('bui/layout/abstract'),
		Item = require('bui/layout/anchoritem');
	
	/**
	 * @class BUI.Layout.Anchor
	 * 锚定布局控件
	 * @extends BUI.Layout.Abstract
	 * <pre><code>
	 * var layout = new Anchor(),
			control = new BUI.Component.Controller({
				width:800,
				height:500,
				render : '#J_Layout',
				elCls : 'layout-test',
				children : [{
					layout : {
						anchor : ['100%',50]
					},
					xclass : 'controller',
					content : "一 ['100%',50]"
				},{
					xclass : 'controller',
					layout : {
						anchor : [-100,50]
					},
					content : '二 [-100,50]'
				},{
					xclass : 'controller',
					layout : {
						anchor : ['60%','20%']
					},
					content : "三 ['60%','20%']"
				},{
					xclass : 'controller',
					layout : {
						anchor : ['50%',-300]
					},
					content : "四 ['50%',-300]"
				}],
				plugins : [layout]
			});

		control.render();
	 * </code></pre>
	 */
	var Anchor = function(config){
		Anchor.superclass.constructor.call(this,config)
	};

	Anchor.ATTRS = {
		itemConstructor : {
			value : Item
		},
		itemTpl : {
			value : '<div class="x-layout-item"></div>'
		}
	};

	BUI.extend(Anchor,Abstract);

	return Anchor;
});