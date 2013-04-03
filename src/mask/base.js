/**
 * @fileOverview Mask的入口文件
 * @ignore
 */

define('bui/mask',function (require) {
  var BUI = require('bui/common'),
    Mask = require('bui/mask/mask');
  Mask.LoadMask = require('bui/mask/loadmask');
  return Mask;
});