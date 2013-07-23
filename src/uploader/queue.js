/**
 * @fileoverview 文件上传队列列表显示和处理
 * @author 剑平（明河）<minghe36@126.com>,紫英<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.4/queue', function (S, Node, Base) {
    var EMPTY = '', $ = Node.all, LOG_PREFIX = '[uploader-queue]:';

    /**
     * 转换文件大小字节数
     * @param {Number} bytes 文件大小字节数
     * @return {String} 文件大小
     */
    function convertByteSize(bytes) {
        var i = -1;
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
    }

    /**
     * @name Queue
     * @class 文件上传队列，用于存储文件数据
     * @constructor
     * @extends Base
     * @param {Object} config Queue没有必写的配置
     * @param {Uploader} config.uploader Uploader的实例
     * @example
     * S.use('gallery/uploader/1.4/queue/base,gallery/uploader/1.4/themes/default/style.css', function (S, Queue) {
     *    var queue = new Queue();
     *    queue.render();
     * })
     */
    function Queue(config) {
        var self = this;
        //调用父类构造函数
        Queue.superclass.constructor.call(self, config);
    }

    S.mix(Queue, /**@lends Queue*/ {
        /**
         * 支持的事件
         */
        event:{
            //添加完文件后触发
            ADD:'add',
            //批量添加文件后触发
            ADD_FILES:'addFiles',
            //删除文件后触发
            REMOVE:'remove',
            //清理队列所有的文件后触发
            CLEAR:'clear',
            //当改变文件状态后触发
            FILE_STATUS : 'statusChange',
            //更新文件数据后触发
            UPDATE_FILE : 'updateFile'
        },
        /**
         * 文件的状态
         */
        status:{
            WAITING : 'waiting',
            START : 'start',
            PROGRESS : 'progress',
            SUCCESS : 'success',
            CANCEL : 'cancel',
            ERROR : 'error',
            RESTORE: 'restore'
        },
        //文件唯一id前缀
        FILE_ID_PREFIX:'file-'
    });
    /**
     * @name Queue#add
     * @desc  添加完文件后触发
     * @event
     * @param {Number} ev.index 文件在队列中的索引值
     * @param {Object} ev.file 文件数据
     */
    /**
     * @name Queue#addFiles
     * @desc  批量添加文件后触发
     * @event
     * @param {Array} ev.files 添加后的文件数据集合
     */
    /**
     * @name Queue#remove
     * @desc  删除文件后触发
     * @event
     * @param {Number} ev.index 文件在队列中的索引值
     * @param {Object} ev.file 文件数据
     */
    /**
     * @name Queue#clear
     * @desc  清理队列所有的文件后触发
     * @event
     */
    /**
     * @name Queue#statusChange
     * @desc  当改变文件状态后触发
     * @event
     * @param {Number} ev.index 文件在队列中的索引值
     * @param {String} ev.status 文件状态
     */
    /**
     * @name Queue#updateFile
     * @desc  更新文件数据后触发
     * @event
     * @param {Number} ev.index 文件在队列中的索引值
     * @param {Object} ev.file 文件数据
     */
    //继承于Base，属性getter和setter委托于Base处理
    S.extend(Queue, Base, /** @lends Queue.prototype*/{
        /**
         * 向上传队列添加文件
         * @param {Object | Array} files 文件数据，传递数组时为批量添加
         * @example
         * //测试文件数据
 var testFile = {'name':'test.jpg',
     'size':2000,
     'input':{},
     'file':{'name':'test.jpg', 'type':'image/jpeg', 'size':2000}
 };
 //向队列添加文件
 queue.add(testFile);
         */
        add:function (files, callback) {
            var self = this,fileData={};
            //如果存在多个文件，需要批量添加文件
            if (files.length > 0) {
                fileData=[];
                var uploader =self.get('uploader');
                var len = self.get('files').length;
                var hasMax = uploader.get('max') > 0;
                S.each(files,function(file, index){
                    if(!hasMax){
                        fileData.push(self._addFile(file));
                    }else{
                        //增加是否超过判断
                        //#128 https://github.com/kissyteam/kissy-gallery/issues/128 by 翰文
                        var max = uploader.get('max');
                        if (max >= len + index + 1) {
                            fileData.push(self._addFile(file));
                        }
                    }
                });
            } else {
                fileData = self._addFile(files);
            }
            callback && callback.call(self);
            return fileData;
        },
        /**
         * 向队列添加单个文件
         * @param {Object} file 文件数据
         * @param {Function} callback 添加完成后执行的回调函数
         * @return {Object} 文件数据对象
         */
        _addFile:function (file,callback) {
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '_addFile()参数file不合法！');
                return false;
            }
            var self = this,
                //设置文件对象
                fileData = self._setAddFileData(file),
                //文件索引
                index = self.getFileIndex(fileData.id),
                fnAdd = self.get('fnAdd');
            //执行用户自定义的回调函数
            if(S.isFunction(fnAdd)){
                fileData = fnAdd(index,fileData);
            }
            self.fire(Queue.event.ADD, {index:index, file:fileData,uploader:self.get('uploader')});
            callback && callback.call(self, index, fileData);
            return fileData;
        },
        /**
         * 删除队列中指定id的文件
         * @param {Number} indexOrFileId 文件数组索引或文件id
         * @param {Function} callback 删除元素后执行的回调函数
         * @example
         * queue.remove(0);
         */
        remove:function (indexOrFileId, callback) {
            var self = this, files = self.get('files'), file;
            //参数是字符串，说明是文件id，先获取对应文件数组的索引
            if (S.isString(indexOrFileId)) {
                indexOrFileId = self.getFileIndex(indexOrFileId);
            }
            //文件数据对象
            file = files[indexOrFileId];
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + 'remove()不存在index为' + indexOrFileId + '的文件数据');
                return false;
            }
            //将该id的文件过滤掉
            files = S.filter(files, function (file, i) {
                return i !== indexOrFileId;
            });
            self.set('files', files);
            self.fire(Queue.event.REMOVE, {index:indexOrFileId, file:file});
            callback && callback.call(self,indexOrFileId, file);
            return file;
        },
        /**
         * 清理队列
         */
        clear:function () {
            var self = this, files;
            _remove();
            //移除元素
            function _remove() {
                files = self.get('files');
                if (!files.length) {
                    self.fire(Queue.event.CLEAR);
                    return false;
                }
                self.remove(0, function () {
                    _remove();
                });
            }
        },
        /**
         * 获取或设置文件状态，默认的主题共有以下文件状态：'waiting'、'start'、'progress'、'success'、'cancel'、'error' ,每种状态的dom情况都不同，刷新文件状态时候同时刷新状态容器类下的DOM节点内容。
         * @param {Number} index 文件数组的索引值
         * @param {String} status 文件状态
         * @return {Object}
         * @example
         * queue.fileStatus(0, 'success');
         */
        fileStatus:function (index, status, args) {
            if (!S.isNumber(index)) return false;
            var self = this, file = self.getFile(index),
                theme = self.get('theme'),
                curStatus,statusMethod;
            if (!file) return false;
            //状态
            curStatus = file['status'];
            if(!status){
                return curStatus;
            }
            //状态一直直接返回
            if(curStatus == status) return self;
            //更新状态
            self.updateFile(index,{status:status});
            self.fire(Queue.event.FILE_STATUS,{index : index,status : status,args:args,file:file});
            return  self;
        },
        /**
         * 获取指定索引值的队列中的文件
         * @param  {Number} index 文件在队列中的索引
         * @return {Object}
         */
        getFile:function (index) {
            if (!S.isNumber(index)) return false;
            var self = this, files = self.get('files'),
                file = files[index];
            if (!S.isPlainObject(file)){
                file = {};
            }
            return file;
        },
        /**
         * 根据文件id来查找文件在队列中的索引
         * @param {String} fileId 文件id
         * @return {Number} index
         */
        getFileIndex:function (fileId) {
            var self = this, files = self.get('files'), index = -1;
            S.each(files, function (file, i) {
                if (file.id == fileId) {
                    index = i;
                    return true;
                }
            });
            return index;
        },
        /**
         * 更新文件数据对象，你可以追加数据
         * @param {Number} index 文件数组内的索引值
         * @param {Object} data 数据
         * @return {Object}
         */
        updateFile:function (index, data) {
            if (!S.isNumber(index)) return false;
            if (!S.isObject(data)) {
                S.log(LOG_PREFIX + 'updateFile()的data参数有误！');
                return false;
            }
            var self = this, files = self.get('files'),
                file = self.getFile(index);
            if (!file) return false;
            S.mix(file, data);
            files[index] = file;
            self.set('files', files);
            self.fire(Queue.event.UPDATE_FILE,{index : index, file : file});
            return file;
        },
        /**
         * 获取等指定状态的文件对应的文件数组index的数组
         * @param {String} type 状态类型
         * @return {Array}
         * @example
         * //getFiles()和getFileIds()的作用是不同的，getFiles()类似过滤数组，获取的是指定状态的文件数据，而getFileIds()只是获取指定状态下的文件对应的在文件数组内的索引值。
         * var indexs = queue.getFileIds('waiting');
         */
        getIndexs:function (type) {
            var self = this, files = self.get('files'),
                status, indexs = [];
            if (!files.length) return indexs;
            S.each(files, function (file, index) {
                if (S.isObject(file)) {
                    status = file.status;
                    //文件状态
                    if (status == type) {
                        indexs.push(index);
                    }
                }
            });
            return indexs;
        },
        /**
         * 获取指定状态下的文件
         * @param {String} status 状态类型
         * @return {Array}
         * @example
         * //获取等待中的所有文件
         * var files = queue.getFiles('waiting');
         */
        getFiles:function (status) {
            var self = this, files = self.get('files'), statusFiles = [];
            if (!files.length) return [];
            S.each(files, function (file) {
                if (file && file.status == status) statusFiles.push(file);
            });
            return statusFiles;
        },
        /**
         * 添加文件时先向文件数据对象追加id、size等数据
         * @param {Object} file 文件数据对象
         * @return {Object} 新的文件数据对象
         */
        _setAddFileData:function (file) {
            var self = this,
                files = self.get('files');
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '_updateFileData()参数file不合法！');
                return false;
            }
            //设置文件唯一id
            if (!file.id) file.id = S.guid(Queue.FILE_ID_PREFIX);
            //转换文件大小单位为（kb和mb）
            if (file.size) file.textSize = convertByteSize(file.size);
            //状态
            file.status = 'waiting';
            files.push(file);
            return file;
        }
    }, {ATTRS:/** @lends Queue.prototype*/{
        /**
         * 添加完文件数据后执行的回调函数，会在add事件前触发
         * @type Function
         * @default  ''
         */
        fnAdd:{value:EMPTY},
        /**
         * 队列内所有文件数据集合
         * @type Array
         * @default []
         * @example
         * var ids = [],
         files = queue.get('files');
         S.each(files, function (file) {
         ids.push(file.id);
         });
         alert('所有文件id：' + ids);
         */
        files:{value:[]},
        /**
         * 该队列对应的Uploader实例
         * @type Uploader
         * @default ""
         */
        uploader:{value:EMPTY}
    }});

    return Queue;
}, {requires:['node', 'base']});
/**
 * changes:
 * 明河：1.4
 *           - 去掉与Theme的耦合
 *           - 去掉restore
 */