/**
 * @fileoverview flash上传方案，基于龙藏写的ajbridge内的uploader
 * @author 剑平（明河）<minghe36@126.com>
 **/
define('bui/uploader/type/flash', function (require) {
    var LOG_PREFIX = '[uploader-FlashType]:';

    var UploadType = require('bui/uploader/type/base');

    /**
     * @name FlashType
     * @class flash上传方案，基于龙藏写的ajbridge内的uploader
     * @constructor
     * @extends UploadType
     * @requires Node
     */
    function FlashType(config) {
        var self = this;
        //调用父类构造函数
        FlashType.superclass.constructor.call(self, config);
        self.isHasCrossdomain();
    }

    BUI.mix(FlashType, /** @lends FlashType.prototype*/{
        /**
         * 事件列表
         */
        event:BUI.merge(UploadType.event, {
            //swf文件已经准备就绪
            SWF_READY: 'swfReady',
            //正在上传
            PROGRESS:'progress'
        })
    });

    BUI.extend(FlashType, UploadType, /** @lends FlashType.prototype*/{
        /**
         * 初始化
         */
        _initSwfUploader:function () {
            var _self = this, swfUploader = _self.get('swfUploader');
            if(!swfUploader){
                BUI.log(LOG_PREFIX + 'swfUploader对象为空！');
                return false;
            }
            //SWF 内容准备就绪
            swfUploader.on('contentReady', function(ev){
                _self.fire(FlashType.event.SWF_READY);
            });
            //监听开始上传事件
            swfUploader.on('uploadStart', function(ev){
                var file = _self.get('file');
                _self.fire(UploadType.event.START, {file: file});
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
                _self.fire(FlashType.event.PROGRESS, { 'loaded':ev.loaded, 'total':ev.total });
            });
            //监听文件上传完成事件
            swfUploader.on('uploadCompleteData', function(ev){
                var result = _self._processResponse(ev.data);
                if(result && result.status === 1){
                    _self.fire(FlashType.event.SUCCESS, {result: result});
                }
                else{
                    _self.fire(FlashType.event.ERROR, {result: result});
                }
                _self.set('file', null);
            });
            //监听文件失败事件
            swfUploader.on('uploadError',function(){
                _self.set('file', file);
                _self.fire(FlashType.event.ERROR, {msg : ev.msg});
            });
        },
        /**
         * 上传文件
         * @param {String} id 文件id
         * @return {FlashType}
         */
        upload:function (file) {
            var _self = this,
                swfUploader = _self.get('swfUploader'),
                action = _self.get('action'),
                method = 'POST',
                data = _self.get('data'),
                name = _self.get('fileDataName');
            if(!file){
                return;
            }
            _self.set('file', file);
            swfUploader.upload(file.id, action, method, data, name);
            return _self;
        },
        /**
         * 停止上传文件
         * @return {FlashType}
         */
        cancel: function () {
            var _self = this,
                swfUploader = _self.get('swfUploader'),
                file = _self.get('file');
            if(file){
                swfUploader.cancel(file.id);
                _self.fire(FlashType.event.CANCEL, {file: file});
                _self.set('file', null);
            }
            return _self;
        },
        /**
         * 应用是否有flash跨域策略文件
         */
        isHasCrossdomain:function(){
            var domain = location.hostname;
             $.ajax({
                 url:'http://' + domain + '/crossdomain.xml',
                 dataType:"xml",
                 error:function(){
                     BUI.log('缺少crossdomain.xml文件或该文件不合法！');
                 }
             });
        }
    }, {ATTRS:/** @lends FlashType*/{
        uploader: {
            setter: function(v){
                var _self = this;
                if(v){
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
        action:{
            getter:function(v){
                var reg = /^http/;
                //不是绝对路径拼接成绝对路径
                if(!reg.test(v)){
                     var href = location.href,uris = href.split('/'),newUris;
                    newUris  = BUI.Array.filter(uris,function(item,i){
                        return i < uris.length - 1;
                    });
                    v = newUris.join('/') + '/' + v;
                }
                return v;
            }
        },
        fileDataName: {
            value: 'Filedata'
        },
        /**
         * ajbridge的uploader组件的实例，必须参数
         */
        swfUploader:{},
        /**
         * 正在上传的文件id
         */
        uploadingId : {}
    }});
    return FlashType;
});