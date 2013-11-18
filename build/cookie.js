/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/cookie',function () {

    var doc = document,
        MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000,
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    function isNotEmptyString(val) {
        return typeof(val) === 'string' && val !== '';
    }

    /**
     * Provide Cookie utilities.
     * @class BUI.Cookie
     * @singleton
     */
    var Cookie = {

        /**
         * Returns the cookie value for given name
         * @return {String} name The name of the cookie to retrieve
         */
        get: function (name) {
            var ret, m;

            if (isNotEmptyString(name)) {
                if ((m = String(doc.cookie).match(
                    new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')))) {
                    ret = m[1] ? decode(m[1]) : '';
                }
            }
            return ret;
        },

        /**
         * Set a cookie with a given name and value
         * @param {String} name The name of the cookie to set
         * @param {String} val The value to set for cookie
         * @param {Number|Date} expires
         * if Number secified how many days this cookie will expire
         * @param {String} domain set cookie's domain
         * @param {String} path set cookie's path
         * @param {Boolean} secure whether this cookie can only be sent to server on https
         */
        set: function (name, val, expires, domain, path, secure) {
            var text = String(encode(val)), date = expires;

            // \u4ece\u5f53\u524d\u65f6\u95f4\u5f00\u59cb\uff0c\u591a\u5c11\u5929\u540e\u8fc7\u671f
            if (typeof date === 'number') {
                date = new Date();
                date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY);
            }
            // expiration date
            if (date instanceof Date) {
                text += '; expires=' + date.toUTCString();
            }

            // domain
            if (isNotEmptyString(domain)) {
                text += '; domain=' + domain;
            }

            // path
            if (isNotEmptyString(path)) {
                text += '; path=' + path;
            }

            // secure
            if (secure) {
                text += '; secure';
            }

            doc.cookie = name + '=' + text;
        },

        /**
         * Remove a cookie from the machine by setting its expiration date to sometime in the past
         * @param {String} name The name of the cookie to remove.
         * @param {String} domain The cookie's domain
         * @param {String} path The cookie's path
         * @param {String} secure The cookie's secure option
         */
        remove: function (name, domain, path, secure) {
            this.set(name, '', -1, domain, path, secure);
        }
    };
    
    BUI.Cookie = Cookie;
    
    return Cookie;
});

/**
* @ignore
* 2012.02.14 yiminghe@gmail.com
* - jsdoc added
*
* 2010.04
* - get \u65b9\u6cd5\u8981\u8003\u8651 ie \u4e0b\uff0c
* \u503c\u4e3a\u7a7a\u7684 cookie \u4e3a 'test3; test3=3; test3tt=2; test1=t1test3; test3', \u6ca1\u6709\u7b49\u4e8e\u53f7\u3002
* \u9664\u4e86\u6b63\u5219\u83b7\u53d6\uff0c\u8fd8\u53ef\u4ee5 split \u5b57\u7b26\u4e32\u7684\u65b9\u5f0f\u6765\u83b7\u53d6\u3002
* - api \u8bbe\u8ba1\u4e0a\uff0c\u539f\u672c\u60f3\u501f\u9274 jQuery \u7684\u7b80\u660e\u98ce\u683c\uff1aS.cookie(name, ...), \u4f46\u8003\u8651\u5230\u53ef\u6269\u5c55\u6027\uff0c\u76ee\u524d
* \u72ec\u7acb\u6210\u9759\u6001\u5de5\u5177\u7c7b\u7684\u65b9\u5f0f\u66f4\u4f18\u3002
*/
