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

BUI.use(['bui/uploader/button/htmlButton', 'bui/uploader/button/swfButton'], function(HtmlButton, SwfButton){
  var htmlButton = new HtmlButton({
      name: 'filedata',
      text: '请选择',
      buttonCls: 'button-cls',
      render: "#J_HtmlButton",
      filter: {desc: 'png'}
    }),
    swfButton = new SwfButton({
      render: '#J_SwfButton',
      text: '请选择'
    });

  htmlButton.render();
  swfButton.render();

  describe('测试HtmlButton', function(){
    var el = htmlButton.get('el');
    it('测试input是否生成功能', function(){
      expect(el.find('input').length).not.toBe(0);
    });
    it('测试buttonCls设置是否正确', function(){
      expect(el.find('.button-cls').length).not.toBe(0);
    })
    it('测试name是否设置正确', function(){
      expect(el.find('input').attr('name')).toBe(htmlButton.get('name'));
    });
    it('测试text是否设置正确', function(){
      expect(el.find('.bui-uploader-button-text').text()).toBe(htmlButton.get('text'));
    });
    it('测试文件多选是否OK', function(){
      expect(el.find('input').attr('multiple')).not.toBe(undefined);
    });
    it('测试文件类型是否OK', function(){
      expect(el.find('input').attr('accept')).not.toBe(undefined);
    });
  });

  describe('测试SwfButton', function(){
    var el = swfButton.get('el');
    it('测试swf是否生成成功', function(){
      expect(el.find('.uploader-button-swf').children().length).not.toBe(0);
    });
  });
})

// BUI.use(['bui/uploader'], function (Uploader) {
//   var uploader = new Uploader.Uploader({
//     render: '#J_Uploader',
//     queueTarget: '#J_UploaderQueue',
//     action: 'upload/upload.php',
//     buttonCls: 'defaultTheme-button',
//     filter: {ext:".jpg,.jpeg,.png,.gif,.bmp"},
//     multiple: true,
//     //type: 'flash'
//     text: '上传'
//   });
//   uploader.render();
//   var el = uploader.get('el');


//   new Uploader.Uploader({
//     render: '#J_UploaderFlash',
//     queueTarget: '#J_UploaderQueueFlash',
//     action: 'http://local.dev/git/bui/test/upload/upload.php',
//     buttonCls: 'defaultTheme-button',
//     multiple: true,
//     //filter: {desc:"JPG,PNG,GIF,BMP", ext:"*.jpg;*.jpeg;*.png;*.gif;*.bmp"},
//     filter: {ext:".jpg,.jpeg,.png,.gif,.bmp"},
//     type: 'flash'
//     // text: '上传'
//   }).render();

//   describe('测试DOM生成', function(){
//     it('render函数是否执行成功', function(){
//       //expect(el.children().length).not.toBe(0);
//     });
//   });
// });