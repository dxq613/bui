define('bui/grid/plugins/columngroup',['bui/common'],function(require){

  var BUI = require('bui/common');

  /**
   * 表头列分组功能
   * @class BUI.Grid.Plugins.ColumnGroup
   * @extends BUI.Base
   */
  var Group = function (cfg) {
    Group.superclass.constructor.call(this,cfg);
  };

  Group.ATTRS = {

    /**
     * 分组
     * @type {Array}
     */
    groups : {
      value : []
    }
  };

  BUI.extend(Group,BUI.Base);

  BUI.augment(Group,{

    renderUI : function (grid) {
      var _self = this,
        groups = _self.get('groups'),
        header = grid.get('header'),
        headerEl = header.get('el'),
        columns = grid.getColumns(),
        wraperEl = $('<tr></tr>').prependTo(headerEl.find('.thead'));

      BUI.each(groups,function (group) {
        var tpl = _self._getGroupTpl(group),
          gEl = $(tpl).appendTo(wraperEl);
        
        group.el = gEl;
        for(var i = group.from; i <= group.to; i++){
          var column = columns[i];
          if(column){
            column.set('group',group);
          }
        }
      });

      BUI.each(columns,function (column,index) {
        if(!column.get('group')){

        }
      });

    },
    _getGroupTpl : function (group) {
      // body...
    },
    bindUI : function (grid) {
      // body...
    }
  });

  return Group;

});