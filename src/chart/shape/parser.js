/**
 * @fileOverview 图形操作的基类,子类分别操作vml,svg
 * @ignore
 */

define('bui/chart/shape/parser',function (require) {
  
  var Parser = function(){

  };
  
  BUI.augment(Parser,{
    create : function(type,attrs,container){

    },
    setAttr : function(el,name,value){

    },
    getAttr : function(el,name){

    }
  });

  return Parser;
});