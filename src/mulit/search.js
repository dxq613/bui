/**
 * 输入过滤的list
 * @fileOverview
 * @ignore
 */
define('search', function(require) {

  var BUI = require('bui/common'),
    Form = require('bui/form');

  function Search(config) {
    Search.superclass.constructor.call(this, config);
  }

  BUI.extend(Search, BUI.Base);

  Search.ATTRS = {
    tpl: {
      value: '<input type="text" name="a" value="1"/><button class="button button-mini">确定</button>'
    }
  }

  BUI.augment(Search, {
    createDom: function(list){
      var _self = this,
        el = $('<div></div>').append(_self.get('tpl')),
        group = new Form.Group( {
          srcNode : el
        }).render();

      _self.set('el', el);
      _self.set('group', group);
    },
    renderUI: function(list){
      var el = list.get('el');
      el.before(this.get('el'));
    },
    bindUI: function(list){
      var _self = this,
        el = _self.get('el'),
        store = list.get('store'),
        group = _self.get('group');

      el.find('.button').on('click', function(ev){
        store.load(group.getRecord());
      })
    }
  });

  return Search;
});