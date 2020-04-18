# moe-plus概述

moe-plus是一个基于html5+以及vue为底层，根据环境自动切换对应的runtime，使得开发者能够通过编写一套代码实现跨平台（H5、安卓、IOS）开发

在我看来，moe-plus并不属于框架，moe-plus更像是两者之间的一个桥梁，开发者通过moe-plus进行开发时无需关心两方的实现差异部分（平台差异除外）

比如在页面的跳转的处理上，当在app环境中，moe-plus会调用5+中的webview来进行跳转、新开页面，而在html环境下则会调用vue-router来实现

成熟案例：[学拓帮](http://download.ewsedu.com/app/ehome)

# 开发相关

项目根目录为app端的基座目录，实际的开发目录在src/中（vue应用）

# 调试、发布相关

npm run dev: 运行开发模式以及启动前端服务

npm run build: 打包发布

npm rub config: 创建配置文件

日常开发中，只需要通过run dev启动服务后，像正常vue应用调试即可

当需要使用app进行调试时，则可通过hbuilder/hbuilderX进行发布/运行调试

当发布更新时，可通过hbuilder发布wgt包进行远程更新
