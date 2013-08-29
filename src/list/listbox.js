/**
 * @fileOverview 可选择的列表
 * @author dengbin
 * @ignore
 */

define('bui/list/listbox',['bui/list/simplelist'],function (require) {
  var SimpleList = require('bui/list/simplelist');
  /**
   * 列表选择框
   * @extends BUI.List.SimpleList
   * @class BUI.List.Listbox
   */
  var listbox = SimpleList.extend({
    bindUI : function(){
    	var _self = this;
      
    	_self.on('selectedchange',function(e){
    		var item = e.item,
    			sender = $(e.domTarget),
    			checkbox =sender.find('input');
    		if(item){
    			checkbox.attr('checked',e.selected);
    		}
    	});
    }
  },{
    ATTRS : {
      /**
       * 选项模板
       * @override
       * @type {String}
       */
      itemTpl : {
        value : '<li><span class="x-checkbox"></span>{text}</li>'
      },
      /**
       * 选项模板
       * @override
       * @type {Boolean}
       */
      multipleSelect : {
        value : true
      }
    }
  },{
    xclass: 'listbox'
  });

  return listbox;
});