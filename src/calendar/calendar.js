/**
 * @fileOverview 日期控件
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/calendar/calendar',['bui/picker','bui/calendar/monthpicker','bui/calendar/header','bui/calendar/panel','bui/toolbar'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_PICKER_TIME = 'x-datepicker-time',
    CLS_PICKER_HOUR = 'x-datepicker-hour',
    CLS_PICKER_MINUTE = 'x-datepicker-minute',
    CLS_PICKER_SECOND = 'x-datepicker-second',
    CLS_TIME_PICKER = 'x-timepicker',
    Picker = require('bui/picker').ListPicker,
    MonthPicker = require('bui/calendar/monthpicker'),
    Header = require('bui/calendar/header'),
    Panel = require('bui/calendar/panel'),
    Toolbar = require('bui/toolbar'),
    Component = BUI.Component,
    DateUtil = BUI.Date;

  function today(){
    var now = new Date();
    return new Date(now.getFullYear(),now.getMonth(),now.getDate());
  }

  function fixedNumber(n){
    if( n< 10 ){
      return '0'+n;
    }
    return n.toString();
  }
  function getNumberItems(end){
    var items = [];
    for (var i = 0; i < end; i++) {
      items.push({text:fixedNumber(i),value:fixedNumber(i)});
    }
    return items;
  }

  function getTimeUnit (self,cls){
    var inputEl = self.get('el').find('.' + cls);
    return parseInt(inputEl.val(),10);

  }

  function setTimeUnit (self,cls,val){
    var inputEl = self.get('el').find('.' + cls);
    if(BUI.isNumber(val)){
      val = fixedNumber(val);
    }
    inputEl.val(val);
  }



  /**
   * 日期控件
   * <p>
   * <img src="../assets/img/class-calendar.jpg"/>
   * </p>
   * xclass:'calendar'
   * <pre><code>
   *  BUI.use('bui/calendar',function(Calendar){
   *    var calendar = new Calendar.Calendar({
   *      render:'#calendar'
   *    });
   *    calendar.render();
   *    calendar.on('selectedchange',function (ev) {
   *      alert(ev.date);
   *    });
   * });
   * </code></pre>
   * @class BUI.Calendar.Calendar
   * @extends BUI.Component.Controller
   */
  var calendar = Component.Controller.extend({

    //设置内容
    initializer: function(){
      var _self = this,
        children = _self.get('children'),
        header = new Header(),
        panel = new Panel(),
        footer = _self.get('footer') || _self._createFooter();/*,
        monthPicker = _self.get('monthPicker') || _self._createMonthPicker();*/


      //添加头
      children.push(header);
      //添加panel
      children.push(panel);
      children.push(footer);
      //children.push(monthPicker);

      _self.set('header',header);
      _self.set('panel',panel);
      _self.set('footer',footer);
      //_self.set('monthPicker',monthPicker);
    },
    renderUI : function(){
      var _self = this,
      children = _self.get('children');
      if(_self.get('showTime')){
        var  timepicker = _self.get('timepicker') || _self._initTimePicker();
        children.push(timepicker);
        _self.set('timepicker',timepicker);
      }
    },
    //绑定事件
    bindUI : function(){
      var _self = this,
        header = _self.get('header'),
        panel = _self.get('panel');

      panel.on('selectedchange',function(e){
        var date = e.date;
        if(!DateUtil.isDateEquals(date,_self.get('selectedDate'))){
          _self.set('selectedDate',date);
        }
      });
      if(!_self.get('showTime')){
        panel.on('click',function(){
          _self.fire('accept');
        });
      }else{
        _self._initTimePickerEvent();
      }

      header.on('monthchange',function(e){
        _self._setYearMonth(e.year,e.month);
      });

      header.on('headerclick',function(){
        var monthPicker = _self.get('monthpicker') || _self._createMonthPicker();
        monthPicker.set('year',header.get('year'));
        monthPicker.set('month',header.get('month'));
        monthPicker.show();
      });
    },
    _initTimePicker : function(){
      var _self = this,
        lockTime = _self.get('lockTime'),
        _timePickerEnum={hour:CLS_PICKER_HOUR,minute:CLS_PICKER_MINUTE,second:CLS_PICKER_SECOND};
      if(lockTime){
          for(var key in lockTime){
              var noCls = _timePickerEnum[key.toLowerCase()];
              _self.set(key,lockTime[key]);
              if(!lockTime.editable){
                _self.get('el').find("."+noCls).attr("disabled","");
              }
          }
      }
      var  picker = new Picker({
          elCls : CLS_TIME_PICKER,
          children:[{
            itemTpl : '<li><a href="#">{text}</a></li>'
          }],
          autoAlign : false,
          align : {
            node : _self.get('el'),
            points:['bl','bl'],
            offset:[0,-30]
          },
          trigger : _self.get('el').find('.' +CLS_PICKER_TIME)
        });
      picker.render();
      _self._initTimePickerEvent(picker);
      return picker;
    },
    _initTimePickerEvent : function(picker){
      var _self = this,
        picker= _self.get('timepicker');

      if(!picker){
        return;
      }

      picker.get('el').delegate('a','click',function(ev){
        ev.preventDefault();
      });
      picker.on('triggerchange',function(ev){
        var curTrigger = ev.curTrigger;
        if(curTrigger.hasClass(CLS_PICKER_HOUR)){
          picker.get('list').set('items',getNumberItems(24));
        }else{
          picker.get('list').set('items',getNumberItems(60));
        }
      });

      picker.on('selectedchange',function(ev){
        var curTrigger = ev.curTrigger,
          val = ev.value;
        if(curTrigger.hasClass(CLS_PICKER_HOUR)){
          _self.setInternal('hour',val);
        }else if(curTrigger.hasClass(CLS_PICKER_MINUTE)){
          _self.setInternal('minute',val);
        }else{
          _self.setInternal('second',val);
        }
      });
    },
    //更改年和月
    _setYearMonth : function(year,month){
      var _self = this,
        selectedDate = _self.get('selectedDate'),
        date = selectedDate.getDate();
      if(year !== selectedDate.getFullYear() || month !== selectedDate.getMonth()){
        var newDate = new Date(year,month,date);
        if(newDate.getMonth() != month){ //下一个月没有对应的日期,定位到下一个月最后一天
          newDate = DateUtil.addDay(-1,new Date(year,month + 1));
        }
        _self.set('selectedDate',newDate);
      }
    },
    //创建选择月的控件
    _createMonthPicker: function(){
      var _self = this,
        monthpicker;
      monthpicker = new MonthPicker({
        render : _self.get('el'),
        effect : {
          effect:'slide',
          duration:300
        },
        visibleMode:'display',
        success : function(){
          var picker = this;
          _self._setYearMonth(picker.get('year'),picker.get('month'));
          picker.hide();
        },
        cancel : function(){
          this.hide();
        }
      });
      _self.set('monthpicker',monthpicker);
      _self.get('children').push(monthpicker);
      return monthpicker;
    },
    //创建底部按钮栏
    _createFooter : function(){
      var _self = this,
        showTime = this.get('showTime'),
        items = [];

      if(showTime){
        items.push({
          content : _self.get('timeTpl')
        });
        items.push({
          xclass:'bar-item-button',
          text:'确定',
          btnCls: 'button button-small button-primary',
          listeners:{
            click:function(){
              _self.fire('accept');
            }
          }
        });
      }else{
        items.push({
          xclass:'bar-item-button',
          text:'今天',
          btnCls: 'button button-small',
		      id:'todayBtn',
          listeners:{
            click:function(){
              var day = today();
              _self.set('selectedDate',day);
              _self.fire('accept');
            }
          }
        });
        items.push({
          xclass:'bar-item-button',
          text:'清除',
          btnCls: 'button button-small',
          id:'clsBtn',
          listeners:{
            click:function(){
              _self.fire('clear');
            }
          }
        });
      }

      return new Toolbar.Bar({
          elCls : PREFIX + 'calendar-footer',
          children:items
        });
    },
	//更新今天按钮的状态
    _updateTodayBtnAble: function () {
            var _self = this;
            if (!_self.get('showTime')) {
                var footer = _self.get("footer"),
                    panelView = _self.get("panel").get("view"),
                    now = today(),
                    btn = footer.getItem("todayBtn");
                panelView._isInRange(now) ? btn.enable() : btn.disable();
            }
    },
    //设置所选日期
    _uiSetSelectedDate : function(v){
      var _self = this,
        year = v.getFullYear(),
        month = v.getMonth();

      _self.get('header').setMonth(year,month);
      _self.get('panel').set('selected',v);
      _self.fire('datechange',{date:v});
    },
    _uiSetHour : function(v){
      setTimeUnit(this,CLS_PICKER_HOUR,v);
    },
    _uiSetMinute : function(v){
      setTimeUnit(this,CLS_PICKER_MINUTE,v);
    },
    _uiSetSecond : function(v){
      setTimeUnit(this,CLS_PICKER_SECOND,v);
    },
    //设置最大值
    _uiSetMaxDate : function(v){
      var _self = this;
      _self.get('panel').set('maxDate',v);
	  _self._updateTodayBtnAble();
    },
    //设置最小值
    _uiSetMinDate : function(v){
      var _self = this;
      _self.get('panel').set('minDate',v);
	  _self._updateTodayBtnAble();
    }

  },{
    ATTRS :
    {
      /**
       * 日历控件头部，选择年月
       * @private
       * @type {Object}
       */
      header:{

      },

      /**
       * 日历控件选择日
       * @private
       * @type {Object}
       */
      panel:{

      },
      /**
       * 最大日期
       * <pre><code>
       *   calendar.set('maxDate','2013-07-29');
       * </code></pre>
       * @type {Date}
       */
      maxDate : {

      },
      /**
       * 最小日期
       * <pre><code>
       *   calendar.set('minDate','2013-07-29');
       * </code></pre>
       * @type {Date}
       */
      minDate : {

      },
      /**
       * 选择月份控件
       * @private
       * @type {Object}
       */
      monthPicker : {

      },
      /**
       * 选择时间控件
       * @private
       * @type {Object}
       */
      timepicker:{

      },
      width:{
        value:180
      },
      events:{
        value:{
           /**
           * @event
           * @name BUI.Calendar.Calendar#click
           * @param {Object} e 点击事件
           * @param {Date} e.date
           */
          'click' : false,
          /**
           * 确认日期更改，如果不显示日期则当点击日期或者点击今天按钮时触发，如果显示日期，则当点击确认按钮时触发。
           * @event
           */
          'accept' : false,
          /**
           * @event
           * @name BUI.Calendar.Calendar#datechange
           * @param {Object} e 选中的日期发生改变
           * @param {Date} e.date
           */
          'datechange' : false,
           /**
           * @event
           * @name BUI.Calendar.Calendar#monthchange
           * @param {Object} e 月份发生改变
           * @param {Number} e.year
           * @param {Number} e.month
           */
          'monthchange' : false
        }
      },
      /**
       * 是否选择时间,此选项决定是否可以选择时间
       *
       * @cfg {Boolean} showTime
       */
      showTime : {
        value : false
      },
      /**
      * 锁定时间选择
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
      timeTpl : {
        value : '<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_HOUR + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_MINUTE + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_SECOND + '" />'
      },
      /**
       * 选择的日期,默认为当天
       * <pre><code>
       *  var calendar = new Calendar.Calendar({
       *  render:'#calendar',
       *   selectedDate : new Date('2013/07/01') //不能使用字符串
       * });
       * </code></pre>
       * @cfg {Date} selectedDate
       */
      /**
       * 选择的日期
       * <pre><code>
       *   calendar.set('selectedDate',new Date('2013-9-01'));
       * </code></pre>
       * @type {Date}
       * @default today
       */
      selectedDate : {
        value : today()
      },
      /**
       * 小时,默认为当前小时
       * @type {Number}
       */
      hour : {
        value : new Date().getHours()
      },
      /**
       * 分,默认为当前分
       * @type {Number}
       */
      minute:{
        value : new Date().getMinutes()
      },
      /**
       * 秒,默认为当前秒
       * @type {Number}
       */
      second : {
        value : 0
      }
    }
  },{
    xclass : 'calendar',
    priority : 0
  });

  return calendar;
});
