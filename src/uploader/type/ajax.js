/**
 * @fileoverview ajax方案上传
 * @author 剑平（明河）<minghe36@126.com>,紫英<daxingplay@gmail.com>
 **/
define('bui/uploader/type/ajax',function(require) {
    var EMPTY = '', LOG_PREFIX = '[uploader-AjaxType]:',
        win = window,
        doc = document;

    var UploadType = require('bui/uploader/type/base');

    function isSubDomain(hostname){
        return win.location.host === doc.domain;
    }

    function endsWith (str, suffix) {
        var ind = str.length - suffix.length;
        return ind >= 0 && str.indexOf(suffix, ind) == ind;
    }

    /**
     * @name AjaxType
     * @class ajax方案上传
     * @constructor
     * @requires UploadType
     */
    function AjaxType(config) {
        var self = this;
        //调用父类构造函数
        AjaxType.superclass.constructor.call(self, config);
    }

    BUI.mix(AjaxType, /** @lends AjaxType.prototype*/{
        /**
         * 事件列表
         */
        event : BUI.merge(UploadType.event, {
            PROGRESS : 'progress'
        })
    });
    //继承于Base，属性getter和setter委托于Base处理
    BUI.extend(AjaxType, UploadType, /** @lends AjaxType.prototype*/{
        /**
         * 上传文件
         * @param {Object} File
         * @return {AjaxType}
         */
        upload : function(file) {
            //不存在文件信息集合直接退出
            if (!file || !file.file) {
                BUI.log(LOG_PREFIX + 'upload()，fileData参数有误！');
                return false;
            }
            var self = this;
            self.set('file', file);
            self.fire(UploadType.event.START, {file: file});
            self._setFormData();
            self._addFileData(file.file);
            self.send();
            return self;
        },
        /**
         * 停止上传
         * @return {AjaxType}
         */
        cancel : function() {
            var self = this,
                xhr = self.get('xhr'),
                file = self.get('file');
            if (!BUI.isObject(xhr)) {
                BUI.log(LOG_PREFIX + 'cancel()，io值错误！');
                return false;
            }
            //中止ajax请求，会触发error事件
            xhr.abort();
            self.fire(AjaxType.event.CANCEL, {file: file});
            self.set('file', null);
            return self;
        },
        /**
         * 发送ajax请求
         * @return {AjaxType}
         */
        send : function() {
            var self = this,
                //服务器端处理文件上传的路径
                url = self.get('url'),
                data = self.get('formData'),
                file = self.get('file');
            var xhr = new XMLHttpRequest();
            //TODO:如果使用onProgress存在第二次上传不触发progress事件的问题
            xhr.upload.addEventListener('progress',function(ev){
                self.fire(AjaxType.event.PROGRESS, { 'loaded': ev.loaded, 'total': ev.total });
            });
            xhr.onload = function(ev){
                var result = self._processResponse(xhr.responseText);
                if(result && result.status === 1){
                    self.fire(AjaxType.event.SUCCESS, {result : result, file: file});
                }
                else{
                    self.fire(AjaxType.event.ERROR, {result : result, file: file});
                }
                self.fire('complete', {result: result, file: file});
            };
            xhr.onerror = function(ev){
                self.fire(AjaxType.event.ERROR, {file: file});
                self.fire('complete', {file: file});
            }
            xhr.open("POST", url, true);
            data.append("type", "ajax");
            xhr.send(data);
            // 重置FormData
            self._setFormData();
            self.set('xhr',xhr);
            return self;
        },
        /**
         * 设置FormData数据
         */
        _setFormData:function(){
            var self = this;
            try{
            	self.set('formData', new FormData());
                self._processData();
            }catch(e){
            	BUI.log(LOG_PREFIX + 'something error when reset FormData.');
            	BUI.log(e, 'dir');
           }
        },
        /**
         * 处理传递给服务器端的参数
         */
        _processData : function() {
            var self = this,data = self.get('data'),
                formData = self.get('formData');
            //将参数添加到FormData的实例内
            BUI.each(data, function(val, key) {
                formData.append(key, val);
            });
            self.set('formData', formData);
        },
        /**
         * 将文件信息添加到FormData内
         * @param {Object} file 文件信息
         */
        _addFileData : function(file) {
            if (!file) {
                BUI.log(LOG_PREFIX + '_addFileData()，file参数有误！');
                return false;
            }
            var self = this,
                formData = self.get('formData'),
                fileDataName = self.get('fileDataName');
            formData.append(fileDataName, file);
            self.set('formData', formData);
        }
    }, {ATTRS : /** @lends AjaxType*/{
        /**
         * 表单数据对象
         */
        formData: {
        },
        data: {
        },
        xhr: {
        },
        subDomain: {
            value: {
                proxy: '/sub_domain_proxy.html'
            }
        }
    }
    });
    return AjaxType;
});