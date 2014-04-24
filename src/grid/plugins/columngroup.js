define('bui/grid/plugins/columngroup',['bui/common'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_HD_TITLE = PREFIX + 'grid-hd-title',
    CLS_GROUP = PREFIX + 'grid-column-group',
    CLS_GROUP_HEADER = PREFIX + 'grid-group-header',
    CLS_DOUBLE = PREFIX + 'grid-db-hd';

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
    },
    /**
     * 列模板
     * @type {String}
     */
    columnTpl : {
      value : '<th class="bui-grid-hd center" colspan="{colspan}"><div class="' + PREFIX + 'grid-hd-inner">' +
                        '<span class="' + CLS_HD_TITLE + '">{title}</span>' +
              '</div></th>'
    }
  };

  BUI.extend(Group,BUI.Base);

  BUI.augment(Group,{

    renderUI : function (grid) {
      var _self = this,
        groups = _self.get('groups'),
        header = grid.get('header'),
        headerEl = header.get('el'),
        columns = header.get('children'),
        wraperEl = $('<tr class="'+CLS_GROUP+'"></tr>').prependTo(headerEl.find('thead'));

      headerEl.addClass(CLS_GROUP_HEADER);

      //遍历分组，标志分组
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

      var afterEl;
      //修改未分组的rowspan和调整位置
      for(var i = columns.length - 1; i >=0 ; i--){
        var column = columns[i],
          group = column.get('group');
        if(group){
          afterEl = group.el;

        }else{
          var cEl = column.get('el');//$(_self.get('emptyTpl'));
          cEl.addClass(CLS_DOUBLE);
          cEl.attr('rowspan',2);
          if(afterEl){
            cEl.insertBefore(afterEl);
          }else{
            cEl.appendTo(wraperEl);
          }
          afterEl = cEl;
        }
      }
      if(groups[0].from !== 0){ //处理第一个单元格边框问题
        var firstCol = columns[groups[0].from];
        if(firstCol){
          firstCol.get('el').css('border-left-width',1);
        }
      }

       //移除空白列

    },
    _getGroupTpl : function (group) {
      var _self = this,
        columnTpl = _self.get('columnTpl'),
        colspan = group.to - group.from + 1;
      return BUI.substitute(columnTpl,{colspan : colspan,title : group.title});
    }
  });

  return Group;

});