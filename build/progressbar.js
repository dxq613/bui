/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/progressbar',['bui/common','bui/progressbar/base','bui/progressbar/load'],function (require) {
  var BUI = require('bui/common'),
    ProgressBar = BUI.namespace('ProgressBar');
  BUI.mix(ProgressBar,{
    Base : require('bui/progressbar/base'),
    Load : require('bui/progressbar/load')
  });

  return ProgressBar;
});
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
 	* \u57fa\u7840\u8fdb\u5ea6\u6761\uff0c\u7528\u4e8e\u663e\u793a\u8fdb\u5ea6
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
	        * \u8fdb\u5ea6\u767e\u5206\u6bd4
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
define('bui/progressbar/load',['bui/progressbar/base'],function(require){

	var Base = require('bui/progressbar/base'),
	 	notStarted = 0,
		hasStarted = 1,
		hasEnded = 2;
	/**
	 * \u5f02\u6b65\u52a0\u8f7d\u8fdb\u5ea6\u6761
	 *<pre><code>
	 *  BUI.use('bui/progressbar',function(ProgressBar){
   *   
   *    var Progressbar = ProgressBar.Load;
   *    var num = 10,
   *      ajaxCfg = {     
   *        url : 'data/progress-bar-data.php',
   *        dataType : 'json',
   *        data : {
   *          id :num
   *        }
   *      };
   *    var progressbar = new Progressbar({
   *      render : '#progressbar',
   *      tpl : '<div class="bar"></div>',
   *      elCls:'progress progress-striped active',
   *      ajaxCfg : ajaxCfg,
   *      interval : 1000
   *    });
   *
   *    progressbar.render();
	 *		$('.button-primary').click(function(){
   *      num = 10;
   *      ajaxCfg.data.id = num;
   *      progressbar.start();
   *    });
 
   *    $('.button-danger').click(function(){
   *      progressbar.cancel();
   *    });
   *      
   *  });
   * </code></pre>
	 * @extends BUI.ProgressBar.Base
	 * @class  BUI.ProgressBar.Load
	 */
	var loadProgressBar = Base.extend({
		/**
	     * @protected
	     * @ignore
	     */
		bindUI : function () {
			var _self = this;

			_self.on('afterPercentChange',function (ev) {
				if(_self.isLoading()){
					var percent = _self.get('percent');
					if(percent == 100 ){
						_self.onCompleted();
					}
					_self.onChange();
				}
			});

		},
		/**
		 * \u5f00\u59cb
		 * <pre><code>
		 *   progressbar.start();
		 * </code></pre>
		 */
		start : function  () {
			var _self = this;
			if(!_self.isLoading()){
				_self.onstart();
			}
		},
		/**
		 * \u5b8c\u6210
		 * <pre><code>
		 *   progressbar.complete();
		 * </code></pre>
		 */
		complete : function(){
			var _self = this;
			clearTimeout(_self.get('t'));
			_self.set('percent',100);
			
		},
		/**
		 * \u53d6\u6d88
		 * <pre><code>
		 *   progressbar.cancel();
		 * </code></pre>
		 */
		cancel : function(){
			var _self = this;
			clearTimeout(_self.get('t'));
			if(_self.get('percent')){
				_self.set('percent',0);
			}
			_self.set('status',notStarted);
		},
		/**
		 * \u5f00\u59cb
		 * @protected
		 */
		onstart : function(){
			var _self = this,
				cfg = _self.get('cfg');

			_self.set('percent',0);
			_self.set('status',hasStarted);
			
			_self.fire('start',cfg);
			_self._startLoad();
		},
		/**
		 * \u52a0\u8f7d\u53d8\u5316
		 * @protected
		 */
		onChange : function(){
			var _self = this;
			_self.fire('loadchange');
		},

		/**
		 * \u5b8c\u6210
		 * @protected
		 */
		onCompleted : function(){
			var _self = this;
			_self.set('status',hasEnded);
			_self.fire('completed');
			
		},
		/**
		 * \u662f\u5426\u6b63\u5728\u52a0\u8f7d
		 * @return {Boolean} \u662f\u5426\u6b63\u5728\u52a0\u8f7d
		 */
		isLoading : function  () {
			return this.get('status') === hasStarted;
		},
		/**
		 * \u662f\u5426\u5df2\u7ecf\u52a0\u8f7d\u5b8c\u6bd5
		 * @return {Boolean} \u662f\u5426\u52a0\u8f7d\u5b8c\u6bd5
		 */
		isCompleted : function () {
			return this.get('status') === hasEnded;
		},
		_startLoad : function () {
			var _self = this,
				ajaxCfg = _self.get('ajaxCfg'),
				interval = _self.get('interval'),
				t;
			ajaxCfg.success = function(data){
				var percent = data.percent;
				_self.set('percent',percent);
				if(percent < 100 && _self.isLoading()){
					t = setTimeout(function(){
						$.ajax(ajaxCfg);
					},interval);
					_self.set('t',t);
				}
			};
			$.ajax(ajaxCfg);
			
		}
	},{
		ATTRS : {
			/**
			 * \u8fdb\u5ea6\u6761\u72b6\u6001
			 * 0\uff1a \u672a\u5f00\u59cb
			 * 1 \uff1a \u5df2\u5f00\u59cb
			 * 2 \uff1a \u4ee5\u7ed3\u675f
			 * @type {Number}
			 */
			status : {
				value : 0
			},
			/**
			 * ajax\u914d\u7f6e\u9879
			 * @type {Object}
			 */
			ajaxCfg : {

			},
			/**
			 * \u53d1\u9001\u8bf7\u6c42\u65f6\u95f4\u95f4\u9694
			 * @type {number}
			 */
			interval : {
				value : 500
			},
			/**  
	        * \u5f53\u6570\u636e\u52a0\u8f7d\u5b8c\u6210\u540e
	        * @name BUI.ProgressBar.Load  
	        * @event  
	        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61\uff0c\u5305\u542b\u52a0\u8f7d\u6570\u636e\u65f6\u7684\u53c2\u6570
	        */
			events : {
				value : [
					'start',
					'loadchange',
					'completed'
				]
			}
		}
	},{
		xclass : 'progress-bar-load'
	});

	return loadProgressBar;
});
