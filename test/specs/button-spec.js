
(function () {
  var Button = BUI.Button;
  var button = new Button.Button({
    render : '#bc',
    text : '第一个按钮',
    elCls : 'button button-primary'
  });

  button.render();
  var el = button.get('el');
  describe('测试按钮生成',function(){
    it('测试DOM生成',function(){
      expect(el.length).not.toBe(0);
      expect(el.hasClass('button')).toBe(true);
    });
  });
})();

(function(){
  var Button = BUI.Button;

  var items = [{
      text : 'left',
      elCls : 'button'
    },{
      text : 'middle',
      elCls : 'button'
    },
    {
      text : 'right',
      elCls : 'button'
    }],
    buttonGroup = new Button.ButtonGroup({
      render:'#bg',
      elCls : 'button-group',
      children : items,
      itemStatusCls : {
        selected : 'active'
      }
    });
  buttonGroup.render();

  var el = buttonGroup.get('el');
  
  describe('按钮组生成',function(){
    it('测试按钮生成',function(){
      expect(el.children('.button').length).toBe(items.length);
    });
    it('测试按钮选中',function(){
      var item = buttonGroup.getFirstItem();
      buttonGroup.setSelected(item);
      expect(item.get('selected')).toBe(true);
      expect(item.get('el').hasClass('active')).toBe(true);
    });
    it('测试多选',function(){
      buttonGroup.set('multipleSelect',true);
      buttonGroup.clearSelection();
      buttonGroup.setSelected(buttonGroup.getItemAt(0));
      buttonGroup.setSelected(buttonGroup.getItemAt(1));
      expect(buttonGroup.getSelection().length).toBe(2);

    });
  });

})();