/**
 * @fileOverview 选择的插件
 * @ignore
 */

define('bui/grid/plugins/selection',['bui/common'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_CHECKBOX = PREFIX + 'grid-checkBox',
    CLS_CHECK_ICON = 'x-grid-checkbox',
    CLS_RADIO = PREFIX + 'grid-radio';
    
  /**
  * 选择行插件
  * <pre><code>
  ** var store = new Store({
  *       data : data,
  *       autoLoad:true
  *     }),
  *     grid = new Grid.Grid({
  *       render:'#grid',
  *       columns : columns,
  *       itemStatusFields : { //设置数据跟状态的对应关系
  *         selected : 'selected',
  *         disabled : 'disabled'
  *       },
  *       store : store,
  *       plugins : [Grid.Plugins.CheckSelection] // 插件形式引入多选表格
  *      //multiSelect: true  // 控制表格是否可以多选，但是这种方式没有前面的复选框 默认为false
  *     });
  *
  *   grid.render();
  * </code></pre>
  * @class BUI.Grid.Plugins.CheckSelection
  * @extends BUI.Base
  */
  function checkSelection(config){
    checkSelection.superclass.constructor.call(this, config);
  }

  BUI.extend(checkSelection,BUI.Base);

  checkSelection.ATTRS = 
  {
    /**
    * column's width which contains the checkbox
    */
    width : {
      value : 40
    },
    /**
    * @private
    */
    column : {
      
    },
    /**
    * @private
    * <input  class="' + CLS_CHECKBOX + '" type="checkbox">
    */
    cellInner : {
      value : '<div class="'+CLS_CHECKBOX+'-container"><span class="' + CLS_CHECK_ICON +'"></span></div>'
    }
  };

  BUI.augment(checkSelection, 
  {
    createDom : function(grid){
      var _self = this;
      var cfg = {
            title : '',
            width : _self.get('width'),
            fixed : true,
            resizable:false,
            sortable : false,
            tpl : '<div class="' + PREFIX + 'grid-hd-inner">' + _self.get('cellInner') + '',
            cellTpl : _self.get('cellInner')
        },
        checkColumn = grid.addColumn(cfg,0);
      grid.set('multipleSelect',true);
      _self.set('column',checkColumn);
    },
    /**
    * @private
    */
    bindUI : function(grid){
      var _self = this,
        col = _self.get('column'),
        colEl = col.get('el'),
        checkBox = colEl.find('.' + CLS_CHECK_ICON);
      checkBox.on('click',function(){
        var checked = colEl.hasClass('checked');     
        if(!checked){
          grid.setAllSelection();
          colEl.addClass('checked');
        }else{
          grid.clearSelection();
          colEl.removeClass('checked');
        }
      });
      grid.on('rowunselected',function(e){
        
        colEl.removeClass('checked');
      });
      
      //清除纪录时取全选
      grid.on('clear',function(){
        //checkBox.attr('checked',false);
        colEl.removeClass('checked');
      });
    }
  });
  
  /**
   * 表格单选插件
   * @class BUI.Grid.Plugins.RadioSelection
   * @extends BUI.Base
   */
  var radioSelection = function(config){
    radioSelection.superclass.constructor.call(this, config);
  };

  BUI.extend(radioSelection,BUI.Base);

  radioSelection.ATTRS = 
  {
    /**
    * column's width which contains the checkbox
    */
    width : {
      value : 40
    },
    /**
    * @private
    */
    column : {
      
    },
    /**
    * @private
    */
    cellInner : {
      value : '<div class="' + PREFIX + 'grid-radio-container"><input  class="' + CLS_RADIO + '" type="radio"></div>'
    }
  };

  BUI.augment(radioSelection, {
    createDom : function(grid){
      var _self = this;
      var cfg = {
            title : '',
            width : _self.get('width'),
            resizable:false,
            fixed : true,
            sortable : false,
            cellTpl : _self.get('cellInner')
        },
        column = grid.addColumn(cfg,0);
      grid.set('multipleSelect',false);
      _self.set('column',column);
    },
    /**
    * @private
    */
    bindUI : function(grid){
      var _self = this;

      grid.on('rowselected',function(e){
        _self._setRowChecked(e.row,true);
      });

      grid.on('rowunselected',function(e){
        _self._setRowChecked(e.row,false);
      });
    },
    _setRowChecked : function(row,checked){
      var rowEl = $(row),
        radio = rowEl.find('.' + CLS_RADIO);
      radio.attr('checked',checked);
    }
  });

  /**
  * @name BUI.Grid.Plugins
  * @namespace 表格插件命名空间
  * @ignore
  */
  var Selection  = {
    CheckSelection : checkSelection,
    RadioSelection : radioSelection
  };

  
  return Selection;
});