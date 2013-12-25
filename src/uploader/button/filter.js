define('bui/uploader/button/filter',['bui/common'], function(require){

  var BUI = require('bui/common');

  var filter =  {
    msexcel: {
      type: "application/msexcel",
      ext: '.xls,.xlsx'
    },
    msword: {
      type: "application/msword",
      ext: '.doc,.docx'
    },
    // {type: "application/pdf"},
    // {type: "application/poscript"},
    // {type: "application/rtf"},
    // {type: "application/x-zip-compressed"},
    // {type: "audio/basic"},
    // {type: "audio/x-aiff"},
    // {type: "audio/x-mpeg"},
    // {type: "audio/x-pn/},realaudio"
    // {type: "audio/x-waw"},
    // image: {
    //   type: "image/*",
    //   ext: '.gif,.jpg,.png,.bmp'
    // },
    gif: {
      type: "image/gif",
      ext: '.gif'
    },
    jpeg: {
      type: "image/jpeg",
      ext: '.jpg'
    },
    // {type: "image/tiff"},
    bmp: {
      type: "image/x-ms-bmp",
      ext: '.bmp'
    },
    //{type: "image/x-photo-cd"},
    png: {
      type: "image/png",
      ext: '.png'
    }
    // {type: "image/x-portablebitmap"},
    // {type: "image/x-portable-greymap"},
    // {type: "image/x-portable-pixmap"},
    // {type: "image/x-rgb"},
    // {type: "text/html"},
    // {type: "text/plain"},
    // {type: "video/quicktime"},
    // {type: "video/x-mpeg2"},
    // {type: "video/x-msvideo"}
  }

  return {
    _getValueByDesc: function(desc, key){
      var value = [];
      if(BUI.isString(desc)){
        desc = desc.split(',');
      }
      if(BUI.isArray(desc)){
        BUI.each(desc, function(v, k){
          var item = filter[v];
          item && item[key] && value.push(item[key]);
        });
      }
      return value.join(',');
    },
    getTypeByDesc: function(desc){
      return this._getValueByDesc(desc, 'type');
    },
    getExtByDesc: function(desc){
      return this._getValueByDesc(desc, 'ext');
    },
    getTypeByExt: function(ext){
      var type = [];
      if(BUI.isString(ext)){
        ext = ext.split(',');
      };
      if(BUI.isArray(ext)){
        BUI.each(ext, function(e){
          BUI.each(filter, function(item, desc){
            if(BUI.Array.indexOf(e, item.ext.split(',')) > -1){
              type.push(item.type);
            }
          });
        });
      };
      return type.join(',');
    }
  }
});