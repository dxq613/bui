/**
 * @fileOverview 简单易用的提示信息
 * @ignore
 */

define('bui/tooltip/tip',['bui/common','bui/overlay'],function (require) {
  var BUI = require('bui/common'),
    Overlay = require('bui/overlay'),
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
   * 
   * ** 你可以简单的使用单个tip **
   * <pre><code>
   * BUI.use('bui/tooltip',function (Tooltip) {
   *  //不使用模板的，左侧显示
   *   var t1 = new Tooltip.Tip({
   *     trigger : '#t1',
   *     alignType : 'left', //方向
   *     showArrow : false, //不显示箭头
   *     offset : 5, //距离左边的距离
   *     title : '无任何样式，<br>左边的提示信息'
   *   });
   *   t1.render();
   *  });
   * </code></pre>
   *
   * ** 也可以配置模板 **
   * <pre><code>
   * BUI.use('bui/tooltip',function (Tooltip) {
   *  //使用模板的，左侧显示
   *   var t1 = new Tooltip.Tip({
   *     trigger : '#t1',
   *     alignType : 'left', //方向
   *     titleTpl : '&lt;span class="x-icon x-icon-small x-icon-success"&gt;&lt;i class="icon icon-white icon-question"&gt;&lt;/i&gt;&lt;/span&gt;\
   *     &lt;div class="tips-content"&gt;{title}&lt;/div&gt;',
   *     offset : 5, //距离左边的距离
   *     title : '无任何样式，&lt;br&gt;左边的提示信息'
   *   });
   *   t1.render();
   *  });
   * </code></pre>
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
      delegateTrigger : {
        value : true
      },
      /**
       * 对齐类型，包括： top,left,right,bottom四种常用方式，其他对齐方式，可以使用@see{BUI.Tooltip.Tip#property-align}属性
       * 
       * @type {String}
       */
      alignType : {
        view : true
      },
      /**
       * 显示的内容，文本或者键值对
       * <pre><code>
       *     var tip =  new Tip({
       *        title : {a : 'text a',b:'text b'}, //属性是对象
       *        titleTpl : '<p>this is {a},because {b}</p>' // <p>this is text a,because text b</p>
       *      });
       * </code></pre>
       * @cfg {String|Object} title
       */
      /**
       * 显示的内容
       * <pre><code>
       *  //设置文本
       *  tip.set('title','new title');
       *
       *  //设置对象
       *  tip.set('title',{a : 'a',b : 'b'})
       * </code></pre>
       * @type {Object}
       */
      title : {
        view : true
      },
      /**
       * 显示对齐箭头
       * @override
       * @default true
       * @cfg {Boolean} [showArrow = true]
       */
      showArrow : {
        value : true
      },
      /**
       * 箭头放置在的位置，是一个选择器，例如 .arrow-wraper
       * <pre><code>
       *     new Tip({ //可以设置整个控件的模板
       *       arrowContainer : '.arrow-wraper',
       *       tpl : '<div class="arrow-wraper"></div>'
       *     });
       *     
       *     new Tip({ //也可以设置title的模板
       *       arrowContainer : '.arrow-wraper',
       *       titleTpl : '<div class="arrow-wraper">{title}</div>'
       *     });
       * </code></pre>   
       * @cfg {String} arrowContainer
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
      * <pre><code>
      *  var tip =  new Tip({
      *    title : {a : 'text a',b:'text b'}, //属性是对象
      *    offset : 10, //距离
      *    titleTpl : '<p>this is {a},because {b}</p>' // <p>this is text a,because text b</p>
      *  });
      * </code></pre>
      * @cfg {Number} offset
      */
      offset : {
        value : 0
      },
      /**
       * 触发显示tip的事件名称，默认为mouseover
       * @type {String}
       * @protected
       */
      triggerEvent : {
        value : 'mouseover'
      },
      /**
       * 显示文本的模板
       * <pre><code>
       *  var tip =  new Tip({
       *    title : {a : 'text a',b:'text b'}, //属性是对象
       *    offset : 10, //距离
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