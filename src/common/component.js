/**
 * @fileOverview Component命名空间的入口文件
 * @ignore
 */

define('bui/component',['bui/component/manage','bui/component/uibase','bui/component/view','bui/component/controller'],function (require) {
  /**
   * @class BUI.Component
   * <p>
   * <img src="../assets/img/class-common.jpg"/>
   * </p>
   * 控件基类的命名空间
   */
  var Component = {};

  BUI.mix(Component,{
    Manager : require('bui/component/manage'),
    UIBase : require('bui/component/uibase'),
    View : require('bui/component/view'),
    Controller : require('bui/component/controller')
  });

  function create(component, self) {
    var childConstructor, xclass;
    if (component && (xclass = component.xclass)) {
        if (self && !component.prefixCls) {
            component.prefixCls = self.get('prefixCls');
        }
        childConstructor = Component.Manager.getConstructorByXClass(xclass);
        if (!childConstructor) {
            BUI.error('can not find class by xclass desc : ' + xclass);
        }
        component = new childConstructor(component);
    }
    return component;
  }

  /**
   * 根据Xclass创建对象
   * @method
   * @static
   * @param  {Object} component 控件的配置项或者控件
   * @param  {Object} self      父类实例
   * @return {Object} 实例对象
   */
  Component.create = create;

  return Component;
});