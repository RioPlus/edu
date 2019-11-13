import express from 'express'
import Advert from './../models/advert'
import formidable from 'formidable'
import config from '../config'
import { basename } from 'path'

// 连接mongodb数据库

// 创建一个路由容器，将所有路由中间件挂在给路由容器
const router = express.Router()

router.get('/advert', (req, res, next) => {
  const page_num = Number.parseInt(req.query.page, 10)
  const page_size = 5

  Advert.find() // 先去查询所有
    .skip((page_num - 1) * page_size) // 跳过多少条数据
    .limit(page_size) // 需要显示多少条数据
    .exec((err, result) => {
      if (err) {
        return next(err)
      }

      Advert.countDocuments((err, count) => {
        if (err) {
          return next(err)
        }
        const totalPage = Math.ceil(count / page_size) // 总页码=总记录数 / 每页记录数
        res.render('advert_list.html', { adverts: result, totalPage: totalPage,page:page_num})
      })

     
    }) // 执行

  // Advert.find((err,adverts)=>{
  //   if(err){
  //     return next(err)
  //   }
  //   res.render('advert_list.html',{
  //     adverts:adverts
  //   })
  // })
})

router.get('/advert/add', (req, res, next) => {
  res.render('advert_add.html')
})

router.post('/advert/add', (req, res, next) => {
  console.log('进来了11')

  const form = new formidable()

  form.uploadDir = config.uploadDir
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err)
    }

    const body = fields

    body.image = basename(files.image.path)
    // console.log('body:' + JSON.stringify(body))
    // console.log("files："+JSON.stringify(files))
    console.log('body:' + body)

    // 2、操作数据库
    const advert = new Advert({
      title: body.title,
      image: body.image,
      link: body.link,

      start_time: body.start_time,
      end_time: body.end_time
    })

    advert.save((err, result) => {
      if (err) {
        return next(err)
      }
      console.log(result, '添加数据')
      res.json({
        error_code: 0
      })
    })
  })

  //   // 1、接收表单提交的数据
  //   const body = req.body

  //   // 2、操作数据库
  //   const advert = new Advert({
  //     title: body.title,
  //     image: body.image,
  //     link: body.link,

  //     start_time: body.start_time,
  //     end_time: body.end_time
  //   })

  //   advert.save((err, result) => {
  //     if (err) {
  //       return next(err)
  //     }
  //     console.log(result, '添加数据')
  //     res.json({
  //       error_code: 0
  //     })
  //   })
})
/*
   查询：获取所有广告
 */
router.get('/advert/list', (req, res, next) => {
  Advert.find((err, docs) => {
    if (err) {
      return next(err)
    }
    res.json({
      error_code: 0,
      result: docs
    })
  })
})

/* 查询某一条广告 */

router.get('/advert/id/:advertId', (req, res, next) => {
  // console.log(req.params.advertId)
  // res.end(`路径参数id为：${req.params.advertId}`)

  Advert.findById(req.params.advertId, (err, result) => {
    if (err) {
      return next(err)
    }
    res.json({
      error_code: 0,
      result: result
    })
  })
})

router.post('/advert/edit', (req, res, next) => {
  Advert.findById(req.body.id, (err, advert) => {
    if (err) {
      return next(err)
    }

    const body = req.body
    ;(advert.title = body.title),
    (advert.image = body.image),
    (advert.link = body.link),
    (advert.start_time = body.start_time),
    (advert.end_time = body.end_time)

    advert.last_modified = Date.now()

    // 这里的save因为内部有一个_id ，所以在匹配到一样的，这里是不会新增数据的
    advert.save((err, result) => {
      if (err) {
        return next(err)
      }
      res.json({
        error_code: 0
      })
    })
  })
})

router.get('/advert/remove/:advertId', (req, res, next) => {
  Advert.remove({ _id: req.params.advertId }, err => {
    if (err) {
      return next(err)
    }
    console.log('删除成功')
    res.json({
      error_code: 0
    })
  })
})

/*
 1：通过export default暴露的借口成员不能定义的同时直接暴露口
 2：最好先定义，再暴露
 3：export default 可以直接暴露字面量 {}、 123
*/

export default router
