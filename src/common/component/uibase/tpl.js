/**
 * @fileOverview 控件模板
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/tpl',function () {

  /**
   * @private
   * 控件模板扩展类的渲染类(view)
   * @class BUI.Component.UIBase.TplView
   */
  function tplView () {
    
  }

  tplView.ATTRS = {
    /**
     * 模板
     * @protected
     * @type {String}
     */
    tpl:{

    },
    tplEl : {

    }
  };

  tplView.prototype = {
    __renderUI : function(){
      var _self = this,
        contentContainer = _self.get('childContainer'),
        contentEl;

      if(contentContainer){
        contentEl = _self.get('el').find(contentContainer);
        if(contentEl.length){
          _self.set('contentEl',contentEl);
        }
      }
    },
    /**
     * 获取生成控件的模板
     * @protected
     * @param  {Object} attrs 属性值
     * @return {String} 模板
     */
    getTpl:function (attrs) {
        var _self = this,
            tpl = _self.get('tpl'),
            tplRender = _self.get('tplRender');
        attrs = attrs || _self.getAttrVals();

        if(tplRender){
          return tplRender(attrs);
        }
        if(tpl){
          return BUI.substitute(tpl,attrs);
        }
        return '';
    },
    /**
     * 如果控件设置了模板，则根据模板和属性值生成DOM
     * 如果设置了content属性，此模板不应用
     * @protected
     * @param  {Object} attrs 属性值，默认为初始化时传入的值
     */
    setTplContent:function (attrs) {
        var _self = this,
            el = _self.get('el'),
            content = _self.get('content'),
            tplEl = _self.get('tplEl'),
            tpl = _self.getTpl(attrs);

        //tplEl.remove();
        if(!content && tpl){ //替换掉原先的内容
          el.empty();
          el.html(tpl);
          /*if(tplEl){
            var node = $(tpl).insertBefore(tplEl);
            tplEl.remove();
            tplEl = node;
          }else{
            tplEl = $(tpl).appendTo(el);
          }
          _self.set('tplEl',tplEl)
          */
        }
    }
  }

  /**
   * 控件的模板扩展
   * @class BUI.Component.UIBase.Tpl
   */
  function tpl() {

  }

  tpl.ATTRS = {
    /**
    * 控件的模版，用于初始化
    * <pre><code>
    * var list = new List.List({
    *   tpl : '&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;',
    *   childContainer : 'ul'
    * });
    * //用于统一子控件模板
    * var list = new List.List({
    *   defaultChildCfg : {
    *     tpl : '&lt;span&gt;{text}&lt;/span&gt;'
    *   }
    * });
    * list.render();
    * </code></pre>
    * @cfg {String} tpl
    */
    /**
     * 控件的模板
     * <pre><code>
     *   list.set('tpl','&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;&lt;div class="bottom"&gt;&lt;/div&gt;')
     * </code></pre>
     * @type {String}
     */
    tpl : {
      view : true,
      sync: false
    },
    /**
     * <p>控件的渲染函数，应对一些简单模板解决不了的问题，例如有if,else逻辑，有循环逻辑,
     * 函数原型是function(data){},其中data是控件的属性值</p>
     * <p>控件模板的加强模式，此属性会覆盖@see {BUI.Component.UIBase.Tpl#property-tpl}属性</p>
     * //用于统一子控件模板
     * var list = new List.List({
     *   defaultChildCfg : {
     *     tplRender : funciton(item){
     *       if(item.type == '1'){
     *         return 'type1 html';
     *       }else{
     *         return 'type2 html';
     *       }
     *     }
     *   }
     * });
     * list.render();
     * @cfg {Function} tplRender
     */
    tplRender : {
      view : true,
      value : null
    },
    /**
     * 这是一个选择器，使用了模板后，子控件可能会添加到模板对应的位置,
     *  - 默认为null,此时子控件会将控件最外层 el 作为容器
     * <pre><code>
     * var list = new List.List({
     *   tpl : '&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;',
     *   childContainer : 'ul'
     * });
     * </code></pre>
     * @cfg {String} childContainer
     */
    childContainer : {
      view : true
    }
  };

  tpl.prototype = {

    __renderUI : function () {
      //使用srcNode时，不使用模板
      if(!this.get('srcNode')){
        this.setTplContent();
      }
    },
    /**
     * 控件信息发生改变时，控件内容跟模板相关时需要调用这个函数，
     * 重新通过模板和控件信息构造内容
     */
    updateContent : function(){
      this.setTplContent();
    },
    /**
     * 根据控件的属性和模板生成控件内容
     * @protected
     */
    setTplContent : function () {
      var _self = this,
        attrs = _self.getAttrVals();
      _self.get('view').setTplContent(attrs);
    },
    //模板发生改变
    _uiSetTpl : function(){
      this.setTplContent();
    }
  };


  tpl.View = tplView;

  return tpl;
});
 

