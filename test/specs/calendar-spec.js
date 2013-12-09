
var CLS_DATE = 'x-datepicker-date',
    CLS_TEXT_YEAR= 'year-text',
    CLS_PREV = 'x-datepicker-prev',
    CLS_NEXT = 'x-datepicker-next';
    CLS_TEXT_MONTH = 'month-text';

function today(){
    var now = new Date();
    return new Date(now.getFullYear(),now.getMonth(),now.getDate());
  }
/**/
BUI.use('bui/calendar/panel',function (Panel) {
  var DateUtil = BUI.Date;
    
  var today = new Date(),
    selDay = DateUtil.addDay(10,today),
    panel =new Panel({
      render : '#c1',
      selected : selDay
    });
    
  panel.render();

  var el = panel.get('el');

  describe("测试日期加减",function(){
    var year = 2012,
      month = 9,
      day = 5,
      date = new Date(year,month,day);
    it('测试日期加减',function(){
      expect(DateUtil.addDay(1,date).getDate()).toBe(day + 1);
      expect(DateUtil.addDay(-1,date).getDate()).toBe(day - 1);
      expect(DateUtil.addDay(10,date).getDate()).toBe(day + 10);
    });
    it('测试日期加减',function(){

      expect(DateUtil.addWeek(1,date).getDate()).toBe(day + 7);
      expect(DateUtil.addWeek(-1,date).getDate()).toBe(28);
      expect(DateUtil.addWeek(3,date).getDate()).toBe(day + 21);
    });

  });

  describe('测试日期容器生成',function(){

    it('测试容器生成',function(){
      expect(panel.get('year')).toBe(selDay.getFullYear());
      expect(panel.get('month')).toBe(selDay.getMonth());
    });

    it('测试日期生成',function(){
      expect($('.'+CLS_DATE,el).length).toBe(42);
    });

    it('测试日期选中默认选中日期',function(){
      var view =panel.get('view'),
        selectEl = view._findDateElement(selDay);
      expect(selectEl.length).toBe(1);
    });
  });
  
  describe('测试日期容器方法',function(){

    it('测试容更改月',function(){
      var view =panel.get('view'),
        year = panel.get('year'),
        month = panel.get('month'),
        toMonth = (month + 2)%12;
      panel.setMonth(year,toMonth);

      expect(view._findDateElement(new Date(year,month))).toBe(null);

      expect(view._findDateElement(new Date(year,toMonth))).not.toBe(null);
        

    });

    it('测试容更改年',function(){

      var view =panel.get('view'),
        year = panel.get('year'),
        toYear = year + 2,
        month = panel.get('month'),
        toMonth = (month + 2)%12;
      panel.setMonth(toYear,month);

      expect(view._findDateElement(new Date(year,month))).toBe(null);

      expect(view._findDateElement(new Date(toYear,month))).not.toBe(null);
    });

    it('测试容更改年月',function(){
      var view =panel.get('view'),
        year = panel.get('year'),
        toYear = year + 2,
        month = panel.get('month'),
        toMonth = (month + 2)%12;
      panel.setMonth(toYear,toMonth);

      expect(view._findDateElement(new Date(year,month))).toBe(null);

      expect(view._findDateElement(new Date(toYear,toMonth))).not.toBe(null);
    });

    it('测试选择当月日期',function(){
      var view =panel.get('view'),
        year = panel.get('year'),
        month = panel.get('month'),
        day = 15,
        newDate = new Date(year,month,day);
      panel.set('selected',newDate);
      expect(view._findDateElement(newDate)).not.toBe(null);
    });

    it('测试选择其他月日期',function(){
      var view =panel.get('view'),
        year = panel.get('year'),
        month = panel.get('month') + 1,
        day = 15,
        newDate = new Date(year,month,day);
      panel.set('selected',newDate);
      expect(view._findDateElement(newDate)).not.toBe(null);
    });

  });

});


BUI.use('bui/calendar/header',function(Header){
  var today = new Date(),
    DateUtil = BUI.Date,
    year = today.getFullYear(),
    month = today.getMonth(),
    header = new Header({
      year: year,
      month :month,
      render : '#c2'
    });

  header.render();
  headerEl = header.get('el');
  describe('日期头生成',function(){
    it('测试头部生成',function(){
      expect(headerEl.length).toBe(1);
      expect(headerEl.find('.x-datepicker-month').length).not.toBe(0);
    });

    it('测试年月显示',function(){
      expect(headerEl.find('.' + CLS_TEXT_YEAR).text()).toBe(year.toString());
      expect(headerEl.find('.' + CLS_TEXT_MONTH).text()).toBe((month+1).toString())
    });
  });

  describe('改变年月',function(){
    it('更改月',function(){
      header.setMonth(year,month+2)
      expect(headerEl.find('.' + CLS_TEXT_MONTH).text()).toBe((month+3).toString());
    });

    it('更改年',function(){
      header.setMonth(year+2,month+2)
      expect(headerEl.find('.' + CLS_TEXT_YEAR).text()).toBe((year+2).toString())
    });
  });

  describe('点击更改月',function(){

    it('上一月',function(){
      var year = header.get('year'),
        month = header.get('month');

      //jasmine.simulate(headerEl.find('.'+CLS_PREV)[0],'click');
      //.fire('click');
      headerEl.find('.'+CLS_PREV).trigger('click');
      waits(200);
      runs(function(){
        expect(header.get('month')).toBe((month-1)%12);
      });
    });

    it('下一月',function(){
       var year = header.get('year'),
        month = header.get('month');

      //jasmine.simulate(headerEl.find('.'+CLS_NEXT)[0],'click');
      headerEl.find('.'+CLS_NEXT).trigger('click');
      waits(200);
      runs(function(){
        expect(header.get('month')).toBe((month+1)%12);
      });
    });
  });
 
});

BUI.use('bui/calendar/calendar',function(Calendar){

  var calendar = new Calendar({
    render:'#c3'
  }),
  DateUtil = BUI.Date;
  calendar.render();
 
  var el = calendar.get('el'),
    header = calendar.get('header'),
    panel = calendar.get('panel');

  describe('测试生成',function(){

    it('测试生成头',function(){
      expect(el.find('.bui-calendar-header').length).not.toBe(0);
    });

    it('测试生成容器',function(){
      expect(el.find('.bui-calendar-panel').length).not.toBe(0);
    });

    it('测试选中默认日期',function(){
      var equals = DateUtil.isDateEquals(panel.get('selected'),today());
      expect(equals).toBeTruthy();
    });
  });
});

BUI.use('bui/calendar/calendar',function(Calendar){

  var calendar = new Calendar({
    render:'#c6',
    minDate : '2010-01-01',
    selectedDate : new Date('2013/06/05'),
    maxDate : '2013-06-06'
  }),
  DateUtil = BUI.Date;
  calendar.render();
 
  var el = calendar.get('el'),
    header = calendar.get('header'),
    panel = calendar.get('panel'),
    pview = panel.get('view');

  describe('测试日期范围',function(){

    it('测试日期范围内的日期',function(){
      var itemEl = pview._findDateElement(new Date('2013/06/06'));
      expect(itemEl.hasClass('x-datepicker-disabled')).toBe(false);
    });

    it('测试日期范围外的日期',function(){
      var itemEl = pview._findDateElement(new Date('2013/06/07'));
      expect(itemEl.hasClass('x-datepicker-disabled')).toBe(true);
    });

    it('测试日期最小值外的日期',function(){
      panel.set('selected',new Date('2010/01/01'));
      var itemEl = pview._findDateElement(new Date('2009/12/31'));
      expect(itemEl.hasClass('x-datepicker-disabled')).toBe(true);

      var itemEl = pview._findDateElement(new Date('2010/01/02'));
      expect(itemEl.hasClass('x-datepicker-disabled')).toBe(false);
    });

    it('更改最小值',function(){
      calendar.set('minDate','2010-10-06');
      var itemEl = pview._findDateElement(new Date('2010/01/02'));
      expect(itemEl.hasClass('x-datepicker-disabled')).toBe(true);
    });

    it('更改最大值',function(){
       calendar.set('maxDate','2013-06-10');
      panel.set('selected',new Date('2013/06/13'));
      var itemEl = pview._findDateElement(new Date('2013/06/07'));
      expect(itemEl.hasClass('x-datepicker-disabled')).toBe(false);
    });

  });
});

BUI.use('bui/calendar/calendar',function(Calendar){

  var calendar = new Calendar({
    render:'#c4',
    showTime : true
  }),
  DateUtil = BUI.Date;
  calendar.render();
 
  var el = calendar.get('el'),
    header = calendar.get('header'),
    panel = calendar.get('panel'),
    timePicker = calendar.get('timePicker'),
    footer = calendar.get('footer');

  describe('测试生成',function(){

    it('测试生成头',function(){
      expect(el.find('.bui-calendar-header').length).not.toBe(0);
    });

    it('测试生成容器',function(){
      expect(el.find('.bui-calendar-panel').length).not.toBe(0);
    });

    it('测试选中默认日期',function(){
      var equals = DateUtil.isDateEquals(panel.get('selected'),today());
      expect(equals).toBeTruthy();
    });

    it('测试时间生成',function(){
      expect(el.find('.x-datepicker-time').length).not.toBe(0);
    });
  });
});
/**/
BUI.use('bui/calendar/datepicker',function(DatePicker){

  var datepicker = new DatePicker({
    trigger:'.calendar'
  });
  datepicker.render();
 
});

BUI.use('bui/calendar/datepicker',function(DatePicker){

  var datepicker = new DatePicker({
    trigger:'.calendar-time',
    showTime : true
  }),
  DateUtil = BUI.Date;
  datepicker.render();
  datepicker._initControl();
  var calendar = datepicker.get('calendar'),
    dtInput = $('#dt1'),
    el = calendar.get('el');
  var str = "2007-10-10 22:10:01",
    date = DateUtil.parse(str);
  dtInput.val(str);
  describe('显示时间日期',function(){

    it('点击显示日期控件',function(){
      dtInput.trigger('click');
      waits(100);
      runs(function(){
        expect(datepicker.get('visible')).toBe(true);
      });
    });
    it('测试初始时间',function(){
      expect(el.find('.x-datepicker-time').length).not.toBe(0);
      expect(calendar.get('hour')).toBe(date.getHours());
      expect(calendar.get('minute')).toBe(date.getMinutes());
      expect(calendar.get('second')).toBe(date.getSeconds());
    });

    it('测试选择时，分，秒',function(){
      var hour = parseInt(el.find('.x-datepicker-hour').val());
      expect(hour).toBe(date.getHours());
    });
    it('测试点击确定',function(){

    });
  });
});

BUI.use('bui/calendar/datepicker',function(DatePicker){
  var lockTime ={minute:55,second:44};
  var datepicker = new DatePicker({
    trigger:'#lt1',
    showTime : true,
    lockTime : lockTime
  });
  datepicker.render();
  datepicker._initControl();
  var calendar = datepicker.get('calendar'),
    dtInput = $('#lt1'),
    el = calendar.get('el');
    describe("测试锁定时间",function(){
        it('点击显示日期控件',function(){
            dtInput.trigger('click');
            waits(100);
            runs(function(){
                expect(datepicker.get('visible')).toBe(true);
            });
        });
        it("测试锁定时间",function(){
            expect(el.find('.x-datepicker-time').length).not.toBe(0);
            expect(calendar.get('minute')).toBe(lockTime.minute);
            expect(calendar.get('second')).toBe(lockTime.second);
        });
    });
});

BUI.use('bui/calendar/monthpicker',function(MonthPicker){

  var year = 2001,
    month = 10,
    monthpicker = new MonthPicker({
      render:'#m1',
      month:month,
      year:year,
      align : {
        points:['tl','tl']
      },
      success:function(){
        alert(this.get('year') + ' ' + this.get('month'));
      }
    }),
    DateUtil = BUI.Date;
  monthpicker.show();
  var el = monthpicker.get('el'),
    monthPanel = monthpicker.get('monthPanel'),
    yearPanel = monthpicker.get('yearPanel');
  describe('测试生成',function(){

    it('测试月生成',function(){
      expect(monthPanel).not.toBe(undefined);
      expect(el.find('.x-monthpicker-months').length).not.toBe(0);
    });
    it('测试年生成',function(){
      expect(yearPanel).not.toBe(undefined);
      expect(el.find('.x-monthpicker-years').length).not.toBe(0);
    });

    it('测试默认选中的年月',function(){
      expect(monthPanel.getSelectedValue()).toBe(month);
      expect(yearPanel.getSelectedValue()).toBe(year);
    })
  });

});
/**/