/**
 * @ignore
 * @fileoverview flash上传方案
 * @author 
 **/
define('bui/uploader/type/flash',['./base'], function (require) {
    var LOG_PREFIX = '[uploader-Flash]:';

    var UploadType = require('bui/uploader/type/base');

    //获取链接绝对路径正则
    var URI_SPLIT_REG = new RegExp('^([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$'),
        HOSTNAME_SPLIT_REG = new RegExp('^(?:([\\w\\d+.-]+):)?(?://([\\w\\d\\-\\u0100-\\uffff.+%]*))?.*$');

    /**
     * @class BUI.Uploader.UploadType.Flash
     * flash上传方案
     * 使用时要确认flash与提交的url是否跨越，如果跨越则需要设置crossdomain.xml
     * @extends BUI.Uploader.UploadType
     */
    function FlashType(config) {
        var _self = this;
        //调用父类构造函数
        FlashType.superclass.constructor.call(_self, config);
    }

    BUI.extend(FlashType, UploadType, {
        /**
         * 初始化
         */
        _initSwfUploader:function () {
            var _self = this, swfUploader = _self.get('swfUploader');
            if(!swfUploader){
                BUI.log(LOG_PREFIX + 'swfUploader对象为空！');
                return false;
            }
            //初始化swf时swf已经ready，所以这里直接fire swfReady事件
            _self.fire('swfReady');

            //测试是否存在crossdomain.xml
            _self._hasCrossdomain();

            //监听开始上传事件
            swfUploader.on('uploadStart', function(ev){
                var file = _self.get('file');
                _self.fire('start', {file: file});
            });
            //监听文件正在上传事件
            swfUploader.on('uploadProgress', function(ev){
                BUI.mix(ev, {
                    //已经读取的文件字节数
                    loaded:ev.bytesLoaded,
                    //文件总共字节数
                    total : ev.bytesTotal
                });
                BUI.log(LOG_PREFIX + '已经上传字节数为：' + ev.bytesLoaded);
                _self.fire('progress', { 'loaded':ev.loaded, 'total':ev.total });
            });
            //监听文件上传完成事件
            swfUploader.on('uploadCompleteData', function(ev){
                var file = _self.get('file'),
                    result = _self._processResponse(ev.data);
                _self.fire('complete', {result: result, file: file});
                _self.set('file', null);
            });
            //监听文件失败事件
            swfUploader.on('uploadError',function(){
                var file = _self.get('file');
                _self.fire('error', {file: file});
                _self.set('file', null);
            });
        },
        /**
         * 上传文件
         * @param {String} id 文件id
         * @return {BUI.Uploader.UploadType.Flash}
         * @chainable
         */
        upload:function (file) {
            var _self = this,
                swfUploader = _self.get('swfUploader'),
                url = _self.get('url'),
                method = 'POST',
                data = _self.get('data'),
                name = _self.get('fileDataName');
            if(!file){
                return;
            }
            _self.set('file', file);
            swfUploader.upload(file.id, url, method, data, name);
            return _self;
        },
        /**
         * 停止上传文件
         * @return {BUI.Uploader.UploadType.Flash}
         * @chainable
         */
        cancel: function () {
            var _self = this,
                swfUploader = _self.get('swfUploader'),
                file = _self.get('file');
            if(file){
                swfUploader.cancel(file.id);
                _self.fire('cancel', {file: file});
                _self.set('file', null);
            }
            return _self;
        },
        /**
         * 应用是否有flash跨域策略文件
         * @private
         * 2014-01-13 应该判断swf的路径上提交上传接口的路径是否同域
         */
        _hasCrossdomain: function(){
            var _self = this,

                // http://g.tbcdn.cn/fi/bui/upload.php => ['http://g.tbcdn.cn/fi/bui/upload.php', 'http', 'g.tbcdn.cn']
                url = _self.get('url').match(HOSTNAME_SPLIT_REG) || [],
                flashUrl = _self.get('swfUploader').get('src').match(HOSTNAME_SPLIT_REG) || [],
                urlDomain = url[2],
                flashUrlDomain = flashUrl[2];

            //不同域时才去校验crossdomain
            if(urlDomain && flashUrlDomain && urlDomain !== flashUrlDomain){
                $.ajax({
                    url: url[1] + '://' + urlDomain + '/crossdomain.xml',
                    dataType:"xml",
                    error:function(){
                       BUI.log('缺少crossdomain.xml文件或该文件不合法！');
                    }
                });
            }
        }
    }, {ATTRS:{
        uploader: {
            setter: function(v){
                var _self = this;
                if(v && v.isController){
                    //因为flash上传需要依赖swfButton，所以是要等flash加载完成后才可以初始化的
                    var swfButton = v.get('button');
                    swfButton.on('swfReady', function(ev){
                        _self.set('swfUploader', ev.swfUploader);
                        _self._initSwfUploader();
                    });
                }
            }
        },
        /**
         * 服务器端路径，留意flash必须是绝对路径
         */
        url:{
            setter: function(v){
                var reg = /^http/;
                //不是绝对路径拼接成绝对路径
                if(!reg.test(v)){
                    //获取前面url部份
                    //修复下如下链接问题：http://a.b.com/a.html?a=a/b/c#d/e/f => http://a.b.com/a.html
                    var href = location.href.match(URI_SPLIT_REG) || [],
                        path = href[1] || '',
                        uris = path.split('/'),
                        newUris;
                    newUris  = BUI.Array.filter(uris,function(item,i){
                        return i < uris.length - 1;
                    });
                    v = newUris.join('/') + '/' + v;
                }
                return v;
            }
        },
        /**
         * ajbridge的uploader组件的实例，必须参数
         */
        swfUploader:{},
        /**
         * 正在上传的文件id
         */
        uploadingId : {},
        /**
         * 事件列表
         */
        events:{
            value: {
                //swf文件已经准备就绪
                swfReady: false,
                /**
                 * 上传正在上传时
                 * @event
                 * @param {Object} e 事件对象
                 * @param {Number} total 文件的总大小
                 * @param {Number} loaded 已经上传的大小
                 */
                progress: false
            }
        }
    }});
    return FlashType;
});
