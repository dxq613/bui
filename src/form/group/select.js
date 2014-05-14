/**
 * @fileOverview 选择框分组
 * @ignore
 */

define('bui/form/group/select',['bui/form/group/base','bui/data'],function (require) {
  var Group = require('bui/form/group/base'),
    Data = require('bui/data'),
    Bindable = BUI.Component.UIBase.Bindable;
  
  function getItems(nodes){
    var items = [];
    BUI.each(nodes,function(node){
      items.push({
        text : node.text,
        value : node.id
      });
    });
    return items;
  }

  /**
   * @class BUI.Form.Group.Select
   * 级联选择框分组
   * @extends BUI.Form.Group
   * @mixins BUI.Component.UIBase.Bindable
   */
  var Select = Group.extend([Bindable],{
    initializer : function(){
      var _self = this,
        url = _self.get('url'),
        store = _self.get('store') || _self._getStore();
      if(!store.isStore){
        store.autoLoad = true;
        if(url){
          store.url = url;
        }
        store = new Data.TreeStore(store);
      }
      _self.set('store',store);
    },
    bindUI : function  () {
      var _self = this;
      _self.on('change',function (ev) {
        var target = ev.target;
        if(target != _self){
          var field = target,
            value = field.get('value'),
            level = _self._getFieldIndex(field) + 1;
          _self._valueChange(value,level);
        }
      });
    },
    onLoad : function(e){
      var _self = this,
        node = e ? e.node : _self.get('store').get('root');
      _self._setFieldItems(node.level,node.children); 
    },
    //获取store的配置项
    _getStore : function(){
      var _self = this,
        type = _self.get('type');
      if(type && TypeMap[type]){
        return TypeMap[type];
      }
      return {};
    },
    _valueChange : function(value,level){
      var _self = this,
        store = _self.get('store');
      if(value){
        var node = store.findNode(value);
        if(!node){
          return;
        }
        if(store.isLoaded(node)){
          _self._setFieldItems(level,node.children);
        }else{
          store.loadNode(node);
        }
      }else{
        _self._setFieldItems(level,[]);
      }
    },
    _setFieldItems : function(level,nodes){
      var _self = this,
        field = _self.getFieldAt(level),
        items = getItems(nodes);
      if(field){
        field.setItems(items);
        _self._valueChange(field.get('value'),level + 1);
      }
    },
    //获取字段的索引位置
    _getFieldIndex : function (field) {
      var _self = this,
        fields = _self.getFields();
      return  BUI.Array.indexOf(field,fields);
    }
  },{
    ATTRS : {
      /**
       * 级联选择框的类型,目前仅内置了 'city'一个类型，用于选择省、市、县,
       * 可以自定义添加类型
       *         Select.addType('city',{
       *           proxy : {
       *             url : 'http://lp.taobao.com/go/rgn/citydistrictdata.php',
       *             dataType : 'jsonp'
       *           },
       *           map : {
       *             isleaf : 'leaf',
       *             value : 'text'
       *           }
       *         });
       * @type {String}
       */
      type : {

      },
      store : {

      }
    }
  },{
    xclass : 'form-group-select'
  });

  var TypeMap = {};

  /**
   * 添加一个类型的级联选择框，目前仅内置了 'city'一个类型，用于选择省、市、县
   * @static
   * @param {String} name 类型名称
   * @param {Object} cfg  配置项，详细信息请参看： @see{BUI.Data.TreeStore}
   */
  Select.addType = function(name,cfg){
    TypeMap[name] = cfg;
  };

  Select.addType('city',{
    proxy : {
      url : 'http://lp.taobao.com/go/rgn/citydistrictdata.php',
      dataType : 'jsonp'
    },
    map : {
      isleaf : 'leaf',
      value : 'text'
    }
  });


  return Select;
});