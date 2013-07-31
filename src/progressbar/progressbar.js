/**
 * @fileOverview 进度条
 * @author dengbin
 * @ignore
 */

define('bui/progressbar/base',['bui/common'],function(require){

	var BUI = require('bui/common');

	var progressBarView = BUI.Component.View.extend({
		_uiSetPercent : function (v) {

			var _self = this,
				innerEl = _self.get('el').children();
			if(!BUI.isArray(v)){
				v = [v];
			}
			BUI.each(innerEl,function (item,index) {
				$(item).width(v[index] + '%');
			});

		}
	},{
		ATTRS:{
			percent:{}
		}
	});
	/**
 	* 基础进度条，用于显示进度
 	* xclass:'progress-bar'
 	* <pre><code>
 	*  BUI.use('bui/progressbar',function(ProgressBar){
  *   
  *     var Progressbar = ProgressBar.Base,
  *       progressbar = new Progressbar({
  *         elCls : 'progress progress-striped active',
  *         render : '#progressbar',
  *         tpl : '<div class="bar"></div>',
  *         percent:10
  *       });
  *     progressbar.render();
  *  });
  * </code></pre>
 	* @class BUI.ProgressBar.Base
	* @extends BUI.Component.Controller
	*/
	var progressBar = BUI.Component.Controller.extend({

	},{
		ATTRS : {
			/**
	        * 进度百分比
	        * @type {number}
	        */
			percent : {
				view:true,
				value: 0
			},
			tpl : {
				value : '<div class="progress-bar-inner"></div>'
			},
			xview : {
				value : progressBarView
			}
		}

	},{
		xclass:'progress-bar'
	});

	return progressBar;
});