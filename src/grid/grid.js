/**
 * @fileOverview 表格
 * @ignore
 * @author dxq613@gmail.com
 */

define('bui/grid/grid',['bui/common','bui/mask','bui/toolbar','bui/list','bui/grid/header','bui/grid/column'],function (require) {

  var BUI = require('bui/common'),
    Mask = require('bui/mask'),
    UA = BUI.UA,
    Component = BUI.Component,
    toolbar = require('bui/toolbar'),
    List = require('bui/list'),
    Header = require('bui/grid/header'),
    Column = require('bui/grid/column');

  function isPercent(str){
    if(BUI.isString(str)){
      return str.indexOf('%') !== -1;
    }
    return false;
  }

  var PREFIX = BUI.prefix,
    CLS_GRID_HEADER_CONTAINER = PREFIX + 'grid-header-container',
    CLS_GRID_BODY = PREFIX + 'grid-body',
    CLS_GRID_WITH = PREFIX + 'grid-width',
    CLS_GRID_HEIGHT = PREFIX + 'grid-height',
    CLS_GRID_BORDER = PREFIX + 'grid-border',
    CLS_GRID_TBAR = PREFIX + 'grid-tbar',
    CLS_GRID_BBAR = PREFIX + 'grid-bbar',
    CLS_BUTTON_BAR= PREFIX + 'grid-button-bar',
    CLS_GRID_STRIPE = PREFIX + 'grid-strip',
    CLS_GRID_ROW = PREFIX + 'grid-row',
    CLS_ROW_ODD = PREFIX + 'grid-row-odd',
    CLS_ROW_EVEN = PREFIX + 'grid-row-even',
    CLS_ROW_FIRST = PREFIX + 'grid-row-first',
    CLS_GRID_CELL = PREFIX + 'grid-cell',
    CLS_GRID_CELL_INNER = PREFIX + 'grid-cell-inner',
    CLS_TD_PREFIX = 'grid-td-',
    CLS_CELL_TEXT = PREFIX + 'grid-cell-text',
    CLS_CELL_EMPTY = PREFIX + 'grid-cell-empty',
    CLS_SCROLL_WITH = '17',
    CLS_HIDE = PREFIX + 'hidden',
    ATTR_COLUMN_FIELD = 'data-column-field',
    WIDTH_BORDER = 2,
    HEIGHT_BAR_PADDING = 1;  

  function getInnerWidth(width){
    var _self = this;
      if(BUI.isNumber(width)){
        width -= WIDTH_BORDER;
      }
      return width;
  }

  /**
   * @class BUI.Grid.GridView
   * @private
   * @extends BUI.List.SimpleListView
   * 表格的视图层
   */
  var gridView = List.SimpleListView.extend({

    //设置 body和table的标签
    renderUI : function(){
      var _self = this,
        el = _self.get('el'),
        bodyEl = el.find('.' + CLS_GRID_BODY);
      _self.set('bodyEl',bodyEl);
      _self._setTableTpl();
    },
    /**
     * 获取行模板
     * @ignore
     */
    getItemTpl : function  (record,index) {
      var _self = this,
        columns =  _self._getColumns(),
        tbodyEl = _self.get('tbodyEl'),
        rowTpl = _self.get('rowTpl'),
        oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN,
        cellsTpl = [],
        rowEl;

      BUI.each(columns, function (column) {
        var dataIndex = column.get('dataIndex');
        cellsTpl.push(_self._getCellTpl(column, dataIndex, record,index));
      });

      if(_self.get('useEmptyCell') /*&& !_self.get('forceFit')*/){
        cellsTpl.push(_self._getEmptyCellTpl());
      }

      rowTpl = BUI.substitute(rowTpl,{cellsTpl:cellsTpl.join(''), oddCls:oddCls});
      return rowTpl;
    },
    /**
     * find the dom by the record in this component
     * @param {Object} record the record used to find row dom
     * @return jQuery
     */
    findRow:function (record) {
        var _self = this;
        return $(_self.findElement(record));
    },
    /**
     * find the cell dom by record and column id
     * @param {String} id the column id
     * @param {jQuery} rowEl the dom that showed in this component
     * @return  {jQuery}
     */
    findCell : function(id,rowEl){
      var cls = CLS_TD_PREFIX + id;
        return rowEl.find('.' + cls);
    },
    /**
     * 重新创建表格的首行，一般在表格初始化完成后，或者列发生改变时
     */
    resetHeaderRow:function () {
      if(!this.get('useHeaderRow')){
        return;
      }
      var _self = this,
        headerRowEl = _self.get('headerRowEl'),
        tbodyEl = _self.get('tbodyEl');
      if(headerRowEl){
        headerRowEl.remove();
      }
      headerRowEl = _self._createHeaderRow();
      headerRowEl.prependTo(tbodyEl);
      _self.set('headerRowEl', headerRowEl);
    },
    /**
     * when header's column width changed, column in this component changed followed
     * @ignore
     */
    resetColumnsWidth:function (column,width) {
      var _self = this,
        headerRowEl = _self.get('headerRowEl'),
        cell = _self.findCell(column.get('id'), headerRowEl);
      width = width || column.get('width');
      if (cell) {
        cell.width(width);
      }
      _self.setTableWidth();
    },
    //set table width
    setTableWidth:function (columnsWidth) {
      if(!columnsWidth && isPercent(this.get('width'))){
        this.get('tableEl').width('100%');
        return;
      }
      var _self = this,
        width = _self._getInnerWidth(),
        height = _self.get('height'),
        tableEl = _self.get('tableEl'),
        forceFit = _self.get('forceFit'),
        headerRowEl = _self.get('headerRowEl');
      //使用百分比的宽度，不进行计算
      if(!isPercent(columnsWidth)){
        
        columnsWidth = columnsWidth || _self._getColumnsWidth();
        if (!width) {
          return;
        }
        if (width >= columnsWidth) {
          columnsWidth = width;
          if (height) {
            var scrollWidth = (UA.ie == 6 || UA.ie == 7) ? CLS_SCROLL_WITH + 2 : CLS_SCROLL_WITH;
            columnsWidth = width - scrollWidth;
          }
        }
      }
      
      tableEl.width(columnsWidth);
    },
    /**
     * 表格表体的宽度
     * @param {Number} width 宽度
     */
    setBodyWidth : function(width){
      var _self = this,
        bodyEl = _self.get('bodyEl');
      width = width || _self._getInnerWidth();
      bodyEl.width(width);

    },
    /**
     * 设置表体高度
     * @param {Number} height 高度
     */
    setBodyHeight : function(height){
      var _self = this,
        bodyEl = _self.get('bodyEl'),
        bodyHeight = height,
        siblings = bodyEl.siblings();

      BUI.each(siblings,function(item){
        if($(item).css('display') !== 'none'){
          bodyHeight -= $(item).outerHeight();
        }
      });
      bodyEl.height(bodyHeight);
    },
    //show or hide column
    setColumnVisible:function (column) {
      var _self = this,
        hide = !column.get('visible'),
        colId = column.get('id'),
        tbodyEl = _self.get('tbodyEl'),
        cells = $('.' + CLS_TD_PREFIX + colId,tbodyEl);
      if (hide) {
        cells.hide();
      } else {
        cells.show();
      }
    },
    /**
     * 更新数据
     * @param  {Object} record 更新的数据
     */
    updateItem : function(record){
      var _self = this, 
        items = _self.getItems(),
        index = BUI.Array.indexOf(record,items),
        columns = _self._getColumns(),
        element = null,
        tpl;
      if(index >=0 ){
        element = _self.findElement(record);

        BUI.each(columns,function(column){
          var cellEl = _self.findCell(column.get('id'),$(element)),
            innerEl = cellEl.find('.' + CLS_GRID_CELL_INNER),
            textTpl = _self._getCellText(column,record,index);
          innerEl.html(textTpl);
        });
        return element;
      }
    },
    /**
     * 显示没有数据时的提示信息
     */
    showEmptyText : function(){
      var _self = this,
        bodyEl = _self.get('bodyEl'),
        emptyDataTpl = _self.get('emptyDataTpl'),
        emptyEl = _self.get('emptyEl');
      if(emptyEl){
        emptyEl.remove();
      }
      var emptyEl = $(emptyDataTpl).appendTo(bodyEl);
      _self.set('emptyEl',emptyEl);
    },
    /**
     * 清除没有数据时的提示信息
     */
    clearEmptyText : function(){
       var _self = this,
        emptyEl = _self.get('emptyEl');
      if(emptyEl){
        emptyEl.remove();
      }
    },
    //设置第一行空白行，不显示任何数据，仅用于设置列的宽度
    _createHeaderRow:function () {
      var _self = this,
          columns = _self._getColumns(),
          tbodyEl = _self.get('tbodyEl'),
          rowTpl = _self.get('headerRowTpl'),
          rowEl,
          cellsTpl = [];

      $.each(columns, function (index,column) {
        cellsTpl.push(_self._getHeaderCellTpl(column));
      });

      //if this component set width,add a empty column to fit row width
      if(_self.get('useEmptyCell')/* && !_self.get('forceFit')*/){
        cellsTpl.push(_self._getEmptyCellTpl());
      }
      rowTpl = BUI.substitute(rowTpl,{cellsTpl:cellsTpl.join('')});
      rowEl = $(rowTpl).appendTo(tbodyEl);
      return rowEl;
    },
    //get the sum of the columns' width
    _getColumnsWidth:function () {
      var _self = this,
        columns = _self.get('columns'),
        totalWidth = 0;

      BUI.each(columns, function (column) {
          if (column.get('visible')) {
              totalWidth += column.get('el').outerWidth();
          }
      });
      return totalWidth;
    },
    //获取列集合
    _getColumns : function(){
      return this.get('columns');
    },
    //get cell text by record and column
    _getCellText:function (column, record,index) {
        var _self = this,
          dataIndex = column.get('dataIndex'),
          textTpl = column.get('cellTpl') || _self.get('cellTextTpl'),
          text = _self._getCellInnerText(column,dataIndex, record,index);
        return BUI.substitute(textTpl,{text:text, tips:_self._getTips(column, dataIndex, record)});
    },
    _getCellInnerText : function(column,dataIndex, record,index){
      //renderer 时发生错误可能性很高
      try{
        var _self = this,
          renderer = column.get('renderer'),
          text = renderer ? renderer(record[dataIndex], record,index) : record[dataIndex];
        return text == null ? '' : text;
      }catch(ex){
        throw 'column:' + column.get('title') +' fomat error!';
      }
    },
    //get cell template by config and record
    _getCellTpl:function (column, dataIndex, record,index) {
      var _self = this,
        cellText = _self._getCellText(column, record,index),
        cellTpl = _self.get('cellTpl');
      return BUI.substitute(cellTpl,{
        elCls : column.get('elCls'),
        id:column.get('id'),
        dataIndex:dataIndex,
        cellText:cellText,
        hideCls:!column.get('visible') ? CLS_HIDE : ''
      });
    },
    //获取空白单元格的模板
    _getEmptyCellTpl:function () {
      return '<td class="' + CLS_GRID_CELL + ' ' + CLS_CELL_EMPTY + '">&nbsp;</td>';
    },
    //获取空白行单元格模板
    _getHeaderCellTpl:function (column) {
      var _self = this,
        headerCellTpl = _self.get('headerCellTpl');
      return BUI.substitute(headerCellTpl,{
        id:column.get('id'),
        width:column.get('width'),
        hideCls:!column.get('visible') ? CLS_HIDE : ''
      });
    },
    //获取表格内宽度
    _getInnerWidth : function(){
      return getInnerWidth(this.get('width'));
    },
    //get cell tips
    _getTips:function (column, dataIndex, record) {
      var showTip = column.get('showTip'),
          value = '';
      if (showTip) {
        value = record[dataIndex];
        if (BUI.isFunction(showTip)) {
          value = showTip(value, record);
        }
      }
      return value;
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
    //设置表格模板
    _setTableTpl : function(tpl){
      var _self = this,
        bodyEl = _self.get('bodyEl');

      tpl = tpl || _self.get('tableTpl');
      $(tpl).appendTo(bodyEl);
      var tableEl = bodyEl.find('table'),
        tbodyEl = bodyEl.find('tbody');
        //headerRowEl = _self._createHeaderRow();
            
      _self.set('tableEl',tableEl);
      _self.set('tbodyEl',tbodyEl);
      //_self.set('headerRowEl', headerRowEl);
      _self.set('itemContainer',tbodyEl);
      _self._setTableCls(_self.get('tableCls'));
    },
    //设置table上的样式
    _uiSetTableCls : function(v){
      this._setTableCls(v);
    },
    //when set grid's height,the scroll can effect the width of its body and header
    _uiSetHeight:function (h) {
      var _self = this,
        bodyEl = _self.get('bodyEl');
      _self.get('el').height(h);
      _self.get('el').addClass(CLS_GRID_HEIGHT);

    },
    _uiSetWidth:function (w) {
      var _self = this;
      _self.get('el').width(w);
      _self.setBodyWidth(_self._getInnerWidth(w));
      _self.get('el').addClass(CLS_GRID_WITH);
      
    },
    _uiSetStripeRows : function(v){
      var _self = this,
        method = v ? 'addClass' : 'removeClass';
      _self.get('el')[method](CLS_GRID_STRIPE);
    },
    _setTableCls : function(cls){
      var _self = this,
        tableEl = _self.get('tableEl');
      tableEl.attr('class',cls);
    }
  },{
    ATTRS : {
      tableCls : {},
      bodyEl : {},
      tbodyEl : {},
      headerRowEl:{},
      tableEl : {},
      emptyEl : {}
    }
  },{
    xclass : 'grid-view'
  });

  /**
   * @class BUI.Grid.Grid
   *
   * 表格控件,表格控件类图，一般情况下配合{@link BUI.Data.Store} 一起使用
   * <p>
   * <img src="../assets/img/class-grid.jpg"/>
   * </p>
   * <p>表格插件的类图：</p>
   * <p>
   * <img src="../assets/img/class-grid-plugins.jpg"/>
   * </p>
   *
   * <pre><code>
   *  BUI.use(['bui/grid','bui/data'],function(Grid,Data){
   *    var Grid = Grid,
   *      Store = Data.Store,
   *      columns = [{  //声明列模型
   *          title : '表头1(20%)',
   *          dataIndex :'a',
   *          width:'20%'
   *        },{
   *          id: '123',
   *          title : '表头2(30%)',
   *          dataIndex :'b',
   *          width:'30%'
   *        },{
   *          title : '表头3(50%)',
   *          dataIndex : 'c',
   *          width:'50%'
   *      }],
   *      data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}]; //显示的数据
   *
   *    var store = new Store({
   *        data : data,
   *        autoLoad:true
   *      }),
   *       grid = new Grid.Grid({
   *         render:'#grid',
   *         width:'100%',//这个属性一定要设置
   *         columns : columns,
   *         idField : 'a',
   *         store : store
   *       });
   *
   *     grid.render();
   *   });
   * </code></pre>
   * @extends BUI.List.SimpleList
   */
  var grid = List.SimpleList.extend({
    /**
     * @protected
     * @ignore
     */
    createDom:function () {
      var _self = this,
            render = _self.get('render'),
            outerWidth = $(render).width(),
            width = _self.get('width');
            
      if(!width && outerWidth){
        var appendWidth = _self.getAppendWidth();
        _self.set('width',outerWidth - appendWidth);
      }

      // 提前,中途设置宽度时会失败！！
      if (_self.get('width')) {
          _self.get('el').addClass(CLS_GRID_WITH);
      }

      if (_self.get('height')) {
        _self.get('el').addClass(CLS_GRID_HEIGHT);
      }

      //因为内部的边距影响header的forceFit计算，所以必须在header计算forceFit前置此项
      if(_self.get('innerBorder')){
          _self.get('el').addClass(CLS_GRID_BORDER);
      } 
    },
    /**
     * @protected
     * @ignore
     */
    renderUI : function(){
      var _self = this;
      _self._initHeader();
      _self._initBars();
      _self._initLoadMask();
      _self.get('view').resetHeaderRow();
    },
    /**
     * @private
     */
    bindUI:function () {
      var _self = this;
      _self._bindHeaderEvent();
      _self._bindBodyEvent();
      _self._bindItemsEvent();
    },
    /**
     * 添加列
     * <pre><code>
     *   //添加到最后
     *   grid.addColumn({title : 'new column',dataIndex : 'new',width:100});
     *   //添加到最前
     *   grid.addColumn({title : 'new column',dataIndex : 'new',width:100},0);
     * </code></pre>
     * @param {Object|BUI.Grid.Column} column 列的配置，列类的定义 {@link BUI.Grid.Column}
     * @param {Number} index 添加到的位置
     * @return {BUI.Grid.Column}
     */
    addColumn : function(column, index){
      var _self = this,
        header = _self.get('header');

      if(header){
        column = header.addColumn(column, index);
      }else{
        column = new Column(column);
        _self.get('columns').splice(index,0,column);
      }  
      return column;
    },
    /**
     * 清除显示的数据
     * <pre><code>
     *   grid.clearData();
     * </code></pre>       
     */
    clearData : function(){
      this.clearItems();
    },
    /**
     * 当前显示在表格中的数据
     * @return {Array} 纪录集合
     * @private
     */
    getRecords : function(){
      return this.getItems();
    },
    /**
     * 使用索引或者id查找列
     * <pre><code>
     *  //设置列的id,否则会自动生成
     *  {id : '1',title : '表头',dataIndex : 'a'}
     *  //获取列
     *  var column = grid.findColumn('id');
     *  //操作列
     *  column.set('visible',false);
     * </code></pre>
     * @param {String|Number} id|index  文本值代表编号，数字代表索引
     */
    findColumn : function(id){
      var _self = this,
        header = _self.get('header');
      if(BUI.isNumber(id)){
        return header.getColumnByIndex(id);
      }else{
        return header.getColumnById(id);
      }
    },
    /**
     * 使用字段名查找列
     * <pre><code>
     * //设置列dataIndex
     *  {id : '1',title : '表头',dataIndex : 'a'}
     *  //获取列
     *  var column = grid.findColumnByField('a');
     *  //操作列
     *  column.set('visible',false);
     * </code></pre>
     * @param {String} field 列的字段名 dataIndex
     */
    findColumnByField : function(field){
      var _self = this,
        header = _self.get('header');
      return header.getColumn(function(column){
        return column.get('dataIndex') === field;
      });
    },
    /**
     * 根据列的Id查找对应的单元格
     * @param {String|Number} id 列id
     * @param {Object|jQuery} record 本行对应的记录，或者是本行的ＤＯＭ对象
     * @protected
     * @return  {jQuery}
     */
    findCell:function (id, record) {
        var _self = this,
            rowEl = null;
        if (record instanceof $) {
            rowEl = record;
        } else {
            rowEl = _self.findRow(record);
        }
        if (rowEl) {
            return _self.get('view').findCell(id, rowEl);
        }
        return null;
    },
    /**
     * find the dom by the record in this component
     * @param {Object} record the record used to find row dom
     * @protected
     * @return jQuery
     */
    findRow:function (record) {
        var _self = this;
        return _self.get('view').findRow(record);
    },
    /**
     * 移除列
     * <pre><code>
     *   var column = grid.findColumn('id');
     *   grid.removeColumn(column);
     * </code></pre>
     * @param {BUI.Grid.Column} column 要移除的列
     */
    removeColumn:function (column) {
      var _self = this;
        _self.get('header').removeColumn(column);
    },
    /**
     * 显示数据,当不使用store时，可以单独显示数据
     * <pre><code>
     *   var data = [{},{}];
     *   grid.showData(data);
     * </code></pre>
     * @param  {Array} data 显示的数据集合
     */
    showData : function(data){
      var _self = this;
      _self.set('items',data);
    },
    /**
     * 重置列，当列发生改变时同步DOM和数据
     * @protected
     */
    resetColumns:function () {
      var _self = this,
          store = _self.get('store');
      //recreate the header row
      _self.get('view').resetHeaderRow();
      //show data
      if (store) {
          _self.onLoad();
      }
    },
    //when body scrolled,the other component of grid also scrolled
    _bindScrollEvent:function () {
      var _self = this,
        el = _self.get('el'),
        bodyEl = el.find('.' + CLS_GRID_BODY),
        header = _self.get('header');

      bodyEl.on('scroll', function () {
        var left = bodyEl.scrollLeft(),
            top = bodyEl.scrollTop();
        header.scrollTo({left:left, top:top});
        _self.fire('scroll', {scrollLeft:left, scrollTop:top,bodyWidth : bodyEl.width(),bodyHeight : bodyEl.height()});
      });
    },
    //bind header event,when column changed,followed this component
    _bindHeaderEvent:function () {
        var _self = this,
          header = _self.get('header'),
          view = _self.get('view'),
          store = _self.get('store');
        header.on('afterWidthChange', function (e) {
          var sender = e.target;
          if (sender !== header) {
              view.resetColumnsWidth(sender);
          }
        });

        header.on('afterSortStateChange', function (e) {
          var column = e.target,
              val = e.newVal;
          if (val && store) {
            store.sort(column.get('dataIndex'), column.get('sortState'));
          }
        });

        header.on('afterVisibleChange', function (e) {
          var sender = e.target;
          if (sender !== header) {
            view.setColumnVisible(sender);
            _self.fire('columnvisiblechange',{column:sender});
          }
        });

        header.on('click', function (e) {
          var sender = e.target;
          if (sender !== header) {
            _self.fire('columnclick',{column:sender,domTarget:e.domTarget});
          }
        });

        header.on('forceFitWidth', function () {
          if (_self.get('rendered')) {
              _self.resetColumns();
          }
        });

        header.on('add', function (e) {
          if (_self.get('rendered')) {
            _self.fire('columnadd',{column:e.column,index:e.index});
              _self.resetColumns();
          }
        });

        header.on('remove', function (e) {
          if (_self.get('rendered')) {
            _self.resetColumns();
            _self.fire('columnremoved',{column:e.column,index:e.index});
          }
        });

    },
    //when body scrolled, header can followed
    _bindBodyEvent:function () {
      var _self = this;
      _self._bindScrollEvent();       
    },
    //绑定记录DOM相关的事件
    _bindItemsEvent : function(){
      var _self = this,
        store = _self.get('store');

      _self.on('itemsshow',function(){
        _self.fire('aftershow');
      });

      _self.on('itemsclear',function(){
        _self.fire('clear');
      });

      _self.on('itemclick',function(ev){
        var target = ev.domTarget,
          record = ev.item,
          cell = $(target).closest('.' + CLS_GRID_CELL),
          rowEl = $(target).closest('.' + CLS_GRID_ROW),
          rst; //用于是否阻止事件触发

        if(cell.length){
          rst = _self.fire('cellclick', {record:record, row:rowEl[0], cell:cell[0], field:cell.attr(ATTR_COLUMN_FIELD), domTarget:target,domEvent:ev.domEvent});
        }

        if(rst === false){
          return rst;
        }

        return _self.fire('rowclick', {record:record, row:rowEl[0], domTarget:target});
          
      });

      _self.on('itemunselected',function(ev){
        _self.fire('rowunselected',getEventObj(ev));
      });

      _self.on('itemselected',function(ev){
        _self.fire('rowselected',getEventObj(ev));
      });

      _self.on('itemrendered',function(ev){
        _self.fire('rowcreated',getEventObj(ev));
      });
      
      _self.on('itemremoved',function(ev){
        _self.fire('rowremoved',getEventObj(ev));
      });

      _self.on('itemupdated',function(ev){
        _self.fire('rowupdated',getEventObj(ev));
      });

      function getEventObj(ev){
        return {record : ev.item, row : ev.domTarget, domTarget : ev.domTarget};
      }
    },
    //获取表格内部的宽度，受边框的影响，
    //内部的宽度不能等于表格宽度
    _getInnerWidth : function(width){
      width = width || this.get('width');
      return getInnerWidth(width);
    },
    //init header,if there is not a header property in config,instance it
    _initHeader:function () {
      var _self = this,
        header = _self.get('header'),
        container = _self.get('el').find('.'+ CLS_GRID_HEADER_CONTAINER);
      if (!header) {
        header = new Header({
          columns:_self.get('columns'),
          tableCls:_self.get('tableCls'),
          forceFit:_self.get('forceFit'),
          width:_self._getInnerWidth(),
          render: container,
          parent : _self
        }).render();
        //_self.addChild(header);
        _self.set('header', header);
      }
    },
    //初始化 上下工具栏
    _initBars:function () {
      var _self = this,
          bbar = _self.get('bbar'),
          tbar = _self.get('tbar');
      _self._initBar(bbar, CLS_GRID_BBAR, 'bbar');
      _self._initBar(tbar, CLS_GRID_TBAR, 'tbar');
    },
    //set bar's elCls to identify top bar or bottom bar
    _initBar:function (bar, cls, name) {
      var _self = this,
        store = null,
        pagingBarCfg = null;
      if (bar) {
        //未指定xclass,同时不是Controller时
        if(!bar.xclass && !(bar instanceof Component.Controller)){
          bar.xclass = 'bar';
          bar.children = bar.children || [];

          if(bar.items){
            bar.children.push({
                xclass : 'bar',
                defaultChildClass : "bar-item-button",
                elCls : CLS_BUTTON_BAR,
                children : bar.items
            });
            bar.items=null;
          }

          // modify by fuzheng
          if(bar.pagingBar){
            store = _self.get('store');
            pagingBarCfg = {
              xclass : 'pagingbar',
              store : store,
              pageSize : store.pageSize
            };
            if(bar.pagingBar !== true){
              pagingBarCfg = BUI.merge(pagingBarCfg, bar.pagingBar);
            }
            bar.children.push(pagingBarCfg);
          }
        }
        if (bar.xclass) {
          var barContainer = _self.get('el').find('.' + cls);
          barContainer.show();
          bar.render = barContainer;
          //bar.parent=_self;
          bar.elTagName = 'div';
          bar.autoRender = true;
          bar = _self.addChild(bar); //Component.create(bar).create();
        }
        _self.set(name, bar);
      }
      return bar;
    },
    //when set 'loadMask = true' ,create a loadMask instance
    _initLoadMask:function () {
      var _self = this,
        loadMask = _self.get('loadMask');
      if (loadMask && !loadMask.show) {
        loadMask = new BUI.Mask.LoadMask({el:_self.get('el')});
        _self.set('loadMask', loadMask);
      }
    },
    //调整宽度时，调整内部控件宽度
    _uiSetWidth:function (w) {
      var _self = this;
      if (_self.get('rendered')) {
        if(!isPercent(w)){
          _self.get('header').set('width', _self._getInnerWidth(w));
        }else{
          _self.get('header').set('width','100%');
        }
        
      }
      _self.get('view').setTableWidth();
    },
    //设置自适应宽度
    _uiSetForceFit:function (v) {
      var _self = this;
      _self.get('header').set('forceFit', v);
    },
    //when set grid's height,the scroll can effect the width of its body and header
    _uiSetHeight:function (h,obj) {
      var _self = this,
        header = _self.get('header');
      _self.get('view').setBodyHeight(h);
      if (_self.get('rendered')) {
        if (_self.get('forceFit') && !obj.prevVal) {
          header.forceFitColumns();
          //强迫对齐时，由未设置高度改成设置高度，增加了17像素的滚动条宽度，所以重置表格宽度
          _self.get('view').setTableWidth();
        }
        header.setTableWidth();
      }
      
    },
    /**
     * 加载数据
     * @protected
     */
    onLoad : function(){
      var _self = this,
        store = _self.get('store');
      grid.superclass.onLoad.call(this);
      if(_self.get('emptyDataTpl')){ //初始化的时候不显示空白数据的文本
        if(store && store.getCount() == 0){
          _self.get('view').showEmptyText();
        }else{
          _self.get('view').clearEmptyText();
        }
      }
    }
  },{
    ATTRS : {
      /**
       * 表头对象
       * @type {BUI.Grid.Header}
       * @protected
       */
      header:{

      },
      /**
       * @see {BUI.Grid.Grid#tbar}
       * <pre><code>
       * grid = new Grid.Grid({
       *    render:'#grid',
       *    columns : columns,
       *    width : 700,
       *    forceFit : true,
       *    tbar:{ //添加、删除
       *        items : [{
       *          btnCls : 'button button-small',
       *          text : '<i class="icon-plus"></i>添加',
       *          listeners : {
       *            'click' : addFunction
       *          }
       *        },
       *        {
       *          btnCls : 'button button-small',
       *          text : '<i class="icon-remove"></i>删除',
       *          listeners : {
       *            'click' : delFunction
       *          }
       *        }]
       *    },
       *    store : store
       *  });
       *
       * grid.render();
       * </code></pre>
       * @cfg {Object|BUI.Toolbar.Bar} bbar
       */
      /**
       * @see {BUI.Grid.Grid#tbar}
       * @type {Object}
       * @ignore
       */
      bbar:{

      },
      itemCls : {
        value : CLS_GRID_ROW
      },
      /**
       * 列的配置 用来配置 表头 和 表内容。{@link BUI.Grid.Column}
       * @cfg {Array} columns
       */
      columns:{
        view : true,
        value:[]
      },
      /**
       * 强迫列自适应宽度，如果列宽度大于Grid整体宽度，等比例缩减，否则等比例增加
       * <pre><code>
       *  var grid = new Grid.Grid({
       *    render:'#grid',
       *    columns : columns,
       *    width : 700,
       *    forceFit : true, //自适应宽度
       *    store : store
       *  });
       * </code></pre>
       * @cfg {Boolean} [forceFit= false]
       */
      /**
       * 强迫列自适应宽度，如果列宽度大于Grid整体宽度，等比例缩减，否则等比例增加
       * <pre><code>
       *  grid.set('forceFit',true);
       * </code></pre>
       * @type {Boolean}
       * @default 'false'
       */
      forceFit:{
        sync:false,
        view : true,
        value:false
      },
      /**
       * 数据为空时，显示的提示内容
       * <pre><code>
       *  var grid = new Grid({
       *   render:'#J_Grid4',
       *   columns : columns,
       *   store : store,
       *   emptyDataTpl : '&lt;div class="centered"&gt;&lt;img alt="Crying" src="http://img03.taobaocdn.com/tps/i3/T1amCdXhXqXXXXXXXX-60-67.png"&gt;&lt;h2&gt;查询的数据不存在&lt;/h2&gt;&lt;/div&gt;',
       *   width:'100%'
       *
       * });
       * 
       * grid.render();
       * </code></pre>
       ** @cfg {Object} emptyDataTpl
       */
      emptyDataTpl : {
        view : true
      },
      /**
       * 表格首行记录模板，首行记录，隐藏显示，用于确定表格各列的宽度
       * @type {String}
       * @protected
       */
      headerRowTpl:{
        view:true,
        value:'<tr class="' + PREFIX + 'grid-header-row">{cellsTpl}</tr>'
      },
      /**
       * 表格首行记录的单元格模板
       * @protected
       * @type {String}
       */
      headerCellTpl:{
        view:true,
        value:'<td class="{hideCls} ' + CLS_TD_PREFIX + '{id}" width="{width}" style="height:0"></td>'
      },
      /**
       * 表格数据行的模板
       * @type {String}
       * @default  <pre>'&lt;tr class="' + CLS_GRID_ROW + ' {{oddCls}}"&gt;{{cellsTpl}}&lt;/tr&gt;'</pre>
       */
      rowTpl:{
        view:true,
        value:'<tr class="' + CLS_GRID_ROW + ' {oddCls}">{cellsTpl}</tr>'
      },
      /**
       * 单元格的模板
       * @type {String}
       * <pre>
       *     '&lt;td  class="' + CLS_GRID_CELL + ' grid-td-{{id}}" data-column-id="{{id}}" data-column-field = {{dataIndex}}&gt;'+
       *        '&lt;div class="' + CLS_GRID_CELL_INNER + '" &gt;{{cellText}}&lt;/div&gt;'+
       *    '&lt;/td&gt;'
       *</pre>
       */
      cellTpl:{
        view:true,
        value:'<td  class="{elCls} {hideCls} ' + CLS_GRID_CELL + ' ' + CLS_TD_PREFIX + '{id}" data-column-id="{id}" data-column-field = "{dataIndex}" >' +
            '<div class="' + CLS_GRID_CELL_INNER + '" >{cellText}</div>' +
            '</td>'

      },
      /**
       * 单元格文本的模板
       * @default &lt;span class="' + CLS_CELL_TEXT + ' " title = "{{tips}}"&gt;{{text}}&lt;/span&gt;
       * @type {String}
       */
      cellTextTpl:{
        view:true,
        value:'<span class="' + CLS_CELL_TEXT + ' " title = "{tips}">{text}</span>'
      },
      /**
       * 事件集合
       * @type {Object}
       */
      events:{
        value:{
          /**
           * 显示完数据触发
           * @event
           */
          'aftershow' : false,
           /**
           * 表格的数据清理完成后
           * @event
           */
          'clear' : false,
          /**
           * 点击单元格时触发,如果return false,则会阻止 'rowclick' ,'rowselected','rowunselected'事件
           * @event
           * @param {jQuery.Event} e  事件对象
           * @param {Object} e.record 此行的记录
           * @param {String} e.field 点击单元格列对应的字段名称
           * @param {HTMLElement} e.row 点击行对应的DOM
           * @param {HTMLElement} e.cell 点击对应的单元格的DOM
           * @param {HTMLElement} e.domTarget 点击的DOM
           * @param {jQuery.Event} e.domEvent 点击的jQuery事件
           */
          'cellclick' : false,
          /**
           * 点击表头
           * @event 
           * @param {jQuery.Event} e 事件对象
           * @param {BUI.Grid.Column} e.column 列对象
           * @param {HTMLElement} e.domTarget 点击的DOM
           */
          'columnclick' : false,
          /**
           * 点击行时触发，如果return false,则会阻止'rowselected','rowunselected'事件
           * @event
           * @param {jQuery.Event} e  事件对象
           * @param {Object} e.record 此行的记录
           * @param {HTMLElement} e.row 点击行对应的DOM
           * @param {HTMLElement} e.domTarget 点击的DOM
           */
          'rowclick' : false,
          /**
           * 当一行数据显示在表格中后触发
           * @event
           * @param {jQuery.Event} e  事件对象
           * @param {Object} e.record 此行的记录
           * @param {HTMLElement} e.row 行对应的DOM
           * @param {HTMLElement} e.domTarget 此事件中等于行对应的DOM
           */
          'rowcreated' : false,
          /**
           * 移除一行的DOM后触发
           * @event
           * @param {jQuery.Event} e  事件对象
           * @param {Object} e.record 此行的记录
           * @param {HTMLElement} e.row 行对应的DOM
           * @param {HTMLElement} e.domTarget 此事件中等于行对应的DOM
           */
          'rowremoved' : false,
          /**
           * 选中一行时触发
           * @event
           * @param {jQuery.Event} e  事件对象
           * @param {Object} e.record 此行的记录
           * @param {HTMLElement} e.row 行对应的DOM
           * @param {HTMLElement} e.domTarget 此事件中等于行对应的DOM
           */
          'rowselected' : false,
          /**
           * 清除选中一行时触发，只有多选情况下触发
           * @event
           * @param {jQuery.Event} e  事件对象
           * @param {Object} e.record 此行的记录
           * @param {HTMLElement} e.row 行对应的DOM
           * @param {HTMLElement} e.domTarget 此事件中等于行对应的DOM
           */
          'rowunselected' : false,
          /**
           * 表格内部发生滚动时触发
           * @event
           * @param {jQuery.Event} e  事件对象
           * @param {Number} e.scrollLeft 滚动到的横坐标
           * @param {Number} e.scrollTop 滚动到的纵坐标
           * @param {Number} e.bodyWidth 表格内部的宽度
           * @param {Number} e.bodyHeight 表格内部的高度
           */
          'scroll' : false
        }
      },
      /**
       * 是否奇偶行添加分割色
       * @type {Boolean}
       * @default true
       */
      stripeRows:{
        view:true,
        value:true
      },
      /**
       * 顶层的工具栏，跟bbar结构一致,可以是工具栏对象@see {BUI.Toolbar.Bar},也可以是xclass形式的配置项，
       * 还可以是包含以下字段的配置项
       * <ol>
       * <li>items:工具栏的项，
       *    - 默认是按钮(xtype : button)、
       *    - 文本(xtype : text)、
       *    - 链接(xtype : link)、
       *    - 分隔符(bar-item-separator)以及自定义项
       * </li>
       * <li>pagingBar:表明包含分页栏</li>
       * </ol>
       * @type {Object|BUI.Toolbar.Bar}
       * @example
       * tbar:{
       *     items:[
       *         {
       *             text:'命令一' //默认是按钮
       *             
       *         },
       *         {
       *             xtype:'text',
       *             text:'文本'
       *         }
       *     ],
       *     pagingBar:true
       * }
       */
      tbar:{

      },
      /**
       * 可以附加到表格上的样式.
       * @cfg {String} tableCls
       * @default 'bui-grid-table' this css cannot be overridden
       */
      tableCls:{
        view : true,
        sync : false,
        value:PREFIX + 'grid-table'
      },
      /**
       * 表体的模板
       * @protected
       * @type {String}
       */
      tableTpl : {
        view:true,
        value:'<table cellspacing="0" cellpadding="0" >' +
            '<tbody></tbody>' +
            '</table>'
      },
      tpl : {
        value : '<div class="'+CLS_GRID_TBAR+'" style="display:none"></div><div class="'+CLS_GRID_HEADER_CONTAINER+'"></div><div class="'+CLS_GRID_BODY+'"></div><div style="display:none" class="' + CLS_GRID_BBAR + '"></div>'
      },
      /**
       * 单元格左右之间是否出现边框
       * 
       * @cfg {Boolean} [innerBorder=true]
       */
      /**
       * 单元格左右之间是否出现边框
       * <pre><code>
       *   var  grid = new Grid.Grid({
       *     render:'#grid',
       *     innerBorder: false, // 默认为true
       *     columns : columns,
       *     store : store
       *   });
       * </code></pre>
       * @type {Boolean}
       * @default true
       */
      innerBorder : {
        sync:false,
        value : true
      },
      /**
       * 是否使用空白单元格用于占位，使列宽等于设置的宽度
       * @type {Boolean}
       * @private
       */
      useEmptyCell : {
        view : true,
        value : true
      },
      /**
       * 是否首行使用空白行，用以确定表格列的宽度
       * @type {Boolean}
       * @private
       */
      useHeaderRow : {
        view : true,
        value : true
      },
      /**
       * Grid 的视图类型
       * @type {BUI.Grid.GridView}
       */
      xview : {
        value : gridView
      }
    }
  },{
    xclass : 'grid'
  });

  grid.View = gridView;

  return grid;
});

/**
 * @ignore
 * 2013.1.18 
 *   这是一个重构的版本，将Body取消掉了，目的是为了可以将Grid和SimpleGrid联系起来，
 *   同时将selection 统一         
 */