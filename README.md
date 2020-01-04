# React技术栈实现新闻平台

> 项目地址：https://github.com/FlyLikeBird/react-news

> 部署在阿里云地址：http://www.renshanhang.site

## 安装步骤
    
    # 克隆项目仓库到本地
    git clone ...
    
    # 安装项目依赖
    npm i (or yarn)
    
    # 开启本地服务http://localhost:8081即可运行
    npm start

## 技术栈
* react
* react-router
* react-router-dom
* react-responsive
* react-loadable
* antd
* babel
* webpack
* webpack-dev-server
* mongoose
* express

前端部分

文章列表展示
文章分类
登录管理
权限管理
文章详情页展示
管理员文章管理
管理员标签管理
发文（支持MarkDown语法）
后端部分

mongoose数据库操作
路由管理
身份验证
基本的增删改查
...
## 功能描述：
  * 前端部分:
    - 分类浏览新闻/收藏新闻/发布心情的功能
    - 发布话题/收藏话题/关注话题的功能
    - 话题
    - 发布/收藏/关注话题的功能标签
    - 发布/收藏/关注话题的功能高鞥能
    - 发布/收藏/关注话题的功能
    - 评论新闻/话题，评论可@用户发出通知消息的功能
        根据关键词搜索新闻/话题/用户的功能
        个人中心的用户行为追踪功能
        分享新闻/话题/动态的社交功能
   * 后端部分:
        用户注册/登录的身份验证功能
        Article/Topic/User等collection的mongoose数据库操作
        express.Router实现路由管理
        话题的标签管理
        基于socket的实时消息机制
        
## 项目截图
项目首页
