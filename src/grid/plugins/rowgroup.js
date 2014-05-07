define('bui/grid/plugins/rowgroup',['bui/common'],function(require){

  var BUI = require('bui/common'),
    DATA_GROUP = 'data-group',
    PREFIX = BUI.prefix,
    CLS_GROUP = PREFIX + 'grid-row-group',
    CLS_TRIGGER = PREFIX + 'grid-cascade',
    CLS_EXPAND = PREFIX + 'grid-cascade-expand';

  //新的分组
  function newGroup (value,text) {
    return {items : [],value : value,text : text};
  }

  /**
   * 表头列分组功能，仅处理数据展示，排序，不处理这个过程中的增删改，添加删除列
   * @class BUI.Grid.Plugins.RowGroup
   * @extends BUI.Base
   */
  var Group = function (cfg) {
    Group.superclass.constructor.call(this,cfg);
  };

  Group.ATTRS = {
   
    groups : {
      shared : false,
      value : []
    },
    /**
     * 渲染分组内容，函数原型 function(text,group){}
     *
     *  - text 是分组字段格式化后的文本
     *  - group 是当前分组，包括,text(文本）,value（值）,items（分组包含的项）
     * @type {Function}
     */
    renderer : {

    }
  };

  BUI.extend(Group,BUI.Base);

  BUI.augment(Group,{

    renderUI : function (grid) {
      var _self = this,
        tbodyEl = grid.get('el').find('tbody');
      _self.set('grid',grid);
      _self.set('tbodyEl',tbodyEl);

    },
    bindUI : function (grid) {
      var _self = this,
         groups = [];

      //显示完成记录时
      grid.on('aftershow',function () {
        var items = grid.getItems(),
          column = _self._getSortColumn();
        _self._clear();
        if(column){
          grid.get('view').getAllElements().hide();
          var field = column.get('dataIndex');
          BUI.each(items,function (item,index) {
            var last = groups[groups.length - 1],
              renderer = column.get('renderer'),
              value = item[field],
              text;
            if(!last || value != last.value){
              text = renderer ? renderer(value,item) : value;
              var current = newGroup(value,text);
              current.begin = index;
              groups.push(current);
              last && _self._createGroup(last);
              last = current;
            }
            
            last.items.push(item);
            
            
          });
          var last = groups[groups.length - 1];
          last && _self._createGroup(last);
          _self.set('groups',groups);
        }
        
      });

      //清除所有记录时
      grid.on('clear',function () {
        _self._clear();
      });

      _self.get('tbodyEl').delegate('.' + CLS_TRIGGER,'click',function (ev) {
        var sender = $(ev.currentTarget),
          group = _self._getGroupData(sender);
        if(sender.hasClass(CLS_EXPAND)){
          _self._collapse(group);
          sender.removeClass(CLS_EXPAND);
        }else{
          _self._expand(group);
          sender.addClass(CLS_EXPAND);
        }

      });
    },
    //获取排序的字段对应的列
    _getSortColumn: function(){
      var _self = this,
        grid = _self.get('grid'),
        store = grid.get('store'),
        field = store.get('sortField');

      return grid.findColumnByField(field);
    },
    //获取分组的数据
    _getGroupData : function (el) {
      var _self = this,
        groupEl = el.closest('.' + CLS_GROUP);
      return groupEl.data(DATA_GROUP);
    },
    _createGroup : function (group) {
      var _self = this,
        grid = _self.get('grid'),
        item = group.items[0],
        firstEl = grid.findElement(item),
        count = grid.get('columns').length,
        renderer = _self.get('renderer'),
        text = renderer ? renderer(group.text,group) : group.text,
        tpl = '<tr class="'+CLS_GROUP+'"><td colspan="' + count + '"><div class="bui-grid-cell-inner"><span class="bui-grid-cell-text"><span class="bui-grid-cascade"><i class="bui-grid-cascade-icon"></i></span> ' + text + '</span></div></td></tr>',
        node = $(tpl).insertBefore(firstEl);
      node.data(DATA_GROUP,group);
    },
    _getGroupedElements : function(group){
      var _self = this,
        grid = _self.get('grid'),
        elements = grid.get('view').getAllElements(),
        begin = group.begin,
        end = group.items.length + begin,
        rst = [];
      for(var i = begin; i < end; i++){
        rst.push(elements[i]);
      }
      return $(rst);
    },
    _expand : function (group) {
      var _self = this,
        subEls = _self._getGroupedElements(group);
      subEls.show();
    },
    _collapse : function (group) {
       var _self = this,
        subEls = _self._getGroupedElements(group);
      subEls.hide();
    },
    _clear : function () {
      var _self = this,
        groups = _self.get('groups'),
        tbodyEl = _self.get('tbodyEl');

      BUI.Array.empty(groups);
      tbodyEl.find('.' + CLS_GROUP).remove();

    }
  });

  return Group;

});