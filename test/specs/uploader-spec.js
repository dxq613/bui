BUI.use(['bui/uploader/button/filter'], function(Filter){
  describe('测试获取文件类型', function(){
    it('getTypeByDesc函数是否正确', function(){
      expect(Filter.getTypeByDesc('gif')).toBe('image/gif');
      expect(Filter.getTypeByDesc(['gif'])).toBe('image/gif');
      expect(Filter.getTypeByDesc('gif,png')).toBe('image/gif,image/png');
    });

    it('getTypeByExt函数是否执行正确', function(){
      expect(Filter.getTypeByExt('.gif')).toBe('image/gif');
      expect(Filter.getTypeByExt(['.gif'])).toBe('image/gif');
      expect(Filter.getTypeByExt('.gif,.png')).toBe('image/gif,image/png');
    });

    it('getExtByDesc函数是否执行正确', function(){
      expect(Filter.getExtByDesc('gif')).toBe('.gif');
      expect(Filter.getExtByDesc(['gif'])).toBe('.gif');
      expect(Filter.getExtByDesc('gif,png')).toBe('.gif,.png');
    });
  });
});

//测试HtmlButton
BUI.use(['bui/uploader/button/htmlButton'], function(HtmlButton){
  var htmlButton = new HtmlButton({
      name: 'filedata',
      text: '请选择',
      render: "#J_HtmlButton",
      filter: {desc: 'png'}
    }).render();

  var el = htmlButton.get('el');

  describe('测试HtmlButton', function(){
    it('测试input是否生成功能', function(){
      expect(el.find('input').length).not.toBe(0);
    });
    it('测试name是否设置正确', function(){
      expect(el.find('input').attr('name')).toBe(htmlButton.get('name'));
    });
    it('测试text是否设置正确', function(){
      expect(el.find('.bui-uploader-button-text').text()).toBe(htmlButton.get('text'));
    });
    
    it('测试文件禁用是否OK', function(){
      expect(el.find('input').attr('multiple')).not.toBe(undefined);
    });
    it('测试文件类型是否OK', function(){
      expect(el.find('input').attr('accept')).not.toBe(undefined);
    });
  });

  describe('测试HtmlButton multiple属性', function(){
    it('测试初始是值是否正确', function(){
      expect(el.find('input').attr('multiple')).not.toBe(undefined);
    });
    it('设置为非多选', function(){
      htmlButton.set('multiple', false);
      expect(el.find('input').attr('multiple')).toBe(undefined);
    });
    it('设置为多选', function(){
      htmlButton.set('multiple', true);
      expect(el.find('input').attr('multiple')).not.toBe(undefined);
    });
  });

  describe('测试HtmlButton disalbed属性', function(){
    it('测试初始是值是否正确', function(){
      expect(el.find('input').css('display')).not.toBe('none');
    });
    it('禁用', function(){
      htmlButton.set('disabled', true);
      expect(el.find('input').css('display')).toBe('none');
    });
    it('启用', function(){
      htmlButton.set('disabled', false);
      expect(el.find('input').css('display')).not.toBe('none');
    });
  });
});


//测试SwfButton
BUI.use(['bui/uploader/button/swfButton'], function(SwfButton){
  var swfButton = new SwfButton({
      elCls: 'defaultTheme-button',
      render: '#J_SwfButton',
      text: '请选择',
      filter: {desc: 'png', ext: '.png'}
    }).render();
  var el = swfButton.get('el'),
    swfEl = swfButton.get('swfEl');

  describe('测试SwfButton', function(){
    it('测试swf是否生成成功', function(){
      expect(el.find('.uploader-button-swf').children().length).not.toBe(0);
    });
    it('测试text是否设置正确', function(){
      expect(el.find('.bui-uploader-button-text').text()).toBe(swfButton.get('text'));
    });
  });


  describe('测试SwfButton disalbed属性', function(){
    it('测试初始是值是否正确', function(){
      expect(swfEl.css('display')).not.toBe('none');
    });
    it('禁用', function(){
      swfButton.set('disabled', true);
      expect(swfEl.css('display')).toBe('none');
    });
    it('启用', function(){
      swfButton.set('disabled', false);
      expect(swfEl.css('display')).not.toBe('none');
    });
  });
})


BUI.use(['bui/uploader/type/flash'], function (Flash) {
  var flash = new Flash({
    url: '../upload.php?p=a/b/c#a/b/c'
  });

  describe('测试flash上传类型', function(){
    it('url的路径是否正确', function(){
      // expect(flash.get('url')).toBe('11');
    })
  });
});


BUI.use(['bui/uploader'], function (Uploader) {
  var uploader = new Uploader.Uploader({
    render: '#J_Uploader',
    url: 'upload/upload.php',
    button: {
      //filter: {desc:'image', ext:".jpg,.jpeg,.png,.gif,.bmp"}
    }
  });
  uploader.render();
  var el = uploader.get('el');

  describe('测试DOM生成', function(){
    it('render函数是否执行成功', function(){
    });
  });

  describe('测试disalbed属性', function(){
    it('初始值', function(){
      expect(uploader.get('button').get('disabled')).toBe(false);
    });
    it('禁用', function(){
      uploader.set('disabled', true);
      expect(uploader.get('button').get('disabled')).toBe(true);
    });
    it('启用', function(){
      uploader.set('disabled', false);
      expect(uploader.get('button').get('disabled')).toBe(false);
    });
  });
});

//测试flash上传类型
BUI.use(['bui/uploader'], function (Uploader) {
  var uploader = new Uploader.Uploader({
    render: '#J_UploaderFlash',
    type: 'flash',
    // disabled: true,
    // multiple: false,
    // queueTarget: '#J_UploaderQueue',
    url: 'upload/upload.php',
    button: {
      filter: {ext:".jpg,.jpeg,.png,.gif,.bmp"}//,
      // flashUrl: 'http://g.tbcdn.cn/fi/bui/uploader/uploader.swf'
    }
  });
  uploader.render();
  var el = uploader.get('el');

  describe('测试DOM生成', function(){
    it('render函数是否执行成功', function(){
      //expect(el.children().length).not.toBe(0);
    });
  });

  describe('测试disalbed属性', function(){
    it('初始值', function(){
      expect(uploader.get('button').get('disabled')).toBe(false);
    });
    it('禁用', function(){
      uploader.set('disabled', true);
      expect(uploader.get('button').get('disabled')).toBe(true);
    });
    it('启用', function(){
      uploader.set('disabled', false);
      expect(uploader.get('button').get('disabled')).toBe(false);
    });
  });
});

//测试iframe上传类型
BUI.use(['bui/uploader'], function (Uploader) {
  var uploader = new Uploader.Uploader({
    render: '#J_UploaderIframe',
    type: 'iframe',
    // disabled: true,
    // queueTarget: '#J_UploaderQueue',
    url: 'upload/upload.php',
    button: {
      filter: {ext:".jpg,.jpeg,.png,.gif,.bmp"}
    }
  });
  uploader.render();
  var el = uploader.get('el');

  describe('测试DOM生成', function(){
    it('render函数是否执行成功', function(){
      //expect(el.children().length).not.toBe(0);
    });
  });
});
