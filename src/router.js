import express from 'express'
import queryString from 'querystring'
import mongodb from 'mongodb'
import fs from 'fs'
import Advert from './models/advert'

// 连接mongodb数据库

const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017' // 没有会自动新建

// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'myproject';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });

// 创建一个路由容器，将所有路由中间件挂在给路由容器
const router = express.Router()

// 涉及配置路由
router.get('/', (req, res, next) => {
  res.render('index.html')  // 不能省略.html等后缀,要写完整的

//   fs.readFile('./aaaa.txt', (err, data) => {
//     if (err) {
//       return next(err)
//     }
//     res.end('success')
//   })
})

// 演示使用
// router.get('/aa',(req,res,next)=>{
//     // res.render('index.html')  // 不能省略.html等后缀,要写完整的

// try {
//     JSON.parse('{dfafafa') // 触发错误

// } catch (e) {
//     next(e)

// }
// })


/* 
 * POST /advert/add
 * body:{
 *      title,image,link,start_time,end_time
 * }
*/
router.post('/advert/add', (req, res, next) => {
    // 1、接收表单提交的数据
  const body = req.body

    // 2、操作数据库
  const advert = new Advert({
    title: body.title,
    image: body.image,
    link: body.link,

    start_time: body.start_time,
    end_time: body.end_time
  })

  console.log('我要保存添加了')
  advert.save((err,result)=>{
      if(err){
         return next(err)
      }
      console.log(result,'添加数据')
      res.json({
          err_code:0
      })
  })




  /* 三部操作
    1： 接口客户端提交的数据
    2： 操作数据库
    3： 发送响应数据
 */

  // res.render('advert_list.html')
  // console.log('advert/add')
  // res.sendJson=function(obj){
  //     res.end(JSON.stringify(obj,null,'    '))
  // }

  // /* 数据库操作三部 */

  // // 1： 打开连接
  // MongoClient.connect(url,{useNewUrlParser:true ,useUnifiedTopology: true},(err,client)=>{
  //     if(err){
  //         throw err
  //     }
  // // 2：  操作数据库
  // const db = client.db('edu');
  // db
  // .collection('adverts')
  // .insertOne(req.body,(err,result)=>{
  //     if(err){

  //         // 当错误发生，调用当前错误对象传递给next
  //         // 然后会被app.use(err,req,res,next)中间件匹配到
  //         throw err
  //     }
  //     console.log(result)
  //     res.json({
  //         err_code:0 // 表示没有错误
  //     })
  // })

  // // 3：  关闭连接

  // client.close()
  // })

  // console.log(req.body)
  // res.json(req.body)
  // res.end(), res.write()只能接收字符串和二进制数据（buffer）两种数据类型
  // 对于发送响应的数据，本质上都是字符，即使传递的一个是字符串，在发送的时候，还是要转成二进制，网络传输二进制
  // res.end(req.body) // 直接这样发送一个对象，浏览器不能解析，需要转换如下
})


/* 
   查询：获取所有广告
 */
router.get('/advert/list',(req,res,next)=>{
    Advert.find((err,docs)=>{
        if(err){
            return next(err)
        }
        res.json({
            error_code:0,
            result:docs
        })
    })
})

// 查询某一条广告
router.get('/advert/id/:advertId',(req,res,next)=>{
    // console.log(req.params.advertId)
    // res.end(`路径参数id为：${req.params.advertId}`)

    Advert.findById(req.params.advertId,(err,result)=>{
        if(err){
            return next(err)
        }
        res.json({
            error_code:0,
            result: result
        })

    })

})


router.post('/advert/edit',(req,res,next)=>{
    Advert.findById(req.body.id,(err,advert)=>{
        if(err){
            return next(err)
        }

        const body=req.body
        advert.title= body.title,
        advert.image= body.image,
        advert.link= body.link,
        advert.start_time= body.start_time,
        advert.end_time= body.end_time

        advert.last_modified=Date.now()


        // 这里的save因为内部有一个_id ，所以在匹配到一样的，这里是不会新增数据的
        advert.save((err,result)=>{
            if(err){
                return next(err)
            }
           res.json({
               error_code:0
           })

        })
    })
})

router.get('/advert/remove/:advertId',(req,res,next)=>{
    Advert.remove({_id:req.params.advertId},(err)=>{
        if(err){
            return next(err)
        }
        console.log('删除成功')
        res.json({
            error_code:0
        })
    })
})

/*
 1：通过export default暴露的借口成员不能定义的同时直接暴露口
 2：最好先定义，再暴露
 3：export default 可以直接暴露字面量 {}、 123
*/

export default router
