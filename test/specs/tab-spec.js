
/**/
BUI.use('bui/tab',function (Tab){
  
  var CLS_ITEM_TITLE = 'tab-item-title',
    CLS_ITEM_CLOSE = 'tab-item-close',
    CLS_CONTENT = 'tab-content';
  var config = {
    title : '<i class="icon icon-music"></i>测试标签',
    render : '#t1',
    actived : true,
    href : 'http://www.taobao.com',
    tabContentContainer : '#container'
  };
  var item = new Tab.NavTabItem(config);

  item.render();
  
  item.on('click',function(){
    BUI.log('click');
  });

  item.on('closing',function(){
    BUI.log('closing');

  });

  item.on('closed',function(){
    BUI.log(closed);
    item.hide();
  })
  var el = item.get('el');

  describe("测试标签项生成",function(){
    it('测试标签导航生成',function(){
      expect(el).not.toBe(undefined);
    });
    it('测试标题',function(){
      var titleEl = el.find('.'+CLS_ITEM_TITLE);
      expect(titleEl.text()).toBe(config.title);
    });
    it('测试标签内容生成',function(){
      var contentEl = $('.'+CLS_CONTENT,config.tabContentContainer);
      expect(contentEl[0]).not.toBe(null);
      expect(contentEl[0]).not.toBe(undefined);
      var iframeEl = contentEl.find('iframe');
      expect(iframeEl.attr('src')).toBe(config.href);
    })
  });
  
});

BUI.use('bui/tab',function(Tab){

  var CLS_NAV_LIST = 'tab-nav-list';
  var tab = new Tab.NavTab({
    render:'#t2',
	  height:500,
    forceFit : true,
    children : [
      {
        title : '测试标签',
        href : 'http://www.baidu.com',
        xclass:'nav-tab-item',
		    id:'testitem'

      },
	  {
        title : '测试标签2',
        href : 'http://www.baidu.com',
        xclass:'nav-tab-item',
		    id:'testitem2'

      },
    {
        title : '测试标签3',
        href : 'http://www.baidu.com',
        xclass:'nav-tab-item',
        id:'testitem3'

      }
    ]
  });

  tab.render();
  $('#btnAdd').on('click',function(){
    var config = {
        title : '添加标签',
        href : 'http://www.taobao.com'
      };
    tab.addTab(config);
  });
  var el = tab.get('el');
	describe("导航标签测试",function(){
		it('导航栏',function(){
		  expect(el).not.toBe(undefined);
		  var list = el.find('.'+CLS_NAV_LIST);
		  expect(list.length).not.toBe(0);
		});
		it('添加标签',function(){
			var config = {
				id : 'additem',
				actived : true,
				title : '添加标签',
				href : 'http://www.taobao.com',
				xclass:'nav-tab-item'
			};
			tab.addChild(config);
			var item = tab.getItemById(config.id);
			expect(item).not.toBe(null);
			expect(item.get('actived')).toBe(config.actived);

		});

		it('设置标签选中',function(){
			var item = tab.getItemById('testitem');
			tab.setActived('testitem');
			expect(tab.getActivedItem()).toBe(item);
		});

    it('添加标签并同时打开',function(){
      
      var config = {
        id:'add2',
        title : '添加标签',
        closeable : false,
        href : 'http://www.taobao.com'
      };
      var item = tab.addTab(config);
      expect(tab.getActivedItem()).toBe(item);
    });
	});
});

BUI.use('bui/tab',function(Tab){

  var tab = new Tab.Tab({
      render : '#tab',
      elCls : 'button-tabs',
      itemStatusCls : {
        selected : 'active',
        hover:'tab-item-hover'
      },
      autoRender: true,
      children:[
        {text:'标签一',value:'1',selected:true},
        {text:'标签二',value:'2'},
        {text:'标签三',value:'3'}
      ]
    });
  var el = tab.get('el');
  describe('测试标签生成',function(){
    it('初始化',function(){
      expect(el.find('.bui-tab-item').length).toBe(tab.getItemCount());
    });
    it('设置，取消选中',function(){
      tab.setSelected(tab.getItemAt(0));
      expect(tab.getSelected()).not.toBe(undefined);
      tab.setSelected(null);
      expect(tab.getSelected()).toBe(undefined);
    });

    it('添加选项,并设置选中',function(){
      var item = tab.addItem({text:'新标签',value:'1',selected:true})
      expect(tab.getSelected()).toBe(item);
    });

    it('删除选中选项',function(){
      var item = tab.getItemAt(0),
        callBack = jasmine.createSpy();
      tab.setSelected(item);

      tab.on('selectedchange',callBack);
      tab.removeItem(item);
      expect(callBack).toHaveBeenCalled();
      tab.off('selectedchange',callBack);
    });
  });
});

BUI.use(['bui/tab/tabpanel','bui/tab/tabpanelitem'],function(TabPanel){

  var tab = new TabPanel({
      render : '#tp',
      elCls : 'nav-tabs',
      panelContainer : '#tc',
      autoRender: true,
      selectedEvent: 'mouseenter',
      children:[
        {text:'标签一',value:'1'},
        {text:'标签二',value:'2',panelContent :'<p>自定义内容</p>'},
        {text:'标签三',value:'3',loader : {url : 'data/text.php'}}
      ]
    });
  describe('测试标签选中跟面板显示',function(){
    it('测试生成',function(){
      var items = tab.getItems();
      BUI.each(items,function(item){
        var panel = item.get('panel');
        expect(panel).not.toBe(null);
      });
    });
    it('测试初始面板隐藏',function(){
      var items = tab.getItems();
      BUI.each(items,function(item){
        var panel = item.get('panel');
        expect($(panel).css('display')).toBe('none');
      });
    });

    it('选中节点,判断对应的节点显示',function(){
      var item = tab.getItemAt(0),
        panel = item.get('panel');
      tab.setSelected(item);
      expect($(panel).css('display')).not.toBe('none');
    });

    it('选中其他节点,判断对应的节点显示',function(){
      var item = tab.getItemAt(1),
        panel = item.get('panel');
      tab.setSelected(item);
      expect($(panel).css('display')).not.toBe('none');

      var firsItem = tab.getFirstItem(),
        panel = firsItem.get('panel');
      expect($(panel).css('display')).toBe('none');
    });
  });
});/**/