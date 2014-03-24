/**
 * @fileOverview 树形选择器，单选使用选中，多选使用勾选
 * @ignore
 */

define('bui/extensions/treepicker',['bui/common','bui/picker','bui/tree'],function (require) {
  'use strict';

  var BUI = require('bui/common'),
    ListPicker = require('bui/picker').ListPicker,
    Tree = require('bui/tree');

  /**
   * @class BUI.Extensions.TreePicker
   * 树形选择器
   * @extends BUI.Picker.ListPicker
   */
  var TreePicker = ListPicker.extend({

    /**
     * 设置选中的值
     * @param {String} val 设置值
     */
    setSelectedValue : function(value){
      value = value || '';
      var _self = this,
        tree = _self.get('tree');
      if(!_self.get('isInit')){
            _self._initControl();
      }
      if(_self.get('selectStatus') === 'selected'){ //如果不使用勾选
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
     * 获取选中的值，多选状态下，值以','分割
     * @return {String} 选中的值
     */
    getSelectedValue : function(){
      var _self = this,
        tree = _self.get('tree');
      if(_self.get('selectStatus') === 'selected'){ //如果不使用勾选
        return  ListPicker.prototype.getSelectedValue.call(_self);
      }

      var nodes = tree.getCheckedNodes();
      nodes = _self._getFilterNodes(nodes);
      return BUI.Array.map(nodes,function(node){
        return node.id;
      }).join(',');
      
    },
    /**
     * 获取选中项的文本，多选状态下，文本以','分割
     * @return {String} 选中的文本
     */
    getSelectedText : function(){
      var _self = this,
        tree = _self.get('tree');
       
      if(_self.get('selectStatus') === 'selected'){ //如果不使用勾选
        return  ListPicker.prototype.getSelectedText.call(_self);
      }

      var nodes = tree.getCheckedNodes();
      nodes = _self._getFilterNodes(nodes);
      return BUI.Array.map(nodes,function(node){
        return node.text;
      }).join(',');
      
    },
    //获取过滤的节点
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
       * 默认子控件的样式,默认为'simple-list'
       * @type {String}
       * @override
       */
      defaultChildClass:{
        value : 'tree-list'
      },
      /**
       * 选中的状态,selected,checked
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
       * 结果集的过滤函数
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