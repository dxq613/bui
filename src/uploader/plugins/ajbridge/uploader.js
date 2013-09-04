/*
Copyright 2011, KISSY UI Library v1.1.5
MIT Licensed
build time: Sep 11 10:29
*/
/**
 * @author kingfo  oicuicu@gmail.com
 */
KISSY.add('gallery/uploader/1.4/plugins/ajbridge/uploader', function(S,flash,A) {

    /**
     * @constructor
     * @param {String} id                                    需要注册的SWF应用ID
     * @param {Object} config                                配置项
     * @param {String} config.ds                             default server 的缩写
     * @param {String} config.dsp                            default server parameters 的缩写
     * @param {Boolean} config.btn                           启用按钮模式，默认 false
     * @param {Boolean} config.hand                          显示手型，默认 false
     */
    function Uploader(id, config) {
        config = config || { };
        var flashvars = { };
		
		
		
		S.each(['ds', 'dsp', 'btn', 'hand'], function(key) {
			if(key in config) flashvars[key] = config[key];
		});
		

        config.params = config.params || { };
        config.params.flashvars = S.merge(config.params.flashvars, flashvars);

		Uploader.superclass.constructor.call(this, id, config);
    }

    S.extend(Uploader, A);

    A.augment(Uploader,
        [
            'setFileFilters',
            'filter',
            'setAllowMultipleFiles',
            'multifile',
            'browse',
            'upload',
            'uploadAll',
            'cancel',
            'getFile',
            'removeFile',
            'lock',
            'unlock',
            'setBtnMode',
            'useHand',
            'clear'
        ]
        );

    Uploader.version = '1.0.1';
    A.Uploader = Uploader;
    return A.Uploader;
},{ requires:["gallery/flash/1.0/index","./ajbridge"] });
/**
 * NOTES:
 * 20130903 移植成bui uploader的模块（索丘修改）
 */
