define('bui/slider',['bui/slider/slider'],function (require) {
  var Slider = BUI.namespace('Slider');

  BUI.mix(Slider,{
    Slider : require('bui/slider/slider')
  });

  return Slider;
});/**
 * @fileOverview 滑块
 * @ignore
 */

define('bui/slider/slider',['bui/common'],function (require) {
  'use strict';
  var doc = document,
    BUI = require('bui/common'),
    CLS_HANDLE = 'x-slider-handle',
    CLS_VERTICLE = 'x-slider-vertical',
    CLS_HORI = 'x-slider-horizontal',
    CLS_BACK = 'x-slider-back',
    CLS_START = CLS_HANDLE + '-start',
    CLS_END = CLS_HANDLE + '-end';

  function parsePercet(v,total){
    if(v > total){
      v = total;
    }
    if(v < 0){
      v = 0;
    }
    return (v/total) * 100;
  }

  
  var SliderView = BUI.Component.View.extend({
    renderUI : function(){
      var _self = this,
        isVertical = _self.get('isVertical');
      if(isVertical){
        _self.get('el').addClass(CLS_VERTICLE);
      }else{
        _self.get('el').addClass(CLS_HORI);
      }
    },
    //设置范围
    setRange : function(start,end,anim){
      if(start > end){
        start = end;
      }
      var _self = this,
        backEl = _self.get('backEl'),
        isVertical = _self.get('isVertical'),
        handleEl = _self.get('handleEl'),
        handleCount = handleEl.length,
        range = end - start,
        duration = anim ? _self.get('duration') : null,
        rangeAttr = isVertical ? 'height' : 'width',
        posAttr = isVertical ? 'bottom' : 'left',
        method = anim ? 'animate' : 'css',
        backCss = {},
        handleCss = {};

       /**
       * @private
       * @ignore
       * 垂直时使用bottom
       */
      function getPos(pos){
        return pos + '%';
      }

      if(backEl){
        backCss[rangeAttr] = range + '%';
        backCss[posAttr] = start + '%';//getPos(start);
        backEl[method](backCss,duration);
      }
      
      if(handleCount === 1){
        handleCss[posAttr] = getPos(end);
        handleEl[method](handleCss,duration);
      }else if(handleCount === 2){

        handleCss[posAttr] = getPos(start);
        if(handleEl[0].style[posAttr] !== handleCss[posAttr]){
          $(handleEl[0])[method](handleCss,duration);
          //$(handleEl[0]).focus();
        }
       
        handleCss[posAttr] = getPos(end);
        if(handleEl[1].style[posAttr] !== handleCss[posAttr]){
          $(handleEl[1])[method](handleCss,duration);
          //$(handleEl[1]).focus();
        }
      }

     
    },
    //设置背景色
    _uiSetBackTpl : function(v){
      var _self = this,
        el = _self.get('el'),
        backEl = $(v).appendTo(el);
      backEl.addClass(CLS_BACK);
      _self.setInternal('backEl',backEl);
    },
    //设置可拖动的滑块
    _uiSetHandleTpl : function(v){
      var _self = this,
        el = _self.get('el'),
        range = _self.get('range'),
        handleEl;
     
      if(!range){
        _self._createHandleEl(v);
      }else{
        _self._createHandleEl(v,CLS_START);
        _self._createHandleEl(v,CLS_END);
      }
      handleEl = el.find('.' + CLS_HANDLE);
      _self.setInternal('handleEl',handleEl);
    },
    _createHandleEl : function(tpl,cls){
      var _self = this,
        el = _self.get('el'),
        handleEl = $(tpl).appendTo(el);
      handleEl.addClass(CLS_HANDLE);
      handleEl.attr('tabindex','0');
      if(cls){
        handleEl.addClass(cls);
      }
    }

  },{
    ATTRS : {
      backEl : {},
      handleEl : {}
    }
  });
  
  /**
   * @class BUI.Slider.Slider
   * 滑动控件
   * @extends BUI.Component.Controller
   */
  var Slider = BUI.Component.Controller.extend({
    /**
     * 滑动到指定位置
     * @param  {Number|Array} v 滑动到位置，传入数组标示指定滑块的上下范围
     */
    slideTo : function(v){
      this.set('value',v);
    },
    //绑定事件
    bindUI : function(){
      var _self = this,
        el = _self.get('el');
      el.find('.x-slider-handle').on('click',function(ev){
        ev.preventDefault();
      });
      el.on('mousedown',function(ev){
        var sender = $(ev.target),
          offset = el.offset();
        if(sender.hasClass('x-slider-handle')){
          ev.preventDefault();
          _self._handleDrag(ev);
        }else{
          offset = {
            left : ev.pageX - offset.left,
            top : ev.pageY - offset.top
          };
         _self._slideByOffset(offset,true);
        }
      });
    },
    //根据容器位置确定滑块的位置
    _slideByOffset : function(offset,anim){
      var _self = this,
        curVal = _self.get('value'),
        value = _self._formatValue(offset);
      if(curVal === value || (BUI.isArray(value) && BUI.Array.equals(value,curVal))){ //当前值如果等于变化值，不处理
        return;
      }
      if(anim){
        _self.set('value',value);
      }else{
        _self.setInternal('value',value);
        _self._setValue(value,false);
      }
    },
    //处理拖拽
    _handleDrag : function(ev){
      
      var _self = this,
        isVertical = _self.get('isVertical'),
        handleEl = $(ev.target),
        pos = handleEl.position();
      if(ev.which == 1){
        _self.set('draging',{
            elX: pos.left,
            elY: isVertical ?(pos.top + handleEl.height()) : (pos.top),
            startX : ev.pageX,
            startY : ev.pageY
        });
        registEvent();
      }

      /**
       * @private
       */
      function mouseMove(e){
        var draging = _self.get('draging');
        if(draging){
          e.preventDefault();
          var endX = e.pageX,
            endY = e.pageY,
            curOffset = {};
          curOffset.left = draging.elX + (endX - draging.startX);
          curOffset.top = draging.elY + (endY - draging.startY);
          _self._slideByOffset(curOffset,false);
        }
      }

      /**
       * @private
       */
      function registEvent(){
          $(doc).on('mousemove',mouseMove);
          $(doc).on('mouseup',mouseUp);
      }
      /**
       * @private
       */
      function unregistEvent(){
          $(doc).off('mousemove',mouseMove);
          $(doc).off('mouseup',mouseUp);
      }

      
      /**
       * @private
       */
      function mouseUp(e){
        if(e.which == 1){
          _self.set('draging',false);
          unregistEvent();
        }
      }
      
    },
    _getCalcValue : function(offset){
      var _self = this,
        el = _self.get('el'),
        max = _self.get('max'),
        min = _self.get('min'),
        step = _self.get('step'),
        isVertical = _self.get('isVertical'),
        total = isVertical ? el.height() : el.width(),
        pos,
        calValue;

      if(isVertical){
        pos = parsePercet(el.height() - offset.top,total);
      }else{
        pos = parsePercet(offset.left,total);
      }
      calValue = (max - min) * pos/100 + min;
      if(step){
        calValue = parseInt(calValue,10);
        var left = calValue % step;
        if(left){
          calValue = calValue + (step - left);
        }
      }
      return calValue;
    },
    _formatValue : function(offset){
      var _self = this,
        curVal = _self.get('value'),
        calValue = _self._getCalcValue(offset);
      if(BUI.isNumber(curVal)){
        return calValue;
      }
      if(BUI.isArray(curVal)){

        var disStart = Math.abs(curVal[0] - calValue),
          disEnd = Math.abs(curVal[1] - calValue);
        if(disStart < disEnd){ //距离开始小于结束，则滑动开始
          return [calValue,curVal[1]];
        }

        return [curVal[0],calValue];
      }
      return curVal;
    },
    //设置值
    _uiSetValue : function(v){
      this._setValue(v,true);
    },
    //设置值
    _setValue : function(value,anim){
      var _self = this,
        min = _self.get('min'),
        max = _self.get('max'),
        total = max - min,
        start,
        end;
      if(min == max){
        start = 0;
        end = 100;
      }else if(BUI.isNumber(value)){
        start = 0;
        end = parsePercet(value - min,total);
      }else if(BUI.isArray(value)){
        start = parsePercet(value[0] - min,total);
        end = parsePercet(value[1] - min,total);
      }
      _self._setRange(start,end,anim);
      _self.fire('change',{value : value});
    },
    //设置范围
    _setRange : function(start,end,anim){
      this.get('view').setRange(start,end,anim);
    }

  },{
    ATTRS : {

      /**
       * 最小值
       * @cfg {Number}
       */
      min : {
        value : 0
      },
      /**
       * 滑动动画的执行间隔
       * @type {Object}
       */
      duration : {
        view : true,
        value : 400
      },
      /**
       * 最大值
       * @cfg {Number}
       */
      max : {
        value : 100
      },
      /**
       * 当前值
       * @type {Number}
       */
      value : {
        view :true
      },
      /**
       * 最小滑动单位
       * @type {Number}
       */
      step : {
        value : 1
      },
      /**
       * 拖拽的滑块的模板
       * @type {String}
       */
      handleTpl : {
        view :true,
        value : '<span></span>'
      },
      /**
       * 是否垂直
       * @type {Boolean}
       */
      isVertical : {
        view : true,
        value : false
      },
      /**
       * 是否滑动范围，默认状态下只能调整最大值，无法调整最小值
       * @type {Boolean}
       */
      range : {
        view : true,
        value : false
      },
      /**
       * 用于显示滑动背景的模板
       * @type {String}
       */
      backTpl : {
        view : true,
        value : '<div></div>'
      },
      xview : {
        value : SliderView
      }
      /**
       * @event change
       * 滑动值改变
       * @param {Object} e 事件对象
       * @param {Number|Array} e.value
       */

    }
  },{
    xclass : 'slider'
  });
  return Slider;
});