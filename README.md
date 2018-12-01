### 项目启动
1.安装 node，官网

2.安装 mongodb，这个自行 Google 吧。

3.进入 mongodb 终端命令，插入一条用户数据用于登录

```bash
use cms

db.users.insert({ account: 'admin', password: 123456, role: 'admin' })
```

4.新开一个终端，进入到项目目录，一定要在项目目录下执行

```bash
npm install

node app.js
````

5.然后去启动 [cms](https://github.com/xxxgitone/cms)，这个终端不要关闭