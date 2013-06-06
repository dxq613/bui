/**
 * @fileOverview 日历命名空间入口
 * @ignore
 */

define('bui/calendar',function (require) {
  var BUI = require('bui/common'),
    Calendar = BUI.namespace('Calendar');
  BUI.mix(Calendar,{
    Calendar : require('bui/calendar/calendar'),
    MonthPicker : require('bui/calendar/monthpicker'),
    DatePicker : require('bui/calendar/datepicker')
  });

  return Calendar;
});/**
 * @fileOverview 选择年月
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/calendar/monthpicker',function (require){
  var BUI = require('bui/common'),
    Component = BUI.Component,
    Overlay = require('bui/overlay').Overlay,
    List = require('bui/list').SimpleList,
    Toolbar = require('bui/toolbar'),
	  PREFIX = BUI.prefix,
    CLS_MONTH = 'x-monthpicker-month',
    DATA_MONTH = 'data-month',
    DATA_YEAR = 'data-year',
    CLS_YEAR = 'x-monthpicker-year',
    CLS_YEAR_NAV = 'x-monthpicker-yearnav',
    CLS_SELECTED = 'x-monthpicker-selected',
    CLS_ITEM = 'x-monthpicker-item',
    months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

  function getMonths(){
    return $.map(months,function(month,index){
      return {text:month,value:index};
    });
  }

  var MonthPanel = List.extend({

    
    bindUI : function(){
      var _self = this;
      _self.get('el').delegate('a','click',function(ev){
        ev.preventDefault();
      }).delegate('.' + CLS_MONTH,'dblclick',function(){
        _self.fire('dblclick');
      });
    }
  },{
    ATTRS:{
      itemTpl:{
        view:true,
        value : '<li class="'+CLS_ITEM+' x-monthpicker-month"><a href="#" hidefocus="on">{text}</a></li>'
      },
      
      itemCls : {
        value : CLS_ITEM
      },
      items:{
        view:true,
        value:getMonths()
      },
      elCls : {
        view:true,
        value:'x-monthpicker-months'
      }
    }
  },{
    xclass:'calendar-month-panel'
  });


  var YearPanel = List.extend({

    bindUI : function(){
      var _self = this,
        el = _self.get('el');
      el.delegate('a','click',function(ev){
        ev.preventDefault();
      });

      el.delegate('.' + CLS_YEAR,'dblclick',function(){
        _self.fire('dblclick');
      });

      el.delegate('.x-icon','click',function(ev){
        var sender = $(ev.currentTarget);

        if(sender.hasClass(CLS_YEAR_NAV + '-prev')){
          _self._prevPage();
        }else if(sender.hasClass(CLS_YEAR_NAV + '-next')){
          _self._nextPage();
        }
      });
      _self.on('itemselected',function(ev){
        if(ev.item){
          _self.setInternal('year',ev.item.value);
        }
        
      });
    },
    _prevPage : function(){
      var _self = this,
        start = _self.get('start'),
        yearCount = _self.get('yearCount');
      _self.set('start',start - yearCount);
    },
    _nextPage : function(){
      var _self = this,
        start = _self.get('start'),
        yearCount = _self.get('yearCount');
      _self.set('start',start + yearCount);
    },
    _uiSetStart : function(){
      var _self = this;
      _self._setYearsContent();
    },
    _uiSetYear : function(v){
      var _self = this,
        item = _self.findItemByField('value',v);
      if(item){
        _self.setSelectedByField(v);
      }else{
        _self.set('start',v);
      }
    },
    _setYearsContent : function(){
      var _self = this,
        year = _self.get('year'),
        start = _self.get('start'),
        yearCount = _self.get('yearCount'),
        items = [];

      for(var i = start;i< start + yearCount;i++){
        var text = i.toString();

        items.push({text:text,value:i});
      }
      _self.set('items',items);
      _self.setSelectedByField(year);
    }

  },{
    ATTRS:{
      items:{
        view:true,
        value:[]
      },
      elCls : {
        view:true,
        value:'x-monthpicker-years'
      },
      itemCls : {
        value : CLS_ITEM
      },
      year:{

      },
      /**
       * 起始年
       * @private
       * @ignore
       * @type {Number}
       */
      start:{
        value: new Date().getFullYear()
      },
      /**
       * 年数
       * @private
       * @ignore
       * @type {Number}
       */
      yearCount:{
        value:10
      },
      itemTpl : {
        view:true,
        value : '<li class="'+CLS_ITEM+' '+CLS_YEAR+'"><a href="#" hidefocus="on">{text}</a></li>'
      },
      tpl : {
        view:true,
        value:'<div class="'+CLS_YEAR_NAV+'">'+
              '<span class="'+CLS_YEAR_NAV+'-prev x-icon x-icon-normal x-icon-small"><span class="icon icon-caret icon-caret-left"></span></span>'+
              '<span class="'+CLS_YEAR_NAV+'-next x-icon x-icon-normal x-icon-small"><span class="icon icon-caret icon-caret-right"></span></span>'+
              '</div>'+
              '<ul></ul>'
      }
    }
  },{
    xclass:'calendar-year-panel'
  });
  
  /**
   * 月份选择器
   * xclass : 'calendar-monthpicker'
   * @class BUI.Calendar.MonthPicker
   * @extends BUI.Overlay.Overlay
   */
  var monthPicker = Overlay.extend({

    initializer : function(){
      var _self = this,
        children = _self.get('children'),
        monthPanel = new MonthPanel(),
        yearPanel = new YearPanel(),
        footer = _self._createFooter();

      children.push(monthPanel);
      children.push(yearPanel);
      children.push(footer);

      _self.set('yearPanel',yearPanel);
      _self.set('monthPanel',monthPanel);
    },
    bindUI : function(){
      var _self = this;

      _self.get('monthPanel').on('itemselected',function(ev){
        if(ev.item){
          _self.setInternal('month',ev.item.value);
        }
      }).on('dblclick',function(){
        _self._successCall();
      });

      _self.get('yearPanel').on('itemselected',function(ev){
        if(ev.item){
          _self.setInternal('year',ev.item.value);
        }
      }).on('dblclick',function(){
        _self._successCall();
      });

    },
    _successCall : function(){
      var _self = this,
        callback = _self.get('success');

      if(callback){
        callback.call(_self);
      }
    },
    _createFooter : function(){
      var _self = this;
      return new Toolbar.Bar({
          elCls : PREFIX + 'clear x-monthpicker-footer',
          children:[
            {
              xclass:'bar-item-button',
              text:'确定',
              btnCls: 'button button-small button-primary',
              handler:function(){
                _self._successCall();
              }
            },{
              xclass:'bar-item-button',
              text:'取消',
              btnCls:'button button-small last',
              handler:function(){
                var callback = _self.get('cancel');
                if(callback){
                  callback.call(_self);
                }
              }
            }
          ]
        });
    },
    _uiSetYear : function(v){
      this.get('yearPanel').set('year',v);
    },
    _uiSetMonth:function(v){
      this.get('monthPanel').setSelectedByField(v);
    }
  },{
    ATTRS:
    /**
     * @lends BUI.Calendar.MonthPicker#
     * @ignore
     */
    {
      /**
       * 下部工具栏
       * @private
       * @type {Object}
       */
      footer : {

      },
      align : {
        value : {}
      },
      /**
       * 选中的年
       * @type {Number}
       */
      year : {
        
      },
      /**
       * 成功的回调函数
       * @type {Function}
       */
      success:{
        value : function(){

        }
      },
      /**
       * 取消的回调函数
       * @type {Function}
       */
      cancel :{

      value : function(){} 
 
      },
      width:{
        value:180
      },
      /**
       * 选中的月
       * @type {Number}
       */
      month:{
        
      },
      /**
       * 选择年的控件
       * @private
       * @type {Object}
       */
      yearPanel : {

      },
      /**
       * 选择月的控件
       * @private
       * @type {Object}
       */
      monthPanel:{

      }

    }
  },{
    xclass :'monthpicker'
  });
  return monthPicker;

});/**
 * @fileOverview 日期控件来选择年月的部分
 * @ignore
 */

define('bui/calendar/header',function (require) {
  
  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    Component = BUI.Component,
    CLS_TEXT_YEAR = 'year-text',
    CLS_TEXT_MONTH = 'month-text',
    CLS_ARROW = 'x-datepicker-arrow',
    CLS_PREV = 'x-datepicker-prev',
    CLS_NEXT = 'x-datepicker-next';
      
  /**
   * 日历控件显示选择年月
   * xclass:'calendar-header'
   * @class BUI.Calendar.Header
   * @protected
   * @extends BUI.Component.Controller
   */
  var header = Component.Controller.extend({

    bindUI : function(){
      var _self = this,
        el = _self.get('el');
		
      el.delegate('.' + CLS_ARROW,'click',function(e){
        e.preventDefault();
        var sender = $(e.currentTarget);
        if(sender.hasClass(CLS_NEXT)){
          _self.nextMonth();
        }else if(sender.hasClass(CLS_PREV)){
          _self.prevMonth();
        }
      });

      el.delegate('.x-datepicker-month','click',function(){
        _self.fire('headerclick');
      });
	  
    },
    /**
     * 设置年月
     * @ignore
     * @param {Number} year  年
     * @param {Number} month 月
     */
    setMonth : function(year,month){
      var _self = this,
        curYear = _self.get('year'),
        curMonth = _self.get('month');
      if(year !== curYear || month !== curMonth){
        _self.set('year',year);
        _self.set('month',month);
        _self.fire('monthchange',{year:year,month:month});
      }
    },
    /**
     * 下一月
     * @ignore
     */
    nextMonth : function(){
      var _self = this,
        date = new Date(_self.get('year'),_self.get('month') + 1);

      _self.setMonth(date.getFullYear(),date.getMonth());
    },
    /**
     * 上一月
     * @ignore
     */
    prevMonth : function(){
      var _self = this,
        date = new Date(_self.get('year'),_self.get('month') - 1);

       _self.setMonth(date.getFullYear(),date.getMonth());
    },
    _uiSetYear : function(v){
      var _self = this;
      _self.get('el').find('.' + CLS_TEXT_YEAR).text(v);
    },
    _uiSetMonth : function(v){
        var _self = this;
      _self.get('el').find('.' + CLS_TEXT_MONTH).text(v+1);
    }

  },{
    ATTRS : {
      /**
       * 年
       * @type {Number}
       */
      year:{
        sync:false
      },
      /**
       * 月
       * @type {Number}
       */
      month:{
        sync:false,
        setter:function(v){
          this.set('monthText',v+1);
        }
      },
      /**
       * @private
       * @type {Object}
       */
      monthText : {
        
      },
      tpl:{
        view:true,
        value:'<div class="'+CLS_ARROW+' ' + CLS_PREV + '"><span class="icon icon-white icon-caret  icon-caret-left"></span></div>'+
          '<div class="x-datepicker-month">'+
            '<div class="month-text-container">'+
              '<span><span class="year-text">{year}</span>年 <span class="month-text">{monthText}</span>月</span>'+
              '<span class="' + PREFIX + 'caret ' + PREFIX + 'caret-down"></span>'+
            '</div>'+
          '</div>' +
          '<div class="'+CLS_ARROW+' ' + CLS_NEXT + '"><span class="icon icon-white icon-caret  icon-caret-right"></span></div>'
      },
      elCls:{
        view:true,
        value:'x-datepicker-header'
      },
  	  events:{
    		value:{
          /**
           * 月发生改变，年发生改变也意味着月发生改变
           * @event
           * @param {Object} e 事件对象
           * @param {Number} e.year 年
           * @param {Number} e.month 月
           */
    			'monthchange' : true
    		}
  	  }
    }
  },{
    xclass:'calendar-header'
  });

  return header;

});/**
 * @fileOverview 日历控件显示一月的日期
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/calendar/panel',function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    DateUtil = BUI.Date,
    CLS_DATE = 'x-datepicker-date',
    CLS_TODAY = 'x-datepicker-today',
    CLS_ACTIVE = 'x-datepicker-active',
    DATA_DATE = 'data-date',//存储日期对象
    DATE_MASK = 'isoDate',
    CLS_SELECTED = 'x-datepicker-selected',
    SHOW_WEEKS = 6,//当前容器显示6周
    dateTypes = {
      deactive : 'prevday',
      active : 'active',
      disabled : 'disabled'
    },
    weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  /**
   * 日历面板的视图类
   * @class BUI.Calendar.PanelView
   * @extends BUI.Component.View
   * @private
   */
  var panelView = Component.View.extend({

    renderUI : function(){
      this.updatePanel();
    },
    //更新容器，当月、年发生改变时
    updatePanel : function(){
      var _self = this,
        el = _self.get('el'),
        bodyEl = el.find('tbody'),
        innerTem = _self._getPanelInnerTpl();

      bodyEl.empty();
      $(innerTem).appendTo(bodyEl);
    },
    //获取容器内容
    _getPanelInnerTpl : function(){
      var _self = this,
        startDate = _self._getFirstDate(),
        temps = [];

      for (var i = 0; i < SHOW_WEEKS; i++) {
        var weekStart = DateUtil.addWeek(i,startDate);
        temps.push(_self._getWeekTpl(weekStart));
      };

      return temps.join('');
    },
    //获取周模版
    _getWeekTpl : function(startDate){
      var _self = this,
        weekTpl = _self.get('weekTpl'),
        daysTemps = [];
      for (var i = 0; i < weekDays.length; i++) {
        var date = DateUtil.addDay(i,startDate);
        daysTemps.push(_self._getDayTpl(date));  
      }

      return BUI.substitute(weekTpl,{
        daysTpl:daysTemps.join('')
      });
    },
    //获取日模版
    _getDayTpl : function(date){
      var _self = this,
        dayTpl = _self.get('dayTpl'),
        day = date.getDay(),
        todayCls = _self._isToday(date) ? CLS_TODAY:'',
        dayOfWeek = weekDays[day],
        dateNumber = date.getDate(),
        //不是本月则处于不活动状态
        //不在指定的最大最小范围内，禁止选中
        dateType = _self._isInRange(date) ? (_self._isCurrentMonth(date) ? dateTypes.active : dateTypes.deactive) : dateTypes.disabled;

      return BUI.substitute(dayTpl,{
        dayOfWeek : dayOfWeek,
        dateType : dateType,
        dateNumber : dateNumber,
        todayCls : todayCls,
        date : DateUtil.format(date,DATE_MASK)
      });
    },
    //获取当前容器的第一天
    _getFirstDate : function(year,month){
      var _self = this,
        monthFirstDate = _self._getMonthFirstDate(year,month),
        day = monthFirstDate.getDay();
      return DateUtil.addDay(day * -1,monthFirstDate);
    },
    //获取当月的第一天
    _getMonthFirstDate : function(year,month){
      var _self = this,
        year = year || _self.get('year'),
        month = month || _self.get('month');
      return new Date(year,month);
    },
    //是否是当前显示的月
    _isCurrentMonth : function(date){
      return date.getMonth() === this.get('month');
    },
    //是否是今天
    _isToday : function(date){
      var tody = new Date();
      return tody.getFullYear() === date.getFullYear() && tody.getMonth() === date.getMonth() && tody.getDate() === date.getDate();
    },
    //是否在允许的范围内
    _isInRange : function(date){
      var _self = this,
        maxDate = _self.get('maxDate'),
        minDate = _self.get('minDate');

      if(minDate && date < minDate){
        return false;
      }
      if(maxDate && date > maxDate){
        return false;
      }
      return true;
    },
    //清除选中的日期
    _clearSelectedDate : function(){
      var _self = this;
      _self.get('el').find('.'+CLS_SELECTED).removeClass(CLS_SELECTED);
    },
    //查找日期对应的DOM节点
    _findDateElement : function(date){
      var _self = this,
        dateStr = DateUtil.format(date,DATE_MASK),
        activeList = _self.get('el').find('.' + CLS_DATE),
        result = null;
      if(dateStr){
        activeList.each(function(index,item){
          if($(item).attr('title') === dateStr){
            result = $(item);
            return false;
          }
        });
      }
      return result;
    },
    //设置选中的日期
    _setSelectedDate : function(date){
      var _self = this,
        dateEl = _self._findDateElement(date);

      _self._clearSelectedDate();
      if(dateEl){
        dateEl.addClass(CLS_SELECTED);
      }
    }
  },{
    ATTRS : {

    }
  });
  
  /**
   * 日历控件显示日期的容器
   * xclass:'calendar-panel'
   * @class BUI.Calendar.Panel
   * @protected
   * @extends BUI.Component.Controller
   */
  var panel = Component.Controller.extend(
  /**
  * @lends  BUI.Calendar.Panel.prototype 
  * @ignore
  */
  {

    /**
     * 设置默认年月
     * @protected
     */
    initializer : function(){
      var _self = this,
        now = new Date();
      if(!_self.get('year')){
        _self.set('year',now.getFullYear());
      }

      if(!_self.get('month')){
        _self.set('month',now.getMonth());
      }
    },
    /**
     * @protected
     * @ignore
     */
    bindUI : function(){
      var _self = this,
        el = _self.get('el');
      el.delegate('.' + CLS_DATE,'click',function(e){
        e.preventDefault();
      });
    },
    /**
     * @protected
     * @ignore
     */
    performActionInternal : function(ev){
      var _self = this,
        sender = $(ev.target).closest('.' + CLS_DATE);
      if(sender){
        var date = sender.attr('title');
        if(date){
          date = DateUtil.parse(date);
          if(_self.get('view')._isInRange(date)){
            _self.set('selected',date);
          }
          //_self.fire('click',{date:date});
        }
      }
    },
    /**
     * 设置年月
     * @param {Number} year  年
     * @param {Number} month 月
     */
    setMonth : function(year,month){
      var _self = this,
        curYear = _self.get('year'),
        curMonth = _self.get('month');
      if(year !== curYear || month !== curMonth){
        _self.set('year',year);
        _self.set('month',month);
    		//if(_self.get('rendered')){
    			_self.get('view').updatePanel();
    		//}
      }
    },
    //选中日期
    _uiSetSelected : function(date,ev){
      var _self = this;
      
      if(!(ev && ev.prevVal && DateUtil.isDateEquals(date,ev.prevVal))){
        _self.setMonth(date.getFullYear(),date.getMonth());
        _self.get('view')._setSelectedDate(date);
        _self.fire('selectedchange',{date:date});
      } 
    },
    //设置最日期
    _uiSetMaxDate : function(v){
      if(v){
        this.get('view').updatePanel();
      }
    },
    //设置最小日期
    _uiSetMinDate : function(v){
      if(v){
        this.get('view').updatePanel();
      }
    }
  },{
    ATTRS:
    /**
     * @lends BUI.Calendar.Panel#
     * @ignore
     */
    {
      /**
       * 展示的月所属年
       * @type {Number}
       */
      year : {
        view :true
      },
      /**
       * 展示的月
       * @type {Number}
       */
      month:{
        view :true
      },
      /**
       * 选中的日期
       * @type {Date}
       */
      selected : {

      },
      focusable:{
        value:true
      },
      /**
       * 日期的模板
       * @private
       * @type {Object}
       */
      dayTpl:{
        view : true,
        value:'<td class="x-datepicker-date x-datepicker-{dateType} {todayCls} day-{dayOfWeek}" title="{date}">'+
                '<a href="#" hidefocus="on" tabindex="1">'+
                  '<em><span>{dateNumber}</span></em>'+
                '</a>'+
              '</td>'
      },
      events:{
        value : {
          /**
           * @event
           * @name BUI.Calendar.Panel#click
           * @param {Object} e 点击事件
           * @param {Date} e.date
           */
          'click' : false,
          /**
           * @name BUI.Calendar.Panel#selectedchange
           * @param {Object} e 点击事件
           * @param {Date} e.date
           */
          'selectedchange' : false
        }
      },
      /**
       * 最小日期
       * @type {Date | String}
       */
      maxDate : {
        view : true,
        setter : function(val){
          if(val){
            if(BUI.isString(val)){
              return DateUtil.parse(val);
            }
            return val;
          }
        }
      },
      /**
       * 最小日期
       * @type {Date | String}
       */
      minDate : {
        view : true,
        setter : function(val){
          if(val){
            if(BUI.isString(val)){
              return DateUtil.parse(val);
            }
            return val;
          }
        }
      },
      /**
       * 周的模板
       * @private
       * @type {Object}
       */
      weekTpl:{
        view : true,
        value : '<tr>{daysTpl}</tr>'
      },
      tpl:{
        view:true,
        value:'<table class="x-datepicker-inner" cellspacing="0">' +
                '<thead>' +
                   '<tr>' +
                    '<th  title="Sunday"><span>日</span></th>' +
                    '<th  title="Monday"><span>一</span></th>' +
                    '<th  title="Tuesday"><span>二</span></th>' +
                    '<th  title="Wednesday"><span>三</span></th>' +
                    '<th  title="Thursday"><span>四</span></th>' +
                    '<th  title="Friday"><span>五</span></th>' +
                    '<th  title="Saturday"><span>六</span></th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody class="x-datepicker-body">' +
                '</tbody>' +
              '</table>'
      },
      xview : {value : panelView}
    }
  },{
    xclass:'calendar-panel',
    priority:0
  });

  return panel;
});/**
 * @fileOverview 日期控件
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/calendar/calendar',function(require){
  
  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_PICKER_TIME = 'x-datepicker-time',
    CLS_PICKER_HOUR = 'x-datepicker-hour',
    CLS_PICKER_MINUTE = 'x-datepicker-minute',
    CLS_PICKER_SECOND = 'x-datepicker-second',
    CLS_TIME_PICKER = 'x-timepicker',
    List = require('bui/list'),
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
    return parseInt(inputEl.val());

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
        footer = _self.get('footer') || _self._createFooter(),
        monthPicker = _self.get('monthPicker') || _self._createMonthPicker();
        

      //添加头
      children.push(header);
      //添加panel
      children.push(panel);
      children.push(footer);
      children.push(monthPicker);

      _self.set('header',header);
      _self.set('panel',panel);
      _self.set('footer',footer);
      _self.set('monthPicker',monthPicker);

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
        var monthPicker = _self.get('monthPicker');
        monthPicker.set('year',header.get('year'));
        monthPicker.set('month',header.get('month'));
        monthPicker.show();
      });
    },
    _initTimePicker : function(){
      var _self = this,
        picker = new List.Picker({
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
          trigger : _self.get('el').find('.' + CLS_PICKER_TIME)
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
        _self.set('selectedDate',new Date(year,month,date));
      }
    },
    //创建选择月的控件
    _createMonthPicker: function(){
      var _self = this;

      return new MonthPicker({
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
          listeners:{
            click:function(){
              var day = today();
              _self.set('selectedDate',day);
              _self.fire('accept');
            }
          }  
        });
      }
      
      return new Toolbar.Bar({
          elCls : PREFIX + 'calendar-footer',
          children:items
        });
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
    },
    //设置最小值
    _uiSetMinDate : function(v){
      var _self = this;
      _self.get('panel').set('minDate',v);
    }

  },{
    ATTRS : 
    /**
     * @lends BUI.Calendar.Calendar#
     * @ignore
     */
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
       * @type {Date}
       */
      maxDate : {

      },
      /**
       * 最小日期
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
       * @cfg {Boolean} showTime
       */
      /**
       * 是否选择时间
       * @type {Boolean}
       */
      showTime : {
        value : false
      },
      timeTpl : {
        value : '<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_HOUR + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_MINUTE + '" />:<input type="text" readonly class="' + CLS_PICKER_TIME + ' ' + CLS_PICKER_SECOND + '" />'
      },
      /**
       * 选择的日期,默认为当天
       * @cfg {Date} selectedDate
       */
      /**
       * 选择的日期
       * @type {Date}
       * @default today
       */
      selectedDate : {
        value : today()
      },
      /**
       * 小时,默认为当前小时
       * @cfg {Number} hour
       */
      /**
       * 小时,默认为当前小时
       * @type {Number}
       */
      hour : {
        value : new Date().getHours()
  
      },
      /**
       * 分,默认为当前分
       * @cfg {Number} minute
       */
      /**
       * 分,默认为当前分
       * @type {Number}
       */
      minute:{
        value : new Date().getMinutes()
      },
      /**
       * 秒,默认为当前秒
       * @cfg {Number} second
       */
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
});/**
 * @fileOverview 日期选择器
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/calendar/datepicker',function(require){
  
  var BUI = require('bui/common'),
    Picker = require('bui/overlay').Picker,
    Calendar = require('bui/calendar/calendar'),
    DateUtil = BUI.Date;

  /**
   * 日期选择器，可以由输入框等触发
   * <p>
   * <img src="../assets/img/class-calendar.jpg"/>
   * </p>
   * xclass : 'calendar-datepicker'
   * @class BUI.Calendar.DatePicker
   * @extends BUI.Overlay.Picker
   */
  var datepicker = Picker.extend({

    initializer:function(){
      var _self = this,
        children = _self.get('children'),
        calendar = new Calendar({
          showTime : _self.get('showTime')
        });

      children.push(calendar);
      _self.set('calendar',calendar);
    },
    /**
     * 设置选中的值
     * @param {String} val 设置值
     */
    setSelectedValue : function(val){
      var _self = this,
        calendar = this.get('calendar'),
        date = DateUtil.parse(val);
      date = date || new Date(new Date().setSeconds(0));
      calendar.set('selectedDate',DateUtil.getDate(date));
      if(_self.get('showTime')){
        calendar.set('hour',date.getHours());
        calendar.set('minute',date.getMinutes());
        calendar.set('second',date.getSeconds());
      }
    },
    /**
     * 获取选中的值，多选状态下，值以','分割
     * @return {String} 选中的值
     */
    getSelectedValue : function(){
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
     * @return {String} 选中的文本
     */
    getSelectedText : function(){
      return DateUtil.format(this.getSelectedValue(),this._getFormatType());
    },
    _getFormatType : function(){
      if(this.get('showTime')){
        return 'yyyy-mm-dd HH:MM:ss';
      }
      return 'yyyy-mm-dd';
    },
    //设置最大值
    _uiSetMaxDate : function(v){
      var _self = this;
      _self.get('calendar').set('maxDate',v);
    },
    //设置最小值
    _uiSetMinDate : function(v){
      var _self = this;
      _self.get('calendar').set('minDate',v);
    }

  },{
    ATTRS : 
    /**
     * @lends BUI.Calendar.DatePicker#
     * @ignore
     */
    {
      /**
       * 是否显示日期
       * @type {Boolean}
       */
      showTime : {
        value:false
      },
      /**
       * 最大日期
       * @type {Date}
       */
      maxDate : {

      },
      /**
       * 最小日期
       * @type {Date}
       */
      minDate : {

      },
      changeEvent:{
        value:'accept'
      },
      hideEvent:{
        value:'accept'
      },
      /**
       * 日历对象,可以进行更多的操作，参看{@link BUI.Calendar.Calendar}
       * @type {BUI.Calendar.Calendar}
       */
      calendar:{

      }
    }
  },{
    xclass : 'datepicker',
    priority : 0
  });
  return datepicker;
  
});