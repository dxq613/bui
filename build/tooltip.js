/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/tooltip',['bui/common','bui/tooltip/tip','bui/tooltip/tips'],function (require) {
  var BUI = require('bui/common'),
    Tooltip = BUI.namespace('Tooltip'),
    Tip = require('bui/tooltip/tip'),
    Tips = require('bui/tooltip/tips');

  BUI.mix(Tooltip,{
    Tip : Tip,
    Tips : Tips
  });
  return Tooltip;
});
define('bui/tooltip/tip',['bui/common','bui/overlay'],function (require) {
  var BUI = require('bui/common'),
    Overlay = require('bui/overlay'),
    CLS_ALIGN_PREFIX = 'x-align-',
    MAP_TYPES = {
      left : ['cl','cr'], //\u5c45\u5de6
      right : ['cr','cl'], //\u5c45\u53f3
      top : ['tc','bc'], //\u5c45\u4e0a
      bottom : ['bc','tc'], //\u5c45\u4e0b
      'top-left' : ['tl','bl'],
      'top-right' : ['tr','br'],
      'bottom-left' : ['bl','tl'],
      'bottom-right' : ['br','tr']
    };
  //\u83b7\u53d6\u8ddd\u79bb
  function getOffset(type,offset){
    if(type === 'left'){
      return [-1 * offset,-4];
    }
    if(type === 'right'){
      return [offset,-4];
    }
    if(type.indexOf('top')){
      return [0,offset];
    }

    if(type.indexOf('bottom')){
      return [0,-1 * offset];
    }
  }

  var TipView = Overlay.OverlayView.extend({
    renderUI : function(){

    },
    //\u83b7\u53d6\u663e\u793a\u6587\u672c\u7684\u5bb9\u5668
    _getTitleContainer : function(){
      return  this.get('el');
    },
    //\u8bbe\u7f6e\u6587\u672c
    _uiSetTitle : function(title){
      var _self = this,
        titleTpl = _self.get('titleTpl'),
        container = _self._getTitleContainer(),
        titleEl = _self.get('titleEl'),
        tem;
      if(titleEl){
        titleEl.remove();
      }
      title = title || '';
      if(BUI.isString(title)){
        title = {title : title};
      }
      tem = BUI.substitute(titleTpl,title);
      titleEl = $(tem).appendTo(container);
      _self.set('titleEl',titleEl);
    },
    //\u8bbe\u7f6e\u5bf9\u9f50\u6837\u5f0f
    _uiSetAlignType : function(type,ev){
      var _self = this;
      if(ev && ev.prevVal){
        _self.get('el').removeClass(CLS_ALIGN_PREFIX + ev.prevVal);
      }
      if(type){
        _self.get('el').addClass(CLS_ALIGN_PREFIX + type);
      }
    }
  },{
    ATTRS : {
      title : {},
      titleEl : {},
      alignType : {}
    }
  },{
    xclass : 'tooltip-view'
  });
  
  /**
   * @class BUI.Tooltip.Tip
   * @extends BUI.Overlay.Overlay
   * \u7b80\u6613\u7684\u63d0\u793a\u4fe1\u606f
   * 
   * ** \u4f60\u53ef\u4ee5\u7b80\u5355\u7684\u4f7f\u7528\u5355\u4e2atip **
   * <pre><code>
   * BUI.use('bui/tooltip',function (Tooltip) {
   *  //\u4e0d\u4f7f\u7528\u6a21\u677f\u7684\uff0c\u5de6\u4fa7\u663e\u793a
   *   var t1 = new Tooltip.Tip({
   *     trigger : '#t1',
   *     alignType : 'left', //\u65b9\u5411
   *     showArrow : false, //\u4e0d\u663e\u793a\u7bad\u5934
   *     offset : 5, //\u8ddd\u79bb\u5de6\u8fb9\u7684\u8ddd\u79bb
   *     title : '\u65e0\u4efb\u4f55\u6837\u5f0f\uff0c<br>\u5de6\u8fb9\u7684\u63d0\u793a\u4fe1\u606f'
   *   });
   *   t1.render();
   *  });
   * </code></pre>
   *
   * ** \u4e5f\u53ef\u4ee5\u914d\u7f6e\u6a21\u677f **
   * <pre><code>
   * BUI.use('bui/tooltip',function (Tooltip) {
   *  //\u4f7f\u7528\u6a21\u677f\u7684\uff0c\u5de6\u4fa7\u663e\u793a
   *   var t1 = new Tooltip.Tip({
   *     trigger : '#t1',
   *     alignType : 'left', //\u65b9\u5411
   *     titleTpl : '&lt;span class="x-icon x-icon-small x-icon-success"&gt;&lt;i class="icon icon-white icon-question"&gt;&lt;/i&gt;&lt;/span&gt;\
   *     &lt;div class="tips-content"&gt;{title}&lt;/div&gt;',
   *     offset : 5, //\u8ddd\u79bb\u5de6\u8fb9\u7684\u8ddd\u79bb
   *     title : '\u65e0\u4efb\u4f55\u6837\u5f0f\uff0c&lt;br&gt;\u5de6\u8fb9\u7684\u63d0\u793a\u4fe1\u606f'
   *   });
   *   t1.render();
   *  });
   * </code></pre>
   */
  var Tip = Overlay.Overlay.extend({
    //\u8bbe\u7f6e\u5bf9\u9f50\u65b9\u5f0f
    _uiSetAlignType : function(type){
      var _self = this,
        offset = _self.get('offset'),
        align = _self.get('align') || {},
        points = MAP_TYPES[type];
      if(points){
        align.points = points;
        if(offset){
          align.offset = getOffset(type,offset);
        }
        _self.set('align',align);
      }
    }
  },{
    ATTRS : {
      //\u4f7f\u7528\u59d4\u6258\u7684\u65b9\u5f0f\u663e\u793a\u63d0\u793a\u4fe1\u606f
      delegateTigger : {
        value : true
      },
      /**
       * \u5bf9\u9f50\u7c7b\u578b\uff0c\u5305\u62ec\uff1a top,left,right,bottom\u56db\u79cd\u5e38\u7528\u65b9\u5f0f\uff0c\u5176\u4ed6\u5bf9\u9f50\u65b9\u5f0f\uff0c\u53ef\u4ee5\u4f7f\u7528@see{BUI.Tooltip.Tip#property-align}\u5c5e\u6027
       * 
       * @type {String}
       */
      alignType : {
        view : true
      },
      /**
       * \u663e\u793a\u7684\u5185\u5bb9\uff0c\u6587\u672c\u6216\u8005\u952e\u503c\u5bf9
       * <pre><code>
       *     var tip =  new Tip({
       *        title : {a : 'text a',b:'text b'}, //\u5c5e\u6027\u662f\u5bf9\u8c61
       *        titleTpl : '<p>this is {a},because {b}</p>' // <p>this is text a,because text b</p>
       *      });
       * </code></pre>
       * @cfg {String|Object} title
       */
      /**
       * \u663e\u793a\u7684\u5185\u5bb9
       * <pre><code>
       *  //\u8bbe\u7f6e\u6587\u672c
       *  tip.set('title','new title');
       *
       *  //\u8bbe\u7f6e\u5bf9\u8c61
       *  tip.set('title',{a : 'a',b : 'b'})
       * </code></pre>
       * @type {Object}
       */
      title : {
        view : true
      },
      /**
       * \u663e\u793a\u5bf9\u9f50\u7bad\u5934
       * @override
       * @default true
       * @cfg {Boolean} [showArrow = true]
       */
      showArrow : {
        value : true
      },
      /**
       * \u7bad\u5934\u653e\u7f6e\u5728\u7684\u4f4d\u7f6e\uff0c\u662f\u4e00\u4e2a\u9009\u62e9\u5668\uff0c\u4f8b\u5982 .arrow-wraper
       * <pre><code>
       *     new Tip({ //\u53ef\u4ee5\u8bbe\u7f6e\u6574\u4e2a\u63a7\u4ef6\u7684\u6a21\u677f
       *       arrowContainer : '.arrow-wraper',
       *       tpl : '<div class="arrow-wraper"></div>'
       *     });
       *     
       *     new Tip({ //\u4e5f\u53ef\u4ee5\u8bbe\u7f6etitle\u7684\u6a21\u677f
       *       arrowContainer : '.arrow-wraper',
       *       titleTpl : '<div class="arrow-wraper">{title}</div>'
       *     });
       * </code></pre>   
       * @cfg {String} arrowContainer
       */
      arrowContainer : {
        view : true
      },
      //\u81ea\u52a8\u663e\u793a
      autoHide : {
        value : true
      },
      //\u8986\u76d6\u81ea\u52a8\u9690\u85cf\u7c7b\u578b
      autoHideType : {
        value : 'leave'
      },
      /**
      * \u663e\u793a\u7684tip \u8ddd\u79bb\u89e6\u53d1\u5668Dom\u7684\u8ddd\u79bb
      * <pre><code>
      *  var tip =  new Tip({
      *    title : {a : 'text a',b:'text b'}, //\u5c5e\u6027\u662f\u5bf9\u8c61
      *    offset : 10, //\u8ddd\u79bb
      *    titleTpl : '<p>this is {a},because {b}</p>' // <p>this is text a,because text b</p>
      *  });
      * </code></pre>
      * @cfg {Number} offset
      */
      offset : {
        value : 0
      },
      /**
       * \u89e6\u53d1\u663e\u793atip\u7684\u4e8b\u4ef6\u540d\u79f0\uff0c\u9ed8\u8ba4\u4e3amouseover
       * @type {String}
       * @protected
       */
      triggerEvent : {
        value : 'mouseover'
      },
      /**
       * \u663e\u793a\u6587\u672c\u7684\u6a21\u677f
       * <pre><code>
       *  var tip =  new Tip({
       *    title : {a : 'text a',b:'text b'}, //\u5c5e\u6027\u662f\u5bf9\u8c61
       *    offset : 10, //\u8ddd\u79bb
       *    titleTpl : '<p>this is {a},because {b}</p>' // <p>this is text a,because text b</p>
       *  });
       * </code></pre>
       * @type {String}
       */
      titleTpl : {
        view : true,
        value : '<span>{title}</span>'
      },
      xview : {
        value : TipView
      }
    }
  },{
    xclass : 'tooltip'
  });

  Tip.View = TipView;

  return Tip;
});
define('bui/tooltip/tips',['bui/common','bui/tooltip/tip'],function(require) {

  //\u662f\u5426json\u5bf9\u8c61\u6784\u6210\u7684\u5b57\u7b26\u4e32
  function isObjectString(str){
    return /^{.*}$/.test(str);
  }

  var BUI = require('bui/common'),
    Tip = require('bui/tooltip/tip'),
    /**
     * @class BUI.Tooltip.Tips
     * \u6279\u91cf\u663e\u793a\u63d0\u793a\u4fe1\u606f
     *  <pre><code>
     * BUI.use('bui/tooltip',function(){
     *   var tips = new Tooltip.Tips({
     *     tip : {
     *       trigger : '#t1 a', //\u51fa\u73b0\u6b64\u6837\u5f0f\u7684\u5143\u7d20\u663e\u793atip
     *       alignType : 'top', //\u9ed8\u8ba4\u65b9\u5411
     *       elCls : 'tips tips-no-icon tip1',
     *       titleTpl : '&lt;span class="x-icon x-icon-small x-icon-success"&gt;&lt;i class="icon icon-white icon-question"&gt;&lt;/i&gt;&lt;/span&gt;\
   *           &lt;div class="tips-content"&gt;{title}&lt;/div&gt;',
     *       offset : 10 //\u8ddd\u79bb\u5de6\u8fb9\u7684\u8ddd\u79bb
     *     }
     *   });
     *   tips.render();
     * })
     * 
     * </code></pre>
     */
    Tips = function(config){
      Tips.superclass.constructor.call(this,config);
    };

  Tips.ATTRS = {

    /**
     * \u4f7f\u7528\u7684\u63d0\u793a\u63a7\u4ef6\u6216\u8005\u914d\u7f6e\u4fe1\u606f @see {BUI.Tooltip.Tip}
     * <pre><code>
     *    //\u4e0d\u4f7f\u7528\u6a21\u677f\u7684\uff0c\u5de6\u4fa7\u663e\u793a
     * var tips = new Tooltip.Tips({
     *   tip : {
     *     trigger : '#t1 a', //\u51fa\u73b0\u6b64\u6837\u5f0f\u7684\u5143\u7d20\u663e\u793atip
     *     alignType : 'top', //\u9ed8\u8ba4\u65b9\u5411
     *     elCls : 'tips tips-no-icon tip1',
     *     offset : 10 //\u8ddd\u79bb\u5de6\u8fb9\u7684\u8ddd\u79bb
     *   }
     * });
     * tips.render();
     * </code></pre>
     * @cfg {BUI.Tooltip.Tip|Object} tip
     */
    /**
     * \u4f7f\u7528\u7684\u63d0\u793a\u63a7\u4ef6 @see {BUI.Tooltip.Tip}
     * <pre><code>
     *    var tip = tips.get('tip');
     * </code></pre>
     * @type {BUI.Tooltip.Tip}
     * @readOnly
     */
    tip : {

    },
    /**
     * \u9ed8\u8ba4\u7684\u5bf9\u9f50\u65b9\u5f0f,\u5982\u679c\u4e0d\u6307\u5b9atip\u7684\u5bf9\u9f50\u65b9\u5f0f\uff0c\u90a3\u4e48\u4f7f\u7528\u6b64\u5c5e\u6027
     * <pre><code>
     * //\u4e0d\u4f7f\u7528\u6a21\u677f\u7684\uff0c\u5de6\u4fa7\u663e\u793a
     * var tips = new Tooltip.Tips({
     *   tip : {
     *     trigger : '#t1 a', //\u51fa\u73b0\u6b64\u6837\u5f0f\u7684\u5143\u7d20\u663e\u793atip
     *     defaultAlignType : 'top', //\u9ed8\u8ba4\u65b9\u5411
     *     elCls : 'tips tips-no-icon tip1',
     *     offset : 10 //\u8ddd\u79bb\u5de6\u8fb9\u7684\u8ddd\u79bb
     *   }
     * });
     * tips.render();
     * </code></pre>
     * @cfg {Object} defaultAlignType
     */
    defaultAlignType : {

    }
  };

  BUI.extend(Tips,BUI.Base);

  BUI.augment(Tips,{
    //\u521d\u59cb\u5316
    _init : function(){
      this._initDom();
      this._initEvent();
    },
    //\u521d\u59cb\u5316DOM
    _initDom : function(){
      var _self = this,
        tip = _self.get('tip'),
        defaultAlignType;
      if(tip && !tip.isController){
        defaultAlignType = tip.alignType; //\u8bbe\u7f6e\u9ed8\u8ba4\u7684\u5bf9\u9f50\u65b9\u5f0f
        tip = new Tip(tip);
        tip.render();
        _self.set('tip',tip);
        if(defaultAlignType){
          _self.set('defaultAlignType',defaultAlignType);
        }
      }
    },
    //\u521d\u59cb\u5316\u4e8b\u4ef6
    _initEvent : function(){
      var _self = this,
        tip = _self.get('tip');
      tip.on('triggerchange',function(ev){
        var curTrigger = ev.curTrigger;
        _self._replaceTitle(curTrigger);
        _self._setTitle(curTrigger,tip);
      });
    },
    //\u66ff\u6362\u6389title
    _replaceTitle : function(triggerEl){
      var title = triggerEl.attr('title');
      if(title){
        triggerEl.attr('data-title',title);
        triggerEl[0].removeAttribute('title');
      }
    },
    //\u8bbe\u7f6etitle
    _setTitle : function(triggerEl,tip){
      var _self = this,
        title = triggerEl.attr('data-title'),
        alignType = triggerEl.attr('data-align') || _self.get('defaultAlignType');

      if(isObjectString(title)){
        title = BUI.JSON.looseParse(title);
      }
      tip.set('title',title);
      if(alignType){
        tip.set('alignType',alignType);
      }
    },
    /**
     * \u6e32\u67d3\u63d0\u793a\u4fe1\u606f
     * @chainable
     */
    render : function(){
      this._init();
      return this;
    }
  });

  return Tips;
});