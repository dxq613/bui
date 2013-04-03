/**
 * @fileOverview 缩放
 * @ignore
 */

define('bui/imgmaps/resize', function (require) {

	var BUI = require('bui/common'),
		resizeId = BUI.guid('resize');

	/**
	 * [Resize description]
	 */
	function getResizeBtn(self){
		return $(self.get('resizeTpl'));
	}
	function Resize(obj){
		
	}

	Resize.ATTRS = {
		minWidth : {
			value : 20
		},
		minHeight : {
			value : 20
		},
		resizeNode : {

		},
		resizing : {
			setter : function (v){
				if(v === true){
					return {};
				}
			},
			value : null
		}
	}

	Resize.prototype = {
		__bindUI : function (){
			var _self = this,
				resizeNode = _self.get('resizeNode');
			resizeNode.on('mousedown',function(e){
				if(e.which == 1){
					e.preventDefault();
					e.stopPropagation();
					_self.set('resizing',{
						width : _self.get('width'),
						height : _self.get('height'),
						differX : _self.get('el').outerWidth() - _self.get('width'),
						differY : _self.get('el').outerHeight() - _self.get('height'),
						startX : e.pageX,
						startY : e.pageY
					});
					registEvent();
				}
			});
			/**
			 * @private
			 */
			function registEvent(){
				$(document).on('mousemove',mouseMove);
				$(window).on('mouseup',mouseUp);
			}
			/**
			 * @private
			 */
			function unregistEvent(){
				$(document).off('mousemove',mouseMove);
                $(window).off('mouseup',mouseUp);
			}
			/**
			 * @private
			 */
			function mouseMove(e){
				var resizing = _self.get('resizing');
				if(resizing){
					e.preventDefault();
					_self._resizeTo(e.pageX,e.pageY,resizing);
				}
			}
			/**
			 * @private
			 */
			function mouseUp(e){
				if(e.which == 1){
					_self.set('resizing',false);
					unregistEvent();
				}
			}		
		},
		startResize : function(){
			var _self = this,
				resizeNode = _self.get('resizeNode'),
				resizing = _self.get('resizing');
				if(!resizing){
					resizeNode.on('mousedown');
				}
		},
		_resizeTo : function(x,y,resizing){
			var _self = this,
				resizing = resizing || _self.get('resizing'),
				width = resizing.width + x - resizing.startX,
				height = resizing.height + y - resizing.startY,
				constraint = _self.get('constraint');
			var leftValue= _self.get('left'),
				topValue = _self.get('top');
			if(width > (constraint.width() - leftValue - resizing.differX)){
				width = constraint.width() - leftValue - resizing.differX;
			}else if(width <  _self.get('minWidth')){
				width = _self.get('minWidth');
			}
			if(height > constraint.height() - topValue - resizing.differY){
				height = constraint.height() - topValue - resizing.differY;
			}else if(height <  _self.get('minHeight')){
				height = _self.get('minHeight');
			}
			_self.set('width',width);
			_self.set('height',height);
		}
	}
	return Resize;
});