BUI.use('bui/extensions/treepicker',function (TreePicker) {
/**/  

  describe('测试单选',function(){
    var picker = new TreePicker({
      trigger : '#J_T1',  
      valueField : '#J_V1',
      width : 200,
      children : [
        {
          nodes : [
            {text : '1',id : '1',children: [{text : '11',id : '11'}]},
            {text : '2',id : '2',expanded : true,children : [
                {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
                {text : '22',id : '22'}
            ]},
            {text : '3',id : '3'},
            {text : '4',id : '4'}
          ]
        }
      ]
    });

    picker.render();

    describe('测试初始化',function(){
      it('测试默认选项',function(){
        var valueEl = $('#J_V1');
        expect(picker.getSelectedValue()).toBe(valueEl.val());
        expect($('#J_T1').val()).toBe(valueEl.val());
      });
      it('改变选项值',function(){
        var val = '3';
        picker.setSelectedValue(val);
        expect($('#J_V1').val()).toBe(val);
      });
    });
  });
  describe('测试多选',function(){
    var picker = new TreePicker({
      trigger : '#J_T2',  
      valueField : '#J_V2',
      selectStatus : 'checked',
      filter : function(node){
        if(node.leaf){
          return true;
        }
        return false;
      },
      width : 200,
      children : [
        {
          checkType : 'all',
          nodes : [
            {text : '1',id : '1',children: [{text : '11',id : '11'}]},
            {text : '2',id : '2',expanded : true,children : [
                {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
                {text : '22',id : '22'}
            ]},
            {text : '3',id : '3'},
            {text : '4',id : '4'}
          ]
        }
      ]
    });

    picker.render();

    it('测试默认选项',function(){
      var valueEl = $('#J_V2');
      expect(picker.getSelectedValue()).toBe(valueEl.val());
      expect($('#J_T2').val()).toBe(valueEl.val());
    });
    it('改变选项值',function(){
      var val = '3';
      picker.setSelectedValue(val);
      expect($('#J_V2').val()).toBe(val);
    });
    it('选中节点',function(){
      picker.get('tree').clearAllChecked();
      expect($('#J_V2').val()).toBe('');
      picker.get('tree').setChecked('2');
      expect($('#J_V2').val()).not.toBe('2');
    }); /**/
  });

});