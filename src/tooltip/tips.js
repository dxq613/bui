/**
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