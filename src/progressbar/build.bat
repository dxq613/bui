@echo off

set ANT_BIN=..\..\tools\ant\bin\ant.bat

if not exist "%ANT_BIN%" goto NO_ANT
if not exist "build.xml" goto NO_BUILD

call %ANT_BIN% -buildfile build.xml
GOTO END

:NO_ANT
	echo.
	echo **** 请安装 OurTools 后再运行
    echo **** 下载地址：http://wiki.ued.taobao.net/doku.php?id=f2e:tools
	echo.
    goto END

:NO_BUILD
    echo.
	echo **** 该目录下没有找到 build.xml 文件
	echo.

:END
    pause
