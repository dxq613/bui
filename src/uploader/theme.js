/**
 * @ignore
 * @fileoverview 文件上传主题的处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/theme',['bui/common'], function (require) {

  var BUI = require('bui/common');

  var themes = {};

  /**
   * 文件上传的主题设置
   * @class BUI.Uploader.Theme
   * @static
   *
   * <pre><code>
   * 默认自带的题有
   * 
   * //这个是默认的
   * theme: 'defaultTheme'
   *
   * //这个带图片预览的
   * theme: 'imageView'
   * </code></pre>
   */
  var Theme = {
    /**
     * 添加一个主题
     * @param {String} name   主题名称
     * @param {Object} config 主题的配置
     * 
     * <pre><code>
     * @example
     * // 添加一个主题模板
     * Theme.addTheme('imageView', {
     *  elCls: 'imageViewTheme',
     *  queue:{
     *    resultTpl: {
     *      'default': '&lt;div class="default"&gt;{name}&lt;/div&gt;',
     *      'success': '&lt;div class="success"&gt;&lt;img src="{url}" /&gt;&lt;/div&gt;'
     *      'error': '&lt;div class="error"&gt;&lt;span title="{name}"&gt;{name}&lt;/span&gt;&lt;span class="uploader-error"&gt;{msg}&lt;/span&gt;&lt;/div&gt;',
     *      'progress': '&lt;div class="progress"&gt;&lt;div class="bar" style="width:{loadedPercent}%"&gt;&lt;/div&gt;&lt;/div&gt;'
     *    }
     *  }
     *});
     * </code></pre>
     */
    addTheme: function(name, config){
      themes[name] = config;
    },
    /**
     * 获取一个主题
     * @param  {String} name [description]
     * @return {BUI.Uploader.Theme} 主题的配置
     */
    getTheme: function(name){
      //不能覆盖主题设置的
      return BUI.cloneObject(themes[name]);
    }
  };

  //这个默认的主题
  Theme.addTheme('default', {
    elCls: 'defaultTheme'
  });


  //带图片预览的主题
  Theme.addTheme('imageView', {
    elCls: 'imageViewTheme',
    queue:{
      resultTpl: {
        'success': '<div class="success"><img src="{url}" /></div>'
      }
    }
  });

  return Theme;

});
