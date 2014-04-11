
describe('测试kissy加载',function(){
  var form;
  KISSY.use(['core','bui/form'],function (S,Form) {
    form = Form;
  });
    it('issue127,测试加载模块',function(){
      waits(500);
      runs(function(){
        expect(form).not.toBe(undefined);
      });
      
    });
});
