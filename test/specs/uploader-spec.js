

BUI.use(['bui/uploader'], function (Uploader) {

  
  var uploader = new Uploader.Uploader({
    render: '#J_Uploader',
    queueTarget: '#J_UploaderQueue',
    url: 'upload/upload.php',
    buttonCls: 'defaultTheme-button',
    multiple: false//,
    //type: 'flash'
    // text: '上传'
  });
  uploader.render();
  var el = uploader.get('el');


  new Uploader.Uploader({
    render: '#J_UploaderFlash',
    queueTarget: '#J_UploaderQueueFlash',
    url: 'upload/upload.php',
    buttonCls: 'defaultTheme-button',
    multiple: false,
    type: 'flash'
    // text: '上传'
  }).render();

  describe('测试DOM生成', function(){
    it('render函数是否执行成功', function(){
      //expect(el.children().length).not.toBe(0);
    });
  });
});