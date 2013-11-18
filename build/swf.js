/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/swf/ua', function (require) {

    var fpvCached,
        firstRun = true,
        win = window;

    /*
     \u83b7\u53d6 Flash \u7248\u672c\u53f7
     \u8fd4\u56de\u6570\u636e [M, S, R] \u82e5\u672a\u5b89\u88c5\uff0c\u5219\u8fd4\u56de undefined
     */
    function getFlashVersion() {
        var ver,
            SF = 'ShockwaveFlash';

        // for NPAPI see: http://en.wikipedia.org/wiki/NPAPI
        if (navigator.plugins && navigator.mimeTypes.length) {
            ver = (navigator.plugins['Shockwave Flash'] || 0).description;
        }
        // for ActiveX see:	http://en.wikipedia.org/wiki/ActiveX
        else if (win['ActiveXObject']) {
            try {
                ver = new ActiveXObject(SF + '.' + SF)['GetVariable']('$version');
            } catch (ex) {
                BUI.log('getFlashVersion failed via ActiveXObject');
                // nothing to do, just return undefined
            }
        }

        // \u63d2\u4ef6\u6ca1\u5b89\u88c5\u6216\u6709\u95ee\u9898\u65f6\uff0cver \u4e3a undefined
        if (!ver) {
            return undefined;
        }

        // \u63d2\u4ef6\u5b89\u88c5\u6b63\u5e38\u65f6\uff0cver \u4e3a "Shockwave Flash 10.1 r53" or "WIN 10,1,53,64"
        return getArrayVersion(ver);
    }

    /*
     getArrayVersion("10.1.r53") => ["10", "1", "53"]
     */
    function getArrayVersion(ver) {
        return ver.match(/\d+/g).splice(0, 3);
    }

    /*
     \u683c\u5f0f\uff1a\u4e3b\u7248\u672c\u53f7Major.\u6b21\u7248\u672c\u53f7Minor(\u5c0f\u6570\u70b9\u540e3\u4f4d\uff0c\u53603\u4f4d)\u4fee\u6b63\u7248\u672c\u53f7Revision(\u5c0f\u6570\u70b9\u540e\u7b2c4\u81f3\u7b2c8\u4f4d\uff0c\u53605\u4f4d)
     ver \u53c2\u6570\u4e0d\u7b26\u5408\u9884\u671f\u65f6\uff0c\u8fd4\u56de 0
     getNumberVersion("10.1 r53") => 10.00100053
     getNumberVersion(["10", "1", "53"]) => 10.00100053
     getNumberVersion(12.2) => 12.2
     */
    function getNumberVersion(ver) {
        var arr = typeof ver == 'string' ?
                getArrayVersion(ver) :
                ver,
            ret = ver;
        if (BUI.isArray(arr)) {
            ret = parseFloat(arr[0] + '.' + pad(arr[1], 3) + pad(arr[2], 5));
        }
        return ret || 0;
    }

    /*
     pad(12, 5) => "00012"
     */
    function pad(num, n) {
        num = num || 0;
        num += '';
        var padding = n + 1 - num.length;
        return new Array(padding > 0 ? padding : 0).join('0') + num;
    }

    /**
     * Get flash version
     * @param {Boolean} [force] whether to avoid getting from cache
     * @returns {String[]} eg: ["11","0","53"]
     * @member KISSY.SWF
     * @static
     */
    function fpv(force) {
        // \u8003\u8651 new ActiveX \u548c try catch \u7684 \u6027\u80fd\u635f\u8017\uff0c\u5ef6\u8fdf\u521d\u59cb\u5316\u5230\u7b2c\u4e00\u6b21\u8c03\u7528\u65f6
        if (force || firstRun) {
            firstRun = false;
            fpvCached = getFlashVersion();
        }
        return fpvCached;
    }

    /**
     * Checks whether current version is greater than or equal the specific version.
     * @param {String} ver eg. "10.1.53"
     * @param {Boolean} force whether to avoid get current version from cache
     * @returns {Boolean}
     * @member KISSY.SWF
     * @static
     */
    function fpvGTE(ver, force) {
        return getNumberVersion(fpv(force)) >= getNumberVersion(ver);
    }

    return {
        fpv: fpv,
        fpvGTE: fpvGTE
    };

});

/**
 * @ignore
 *
 * NOTES:
 *
 -  ActiveXObject JS \u5c0f\u8bb0
 -    newObj = new ActiveXObject(ProgID:String[, location:String])
 -    newObj      \u5fc5\u9700    \u7528\u4e8e\u90e8\u7f72 ActiveXObject  \u7684\u53d8\u91cf
 -    ProgID      \u5fc5\u9009    \u5f62\u5f0f\u4e3a "serverName.typeName" \u7684\u5b57\u7b26\u4e32
 -    serverName  \u5fc5\u9700    \u63d0\u4f9b\u8be5\u5bf9\u8c61\u7684\u5e94\u7528\u7a0b\u5e8f\u7684\u540d\u79f0
 -    typeName    \u5fc5\u9700    \u521b\u5efa\u5bf9\u8c61\u7684\u7c7b\u578b\u6216\u8005\u7c7b
 -    location    \u53ef\u9009    \u521b\u5efa\u8be5\u5bf9\u8c61\u7684\u7f51\u7edc\u670d\u52a1\u5668\u7684\u540d\u79f0

 -  Google Chrome \u6bd4\u8f83\u7279\u522b\uff1a
 -    \u5373\u4f7f\u5bf9\u65b9\u672a\u5b89\u88c5 flashplay \u63d2\u4ef6 \u4e5f\u542b\u6700\u65b0\u7684 Flashplayer
 -    ref: http://googlechromereleases.blogspot.com/2010/03/dev-channel-update_30.html
 *
 */

define('bui/swf', function (require) {

    var BUI = require('bui/common'),
        FlashUA = require('bui/swf/ua'),
        UA = BUI.UA,
		JSON = BUI.JSON,
        TYPE = 'application/x-shockwave-flash',
        CID = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
        FLASHVARS = 'flashvars',
        EMPTY = '',
        SPACE = ' ',
        EQUAL = '=',
        DOUBLE_QUOTE = '"',
        LT = '<',
        GT = '>',
        doc = document,
        fpv = FlashUA.fpv,
        fpvGEQ = FlashUA.fpvGEQ,
        fpvGTE = FlashUA.fpvGTE,
        OBJECT_TAG = 'object',
        encode = encodeURIComponent,

    // flash player \u7684\u53c2\u6570\u8303\u56f4
        PARAMS = {
            // swf \u4f20\u5165\u7684\u7b2c\u4e09\u65b9\u6570\u636e\u3002\u652f\u6301\u590d\u6742\u7684 Object / XML \u6570\u636e / Json \u5b57\u7b26\u4e32
            // flashvars: EMPTY,
            wmode: EMPTY,
            allowscriptaccess: EMPTY,
            allownetworking: EMPTY,
            allowfullscreen: EMPTY,

            // \u663e\u793a \u63a7\u5236 \u5220\u9664
            play: 'false',
            loop: EMPTY,
            menu: EMPTY,
            quality: EMPTY,
            scale: EMPTY,
            salign: EMPTY,
            bgcolor: EMPTY,
            devicefont: EMPTY,
            hasPriority: EMPTY,

            //	\u5176\u4ed6\u63a7\u5236\u53c2\u6570
            base: EMPTY,
            swliveconnect: EMPTY,
            seamlesstabbing: EMPTY
        };
    var SWF = function(config){
        SWF.superclass.constructor.call(this, config);
        this.initializer();
    }
    /**
     * insert a new swf into container
     * @class KISSY.SWF
     * @extends KISSY.Base
     */
    BUI.extend(SWF, BUI.Base, {
        initializer: function () {
            var self = this;
            var expressInstall = self.get('expressInstall'),
                swf,
                html,
                id,
                htmlMode = self.get('htmlMode'),
                flashVars,
                params = self.get('params'),
                attrs = self.get('attrs'),
                doc = self.get('document'),
                placeHolder = $('<span>'),
                elBefore = self.get('elBefore'),
                installedSrc = self.get('src'),
                version = self.get('version');

            id = attrs.id = attrs.id || BUI.guid('ks-swf-');

            // 2. flash \u63d2\u4ef6\u6ca1\u6709\u5b89\u88c5
            if (!fpv()) {
                self.set('status', SWF.Status.NOT_INSTALLED);
                return;
            }

            // 3. \u5df2\u5b89\u88c5\uff0c\u4f46\u5f53\u524d\u5ba2\u6237\u7aef\u7248\u672c\u4f4e\u4e8e\u6307\u5b9a\u7248\u672c\u65f6
            if (version && !fpvGTE(version)) {
                self.set('status', SWF.Status.TOO_LOW);

                // \u6709 expressInstall \u65f6\uff0c\u5c06 src \u66ff\u6362\u4e3a\u5feb\u901f\u5b89\u88c5
                if (expressInstall) {
                    installedSrc = expressInstall;

                    // from swfobject
                    if (!('width' in attrs) ||
                        (!/%$/.test(attrs.width) && parseInt(attrs.width, 10) < 310)) {
                        attrs.width = "310";
                    }

                    if (!('height' in attrs) ||
                        (!/%$/.test(attrs.height) && parseInt(attrs.height, 10) < 137)) {
                        attrs.height = "137";
                    }

                    flashVars = params.flashVars = params.flashVars || {};
                    // location.toString() crash ie6
                    BUI.mix(flashVars, {
                        MMredirectURL: location.href,
                        MMplayerType: UA.ie ? "ActiveX" : "PlugIn",
                        MMdoctitle: doc.title.slice(0, 47) + " - Flash Player Installation"
                    });
                }
            }

            if (htmlMode == 'full') {
                html = _stringSWFFull(installedSrc, attrs, params)
            } else {
                html = _stringSWFDefault(installedSrc, attrs, params)
            }

            // ie \u518d\u53d6  target.innerHTML \u5c5e\u6027\u5927\u5199\uff0c\u5f88\u591a\u591a\u4e0e\u5c5e\u6027\uff0c\u7b49
            self.set('html', html);

            if (elBefore) {
                placeHolder.insertBefore(elBefore);
            } else {
                placeHolder.appendTo(self.get('render'));
            }

            if ('outerHTML' in placeHolder[0]) {
                placeHolder[0].outerHTML = html;
            } else {
				placeHolder.replaceWith($(html));
            }

            swf = doc.getElementById(id);

            self.set('swfObject', swf);

            if (htmlMode == 'full') {
                if (UA.ie) {
                    self.set('swfObject', swf);
                } else {
                    self.set('swfObject', swf.parentNode);
                }
            }

            // bug fix: \u91cd\u65b0\u83b7\u53d6\u5bf9\u8c61,\u5426\u5219\u8fd8\u662f\u8001\u5bf9\u8c61.
            // \u5982 \u5165\u53e3\u4e3a div \u5982\u679c\u4e0d\u91cd\u65b0\u83b7\u53d6\u5219\u4ecd\u7136\u662f div	longzang | 2010/8/9
            self.set('el', swf);

            if (!self.get('status')) {
                self.set('status', SWF.Status.SUCCESS);
            }
        },
        /**
         * Calls a specific function exposed by the SWF 's ExternalInterface.
         * @param func {String} the name of the function to call
         * @param args {Array} the set of arguments to pass to the function.
         */
        callSWF: function (func, args) {
            var swf = this.get('el'),
                ret,
                params;
            args = args || [];
            try {
                if (swf[func]) {
                    ret = swf[func].apply(swf, args);
                }
            } catch (e) {
                // some version flash function is odd in ie: property or method not supported by object
                params = "";
                if (args.length !== 0) {
                    params = "'" + args.join("', '") + "'";
                }
                //avoid eval for compression
                ret = (new Function('swf', 'return swf.' + func + '(' + params + ');'))(swf);
            }
            return ret;
        },
        /**
         * remove its container and swf element from dom
         */
        destroy: function () {
            var self = this;
            self.detach();
            var swfObject = self.get('swfObject');
            /* Cross-browser SWF removal
             - Especially needed to safely and completely remove a SWF in Internet Explorer
             */
            if (UA.ie) {
                swfObject.style.display = 'none';
                // from swfobject
                (function () {
                    if (swfObject.readyState == 4) {
                        removeObjectInIE(swfObject);
                    }
                    else {
                        setTimeout(arguments.callee, 10);
                    }
                })();
            } else {
                swfObject.parentNode.removeChild(swfObject);
            }
        }
    }, {
        ATTRS: {

            /**
             * express install swf url.
             * Defaults to: swfobject 's express install
             * @cfg {String} expressInstall
             */
            /**
             * @ignore
             */
            expressInstall: {
                //value: S.config('base') + 'swf/assets/expressInstall.swf'
            },

            /**
             * new swf 's url
             * @cfg {String} src
             */
            /**
             * @ignore
             */
            src: {

            },

            /**
             * minimum flash version required. eg: "10.1.250"
             * Defaults to "9".
             * @cfg {String} version
             */
            /**
             * @ignore
             */
            version: {
                value: "9"
            },

            /**
             * params for swf element
             *  - params.flashVars
             * @cfg {Object} params
             */
            /**
             * @ignore
             */
            params: {
                value: {}
            },

            /**
             * attrs for swf element
             * @cfg {Object} attrs
             */
            /**
             * @ignore
             */
            attrs: {
                value: {}
            },
            /**
             * container where flash will be appended.
             * Defaults to: body
             * @cfg {HTMLElement} render
             */
            /**
             * @ignore
             */
            render: {
                setter: function (v) {
                    if (typeof v == 'string') {
                        v = $(v)[0];
                    }
                    return v;
                },
                valueFn: function () {
                    return document.body;
                }
            },
            /**
             * element where flash will be inserted before.
             * @cfg {HTMLElement} elBefore
             */
            /**
             * @ignore
             */
            elBefore: {
                setter: function (v) {
                    if (typeof v == 'string') {
                        v = $(v)[0];
                    }
                    return v;
                }
            },

            /**
             * html document current swf belongs.
             * Defaults to: current document
             * @cfg {HTMLElement} document
             */
            /**
             * @ignore
             */
            document: {
                value: doc
            },

            /**
             * status of current swf
             * @property status
             * @type {KISSY.SWF.Status}
             * @readonly
             */
            /**
             * @ignore
             */
            status: {

            },

            /**
             * swf element
             * @readonly
             * @type {HTMLElement}
             * @property el
             */
            /**
             * @ignore
             */
            el: {

            },

            /**
             * @ignore
             * @private
             */
            swfObject: {

            },

            /**
             * swf element 's outerHTML
             * @property html
             * @type {String}
             * @readonly
             */
            /**
             * @ignore
             */
            html: {
            },

            /**
             *  full or default(depends on browser object)
             *  @cfg {KISSY.SWF.HtmlMode} htmlMode
             */
            /**
             * @ignore
             */
            htmlMode: {
                value: 'default'
            }
        },
        /**
         * get src from existing oo/oe/o/e swf element
         * @param {HTMLElement} swf
         * @returns {String}
         * @static
         */
        getSrc: function (swf) {
            //swf = $(swf)[0];
            var srcElement = getSrcElements(swf)[0],
                src,
                nodeName = srcElement && srcElement.nodeName.toLowerCase();
            if (nodeName == 'embed') {
                return $(srcElement).attr('src');
            } else if (nodeName == 'object') {
                return $(srcElement).attr('data');
            } else if (nodeName == 'param') {
                return $(srcElement).attr('value');
            }
            return null;
        },

        /**
         * swf status
         * @enum {String} KISSY.SWF.Status
         */
        Status: {
            /**
             * flash version is too low
             */
            TOO_LOW: 'flash version is too low',
            /**
             * flash is not installed
             */
            NOT_INSTALLED: 'flash is not installed',
            /**
             * success
             */
            SUCCESS: 'success'
        },

        /**
         * swf htmlMode
         * @enum {String} KISSY.SWF.HtmlMode
         */
        HtmlMode: {
            /**
             * generate object structure depending on browser
             */
            DEFAULT: 'default',
            /**
             * generate object/object structure
             */
            FULL: 'full'
        },

        fpv: fpv,
        fpvGEQ: fpvGEQ,
        fpvGTE: fpvGTE
    });

    function removeObjectInIE(obj) {
        for (var i in obj) {
            if (typeof obj[i] == "function") {
                obj[i] = null;
            }
        }
        obj.parentNode.removeChild(obj);
    }

    function getSrcElements(swf) {
        var url = "",
            params, i, param,
            elements = [],
            nodeName = swf.nodeName.toLowerCase();
        if (nodeName == "object") {
            url = $(swf).attr("data");
            if (url) {
                elements.push(swf);
            }
            params = swf.childNodes;
            for (i = 0; i < params.length; i++) {
                param = params[i];
                if (param.nodeType == 1) {
                    if (($(param).attr("name") || "").toLowerCase() == "movie") {
                        elements.push(param);
                    } else if (param.nodeName.toLowerCase() == "embed") {
                        elements.push(param);
                    } else if (param.nodeName.toLowerCase() == "object") {
                        elements.push(param);
                    }
                }
            }
        } else if (nodeName == "embed") {
            elements.push(swf);
        }
        return elements;
    }

    // setSrc ie \u4e0d\u91cd\u65b0\u6e32\u67d3

    function collectionParams(params) {
        var par = EMPTY;
        BUI.each(params, function (v, k) {
            k = k.toLowerCase();
            if (k in PARAMS) {
                par += stringParam(k, v);
            }
            // \u7279\u6b8a\u53c2\u6570
            else if (k == FLASHVARS) {
                par += stringParam(k, toFlashVars(v));
            }
        });
        return par;
    }


    function _stringSWFDefault(src, attrs, params) {
        return _stringSWF(src, attrs, params, UA.ie) + LT + '/' + OBJECT_TAG + GT;
    }

    function _stringSWF(src, attrs, params, ie) {
        var res,
            attr = EMPTY,
            par = EMPTY;

        if (ie == undefined) {
            ie = UA.ie;
        }

        // \u666e\u901a\u5c5e\u6027
        BUI.each(attrs, function (v, k) {
            attr += stringAttr(k, v);
        });

        if (ie) {
            attr += stringAttr('classid', CID);
            par += stringParam('movie', src);
        } else {
            // \u6e90
            attr += stringAttr('data', src);
            // \u7279\u6b8a\u5c5e\u6027
            attr += stringAttr('type', TYPE);
        }

        par += collectionParams(params);

        res = LT + OBJECT_TAG + attr + GT + par;

        return res
    }

    // full oo \u7ed3\u6784
    function _stringSWFFull(src, attrs, params) {
        var outside, inside;
        if (UA.ie) {
            outside = _stringSWF(src, attrs, params, 1);
            delete attrs.id;
            delete attrs.style;
            inside = _stringSWF(src, attrs, params, 0);
        } else {
            inside = _stringSWF(src, attrs, params, 0);
            delete attrs.id;
            delete attrs.style;
            outside = _stringSWF(src, attrs, params, 1);
        }
        return outside + inside + LT + '/' + OBJECT_TAG + GT + LT + '/' + OBJECT_TAG + GT;
    }

    /*
     \u5c06\u666e\u901a\u5bf9\u8c61\u8f6c\u6362\u4e3a flashvars
     eg: {a: 1, b: { x: 2, z: 's=1&c=2' }} => a=1&b=encode({"x":2,"z":"s%3D1%26c%3D2"})
     */
    function toFlashVars(obj) {
        var arr = [],
            ret;

        BUI.each(obj, function (data, prop) {
            if (typeof data != 'string') {
                data = JSON.stringify(data);
            }
            if (data) {
                arr.push(prop + '=' + encode(data));
            }
        });
        ret = arr.join('&');
        return ret;
    }

    function stringParam(key, value) {
        return '<param name="' + key + '" value="' + value + '"></param>';
    }

    function stringAttr(key, value) {
        return SPACE + key + EQUAL + DOUBLE_QUOTE + value + DOUBLE_QUOTE;
    }


    return SWF;
});

/**
 * NOTES:
 * 20130903 \u4ecekissy1.3.1\u79fb\u690d\u6210BUI\u7684\u6a21\u5757\uff08\u7d22\u4e18\u4fee\u6539\uff09
 */

