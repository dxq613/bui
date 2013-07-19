
BUI.use(['bui/uploader'], function (Uploader) {
  var uploader = new Uploader.Uploader({
    render: '#J_Uploader'//,
    // text: '上传'
  });
  uploader.render();
  var el = uploader.get('el');

  describe('测试DOM生成', function(){
    it('render函数是否执行成功', function(){
      //expect(el.children().length).not.toBe(0);
    });
  });
});
