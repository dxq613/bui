/**
 * @fileOverview 提示的入口文件
 * @ignore
 */

define('bui/tooltip',function (require) {
  var BUI = require('bui/common'),
    Tooltip = BUI.namespace('Tooltip'),
    Tip = require('bui/tooltip/tip'),
    Tips = require('bui/tooltip/tips');

  BUI.mix(Tooltip,{
    Tip : Tip,
    Tips : Tips
  });
  return Tooltip;
});/**
 * @fileOverview 简单易用的提示信息
 * @ignore
 */

define('bui/tooltip/tip',function (require) {
  var BUI = require('bui/common'),
    Overlay = require('overlay'),
    CLS_ALIGN_PREFIX = 'x-align-',
    MAP_TYPES = {
      left : ['cl','cr'], //居左
      right : ['cr','cl'], //居右
      top : ['tc','bc'], //居上
      bottom : ['bc','tc'], //居下
      'top-left' : ['tl','bl'],
      'top-right' : ['tr','br'],
      'bottom-left' : ['bl','tl'],
      'bottom-right' : ['br','tr']
    };
  //获取距离
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
    //获取显示文本的容器
    _getTitleContainer : function(){
      return  this.get('el');
    },
    //设置文本
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
    //设置对齐样式
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
   * 简易的提示信息
   */
  var Tip = Overlay.Overlay.extend({
    //设置对齐方式
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
      //使用委托的方式显示提示信息
      delegateTigger : {
        value : true
      },
      /**
       * 对齐类型，包括： top,left,right,bottom四种常用方式，其他对齐方式，可以使用@see{BUI.Tooltip.Tip-property-align}属性
       * @type {String}
       */
      alignType : {
        view : true
      },
      /**
       * 显示的内容，文本或者键值对
       *      new Tip({
       *        title : {a : 'text a',b:'text b'}, //属性是对象
       *        titleTpl : '<p>this is {a},because {b}</p>' // <p>this is text a,because text b</p>
       *      });
       * @type {String|Object}
       */
      title : {
        view : true
      },
      /**
       * 显示对齐箭头
       * @override
       * @default true
       * @type {Boolean}
       */
      showArrow : {
        value : true
      },
      /**
       * 箭头放置在的位置，是一个选择器，例如 .arrow-wraper
       *     new Tip({ //可以设置整个控件的模板
       *       arrowContainer : '.arrow-wraper',
       *       tpl : '<div class="arrow-wraper"></div>'
       *     });
       *     
       *     new Tip({ //也可以设置title的模板
       *       arrowContainer : '.arrow-wraper',
       *       titleTpl : '<div class="arrow-wraper">{title}</div>'
       *     });
       *     
       * @type {String}
       */
      arrowContainer : {
        view : true
      },
      //自动显示
      autoHide : {
        value : true
      },
      //覆盖自动隐藏类型
      autoHideType : {
        value : 'leave'
      },
      /**
      * 显示的tip 距离触发器Dom的距离
      * @type {Number}
      */
      offset : {
        value : 0
      },
      /**
       * 触发显示tip的事件名称，默认为mouseover
       * @type {String}
       */
      triggerEvent : {
        value : 'mouseover'
      },
      /**
       * 显示文本的模板
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
});/**
 * @fileOverview 批量显示提示信息
 * @ignore
 */

define('bui/tooltip/tips',function(require) {

  //是否json对象构成的字符串
  function isObjectString(str){
    return /^{.*}$/.test(str);
  }

  var BUI = require('bui/common'),
    Tip = require('bui/tooltip/tip'),
    /**
     * @class BUI.Tooltip.Tips
     * 批量显示提示信息
     */
    Tips = function(config){
      Tips.superclass.constructor.call(this,config);
    };

  Tips.ATTRS = {

    /**
     * 使用的提示控件或者配置信息 @see {BUI.Tooltip.Tip}
     * @cfg {BUI.Tooltip.Tip|Object}
     */
    /**
     * 使用的提示控件 @see {BUI.Tooltip.Tip}
     * @type {BUI.Tooltip.Tip}
     */
    tip : {

    },
    /**
     * 默认的对齐方式
     * @type {Object}
     */
    defaultAlignType : {

    }
  };

  BUI.extend(Tips,BUI.Base);

  BUI.augment(Tips,{
    //初始化
    _init : function(){
      this._initDom();
      this._initEvent();
    },
    //初始化DOM
    _initDom : function(){
      var _self = this,
        tip = _self.get('tip'),
        defaultAlignType;
      if(tip && !tip.isController){
        defaultAlignType = tip.alignType; //设置默认的对齐方式
        tip = new Tip(tip);
        tip.render();
        _self.set('tip',tip);
        if(defaultAlignType){
          _self.set('defaultAlignType',defaultAlignType);
        }
      }
    },
    //初始化事件
    _initEvent : function(){
      var _self = this,
        tip = _self.get('tip');
      tip.on('triggerchange',function(ev){
        var curTrigger = ev.curTrigger;
        _self._replaceTitle(curTrigger);
        _self._setTitle(curTrigger,tip);
      });
    },
    //替换掉title
    _replaceTitle : function(triggerEl){
      var title = triggerEl.attr('title');
      if(title){
        triggerEl.attr('data-title',title);
        triggerEl[0].removeAttribute('title');
      }
    },
    //设置title
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
     * 渲染提示信息
     * @chainable
     */
    render : function(){
      this._init();
      return this;
    }
  });

  return Tips;
});