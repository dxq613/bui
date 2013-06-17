BUI.use('bui/tooltip',function (Tooltip) {
  var Tip = Tooltip.Tip;

  describe('测试tip',function(){

    describe('测试生成',function(){
      var title = '测试',
        tip  = new Tip({
        title : title
      });

      tip.render();
      var el = tip.get('el');
      it('测试tip生成',function(){
        expect(el.length).not.toBe(0);
      });
      it('测试title',function(){
        expect(el.text()).toBe(title);
      });

      it('测试指向箭头',function(){
        expect(el.find('.x-align-arrow').length).not.toBe(0);
      });
    });

    describe('测试对齐样式',function(){
      var title = '测试',
        tip  = new Tip({
        title : title,
        elCls:"tips tips-warning",
        trigger : '#t1'
      });

      tip.render();
      var el = tip.get('el');
      it('测试顶部对齐',function(){
        tip.set('align',{
          points : ['bc','tc']
        });
        expect(el.hasClass('x-align-bc-tc')).toBe(true);
      });
      it('测试底部对齐',function(){
        tip.set('align',{
          points : ['tc','bc']
        });
        expect(el.hasClass('x-align-bc-tc')).toBe(false);
        expect(el.hasClass('x-align-tc-bc')).toBe(true);
      });
      it('测试居左',function(){
        tip.set('align',{
          points : ['cl','cr']
        });
        expect(el.hasClass('x-align-tc-bc')).toBe(false);
        expect(el.hasClass('x-align-cl-cr')).toBe(true);
      });

      it('测试居右',function(){
        tip.set('align',{
          points : ['cr','cl']
        });
        expect(el.hasClass('x-align-cl-cr')).toBe(false);
        expect(el.hasClass('x-align-cr-cl')).toBe(true);
      });

      it('测试居上',function(){
        tip.set('alignType','top');
        expect(el.hasClass('x-align-top')).toBe(true);
        expect(el.hasClass('x-align-tc-bc')).toBe(true);
      });
      it('测试居下',function(){
        tip.set('alignType','bottom');
        expect(el.hasClass('x-align-bottom')).toBe(true);
        expect(el.hasClass('x-align-bc-tc')).toBe(true);
      });
      it('测试居左',function(){
        tip.set('alignType','left');
        expect(el.hasClass('x-align-left')).toBe(true);
        expect(el.hasClass('x-align-cl-cr')).toBe(true);
      });
      it('测试居右',function(){
        tip.set('alignType','right');
        expect(el.hasClass('x-align-right')).toBe(true);
        expect(el.hasClass('x-align-cr-cl')).toBe(true);
      });
      it('测试居左上',function(){
        tip.set('alignType','top-left');
        expect(el.hasClass('x-align-top-left')).toBe(true);
        expect(el.hasClass('x-align-tl-bl')).toBe(true);
      });
      it('测试右上',function(){
        tip.set('alignType','top-right');
        expect(el.hasClass('x-align-top-right')).toBe(true);
        expect(el.hasClass('x-align-tr-br')).toBe(true);
      });
      it('测试居左下',function(){
        tip.set('alignType','bottom-left');
        expect(el.hasClass('x-align-bottom-left')).toBe(true);
        expect(el.hasClass('x-align-bl-tl')).toBe(true);
      });
      it('测试右下',function(){
        tip.set('alignType','bottom-right');
        expect(el.hasClass('x-align-bottom-right')).toBe(true);
        expect(el.hasClass('x-align-br-tr')).toBe(true);
      });
    });

    describe('测试委托',function(){

    });

    describe('测试操作',function(){
      var title = '测试',
        tip  = new Tip({
        title : title
      });

      tip.render();
      var el = tip.get('el');
      it('更改title',function(){
        var title = 'new test';
        tip.set('title',title);
        expect(el.text()).toBe(title);
      });

      it('设置object title',function(){
        var title = {text : 'abc',value:123}
        tip.set('titleTpl','<span>{text}:{value}</span>');
        tip.set('title',title);
        expect(el.text()).toBe(title.text + ':' + title.value);
      });
    });

  });

  describe('测试tips',function(){
    var Tips = Tooltip.Tips;
    new Tips({
      tip : {
        trigger: 'code',
        alignType : 'top',
        offset: 8,
        elCls : 'tips tips-small tips-success',
        titleTpl : '<span class="x-icon x-icon-small x-icon-success"><i class="icon icon-white icon-question"></i></span>\
        <div class="tips-content">{title}</div>'
      }
    }).render();

    describe('测试生成',function(){

    });

    describe('测试显示位置',function(){

    });

    describe('测试显示内容',function(){

    });
  });
});