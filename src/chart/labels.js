/**
 * @fileOverview 图表中的文本信息
 * @ignore
 */

define('bui/chart/labels',['bui/common','bui/chart/plotitem'],function (require) {
	
	var BUI = require('bui/common'),
		Item = require('bui/chart/plotitem'),
		CLS_LABELS = 'x-chart-labels';

	/**
	 * @class BUI.Chart.Labels
	 * 文本集合
	 * @extends BUI.Chart.PlotItem
	 */
	var Labels = function(cfg){
		Labels.superclass.constructor.call(this,cfg);
	};

	Labels.ATTRS = {

		elCls : {
			value : CLS_LABELS
		},
		zIndex : {
			value : 5
		},
		/**
		 * 文本集合
		 * @type {Array}
		 */
		items : {

		},
		/**
		 * 内部label的默认配置信息
		 * @type {Object}
		 */
		label : {

		},
		/**
		 * 格式化函数 function (text,item)
		 * @type {Function}
		 */
		renderer : {

		}

	};

	BUI.extend(Labels,Item);

	BUI.augment(Labels,{
		
		//渲染控件
		renderUI : function(){
			var _self = this;
			Labels.superclass.renderUI.call(_self);
			_self._drawLabels();
		},
		//绘制文本
		_drawLabels : function(){
			var _self = this,
				items = _self.get('items'),
				label = _self.get('label'),
				renderer = _self.get('renderer'),
				cfg;

			BUI.each(items,function(item,index){
				if(!BUI.isObject(item)){
					var tmp = item;
					item = {};
					item.text = tmp;
				}
				
				if(renderer){
					item.text = renderer(item.text,item,index);
				}
				item.text = item.text.toString();
				item.x = (item.x || 0) + (label.x || 0);
				item.y = (item.y || 0) + (label.y || 0);
				cfg = BUI.merge(label,item);
				_self._createText(cfg);
			});
		},
		/**
		 * 创建按文本
		 * @private
		 */
		_createText : function(cfg){
			this.addShape('label',cfg);
		}

	});


	return Labels;
});