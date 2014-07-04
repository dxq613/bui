/**
 * @fileOverview 日期选择器
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/calendar/datepicker',['bui/common','bui/picker','bui/calendar/calendar'],function(require){
  
  var BUI = require('bui/common'),
    Picker = require('bui/picker').Picker,
    Calendar = require('bui/calendar/calendar'),
    DateUtil = BUI.Date;

  /**
   * 日期选择器，可以由输入框等触发
   * <p>
   * <img src="../assets/img/class-calendar.jpg"/>
   * </p>
   * xclass : 'calendar-datepicker'
   * <pre><code>
   *   BUI.use('bui/calendar',function(Calendar){
   *      var datepicker = new Calendar.DatePicker({
   *        trigger:'.calendar',
   *        //delegateTrigger : true, //如果设置此参数，那么新增加的.calendar元素也会支持日历选择
   *        autoRender : true
   *      });
   *    });
   * </code></pre>
   * @class BUI.Calendar.DatePicker
   * @extends BUI.Picker.Picker
   */
  var datepicker = Picker.extend({

    initializer:function(){
      
    },
    /**
     * @protected
     * 初始化内部控件
     */
    createControl : function(){
      var _self = this,
        children = _self.get('children'),
        calendar = new Calendar({
          render : _self.get('el'),
          showTime : _self.get('showTime'),
          lockTime : _self.get('lockTime'),
          minDate: _self.get('minDate'),
          maxDate: _self.get('maxDate'),
          autoRender : true
        });

      calendar.on('clear', function(){
        var curTrigger = _self.get('curTrigger'),
          oldValue = curTrigger.val();

        if(oldValue){
          curTrigger.val('');
          curTrigger.trigger('change');
        }
      });

      if (!_self.get('dateMask')) {
        if (_self.get('showTime')) {
            _self.set('dateMask', 'yyyy-mm-dd HH:MM:ss');
        } else {
            _self.set('dateMask', 'yyyy-mm-dd');
        }
       }  
      children.push(calendar);
      _self.set('calendar',calendar);
      return calendar;
    },
    /**
     * 设置选中的值
     * <pre><code>
     *   datePicker.setSelectedValue('2012-01-1');
     * </code></pre>
     * @param {String} val 设置值
     * @protected
     */
    setSelectedValue : function(val){
      if(!this.get('calendar')){
        return;
      }
      var _self = this,
        calendar = this.get('calendar'),
        date = DateUtil.parse(val,_self.get("dateMask"));
      date = date || _self.get('selectedDate');
      calendar.set('selectedDate',DateUtil.getDate(date));

      if(_self.get('showTime')){

          var lockTime = this.get("lockTime"),
            hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds();

          if(lockTime){
            if(!val || !lockTime.editable){
              hour = lockTime['hour'] != null ?lockTime['hour']:hour;
              minute = lockTime['minute'] != null ?lockTime['minute']:minute;
              second = lockTime['second'] != null ?lockTime['second']:second;
            }
          }

        calendar.set('hour',hour);
        calendar.set('minute',minute);
        calendar.set('second',second);
      }
    },
    /**
     * 获取选中的值
     * @protected
     * @return {String} 选中的值
     */
    getSelectedValue : function(){
      if(!this.get('calendar')){
        return null;
      }
      var _self = this, 
        calendar = _self.get('calendar'),
      date =  DateUtil.getDate(calendar.get('selectedDate'));
      if(_self.get('showTime')){
        date = DateUtil.addHour(calendar.get('hour'),date);
        date = DateUtil.addMinute(calendar.get('minute'),date);
        date = DateUtil.addSecond(calendar.get('second'),date);
      }
      return date;
    },
    /**
     * 获取选中项的文本，多选状态下，文本以','分割
     * @protected
     * @return {String} 选中的文本
     */
    getSelectedText : function(){
      if(!this.get('calendar')){
        return '';
      }
      return DateUtil.format(this.getSelectedValue(),this._getFormatType());
    },
    _getFormatType : function(){
      return this.get('dateMask');
    },
    //设置最大值
    _uiSetMaxDate : function(v){
      if(!this.get('calendar')){
        return null;
      }
      var _self = this;
      _self.get('calendar').set('maxDate',v);
    },
    //设置最小值
    _uiSetMinDate : function(v){
      if(!this.get('calendar')){
        return null;
      }
      var _self = this;
      _self.get('calendar').set('minDate',v);
    }

  },{
    ATTRS : 
    {
      /**
       * 是否显示日期
       * <pre><code>
       *  var datepicker = new Calendar.DatePicker({
       *    trigger:'.calendar',
       *    showTime : true, //可以选择日期
       *    autoRender : true
       *  });
       * </code></pre>
       * @type {Boolean}
       */
      showTime : {
        value:false
      },
       /**
       * 锁定时间选择，默认锁定的时间不能修改可以通过 editable : true 来允许修改锁定的时间
       *<pre><code>
       *  var calendar = new Calendar.Calendar({
       *  render:'#calendar',
       *  lockTime : {hour:00,minute:30} //表示锁定时为00,分为30分,秒无锁用户可选择
       * });
       * </code></pre>
       *
       * @type {Object}
       */
      lockTime :{

      },
      /**
       * 最大日期
       * <pre><code>
       *   var datepicker = new Calendar.DatePicker({
       *     trigger:'.calendar',
       *     maxDate : '2014-01-01',
       *     minDate : '2013-7-25',
       *     autoRender : true
       *   });
       * </code></pre>
       * @type {Date}
       */
      maxDate : {

      },
      /**
       * 最小日期
       * <pre><code>
       *   var datepicker = new Calendar.DatePicker({
       *     trigger:'.calendar',
       *     maxDate : '2014-01-01',
       *     minDate : '2013-7-25',
       *     autoRender : true
       *   });
       * </code></pre>
       * @type {Date}
       */
      minDate : {

      },
	  /**
       * 返回日期格式，如果不设置默认为 yyyy-mm-dd，时间选择为true时为 yyyy-mm-dd HH:MM:ss
       * <pre><code>
       *   calendar.set('dateMask','yyyy-mm-dd');
       * </code></pre>
       * @type {String}
      */
      dateMask: {

      },
      changeEvent:{
        value:'accept'
      },
      hideEvent:{
        value:'accept clear'
      },
      /**
       * 日历对象,可以进行更多的操作，参看{@link BUI.Calendar.Calendar}
       * @type {BUI.Calendar.Calendar}
       */
      calendar:{

      },
      /**
       * 默认选中的日期
       * @type {Date}
       */
      selectedDate: {
      	value: new Date(new Date().setSeconds(0))
      }
    }
  },{
    xclass : 'datepicker',
    priority : 0
  });
  return datepicker;
  
});
