/**
 * @fileoverview iframe方案上传
 * @ignore
 **/
define('bui/uploader/type/iframe',['./base'], function(require) {
    var ID_PREFIX = 'bui-uploader-iframe-';

    var UploadType = require('bui/uploader/type/base');
    /**
     * @class BUI.Uploader.UploadType.Iframe
     * iframe方案上传，全浏览器支持
     * @extends BUI.Uploader.UploadType
     *
     */
    function IframeType(config) {
        var _self = this;
        //调用父类构造函数
        IframeType.superclass.constructor.call(_self, config);
    }

    //继承于Base，属性getter和setter委托于Base处理
    BUI.extend(IframeType, UploadType,{
        /**
         * 上传文件
         * @param {HTMLElement} fileInput 文件input
         */
        upload : function(file) {
            var _self = this,
                input = file.input,
                form;
            if (!file){
                return false
            };
            _self.fire('start', {file: file});
            _self.set('file', file);
            _self.set('fileInput', input);
            //创建iframe和form
            _self._create();
            form = _self.get('form');
            //提交表单到iframe内
            form && form[0].submit();
        },
        /**
         * 取消上传
         * @return {BUI.Uploader.UploadType.Iframe}
         */
        cancel : function() {
            var self = this,iframe = self.get('iframe');
            //iframe.attr('src', 'javascript:"<html></html>";');
            self.reset();
            self.fire('cancel');
            // self.fire('error', {status : 'abort',msg : '上传失败，原因：abort'});
            return self;
        },
        /**
         * 将参数数据转换成hidden元素
         * @param {Object} data 对象数据
         * @return {String} hiddenInputHtml hidden元素html片段
         */
        dataToHidden : function(data) {
            if (!$.isPlainObject(data) || $.isEmptyObject(data)) return '';
            var self = this,
                hiddenInputHtml = [],
                //hidden元素模板
                tpl = self.get('tpl'),
                hiddenTpl = tpl.HIDDEN_INPUT;
            if (!BUI.isString(hiddenTpl)) return '';
            for (var k in data) {
                hiddenInputHtml.push(BUI.substitute(hiddenTpl, {'name' : k,'value' : data[k]}));
            }
            return hiddenInputHtml.join();
        },
        /**
         * 创建一个空的iframe，用于文件上传表单提交后返回服务器端数据
         * @return {NodeList}
         */
        _createIframe : function() {
            var self = this,
                //iframe的id
                id = ID_PREFIX + BUI.guid(),
                //iframe模板
                tpl = self.get('tpl'),
                iframeTpl = tpl.IFRAME,
                existIframe = self.get('iframe'),
                iframe;
            //先判断是否已经存在iframe，存在直接返回iframe
            if (!$.isEmptyObject(existIframe)) return existIframe;

            //创建处理上传的iframe
            iframe = $(BUI.substitute(tpl.IFRAME, { 'id' : id }));
            //监听iframe的load事件
            $('body').append(iframe);
            iframe.on('load', function(ev){
                self._iframeLoadHandler(ev);
            });
            self.set('id',id);
            self.set('iframe', iframe);
            return iframe;
        },
        /**
         * iframe加载完成后触发（文件上传结束后）
         */
        _iframeLoadHandler : function(ev) {
            var self = this,iframe = ev.target,
                doc = iframe.contentDocument || window.frames[iframe.id].document,
                result;
            if (!doc || !doc.body) {
                self.fire('error', {msg : '服务器端返回数据有问题！'});
                return false;
            }
            var response = doc.body.innerHTML;
            //输出为直接退出
            if(response == ''){
                self.fire('error');
                return;
            };
            result = self._processResponse(response);

            self.fire('complete', {result: result, file: self.get('file')});
            self.reset();
        },
        /**
         * 创建文件上传表单
         * @return {NodeList}
         */
        _createForm : function() {
            var self = this,
                //iframe的id
                id = self.get('id'),
                //form模板
                tpl = self.get('tpl'),formTpl = tpl.FORM,
                //想要传送给服务器端的数据
                data = self.get('data'),
                //服务器端处理文件上传的路径
                action = self.get('url'),
                fileInput = self.get('fileInput'),
                hiddens,
                form;
            if (!BUI.isString(formTpl)) {
                return false;
            }
            if (!BUI.isString(action)) {
                return false;
            }
            hiddens = self.dataToHidden(data);
            hiddens += self.dataToHidden({"type":"iframe"});
            form = BUI.substitute(formTpl, {'action' : action,'target' : id,'hiddenInputs' : hiddens});
            //克隆文件域，并添加到form中
            form = $(form).append(fileInput);
            $('body').append(form);
            self.set('form', form);
            return form;
        },
        /**
         * 创建iframe和form
         */
        _create : function() {
            var _self = this,
                iframe = _self._createIframe(),
                form = _self._createForm();

            _self.fire('create', {iframe : iframe,form : form});
        },
        /**
         * 移除表单
         */
        _remove : function() {
            var self = this,form = self.get('form');
            if(!form)return false;
            //移除表单
            form.remove();
            //重置form属性
            self.set('form', null);
            self.fire('remove', {form : form});
        },
        reset: function(){
            var _self = this;
            _self._remove();
            _self.set('file', null);
        }
    }, {ATTRS : {
        /**
         * iframe方案会用到的html模板，一般不需要修改
         * @type {String}
         * @default
         * {
         *   IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
         *   FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}">{hiddenInputs}</form>',
         *   HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
         * }
         */
        tpl: {
            value: {
                IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
                FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}" style="visibility: hidden;">{hiddenInputs}</form>',
                HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
            }
        },
        /**
         * 只读，创建的iframeid,id为组件自动创建
         * @type {String}
         * @default  'ks-uploader-iframe-' +随机id
         */
        id: {value : ID_PREFIX + BUI.guid()},
        /**
         * iframe
         */
        iframe: {value : {}},
        form: {},
        fileInput: {},
        events: {
            value: {
                /**
                 * 创建iframe和form后触发
                 * @event
                 * @param {Object} e 事件对象
                 */
                create: false,
                /**
                 * 删除form后触发
                 * @event
                 * @param {Object} e 事件对象
                 */
                remove: false
            }
        }
    }});

    return IframeType;
});
