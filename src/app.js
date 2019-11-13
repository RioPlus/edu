// 導入需要的資源，包括自己定義的配置文件
import express from 'express'
import config from './config'

import fs from 'fs'
import nunjucks from 'nunjucks'
// import router from './router'
import indexRouter from './routes/index'
import advertRouter from './routes/advert'
import queryString from 'querystring'
import bodyParse from './middleware/body-parse'
import errLog from './middleware/error_log'

const path = require('path')

// 實例化一個服務對象
const app = express()

// console.log(config)

// 往外暴露靜態資源
app.use('/node_modules', express.static(config.node_modules_path)) // node_modules中的引入的靜態文件
app.use('/public', express.static(config.public_path)) // public中的引入的自己的靜態文件

// 設置views文件夾路徑，默認在根目錄下
app.set('views', config.viewPath)

// 配置ejs模板引擎，目前主要用來render頁面
// app.set('view engine','ejs')

/* 这里我们换一个模板引擎nunjucks，前提先安装到本地项目
   
*/
nunjucks.configure(config.viewPath, {
  autoescape: true,
  express: app,
  noCache: true // 禁止页面缓存，一般开发阶段需要true
})

// app.use((req, res, next) => {
//   // 由于表单post会携带大量数据，所以提交会分为多次提交
//   // 具体分为多少次提交不一定，取决于数据量的大小
//   // 在node中，对于处理这种不确定的数据，使用事件的形式处理
//   // 这里可以监听req对象的data事件，然后通过对应的回调函数中的参数chunk拿到每一次
//   // data 时间触发多少次不一定
//   // 当数据接收完毕，会自动触发req对象的end事件，然后就可以在end事件中使用接收到的数据
//   console.log('访问进来了')
//   let data = ''
//   req.on('data', chunk => {
//     data += chunk
//   })

//   req.on('end', () => {
//       // 手动给req对象挂载一个body属性，值就是当前表单post请求体对象
//       // 在后续的处理中间件中，就可以直接使用req.body
//       // 因为在同一个请求中，流通的都是同一个req和res对象
//       req.body=queryString.parse(data)
//       console.log(req.body)
//       next()
//   })
// })



// 涉及配置路由
// app.get('/',(req,res,next)=>{
//     res.render('index.html')  // nunjucks,不能省略.html等后缀,要写完整的
// })
/* 下面兩種區別: use不区分get和post
 use 是匹配 以什么路径开始  如下，/aa/b/c  也会执行
 get 会精确匹配路径
*/

// app.get('/aa',(req,res)=>{
//     res.end('hello get aa')
// })

// app.use('/a',(req,res,next)=>{
//     res.render('hello post a')
// })

// app.get('/a',(req,res,next)=>{
//     fs.readFile('./fafafa',(err,data)=>{
//         if(err){
//             next(err)
//         }
//     })
// })

/* 全局错误处理 中间件
注： 带参数的next智能被具有四个参数的（错误）处理中间件匹配到
    1：该中间件只能被带有参数的next才能调用到
    2：注意参数写全，四个参数，否则会当成普通中间件
    3：这个中间件就是用来全局统一处理错误的
    4：放的位置，路由最后
*/

// app.use((err,req,res,next)=>{
//     const err_log=`
//     ===============================
//     错误名：${err.name}
//     错误消息：${err.message}
//     错误堆栈：${err.stack}
//     错误时间；${new Date()}
//     ===============================\n\n\n
//     `
//  fs.appendFile(path.join(__dirname,'../err_log.txt'),err_log,err=>{
//   res.writeHead(500,{'Content-Type': 'text/html; charset=utf-8'})
//   res.end("500 服务器正忙，请稍后重试！",'utf8')
//     })

// })

/* 处理404 中间件 */

// app.use((req,res)=>{
//     res.end('404 not found')
// })


// 挂载解析表单 post 请求中间件
app.use(bodyParse)

// 挂载路由容器，（路由器中组织了网站功能处理路由中间件）
// app.use(router)
app.use(indexRouter)
app.use(advertRouter)

// 挂载错误处理中间件
app.use(errLog)

app.use((req,res,next)=>{
  res.end('404 not found!')
})

// 端口開啓服務
app.listen(3000, () => {
  console.log('server is run on port 3000')
})
