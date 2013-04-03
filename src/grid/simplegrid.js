/**
 * @fileOverview 简单表格,仅用于展示数据
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/grid/simplegrid',function(require) {
  
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Component = BUI.Component,
    UIBase = Component.UIBase,
    PREFIX = BUI.prefix,
    CLS_GRID = PREFIX + 'grid',
    CLS_GRID_ROW = CLS_GRID + '-row',
    CLS_ROW_ODD = PREFIX + 'grid-row-odd',
    CLS_ROW_EVEN = PREFIX + 'grid-row-even',
    CLS_GRID_BORDER = PREFIX + 'grid-border',
    CLS_ROW_FIRST = PREFIX + 'grid-row-first';


  /**
   * 简单表格的视图类
   * @class BUI.Grid.SimpleGridView
   * @extends BUI.List.SimpleListView
   * @private
   */
  var simpleGridView = List.SimpleListView.extend({
    /**
     * 设置列
     * @internal 
     * @param {Array} columns 列集合
     */
    setColumns : function(columns){
      var _self = this,
        headerRowEl = _self.get('headerRowEl');

      columns = columns || _self.get('columns');
      //清空表头
      headerRowEl.empty();

      BUI.each(columns,function(column){
        _self._createColumn(column,headerRowEl);
      });
    },
    //创建列
    _createColumn : function(column,parent){
      var _self = this,
        columnTpl = BUI.substitute(_self.get('columnTpl'),column);
      $(columnTpl).appendTo(parent);
    },
    /**
     * 获取行模板
     * @ignore
     */
    getItemTpl : function  (record,index) {
      var _self = this,
          columns = _self.get('columns'),
          rowTpl = _self.get('rowTpl'),
          oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN,
          cellsTpl = [],
          rowEl;

      BUI.each(columns, function (column) {
          var dataIndex = column['dataIndex'];
          cellsTpl.push(_self._getCellTpl(column, dataIndex, record));
      });

      rowTpl = BUI.substitute(rowTpl,{cellsTpl:cellsTpl.join(''), oddCls:oddCls});
      return rowTpl;
    },
    //get cell template by config and record
    _getCellTpl:function (column, dataIndex, record) {
        var _self = this,
            renderer = column.renderer,
            text = renderer ? renderer(record[dataIndex], record) : record[dataIndex],
            cellTpl = _self.get('cellTpl');
        return BUI.substitute(cellTpl,{elCls : column.elCls,text:text});    
    },
    /**
     * 清除数据
     * @ignore
     */
    clearData : function(){
      var _self = this,
        tbodyEl = _self.get('itemContainer');
       tbodyEl.empty();
    },
    showData : function(data){

      var _self = this;
      BUI.each(data,function(record,index){
        _self._createRow(record,index);
      });
    },
    //设置单元格边框
    _uiSetInnerBorder : function(v){
        var _self = this,
            el = _self.get('el');
        if(v){
            el.addClass(CLS_GRID_BORDER);
        }else{
            el.removeClass(CLS_GRID_BORDER);
        }
    },
    _uiSetTableCls : function(v){
      var _self = this,
        tableEl = _self.get('el').find('table');
      tableEl.attr('class',v);
    }
  },{
    ATTRS : {
      /**
       * @private
       * @ignore
       */
      headerRowEl : {
        valueFn :function(){
          var _self = this,
            thead = _self.get('el').find('thead');
          return thead.children('tr');
        }
      },
      /**
       * @private 
       * @ignore
       * @type {Object}
       */
      itemContainer :{
        valueFn :function(){
          return this.get('el').find('tbody');
        }
      },
      tableCls : {

      }
    }
  },{
    xclass:'simple-grid-veiw'
  });

  /**
   * 简单表格
   * xclass:'simple-grid'
   * @class BUI.Grid.SimpleGrid
   * @extends BUI.List.SimpleList
   */
  var simpleGrid = BUI.List.SimpleList.extend(
  /**
   * @lends BUI.Grid.SimpleGrid.prototype
   * @ignore
   */
  {
    renderUI : function(){
      this.get('view').setColumns();
    },
    /**
     * 绑定事件
     * @protected
     */
    bindUI : function(){
      var _self = this,
        itemCls = _self.get('itemCls'),
        hoverCls = itemCls + '-hover',
        el = _self.get('el');

      el.delegate('.'+itemCls,'mouseover',function(ev){
        var sender = $(ev.currentTarget);
        sender.addClass(hoverCls);
      }).delegate('.'+itemCls,'mouseout',function(ev){
        var sender = $(ev.currentTarget);
        sender.removeClass(hoverCls);
      });
    },
    /**
     * 显示数据
     * @param  {Array} data 要显示的数据
     */
    showData : function(data){
      this.clearData();
      //this.get('view').showData(data);
      this.set('items',data);
    },
    /**
     * 清除数据
     */
    clearData : function(){
      this.get('view').clearData();
    },
    _uiSetColumns : function(columns){
      var _self = this;

      //重置列，先清空数据
      _self.clearData();
      _self.get('view').setColumns(columns);
    }
  },{
    ATTRS : 
    /**
     * @lends BUI.Grid.SimpleGrid#
     * @ignore
     */
    {
      /**
       * 表格可点击项的样式
       * @protected
       * @type {String}
       */
      itemCls : {
        view:true,
        value : CLS_GRID_ROW
      },
      /**
       * 表格应用的样式，更改此值，则不应用默认表格样式
       * @type {Object}
       */
      tableCls : {
        view : true,
        value : CLS_GRID + '-table'
      },
      /**
       * 列信息
       * @cfg {Array} columns
       */
      /**
       * 列信息，仅支持以下配置项：
       * <ol>
       *   <li>title：标题</li>
       *   <li>elCls: 应用到本列的样式</li>
       *   <li>width：宽度，数字或者百分比</li>
       *   <li>dataIndex: 字段名</li>
       *   <li>renderer: 渲染函数</li>
       * </ol>
       * 具体字段的解释清参看 ： {@link BUI.Grid.Column}
       * @type {Array}
       */
      columns : {
        view : true,
        sync:false,
        value : []
      },
      /**
       * 模板
       * @protected
       */
      tpl:{
        view : true,
        value:'<table cellspacing="0" class="{tableCls}" cellpadding="0"><thead><tr></tr></thead><tbody></tbody></table>'
      },
      /**
       * 单元格左右之间是否出现边框
       * @cfg {Boolean} [innerBorder=true]
       */
      /**
       * 单元格左右之间是否出现边框
       * @type {Boolean}
       * @default true
       */
      innerBorder : {
          view:true,
          value : true
      },
      /**
       * 行模版
       * @type {Object}
       */
      rowTpl:{
        view : true,
        value:'<tr class="' + CLS_GRID_ROW + ' {oddCls}">{cellsTpl}</tr>'
      },
      /**
       * 单元格的模版
       * @type {String}
       */
      cellTpl:{
        view:true,
        value:'<td class="' + CLS_GRID + '-cell {elCls}"><div class="' + CLS_GRID + '-cell-inner"><span class="' + CLS_GRID + '-cell-text">{text}</span></div></td>'
      },
      /**
       * 列的配置模版
       * @type {String}
       */
      columnTpl : {
        view:true,
        value : '<th class="' + CLS_GRID + '-hd {elCls}" width="{width}"><div class="' + CLS_GRID + '-hd-inner"><span class="' + CLS_GRID + '-hd-title">{title}</span></div></th>'
      },
      /**
       * @private
       */
      events :{ 

          value : {

              /**
               * 点击行时
               * @name  BUI.Grid.SimpleGrid#rowclick
               * @event
               * @param {jQuery.Event} e  事件对象
               * @param {Object} e.record 点击的行对应的纪录
               * @param {HTMLElement} e.row 行的DOM
               * @param {HTMLElement} e.domTarget 点击的dom对象
               * @param {HTMLElement} e.domEvent 点击的原生事件
               */
              'rowclick' : false
          }
      },
      xview : {
        value : simpleGridView
      }
    }
  },{
    xclass:'simple-grid'
  });
  
  simpleGrid.View = simpleGridView;
  return  simpleGrid;
});