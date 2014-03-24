/**
 * @fileOverview 图表中的文本信息
 * @ignore
 */

define('bui/chart/labels',['bui/common','bui/chart/plotitem','bui/graphic'],function (require) {
	
	var BUI = require('bui/common'),
		Item = require('bui/chart/plotitem'),
		Util = require('bui/graphic').Util,
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
			value : 6
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

		},
		animate : {
			value : true
		},
		duration : {
			value : 400
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
		/**
		 * 添加文本
		 * @param {Object} item 文本配置项
		 */
		addLabel : function(item){
			var _self = this,
				items = _self.get('items'),
				count = items.length;
			items.push(item);

			return _self._addLabel(item,count);

		},
		//绘制文本
		_drawLabels : function(){
			var _self = this,
				items = _self.get('items'),
				cfg;

			BUI.each(items,function(item,index){
				_self._addLabel(item,index);
			});
		},

		_addLabel : function(item,index){
			var _self = this,
				cfg = _self._getLabelCfg(item,index);

			return _self._createText(cfg);
		},
		_getLabelCfg : function(item,index){
			var _self = this,
				label = _self.get('label'),
				renderer = _self.get('renderer');

			if(!BUI.isObject(item)){
				var tmp = item;
				item = {};
				item.text = tmp;
			}

			if(renderer){
				item.text = renderer(item.text,item,index);
			}
			if(item.text == null){
				item.text = '';
			}
			
			item.text = item.text.toString();
			item.x = (item.x || 0) + (label.x || 0);
			item.y = (item.y || 0) + (label.y || 0);
			cfg = BUI.merge(label,item);

			return cfg;
		},
		changeLabel : function(label,item){
			var _self = this,
				index = BUI.Array.indexOf(label,_self.get('children')),
				cfg = _self._getLabelCfg(item,index);
			if(label){
				label.attr('text',cfg.text);
				if(label.attr('x') != cfg.x || label.attr('y') != cfg.y){
					if(Util.svg && _self.get('animate') && !cfg.rotate){
						if(cfg.rotate){
							label.attr('transform','');
						}
						
						label.animate({
							x : cfg.x,
							y : cfg.y
						},_self.get('duration'));
					}else{
						label.attr(cfg);
						if(cfg.rotate){
							label.attr('transform',BUI.substitute('r{rotate} {x} {y}',cfg));
						}
					}
				}
				
			}
		},
		/**
		 * 创建按文本
		 * @private
		 */
		_createText : function(cfg){
			return this.addShape('label',cfg);
		}

	});


	return Labels;
});