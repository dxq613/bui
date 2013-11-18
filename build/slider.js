/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/slider',['bui/slider/slider'],function (require) {
  var Slider = BUI.namespace('Slider');

  BUI.mix(Slider,{
    Slider : require('bui/slider/slider')
  });

  return Slider;
});
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
    //\u8bbe\u7f6e\u8303\u56f4
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
       * \u5782\u76f4\u65f6\u4f7f\u7528bottom
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
    //\u8bbe\u7f6e\u80cc\u666f\u8272
    _uiSetBackTpl : function(v){
      var _self = this,
        el = _self.get('el'),
        backEl = $(v).appendTo(el);
      backEl.addClass(CLS_BACK);
      _self.setInternal('backEl',backEl);
    },
    //\u8bbe\u7f6e\u53ef\u62d6\u52a8\u7684\u6ed1\u5757
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
   * \u6ed1\u52a8\u63a7\u4ef6
   * @extends BUI.Component.Controller
   */
  var Slider = BUI.Component.Controller.extend({
    /**
     * \u6ed1\u52a8\u5230\u6307\u5b9a\u4f4d\u7f6e
     * @param  {Number|Array} v \u6ed1\u52a8\u5230\u4f4d\u7f6e\uff0c\u4f20\u5165\u6570\u7ec4\u6807\u793a\u6307\u5b9a\u6ed1\u5757\u7684\u4e0a\u4e0b\u8303\u56f4
     */
    slideTo : function(v){
      this.set('value',v);
    },
    //\u7ed1\u5b9a\u4e8b\u4ef6
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
    //\u6839\u636e\u5bb9\u5668\u4f4d\u7f6e\u786e\u5b9a\u6ed1\u5757\u7684\u4f4d\u7f6e
    _slideByOffset : function(offset,anim){
      var _self = this,
        curVal = _self.get('value'),
        value = _self._formatValue(offset);
      if(curVal === value || (BUI.isArray(value) && BUI.Array.equals(value,curVal))){ //\u5f53\u524d\u503c\u5982\u679c\u7b49\u4e8e\u53d8\u5316\u503c\uff0c\u4e0d\u5904\u7406
        return;
      }
      if(anim){
        _self.set('value',value);
      }else{
        _self.setInternal('value',value);
        _self._setValue(value,false);
      }
    },
    //\u5904\u7406\u62d6\u62fd
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
        if(disStart < disEnd){ //\u8ddd\u79bb\u5f00\u59cb\u5c0f\u4e8e\u7ed3\u675f\uff0c\u5219\u6ed1\u52a8\u5f00\u59cb
          return [calValue,curVal[1]];
        }

        return [curVal[0],calValue];
      }
      return curVal;
    },
    //\u8bbe\u7f6e\u503c
    _uiSetValue : function(v){
      this._setValue(v,true);
    },
    //\u8bbe\u7f6e\u503c
    _setValue : function(value,anim){
      var _self = this,
        min = _self.get('min'),
        max = _self.get('max'),
        total = max - min,
        start,
        end;

      if(BUI.isNumber(value)){
        start = 0;
        end = parsePercet(value - min,total);
      }else if(BUI.isArray(value)){
        start = parsePercet(value[0] - min,total);
        end = parsePercet(value[1] - min,total);
      }
      _self._setRange(start,end,anim);
      _self.fire('change',{value : value});
    },
    //\u8bbe\u7f6e\u8303\u56f4
    _setRange : function(start,end,anim){
      this.get('view').setRange(start,end,anim);
    }

  },{
    ATTRS : {

      /**
       * \u6700\u5c0f\u503c
       * @cfg {Number}
       */
      min : {
        value : 0
      },
      /**
       * \u6ed1\u52a8\u52a8\u753b\u7684\u6267\u884c\u95f4\u9694
       * @type {Object}
       */
      duration : {
        view : true,
        value : 400
      },
      /**
       * \u6700\u5927\u503c
       * @cfg {Number}
       */
      max : {
        value : 100
      },
      /**
       * \u5f53\u524d\u503c
       * @type {Number}
       */
      value : {
        view :true
      },
      /**
       * \u6700\u5c0f\u6ed1\u52a8\u5355\u4f4d
       * @type {Number}
       */
      step : {
        value : 1
      },
      /**
       * \u62d6\u62fd\u7684\u6ed1\u5757\u7684\u6a21\u677f
       * @type {String}
       */
      handleTpl : {
        view :true,
        value : '<span></span>'
      },
      /**
       * \u662f\u5426\u5782\u76f4
       * @type {Boolean}
       */
      isVertical : {
        view : true,
        value : false
      },
      /**
       * \u662f\u5426\u6ed1\u52a8\u8303\u56f4\uff0c\u9ed8\u8ba4\u72b6\u6001\u4e0b\u53ea\u80fd\u8c03\u6574\u6700\u5927\u503c\uff0c\u65e0\u6cd5\u8c03\u6574\u6700\u5c0f\u503c
       * @type {Boolean}
       */
      range : {
        view : true,
        value : false
      },
      /**
       * \u7528\u4e8e\u663e\u793a\u6ed1\u52a8\u80cc\u666f\u7684\u6a21\u677f
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
       * \u6ed1\u52a8\u503c\u6539\u53d8
       * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
       * @param {Number|Array} e.value
       */

    }
  },{
    xclass : 'slider'
  });
  return Slider;
});