/**
 * @fileOverview 选择的插件
 * @ignore
 */

define('bui/grid/plugins/selection',['bui/common'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_CHECKBOX = PREFIX + 'grid-checkBox',
    CLS_RADIO = PREFIX + 'grid-radio';
    
  /**
  * 选择行插件
  * @class BUI.Grid.Plugins.CheckSelection
  * @extends BUI.Base
  */
  function checkSelection(config){
    checkSelection.superclass.constructor.call(this, config);
  }

  BUI.extend(checkSelection,BUI.Base);

  checkSelection.ATTRS = 
  /**
   * @lends BUI.Grid.Plugins.CheckSelection.prototype
   * @ignore
   */ 
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
      value : '<div class="'+CLS_CHECKBOX+'-container"><input  class="' + CLS_CHECKBOX + '" type="checkbox"></div>'
    }
  };

  BUI.augment(checkSelection, 
  /**
   * @lends BUI.Grid.Plugins.CheckSelection.prototype
   * @ignore
   */ 
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
        checkBox = col.get('el').find('.' + CLS_CHECKBOX);
      checkBox.on('click',function(){
        //e.preventDefault();
        var checked = checkBox.attr('checked');
        checkBox.attr('checked',checked);
        if(checked){
          grid.setAllSelection();
        }else{
          grid.clearSelection();
        }
      });

      grid.on('rowselected',function(e){
        _self._setRowChecked(e.row,true);
      });
      
      grid.on('rowcreated',function(){
        checkBox.attr('checked',false);
      });
      grid.on('rowunselected',function(e){
        _self._setRowChecked(e.row,false);
        checkBox.attr('checked',false);
      });
      //清除纪录时取全选
      grid.on('clear',function(){
        checkBox.attr('checked',false);
      });
    },
    _setRowChecked : function(row,checked){
      var rowEl = $(row),
        checkBox = rowEl.find('.' + CLS_CHECKBOX);
      checkBox.attr('checked',checked);
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
  /**
   * @lends BUI.Grid.Plugins.RadioSelection#
   * @ignore
   */ 
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