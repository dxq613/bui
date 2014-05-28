/**
 * @fileOverview 表格数据汇总
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/grid/plugins/summary',['bui/common'],function (require) {

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_GRID_ROW = PREFIX + 'grid-row',
    CLS_GRID_BODY = PREFIX + 'grid-body',
    CLS_SUMMARY_ROW = PREFIX + 'grid-summary-row',
    CLS_GRID_CELL_INNER = PREFIX + 'grid-cell-inner',
    CLS_COLUMN_PREFIX = 'grid-td-',
    CLS_GRID_CELL_TEXT = PREFIX + 'grid-cell-text',
    CLS_GRID_CELL = PREFIX + 'grid-cell';

  /**
  * @private
  * @ignore
  */
  function getEmptyCellTemplate(colspan){
    if(colspan > 0) {
      return '<td class="' + CLS_GRID_CELL + '" colspan="' + colspan + '">&nbsp;</td>';
    } 
    return '';
  }

  /**
   * @private
   * @ignore
   */
  function getCellTemplate(text,id){
    return '<td class="' + CLS_GRID_CELL + ' '+ CLS_COLUMN_PREFIX + id + '">' +
      getInnerTemplate(text) +
    '</td>';
  }

  /**
   * @private
   * @ignore
   */
  function getInnerTemplate(text){
    return '<div class="' + CLS_GRID_CELL_INNER + '" >' + 
      '<span class="'+CLS_GRID_CELL_TEXT+' ">' + text + '</span>' + 
      '</div>' ;
  }

  /**
   * @private
   * @ignore
   */
  function getLastEmptyCell(){
    return '<td class="' + CLS_GRID_CELL + ' ' + CLS_GRID_CELL + '-empty">&nbsp;</td>';
  }


  /**
   * 表格菜单插件 
   * <pre><code>
   * var store = new Store({
   *      url : 'data/summary.json',
   *      pageSize : 10,
   *      autoLoad:true
   *    }),
   *    grid = new Grid.Grid({
   *      render:'#grid',
   *      columns : columns,
   *      store: store,
   *      bbar : {pagingBar : true},
   *      plugins : [Grid.Plugins.Summary] // 插件形式引入单选表格
   *    });
   *
   *  grid.render();
   * </code></pre>
   * @class BUI.Grid.Plugins.Summary
   */
  var summary = function (config) {
    summary.superclass.constructor.call(this,config);
  };

  summary.ATTRS = 
  {

    footerTpl : {
      value : '<tfoot></tfoot>'
    },
    footerEl : {

    },
    /**
     * 总汇总行的标题
     * @type {String}
     * @default '总汇总'
     */
    summaryTitle : {
      value : '查询合计'
    },
    /**
     * 本页汇总的标题
     * @type {String}
     */
    pageSummaryTitle : {
      value : '本页合计'
    },
    /**
     * 在列对象中配置的字段
     * @type {String}
     * @default 'summary'
     */
    field : {
      value : 'summary'
    },
    /**
     * 本页汇总值的记录
     * @type {String}
     */
    pageSummaryField: {
      value : 'pageSummary'
    },
    /**
     * 总汇总值的记录
     * @type {String}
     */
    summaryField : {
      value : 'summary'
    },
    /**
     * @private
     * 本页汇总值
     * @type {Object}
     */
    pageSummary : {

    },
    /**
     * @private
     * 总汇总
     * @type {Object}
     */
    summary : {

    }
  };

  BUI.extend(summary,BUI.Base);

  BUI.augment(summary,{
    //初始化
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);
    },
    //添加DOM结构
    renderUI : function(grid){
      var _self = this,
        bodyEl = grid.get('el').find('.' + CLS_GRID_BODY),
        bodyTable = bodyEl.find('table'),
        footerEl = $(_self.get('footerTpl')).appendTo(bodyTable);
      _self.set('footerEl',footerEl);
    },
    //绑定事件
    bindUI : function(grid){
      //绑定获取数据
      var _self = this,
        store = grid.get('store');
      if(store){
        store.on('beforeprocessload',function(ev){
          _self._processSummary(ev.data);
        });
        store.on('add',function(){
          _self.resetPageSummary();
        });
        store.on('remove',function(){
          _self.resetPageSummary();
        });
        store.on('update',function(){
          _self.resetPageSummary();
        });
      }
      grid.on('aftershow',function(){
        _self.resetSummary();
      });

      grid.get('header').on('afterVisibleChange',function(){
        _self.resetSummary();
      });
    },
    //处理汇总数据
    _processSummary : function(data){
      var _self = this,
        footerEl = _self.get('footerEl');

      footerEl.empty();
      if(!data){
        return;
      }

      var pageSummary = data[_self.get('pageSummaryField')],
        summary = data[_self.get('summaryField')];

      _self.set('pageSummary',pageSummary);
      _self.set('summary',summary);
    },
    /**
     * 重新设置本页汇总
     */
    resetPageSummary : function(){
      var _self = this,
        grid = _self.get('grid'),
        columns = grid.get('columns'),
        pageSummary = _self._calculatePageSummary(),
        pageEl = _self.get('pageEl');
      _self.set('pageSummary',pageSummary);
      if(pageEl){
        BUI.each(columns,function(column){
          if(column.get('summary') && column.get('visible')){
            var id = column.get('id'),
              cellEl = pageEl.find('.' + CLS_COLUMN_PREFIX + id),
              text = _self._getSummaryCellText(column,pageSummary);
            cellEl.find('.' + CLS_GRID_CELL_TEXT).text(text);
          }
        });
        _self._updateFirstRow(pageEl,_self.get('pageSummaryTitle'));
      }
    },
    //重置汇总数据
    resetSummary : function(pageSummary,summary){
      var _self = this,
        footerEl = _self.get('footerEl'),
        pageEl = null;

      footerEl.empty();

      pageSummary = pageSummary || _self.get('pageSummary');
      if(!pageSummary){
        pageSummary = _self._calculatePageSummary();
        _self.set('pageSummary',pageSummary);
      }
      summary = summary || _self.get('summary');
      pageEl = _self._creatSummaryRow(pageSummary,_self.get('pageSummaryTitle'));
      _self.set('pageEl',pageEl);
      _self._creatSummaryRow(summary,_self.get('summaryTitle'));
    },
    //创建汇总
    _creatSummaryRow : function(summary,title){
      if(!summary){
        return null;
      }
      var _self = this,
        footerEl = _self.get('footerEl'),
        tpl = _self._getSummaryTpl(summary),
        rowEl = $(tpl).appendTo(footerEl);
      
      _self._updateFirstRow(rowEl,title);
      return rowEl;
    },
    _updateFirstRow : function(rowEl,title){
      var firstCell = rowEl.find('td').first(),
          textEl = firstCell.find('.' + CLS_GRID_CELL_INNER);
      if(textEl.length){
        var textPrefix = title + ': ';
          text = textEl.text();
        if(text.indexOf(textPrefix) === -1){
          text = textPrefix + text;
        }
        firstCell.html(getInnerTemplate(text));
      }else{
        firstCell.html(getInnerTemplate(title + ':'));
      }
    },
    //获取汇总模板
    _getSummaryTpl : function(summary){
      var _self = this,
        grid = _self.get('grid'),
        columns = grid.get('columns'),
        cellTempArray = [],
        prePosition = -1, //上次汇总列的位置
        currentPosition = -1,//当前位置
        rowTemplate = null;

      $.each(columns, function (colindex,column) {
        if(column.get('visible')){
          currentPosition += 1;
          if(column.get('summary')){
            cellTempArray.push(getEmptyCellTemplate(currentPosition-prePosition - 1));

            var text = _self._getSummaryCellText(column,summary),
              temp = getCellTemplate(text,column.get('id'));
            cellTempArray.push(temp);
            prePosition = currentPosition;
          }
        }
      });
      if(prePosition !== currentPosition){
        cellTempArray.push(getEmptyCellTemplate(currentPosition-prePosition));
      }

      rowTemplate = ['<tr class="', CLS_SUMMARY_ROW,' ', CLS_GRID_ROW, '">', cellTempArray.join(''),getLastEmptyCell(), '</tr>'].join('');
      return rowTemplate;
    },
    //获取汇总单元格内容
    _getSummaryCellText : function(column,summary){
      var _self = this,
        val = summary[column.get('dataIndex')],
        value = val == null ? '' : val,
        renderer = column.get('renderer'),
        text = renderer ? renderer(value,summary) : value;
      return text;
    },
    _calculatePageSummary : function(){
      var _self = this,
        grid = _self.get('grid'),
        store = grid.get('store'),
        columns = grid.get('columns'),
        rst = {};

      BUI.each(columns,function(column){
        if(column.get('summary')){
          var dataIndex = column.get('dataIndex');
          rst[dataIndex] = store.sum(dataIndex);
        }
      });
      
      return rst;
    }
  });

  return summary;
});