/**
 * @fileOverview 滑块的键盘导航
 * @ignore
 */

define('bui/slider/keynav',['bui/common'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    CLS_HANDLE = 'x-slider-handle',
    CLS_START = CLS_HANDLE + '-start',
    CLS_END = CLS_HANDLE + '-end',
    NAV_TYPE = {
      START : 1,
      END : 0
    };

  /**
   * @class BUI.Slider.KeyNav
   * 列表导航扩展类
   */
  var  KeyNav = function(){};

  KeyNav.ATTRS = {
    
  };

  BUI.augment(KeyNav,{

    //获取滑动类型
    _getNavType : function(target){
      var sender = $(target);
      if(sender.hasClass(CLS_START)){
        return NAV_TYPE.START;
      }
      return NAV_TYPE.END;
    },
    /**
     * 滑动到下一个点，跟step属性相关
     * @param  {Number} navType 1：start,0 : end
     */
    nextStep : function(navType){
      var _self = this,
        step = _self.get('step'),
        max = _self.get('max')
        value = _self.get('value'),
        newVal;
      if(BUI.isNumber(value)){
        _self.sliderTo(_self._getFrontValue(value + step));
        return;
      }
      if(navType){
        newVal = [_self._getFrontValue(value[0],value[1]),value[1]];
      }else{
        newVal = [value[0],_self._getFrontValue(value[1])];
      }
      _self.sliderTo(newVal);
    },
    /**
     * 滑动到下一个点，跟step属性相关
     * @param  {Number} navType 1：start,0 : end
     */
    prevStep : function(navType){
      var _self = this,
        step = _self.get('step'),
        value = _self.get('value'),
        newVal;
      if(BUI.isNumber(value)){
        _self.sliderTo(_self._getBackValue(value - step));
        return;
      }
      if(navType){
        newVal = [_self._getBackValue(value[0]),value[1]];
      }else{
        newVal = [value[0],_self._getBackValue(value[1],value[0])];
      }
      _self.sliderTo(newVal);
    },
    _getBackValue : function(val,min){
      var _self = this;
      min = min || _self.get('min');
      return val > min ? val : min;
    },
    _getFrontValue : function(val,max){
      var _self = this;
      max =  max || _self.get('max');
      return val < max ? val : max;
    },
    /**
     * 处理向上导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavUp : function (ev) {
      this.nextStep(this._getNavType(ev.target));
    },
    /**
     * 处理向下导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavDown : function (ev) {
      this.prevStep(this._getNavType(ev.target));
    },
    /**
     * 处理向左导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavLeft : function (ev) {
      this.prevStep(this._getNavType(ev.target));
    },
    
    /**
     * 处理向右导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavRight : function (ev) {
      this.nextStep(this._getNavType(ev.target));
    }
  });

  return KeyNav;

});