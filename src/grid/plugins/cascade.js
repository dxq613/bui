/**
 * @fileOverview 级联表格
 * @ignore
 */

define('bui/grid/plugins/cascade',['bui/common'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_GRID_CASCADE = '',
    DATA_RECORD = 'data-record',
    CLS_CASCADE = PREFIX + 'grid-cascade',
    CLS_CASCADE_EXPAND = CLS_CASCADE + '-expand',
    CLS_CASCADE_ROW = CLS_CASCADE + '-row',
    CLS_CASCADE_CELL = CLS_CASCADE + '-cell',
    CLS_CASCADE_ROW_COLLAPSE = CLS_CASCADE + '-collapse';

  /**
   * 级联表格
   * <pre><code>
   *  // 实例化 Grid.Plugins.Cascade 插件
   *    var cascade = new Grid.Plugins.Cascade({
   *      renderer : function(record){
   *        return '<div style="padding: 10px 20px;"><h2>详情信息</h2><p>' + record.detail + '</p></div>';
   *      }
   *    });
   *    var store = new Store({
   *        data : data,
   *        autoLoad:true
   *      }),
   *      grid = new Grid.Grid({
   *        render:'#grid',
   *        columns : columns,
   *        store: store,
   *        plugins: [cascade]  // Grid.Plugins.Cascade 插件
   *      });
   *
   *    grid.render();
   *    
   *    cascade.expandAll();//展开所有
   * </code></pre>
   * @class BUI.Grid.Plugins.Cascade
   * @extends BUI.Base
   */
  var cascade = function(config){
    cascade.superclass.constructor.call(this, config);
  };

  BUI.extend(cascade,BUI.Base);

  cascade.ATTRS = 
  {
    /**
     * 显示展开按钮列的宽度
     * @cfg {Number} width
     */
    /**
     * 显示展开按钮列的宽度
     * @type {Number}
     * @default 40
     */
    width:{
      value:40
    },
    /**
     * 展开列的默认内容
     * @type {String}
     * @protected
     */
    cellInner:{
      value:'<span class="' + CLS_CASCADE + '"><i class="' + CLS_CASCADE + '-icon"></i></span>'
    },
    /**
     * 展开行的模版
     * @protected
     * @type {String}
     */
    rowTpl : {
      value:'<tr class="' + CLS_CASCADE_ROW + '"><td class="'+ CLS_CASCADE_CELL + '"></td></tr>'
    },
    /**
     * 生成级联列时需要渲染的内容
     * @cfg {Function} renderer
     */
    /**
     * 生成级联列时需要渲染的内容
     * @type {Function}
     */
    renderer:{

    },
    events : [
      /**
       * 展开级联内容时触发
       * @name  BUI.Grid.Plugins.Cascade#expand
       * @event
       * @param {jQuery.Event} e  事件对象
       * @param {Object} e.record 级联内容对应的纪录
       * @param {HTMLElement} e.row 级联的行DOM
       */
      'expand',
      /**
       * 折叠级联内容时触发
       * @name  BUI.Grid.Plugins.Cascade#collapse
       * @event
       * @param {jQuery.Event} e  事件对象
       * @param {Object} e.record 级联内容对应的纪录
       * @param {HTMLElement} e.row 级联的行DOM
       */
      'collapse',
      /**
       * 删除级联内容时触发
       * @name  BUI.Grid.Plugins.Cascade#removed
       * @event
       * @param {jQuery.Event} e  事件对象
       * @param {Object} e.record 级联内容对应的纪录
       * @param {HTMLElement} e.row 级联的行DOM
       */
      'removed'
    ]
  };

  BUI.augment(cascade,
  {
    /**
     * 初始化
     * @protected
     */
    initializer:function(grid){
      var _self = this;
      var cfg = {
            title : '',
            elCls:'center',//居中对齐
            width : _self.get('width'),
            resizable:false,
            fixed : true,
            sortable : false,
            cellTpl : _self.get('cellInner')
        },
        expandColumn = grid.addColumn(cfg,0);
      //列之间的线去掉
      grid.set('innerBorder',false);

      _self.set('grid',grid);
    },
    /**
     * 绑定事件
     * @protected
     */
    bindUI:function(grid){
      var _self = this;
      grid.on('cellclick',function(ev){
        var sender = $(ev.domTarget),
          cascadeEl = sender.closest('.' + CLS_CASCADE);
        //如果点击展开、折叠按钮
        if(cascadeEl.length){
          if(!cascadeEl.hasClass(CLS_CASCADE_EXPAND)){
            _self._onExpand(ev.record,ev.row,cascadeEl);
          }else{
            _self._onCollapse(ev.record,ev.row,cascadeEl);
          }
        }
      });

      grid.on('columnvisiblechange',function(){
        _self._resetColspan();
      });

      grid.on('rowremoved',function(ev){
        _self.remove(ev.record);
      });

      grid.on('clear',function(){
        _self.removeAll();
      });
    },
    /**
     * 展开所有级联数据
     * <pre><code>
     *   cascade.expandAll();
     * </code></pre>
     */
    expandAll : function(){
      var _self = this,
        grid = _self.get('grid'),
        records = grid.getRecords();
        $.each(records,function(index,record){
          _self.expand(record);
        });
    },
    /**
     * 展开某条纪录
     * <pre><code>
     *   var record = grid.getItem('a');
     *   cascade.expand(record);
     * </code></pre>
     * @param  {Object} record 纪录
     */
    expand : function(record){
      var _self = this,
        grid = _self.get('grid');

      var row = grid.findRow(record);
      if(row){
        _self._onExpand(record,row);
      }
    },
    /**
     * 折叠某条纪录
     * <pre><code>
     *   var record = grid.getItem('a');
     *   cascade.collapse(record);
     * </code></pre>
     * @param  {Object} record 纪录
     */
    collapse : function(record){
      var _self = this,
        grid = _self.get('grid');

      var row = grid.findRow(record);
      if(row){
        _self._onCollapse(record,row);
      }
    },
    /**
     * 移除所有级联数据的ＤＯＭ
     * @protected
     */
    removeAll : function(){
      var _self = this,
        rows = _self._getAllCascadeRows();

      rows.each(function(index,row){
      
        _self._removeCascadeRow(row);
      });
    },
    /**
     * 根据纪录删除级联信息
     * @protected
     * @param  {Object} record 级联信息对应的纪录
     */
    remove : function(record){
      var _self = this,
        cascadeRow = _self._findCascadeRow(record);
      if(cascadeRow){
        _self._removeCascadeRow(cascadeRow);
      }

    },
    /**
     * 折叠所有级联数据
     * <pre><code>
     *  cascade.collapseAll();
     * </code></pre>
     */
    collapseAll : function(){
      var _self = this,
        grid = _self.get('grid'),
        records = grid.getRecords();
        $.each(records,function(index,record){
          _self.collapse(record);
        });
    },
    //获取级联数据
    _getRowRecord : function(cascadeRow){
      return $(cascadeRow).data(DATA_RECORD);
    },
    //移除级联行
    _removeCascadeRow : function(row){

      this.fire('removed',{record: $(row).data(DATA_RECORD),row : row});
      $(row).remove();
    },
    //通过纪录查找
    _findCascadeRow: function(record){
      var _self = this,
        rows = _self._getAllCascadeRows(),
        result = null;

      $.each(rows,function(index,row){
        if(_self._getRowRecord(row) === record){
          result = row;
          return false;
        }
      });
      return result;
    },
    _getAllCascadeRows : function(){
      var _self = this,
        grid = _self.get('grid');
      return grid.get('el').find('.' + CLS_CASCADE_ROW);
    },
    //获取生成的级联行
    _getCascadeRow : function(gridRow){
      var nextRow = $(gridRow).next();
      if((nextRow).hasClass(CLS_CASCADE_ROW)){
        return nextRow;
      }
      return null;
      //return $(gridRow).next('.' + CLS_CASCADE_ROW);
    },
    //获取级联内容
    _getRowContent : function(record){
      var _self = this,
        renderer = _self.get('renderer'),
        content = renderer ? renderer(record) : '';
      return content;
    },
    //创建级联行
    _createCascadeRow : function(record,gridRow){
      var _self = this,
        rowTpl = _self.get('rowTpl'),
        content = _self._getRowContent(record),
        rowEl = $(rowTpl).insertAfter(gridRow);

      rowEl.find('.' + CLS_CASCADE_CELL).append($(content));
      rowEl.data(DATA_RECORD,record);
      return rowEl;
    },
    //展开
    _onExpand : function(record,row,cascadeEl){
      var _self = this,
        cascadeRow = _self._getCascadeRow(row),
        colspan = _self._getColumnCount(row);

      cascadeEl = cascadeEl || $(row).find('.'+CLS_CASCADE);
      cascadeEl.addClass(CLS_CASCADE_EXPAND);

      if(!cascadeRow || !cascadeRow.length){
        cascadeRow = _self._createCascadeRow(record,row);
      }
      $(cascadeRow).removeClass(CLS_CASCADE_ROW_COLLAPSE);

      _self._setColSpan(cascadeRow,row);
      
      _self.fire('expand',{record : record,row : cascadeRow[0]});
    },
    //折叠
    _onCollapse : function(record,row,cascadeEl){

      var _self = this,
        cascadeRow = _self._getCascadeRow(row);
      cascadeEl = cascadeEl || $(row).find('.'+CLS_CASCADE);
      cascadeEl.removeClass(CLS_CASCADE_EXPAND);

      if(cascadeRow || !cascadeRow.length){
        $(cascadeRow).addClass(CLS_CASCADE_ROW_COLLAPSE);
        _self.fire('collapse',{record : record,row : cascadeRow[0]});
      }
      
    },
    //获取显示的列数
    _getColumnCount : function(row){
      return $(row).children().filter(function(){
        return $(this).css('display') !== 'none';
      }).length;
    },
    //设置colspan
    _setColSpan : function(cascadeRow,gridRow){
      gridRow = gridRow || $(cascadeRow).prev();
      var _self = this,
        colspan = _self._getColumnCount(gridRow);

      $(cascadeRow).find('.' + CLS_CASCADE_CELL).attr('colspan',colspan)
    },
    //重置所有的colspan
    _resetColspan : function(){
      var _self = this,
        cascadeRows =  _self._getAllCascadeRows();
      $.each(cascadeRows,function(index,cascadeRow){
        _self._setColSpan(cascadeRow);
      });
    },
    /**
     * 析构函数
     */
    destructor : function(){
      var _self = this;
      _self.removeAll();
      _self.off();
      _self.clearAttrVals();
    }
  });

  return cascade;
});