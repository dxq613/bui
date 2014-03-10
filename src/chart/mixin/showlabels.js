/**
 * 内部显示Labels的控件扩展
 * @ignore
 */

define('bui/chart/showlabels',['bui/chart/labels'],function (require) {
	var BUI = require('bui/common'),
		Labels = require('bui/chart/labels');

	/**
	 * @class BUI.Chart.ShowLabels
	 * 内部显示文本集合
	 */
	var ShowLabels = function(){

	};

	ShowLabels.ATTRS = {

		/**
		 * 多个文本的配置项
		 * @type {Object}
		 */
		labels : {

		}
	};

	BUI.augment(ShowLabels,{
 
		/**
		 * @protected
		 * 渲染文本
		 */
		renderLabels : function(){
			var _self = this,
          labels = _self.get('labels'),
          labelsGroup;
      if(!labels){
        return;
      }
      if(!labels.items){
      	labels.items = [];
      }

      /*labels.x = _self.get('x');
      labels.y = _self.get('y');*/

      labelsGroup = _self.addGroup(Labels,labels);
      _self.set('labelsGroup',labelsGroup);
		},
		/**
		 * 设置labels
		 * @param  {Array} items items的配置信息
		 */
		resetLabels : function(items){
			var _self = this,
				labels = _self.get('labels');
				
			if(!labels){
				return;
			}
			
			var labelsGroup = _self.get('labelsGroup'),
				children = labelsGroup.get('children'),
				count = children.length;
			items = items || labels.items;
			BUI.each(items,function(item,index){
				if(index < count){
					var label = children[index];
					labelsGroup.changeLabel(label,item);
				}else{
					_self.addLabel(item.text,item);
				}
			});

			for(var i = count - 1; i >= items.length ; i--){
				children[i].remove();
			}
		},
		/**
		 * @protected
		 * 添加文本项
		 * @param {String|Number} value  显示的文本
		 * @param {Object} offsetPoint 显示的位置
		 */
    addLabel : function(value,offsetPoint){
      var _self = this,
          labelsGroup = _self.get('labelsGroup'),
          label = {},
          rst;
      if(labelsGroup){
      	label.text = value;
	      label.x = offsetPoint.x;
	      label.y = offsetPoint.y;
        label.point = offsetPoint;
	      rst = labelsGroup.addLabel(label);
      }
      return rst;
    },
    /**
     * @protected
     * 移除文本
     */
    removeLabels : function(){
    	var _self = this,
    		labelsGroup = _self.get('labelsGroup');
    	labelsGroup && labelsGroup.remove();
    }
	})

	return ShowLabels;
});