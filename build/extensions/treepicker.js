/**
 * @fileOverview \u6811\u5f62\u9009\u62e9\u5668\uff0c\u5355\u9009\u4f7f\u7528\u9009\u4e2d\uff0c\u591a\u9009\u4f7f\u7528\u52fe\u9009
 * @ignore
 */

define('bui/extensions/treepicker',['bui/common','bui/picker','bui/tree'],function (require) {
  'use strict';

  var BUI = require('bui/common'),
    ListPicker = require('bui/picker').ListPicker,
    Tree = require('bui/tree');

  /**
   * @class BUI.Extensions.TreePicker
   * \u6811\u5f62\u9009\u62e9\u5668
   * @extends BUI.Picker.ListPicker
   */
  var TreePicker = ListPicker.extend({

    /**
     * \u8bbe\u7f6e\u9009\u4e2d\u7684\u503c
     * @param {String} val \u8bbe\u7f6e\u503c
     */
    setSelectedValue : function(value){
      value = value || '';
      var _self = this,
        tree = _self.get('tree');
      if(_self.get('selectStatus') === 'selected'){ //\u5982\u679c\u4e0d\u4f7f\u7528\u52fe\u9009
        if(value){
          tree.expandNode(value);
        }
        ListPicker.prototype.setSelectedValue.call(_self,value);
      }else{
        tree.clearAllChecked();
        var arr = value.split(',');
        BUI.each(arr,function(id){
          tree.setChecked(id);
        });
      }
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u7684\u503c\uff0c\u591a\u9009\u72b6\u6001\u4e0b\uff0c\u503c\u4ee5','\u5206\u5272
     * @return {String} \u9009\u4e2d\u7684\u503c
     */
    getSelectedValue : function(){
      var _self = this,
        tree = _self.get('tree');
      if(_self.get('selectStatus') === 'selected'){ //\u5982\u679c\u4e0d\u4f7f\u7528\u52fe\u9009
        return  ListPicker.prototype.getSelectedValue.call(_self);
      }

      var nodes = tree.getCheckedNodes();
      nodes = _self._getFilterNodes(nodes);
      return BUI.Array.map(nodes,function(node){
        return node.id;
      }).join(',');
      
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u9879\u7684\u6587\u672c\uff0c\u591a\u9009\u72b6\u6001\u4e0b\uff0c\u6587\u672c\u4ee5','\u5206\u5272
     * @return {String} \u9009\u4e2d\u7684\u6587\u672c
     */
    getSelectedText : function(){
      var _self = this,
        tree = _self.get('tree');
       
      if(_self.get('selectStatus') === 'selected'){ //\u5982\u679c\u4e0d\u4f7f\u7528\u52fe\u9009
        return  ListPicker.prototype.getSelectedText.call(_self);
      }

      var nodes = tree.getCheckedNodes();
      nodes = _self._getFilterNodes(nodes);
      return BUI.Array.map(nodes,function(node){
        return node.text;
      }).join(',');
      
    },
    //\u83b7\u53d6\u8fc7\u6ee4\u7684\u8282\u70b9
    _getFilterNodes : function(nodes){
      var _self = this,
        filter = _self.get('filter');
      if(filter){
        nodes = BUI.Array.filter(nodes,filter);
      }
      return nodes;
    }
  },{
    ATTRS : {
      /**
       * \u9ed8\u8ba4\u5b50\u63a7\u4ef6\u7684\u6837\u5f0f,\u9ed8\u8ba4\u4e3a'simple-list'
       * @type {String}
       * @override
       */
      defaultChildClass:{
        value : 'tree-list'
      },
      /**
       * \u9009\u4e2d\u7684\u72b6\u6001,selected,checked
       * @type {String}
       */
      selectStatus : {
        value : 'selected'
      },
      changeEvent : {
        getter : function(){
          return this.get('selectStatus') + 'change';
        }
      },
      hideEvent : {
        getter : function(v){
          if(this.get('selectStatus') === 'checked'){
            return null;
          }
          return v;
        }
      },
      /**
       * \u7ed3\u679c\u96c6\u7684\u8fc7\u6ee4\u51fd\u6570
       * @type {Function}
       */
      filter : {
       
      },
      /**
       * @readOnly
       * @type {BUI.Tree.TreeList}
       */
      tree : {
        getter : function(){
          return this.get('children')[0];
        }
      }
    }
  },{
    xclass : 'tree-picker'
  });

  return TreePicker;
});