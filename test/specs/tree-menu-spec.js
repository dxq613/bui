
BUI.use('bui/tree/treemenu',function (TreeMenu) {

  describe('生成默认菜单',function(){
    var menu = new TreeMenu({
      render : '#t1',
      elCls : 'test-menu',
      nodes : [
        {text : '1',id : '1',leaf : false,children: []},
        {text : '2',id : '2',expanded : true,children : [
            {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212',children : [{text : '2121',id : '2121'},{text : '2122',id : '2122'}]}]},
            {text : '22',id : '22'}
        ]},
        {text : '3',id : '3'},
        {text : '4',id : '4'}
      ]
    });
    menu.render();
    it('初始化',function(){
      expect('生成菜单项',function(){
        expect(menu.getItems().length).not.toBe(0);
      });
    });

    it('选中',function(){
      var node = menu.findNode('22');
      menu.setSelected(node);
      expect(node.selected).toBe(true);
      
      var node1 = menu.findNode('21');
      menu.setSelected(node1);
      expect(node1.selected).not.toBe(true);
      expect(node.selected).toBe(true);
      /**/
    });

    it('折叠',function(){
      menu.collapseNode('2');
      var node = menu.findNode('22');
      expect(node.selected).toBe(true);
    });

    it('展开',function(){
      menu.expandNode('2');
      var node = menu.findNode('22');
      expect(node.selected).toBe(true);
    });

  });

  describe('自定义样式',function(){
     var menu = new TreeMenu({
      render : '#t2',
      elCls : 'bui-side-menu',
      itemCls : 'bui-menu-item',
      expandAnimate : true,
      showIcons : false,
      dirTpl : '<li class="menu-second"><div class="bui-menu-title"><s></s><span class="bui-menu-title-text">{text}</span></div></li>',
      leafTpl : '<li class="menu-leaf"><a href="{href}"><em>{text}</em></a></li>',
      nodes : [
        {id : '1',text : '首页内容',expanded : true,children : [
          {id:'code',text:'首页代码',href:'main/code.html'},
          {id:'main-menu',text:'顶部导航',href:'main/menu.html'},
          {id:'second-menu',text:'右边菜单',href:'main/second-menu.html'},
          {id:'dyna-menu',text:'动态菜单',href:'main/dyna-menu.html'}
        ]},
        {id:'2',text : '页面操作',expanded : true,children : [
          {id:'operation',text:'页面常见操作',href:'main/operation.html'},
          {id:'quick',text:'页面操作快捷方式',href:'main/quick.html'}  

        ]},
        {text : '文件结构',expanded : true,children : [
          {id:'resource',text:'资源文件结构',href:'main/resource.html'},
          {id:'loader',text:'引入JS方式',href:'main/loader.html'} 
        ]}
      ]
    });
    menu.render();

    describe('初始化',function(){
      it('选项生成',function(){
        expect(menu.getItems().length).not.toBe(0);
      });
      it('测试非叶子节点DOM',function(){
        var node = menu.findNode('1'),
          element = menu.findElement(node);
        expect($(element).hasClass('menu-second')).toBe(true);
      });
      it('测试叶子节点',function(){
        var node = menu.findNode('loader'),
          element = menu.findElement(node);
        expect($(element).hasClass('menu-leaf')).toBe(true);
      });
    });
  });
});