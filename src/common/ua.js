/**
 * @fileOverview UA,jQuery的 $.browser 对象非常难使用
 * @ignore
 * @author dxq613@gmail.com
 */
define('bui/ua',function(){

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    };

    var UA = $.UA || (function(){
        var browser = $.browser,
            versionNumber = numberify(browser.version),
            /**
             * 浏览器版本检测
             * @class BUI.UA
                     * @singleton
             */
            ua = 
            {
                /**
                 * ie 版本
                 * @type {Number}
                 */
                ie : browser.msie && versionNumber,

                /**
                 * webkit 版本
                 * @type {Number}
                 */
                webkit : browser.webkit && versionNumber,
                /**
                 * opera 版本
                 * @type {Number}
                 */
                opera : browser.opera && versionNumber,
                /**
                 * mozilla 火狐版本
                 * @type {Number}
                 */
                mozilla : browser.mozilla && versionNumber
            };
        return ua;
    })();

    return UA;
});