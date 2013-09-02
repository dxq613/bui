/**
 * @fileOverview 可勾选的列表，模拟多个radio
 * @ignore
 */

define('bui/form/radiolistfield',['bui/common','bui/form/listfield'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    ListField = require('bui/form/listfield');

  /**
   * @class BUI.Form.Field.RadioList
   * 可勾选的列表，模拟多个radio
   * @extends BUI.Form.Field.List
   */
  var RadioList = ListField.extend({

  },{
    ATTRS : {
      list : {
        value : {
          itemTpl : '<li><span class="x-radio"></span>{text}</li>',
          allowTextSelection : false
        }
      }
    }
  },{
    xclass : 'form-feild-checklist'
  });

  return RadioList;

});