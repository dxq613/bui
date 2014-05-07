
seajs.use(['bui/common','bui/data','bui/list','bui/picker',
  'bui/menu','bui/toolbar','bui/progressbar','bui/cookie',
  'bui/form','bui/mask','bui/select','bui/tab',
  'bui/calendar','bui/overlay','bui/grid'
],function () {
  function isExist(arr){
    for(var i = 0 ; i < arr.length; i++){
      expect(arr[i]).not.toBe(undefined);
    }
  }
  describe('测试模块是否全部加载',function(){
    it('测试Common 加载',function(){
      var arr = [
        BUI.UA,
        BUI.JSON,
        BUI.Array,
        BUI.Base,
        BUI.Date,
        BUI.KeyCode,
        BUI.Observable,
        BUI.Component,
        BUI.Component.UIBase
        ];
      isExist(arr);
    });

    it('测试cookie 加载',function(){
      var arr = [
        BUI.Cookie
      ];
      isExist(arr);
    });

    it('测试Calendar 加载',function(){
      var arr = [
        BUI.Calendar,
        BUI.Calendar.Calendar,
        BUI.Calendar.DatePicker,
        BUI.Calendar.MonthPicker
      ];
      isExist(arr);
    });


    it('测试Data 加载',function(){
      var arr = [
        BUI.Data,
        BUI.Data.Proxy,
        BUI.Data.Proxy.Memery,
        BUI.Data.Proxy.Ajax,
        BUI.Data.Store,
        BUI.Data.Sortable,
        BUI.Data.Node,
        BUI.Data.TreeStore
      ];
      isExist(arr);
    });

    it('测试Form 加载',function(){
      var arr = [
        BUI.Form,
        BUI.Form.Form,
        BUI.Form.Group,
        BUI.Form.Group.Range,
        BUI.Form.Group.Check,
        BUI.Form.Field,
        BUI.Form.Field.Text,
        BUI.Form.Field.Number,
        BUI.Form.Field.Date,
        BUI.Form.Field.Check,
        BUI.Form.Field.Plain,
        BUI.Form.Tips,
        BUI.Form.TipItem
      ];
      isExist(arr);
    });

    it('测试Grid 加载',function(){
      var arr = [
        BUI.Grid,
        BUI.Grid.Grid,
        BUI.Grid.SimpleGrid,
        BUI.Grid.Format,
        BUI.Grid.Column,
        BUI.Grid.Plugins,
        BUI.Grid.Plugins.GridMenu,
        BUI.Grid.Plugins.Cascade,
        BUI.Grid.Plugins.CheckSelection,
        BUI.Grid.Plugins.RadioSelection,
        BUI.Grid.Plugins.Summary,
        BUI.Grid.Plugins.CellEditing,
        BUI.Grid.Plugins.RowEditing,
        BUI.Grid.Plugins.DialogEditing,
        BUI.Grid.Plugins.ColumnGroup,
        BUI.Grid.Plugins.RowGroup,
        BUI.Grid.Plugins.ColumnResize
      ];
      isExist(arr);
    });
    it('测试picker',function(){
      var Picker = BUI.Picker;
      var arr = [
        Picker,
        Picker.Picker,
        Picker.ListPicker
      ];
      isExist(arr);
    });

    it('测试List 加载',function(){
      var List = BUI.List;
      var arr = [
        List,
        List.List,
        List.ListItem,
        List.SimpleList,
        List.Listbox
      ];
      isExist(arr);
    });

    it('测试Mask 加载',function(){
      var arr = [
        BUI.Mask,
        BUI.Mask.LoadMask
      ];
      isExist(arr);
    });

    it('测试Progressbar 加载',function(){
      var arr = [
        BUI.ProgressBar,
        BUI.ProgressBar.Base,
        BUI.ProgressBar.Load
      ];
      isExist(arr);
    });

    it('测试Menu 加载',function(){
      var Menu = BUI.Menu;
      var arr = [
        Menu,
        Menu.Menu,
        Menu.MenuItem,
        Menu.ContextMenu,
        Menu.ContextMenuItem,
        Menu.PopMenu,
        Menu.SideMenu
      ];
      isExist(arr);
    });

    it('测试Overlay 加载',function(){
      var Overlay = BUI.Overlay;

      var arr = [
        Overlay,
        Overlay.Overlay,
        Overlay.Dialog
      ];
      isExist(arr);
    });

    it('测试Select 加载',function(){
      var Select = BUI.Select;

      var arr = [
        Select,
        Select.Select,
        Select.Combox,
        Select.Suggest
      ];
      isExist(arr);
    });

    it('测试Tab 加载',function(){
      var Tab = BUI.Tab;

      var arr = [
        Tab,
        Tab.Tab,
        Tab.TabItem,
        Tab.TabPanel,
        Tab.TabPanelItem,
        Tab.NavTab,
        Tab.NavTabItem
      ];
      isExist(arr);
    });

    it('测试Toolbar 加载',function(){
      var Toolbar = BUI.Toolbar;

      var arr = [
        Toolbar,
        Toolbar.Bar,
        Toolbar.BarItem,
        Toolbar.PagingBar,
        Toolbar.NumberPagingBar
      ];
      isExist(arr);
    });
  });

});