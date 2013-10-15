/**
 * @fileOverview UA,jQuery的 $.browser 对象非常难使用
 * @ignore
 * @author dxq613@gmail.com
 */
define('bui/ua', function () {

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    };

    function uaMatch(s) {
        s = s.toLowerCase();
        var r = /(chrome)[ \/]([\w.]+)/.exec(s) || /(webkit)[ \/]([\w.]+)/.exec(s) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(s) || /(msie) ([\w.]+)/.exec(s) || s.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(s) || [],
            a = {
                browser: r[1] || "",
                version: r[2] || "0"
            },
            b = {};
        a.browser && (b[a.browser] = !0, b.version = a.version),
            b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0);
        return b;
    }

    var UA = $.UA || (function () {
        var browser = $.browser || uaMatch(navigator.userAgent),
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
                ie: browser.msie && versionNumber,

                /**
                 * webkit 版本
                 * @type {Number}
                 */
                webkit: browser.webkit && versionNumber,
                /**
                 * opera 版本
                 * @type {Number}
                 */
                opera: browser.opera && versionNumber,
                /**
                 * mozilla 火狐版本
                 * @type {Number}
                 */
                mozilla: browser.mozilla && versionNumber
            };
        return ua;
    })();

    return UA;
});