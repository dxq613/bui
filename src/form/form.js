/**
 * @fileOverview 创建表单
 * @ignore
 */

define('bui/form/form',['bui/common','bui/form/fieldcontainer'],function (require) {
  
  var BUI = require('bui/common'),
    TYPE_SUBMIT = {
      NORMAL : 'normal',
      AJAX : 'ajax',
      IFRAME : 'iframe'
    },
    FieldContainer = require('bui/form/fieldcontainer'),
    Component = BUI.Component;

  var FormView = FieldContainer.View.extend({
    _uiSetMethod : function(v){
      this.get('el').attr('method',v);
    },
    _uiSetAction : function(v){
      this.get('el').attr('action',v);
    }
  },{
    ATTRS : {
      method : {},
      action : {}
    }
  },{
    xclass: 'form-view'
  });

  /**
   * @class BUI.Form.Form
   * 表单控件,表单相关的类图：
   * <img src="../assets/img/class-form.jpg"/>
   * @extends BUI.Form.FieldContainer
   */
  var Form = FieldContainer.extend({
    renderUI : function(){
      var _self = this,
        buttonBar = _self.get('buttonBar'),
        cfg;
      if($.isPlainObject(buttonBar) && _self.get('buttons')){
        cfg = BUI.merge(_self.getDefaultButtonBarCfg(),buttonBar);
        _self._initButtonBar(cfg);
      }
      _self._initSubmitMask();
    },
    _initButtonBar : function(cfg){
      var _self = this;
      BUI.use('bui/toolbar',function(Toolbar){
        buttonBar = new Toolbar.Bar(cfg);
        _self.set('buttonBar',buttonBar);
      });
    },
    bindUI : function(){
      var _self = this,
        formEl = _self.get('el');

      formEl.on('submit',function(ev){
        _self.valid();
        if(!_self.isValid() || _self.onBeforeSubmit() === false){
          ev.preventDefault();
          _self.focusError();
          return;
        }
        if(_self.isValid() && _self.get('submitType') === TYPE_SUBMIT.AJAX){
          ev.preventDefault();
          _self.ajaxSubmit();
        }

      });
    },
    /**
     * 获取按钮栏默认的配置项
     * @protected
     * @return {Object} 
     */
    getDefaultButtonBarCfg : function(){
      var _self = this,
        buttons = _self.get('buttons');
      return {
        autoRender : true,
        elCls :'toolbar',
        render : _self.get('el'),
        items : buttons,
        defaultChildClass : 'bar-item-button'
      };
    },
    /**
     * 将焦点定位到第一个错误字段
     */
    focusError : function(){
      var _self = this,
        fields = _self.getFields();
      
      BUI.each(fields,function(field){
        if(field.get('visible') && !field.get('disabled') && !field.isValid()){
          try{
            field.focus();
          }catch(e){
            BUI.log(e);
          }
          
          return false;
        }
      });
    },
    /**
     * 表单提交，如果未通过验证，则阻止提交
     */
    submit : function(options){
      var _self = this,
        submitType = _self.get('submitType');
      _self.valid();
      if(_self.isValid()){
        if(_self.onBeforeSubmit() == false){
          return;
        }
        if(submitType === TYPE_SUBMIT.NORMAL){
          _self.get('el')[0].submit();
        }else if(submitType === TYPE_SUBMIT.AJAX){
          _self.ajaxSubmit(options);
        }
      }else{
        _self.focusError();
      }
    },
    /**
     * 异步提交表单
     */
    ajaxSubmit : function(options){
      var _self = this,
        method = _self.get('method'),
        action = _self.get('action'),
        callback = _self.get('callback'),
        submitMask = _self.get('submitMask'),
        data = _self.serializeToObject(), //获取表单数据
        success,
        ajaxParams = BUI.merge(true,{ //合并请求参数
          url : action,
          type : method,
          dataType : 'json',
          data : data
        },options);

      if(options && options.success){
        success = options.success;
      }
      ajaxParams.success = function(data){ //封装success方法
        if(submitMask && submitMask.hide){
          submitMask.hide();
        }
        if(success){
          success(data);
        }
        callback && callback.call(_self,data);
      } 
      if(submitMask && submitMask.show){
        submitMask.show();
      }
      $.ajax(ajaxParams); 
    },
    //获取提交的屏蔽层
    _initSubmitMask : function(){
      var _self = this,
        submitType = _self.get('submitType'),
        submitMask = _self.get('submitMask');
      if(submitType === TYPE_SUBMIT.AJAX && submitMask){
        BUI.use('bui/mask',function(Mask){
          var cfg = $.isPlainObject(submitMask) ? submitMask : {};
          submitMask = new Mask.LoadMask(BUI.mix({el : _self.get('el')},cfg));
          _self.set('submitMask',submitMask);
        });
      }
    },
    /**
     * 序列化表单成对象，所有的键值都是字符串
     * @return {Object} 序列化成对象
     */
    serializeToObject : function(){
      return BUI.FormHelper.serializeToObject(this.get('el')[0]);
    },
    /**
     * serializeToObject 的缩写，所有的键值都是字符串
     * @return {Object} 序列化成对象
     */
    toObject : function(){
      return this.serializeToObject();
    },
    /**
     * 表单提交前
     * @protected
     * @return {Boolean} 是否取消提交
     */
    onBeforeSubmit : function(){
      return this.fire('beforesubmit');
    },
    /**
     * 表单恢复初始值
     */
    reset : function(){
      var _self = this,
        initRecord = _self.get('initRecord');
      _self.setRecord(initRecord);
    },
    /**
     * 重置提示信息，因为在表单隐藏状态下，提示信息定位错误
     * <pre><code>
     * dialog.on('show',function(){
     *   form.resetTips();
     * });
     *   
     * </code></pre>
     */
    resetTips : function(){
      var _self = this,
        fields = _self.getFields();
      BUI.each(fields,function(field){
        field.resetTip();
      });
    },
    /**
     * @protected
     * @ignore
     */
    destructor : function(){
      var _self = this,
        buttonBar = _self.get('buttonBar'),
        submitMask = _self.get('submitMask');
      if(buttonBar && buttonBar.destroy){
        buttonBar.destroy();
      }
      if(submitMask && submitMask.destroy){
        submitMask.destroy();
      }
    },
    //设置表单的初始数据
    _uiSetInitRecord : function(v){
      //if(v){
        this.setRecord(v);
      //}
      
    }
  },{
    ATTRS : {
      /**
       * 提交的路径
       * @type {String}
       */
      action : {
        view : true,
        value : ''
      },
      allowTextSelection:{
        value : true
      },
      events : {
        value : {
          /**
           * @event
           * 表单提交前触发，如果返回false会阻止表单提交
           */
          beforesubmit : false
        }
      },
      /**
       * 提交的方式
       * @type {String}
       */
      method : {
        view : true,
        value : 'get'
      },
      /**
       * 默认的loader配置
       * <pre>
       * {
       *   autoLoad : true,
       *   property : 'record',
       *   dataType : 'json'
       * }
       * </pre>
       * @type {Object}
       */
      defaultLoaderCfg : {
        value : {
          autoLoad : true,
          property : 'record',
          dataType : 'json'
        }
      },
      /**
       * 异步提交表单时的屏蔽
       * @type {BUI.Mask.LoadMask|Object}
       */
      submitMask : {
        value : {
          msg : '正在提交。。。'
        }
      },
      /**
       * 提交表单的方式
       *
       *  - normal 普通方式，直接提交表单
       *  - ajax 异步提交方式，在submit指定参数
       *  - iframe 使用iframe提交,开发中。。。
       * @cfg {String} [submitType='normal']
       */
      submitType : {
        value : 'normal'
      },
      /**
       * 表单提交前，如果存在错误，是否将焦点定位到第一个错误
       * @type {Object}
       */
      focusError : {
        value : true
      },
      /**
       * 表单提交成功后的回调函数，普通提交方式 submitType = 'normal'，不会调用
       * @type {Object}
       */
      callback : {

      },
      decorateCfgFields : {
        value : {
          'method' : true,
          'action' : true
        }
      },
      /**
       * 默认的子控件时文本域
       * @type {String}
       */
      defaultChildClass : {
        value : 'form-field'
      },
      /**
       * 使用的标签，为form
       * @type {String}
       */
      elTagName : {
        value : 'form'
      },
      /**
       * 表单按钮
       * @type {Array}
       */
      buttons : {

      },
      /**
       * 按钮栏
       * @type {BUI.Toolbar.Bar}
       */
      buttonBar : {
        shared : false,
        value : {}
      },
      childContainer : {
        value : '.x-form-fields'
      },
      /**
       * 表单初始化的数据，用于初始化或者表单回滚
       * @type {Object}
       */
      initRecord : {

      },
      /**
       * 表单默认不显示错误，不影响表单分组和表单字段
       * @type {Boolean}
       */
      showError : {
        value : false
      },
      xview : {
        value : FormView
      },
      tpl : {
        value : '<div class="x-form-fields"></div>'
      }
    }
  },{
    xclass : 'form'
  });
  
  Form.View = FormView;
  return Form;
});