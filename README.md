bui
===

基于jQuery的富客户端控件库
- [文档库地址](http://www.builive.com/)
- [应用代码](https://github.com/dxq613/bui-default)
- [API代码](https://github.com/dxq613/bui-docs)
- [License](https://github.com/dxq613/bui/wiki/License)
- [提交代码流程](CONTRIBUTING.md)

## 文件结构

- assets : css文件，基于bootstrap的css样式，可以自己在此基础上编译出新的版本
- build : js 和 css文件打包好的目录
- src: js 的源文件
- test: 单元测试，所有控件的单元测试都在内部，以php的方式提供
- tools : 文件打包，以及生成文件的工具
- docs ： 源文件中未提供，但是可以自己执行 tools/jsduck/run.bat文件，请不要提交此文件夹

## 打包

### 源文件的编译包括：

- 合并js，压缩js
- 编译less生成 css,压缩css
- 复制文件，将所有js合并成一个bui.js
- 执行build.bat文件

### 生成文档：

- 使用jsduck 进行编译文档，tools/jsduck/run.bat
- 配置文件在tools/jsduck/config.json
- 如果不想配置环境，请下载[文档API](https://github.com/dxq613/bui-docs)

## 文档地址

- [dpl 地址](http://www.builive.com/)
- [控件库demo](http://www.builive.com/demo/index.php)
- [控件库API](http://www.builive.com/docs/index.html)
- [集成的应用](http://www.builive.com/application/back.php)

## 提交问题
[提问](https://github.com/dxq613/bui/issues)

## 联系我们

- 论坛：http://bbs.builive.com
- 旺旺群号： 778141976
- QQ群：138692365