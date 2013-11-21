/**/
BUI.use('bui/slider/slider',function (Slider) {

  var slider = new Slider({
    render : '#s1',
    elCls : 'progress',
    
    backTpl : '<div class="bar"></div>',
    value : 30
  });

  slider.render();

  var el = slider.get('el')

  describe('初始化',function(){
    it('测试滑块生成',function(){
      expect(el.find('.x-slider-handle').length).not.toBe(0);
    });
    it('测试背景生成',function(){
      expect(el.find('.x-slider-back').length).not.toBe(0);
    });
    it('测试初始值',function(){
      waits(400);
      runs(function(){
        expect(el.find('.x-slider-back')[0].style.width).toBe('30%');
        expect(el.find('.x-slider-handle')[0].style.left).toBe('30%');
      });  
    });
  });

  describe('操作',function(){
    it('改变值',function(){
      slider.set('value',50);
      waits(400);
      runs(function(){
        expect(el.find('.x-slider-back')[0].style.width).toBe('50%');
        expect(el.find('.x-slider-handle')[0].style.left).toBe('50%');
      });
      
    });
  });

  describe('事件',function(){

    it('测试改变',function(){

    });
    it('测试点击',function(){

    });

    it('测试拖拽',function(){

    });
  });

  describe('键盘操作',function(){
    it('上',function(){

    });

    it('下',function(){

    });

    it('左',function(){

    });

    it('右',function(){

    });
  });
});

BUI.use('bui/slider/slider',function (Slider) {

  var slider = new Slider({
    render : '#s2',
    isVertical : true,
    //duration : 4000,
    height:200,
    step:10,
    value : 30
  });

  slider.render();

  var el = slider.get('el')

  describe('初始化',function(){
    it('测试垂直',function(){
      expect(el.hasClass('x-slider-vertical')).toBe(true);
    });
    it('测试初始值',function(){
      waits(400);
      runs(function(){
        expect(el.find('.x-slider-back')[0].style.height).toBe('30%');
        expect(el.find('.x-slider-handle')[0].style.bottom).toBe('30%');
      });
      
    });
  });
});

BUI.use('bui/slider/slider',function (Slider) {

  var slider = new Slider({
    render : '#s3',
    range : true,
    value : [30,50]
  });

  slider.render();

  var el = slider.get('el')

  describe('初始化',function(){
    it('测试滑块',function(){
      expect(el.find('.x-slider-handle').length).toBe(2);
    });
    it('测试初始值',function(){
      waits(400);
      runs(function(){
        expect(el.find('.x-slider-handle')[0].style.left).toBe('30%');
        expect(el.find('.x-slider-handle')[1].style.left).toBe('50%');
        expect(el.find('.x-slider-back')[0].style.width).toBe('20%');
        expect(el.find('.x-slider-back')[0].style.left).toBe('30%');
      });
    });
  });

  describe('操作',function(){
    it('更改范围',function(){
      slider.set('value',[20,60]);
      waits(400);
      runs(function(){
        expect(el.find('.x-slider-handle')[0].style.left).toBe('20%');
        expect(el.find('.x-slider-handle')[1].style.left).toBe('60%');
        expect(el.find('.x-slider-back')[0].style.width).toBe('40%');
        expect(el.find('.x-slider-back')[0].style.left).toBe('20%');
      });
    });
  });
});

BUI.use('bui/slider/slider',function (Slider) {

  var slider = new Slider({
    render : '#s4',
    isVertical : true,
    height:200,
    range : true,
    value : [30,50]
  });

  slider.render();

  var el = slider.get('el')

  describe('初始化',function(){
    it('测试滑块',function(){
      expect(el.find('.x-slider-handle').length).toBe(2);
    });
    it('测试初始值',function(){
      waits(400);
      runs(function(){
        expect(el.find('.x-slider-handle')[0].style.bottom).toBe('30%');
        expect(el.find('.x-slider-handle')[1].style.bottom).toBe('50%');
        expect(el.find('.x-slider-back')[0].style.height).toBe('20%');
        expect(el.find('.x-slider-back')[0].style.bottom).toBe('30%');
      });
    });
  });

  describe('操作',function(){
    it('更改范围',function(){
      slider.set('value',[20,60]);
      waits(800);
      runs(function(){
        expect(el.find('.x-slider-handle')[0].style.bottom).toBe('20%');
        expect(el.find('.x-slider-handle')[1].style.bottom).toBe('60%');
        expect(el.find('.x-slider-back')[0].style.height).toBe('40%');
        expect(el.find('.x-slider-back')[0].style.bottom).toBe('20%');
      });
    });
  });
});

BUI.use('bui/slider/slider',function (Slider) {

  var slider = new Slider({
    render : '#s5',
    elCls : 'progress',
    min : 1000,
    max : 1000,
    value : 1000,
    backTpl : '<div class="bar"></div>'
  });

  slider.render();

  var el = slider.get('el')

  describe('最小值等于最大值，初始化',function(){
    it('测试滑块生成',function(){
      expect(el.find('.x-slider-handle').length).not.toBe(0);
    });
    it('测试背景生成',function(){
      expect(el.find('.x-slider-back').length).not.toBe(0);
    });
    it('测试初始值',function(){
      waits(400);
      runs(function(){
        expect(el.find('.x-slider-back')[0].style.width).toBe('100%');
        expect(el.find('.x-slider-handle')[0].style.left).toBe('100%');
      });  
    });
  });

});