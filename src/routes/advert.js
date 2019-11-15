import express from 'express'
import Advert from './../models/advert'
import formidable from 'formidable'
import config from '../config'
import { basename } from 'path'
import fs from 'fs'

// 连接mongodb数据库

// 创建一个路由容器，将所有路由中间件挂在给路由容器
const router = express.Router()

router.get('/advert/count', (req, res, next) => {
  Advert.countDocuments((err, count) => {
    if (err) {
      return next(err)
    }
    res.json({
      error_code: 0,
      result: count
    })
  })
})

router.get('/advert', (req, res, next) => {
  res.render('advert_list.html', {
    foo: 'bar'
  })

  // const page_num = Number.parseInt(req.query.page, 10)
  // const page_size = 5

  // Advert.find() // 先去查询所有
  //   .skip((page_num - 1) * page_size) // 跳过多少条数据
  //   .limit(page_size) // 需要显示多少条数据
  //   .exec((err, result) => {
  //     if (err) {
  //       return next(err)
  //     }

  //     Advert.countDocuments((err, count) => {
  //       if (err) {
  //         return next(err)
  //       }
  //       const totalPage = Math.ceil(count / page_size) // 总页码=总记录数 / 每页记录数
  //       res.render('advert_list.html', { adverts: result, totalPage: totalPage,page:page_num})
  //     })

  //   }) // 执行

  // Advert.find((err,adverts)=>{
  //   if(err){
  //     return next(err)
  //   }
  //   res.render('advert_list.html',{
  //     adverts:adverts
  //   })
  // })
})

// 獲取新增界面
router.get('/advert/add', (req, res, next) => {
  res.render('advert_add.html')
})

// 新增提交
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
   查询：获取所有广告列表
 */
router.get('/advert/list', (req, res, next) => {
  let { page, pageSize } = req.query
  page = Number.parseInt(page)
  pageSize = Number.parseInt(pageSize)

  Advert.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec((err, result) => {
      if (err) {
        return next(err)
      }
      res.json({
        error_code: 0,
        result: result
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

// 编辑页面
router.get('/advert/edit/:id', (req, res, next) => {
  const id = req.params.id
  Advert.findById(id, (err, advert) => {
    if (err) {
      return next(err)
    }
    // res.json({
    //   error_code:0,
    //   data:advert
    // })
    res.render('advert_edit.html', advert)
  })
})

// 编辑提交
router.post('/advert/edit', (req, res, next) => {
  const form = new formidable()

  form.uploadDir = config.uploadDir
  form.keepExtensions = true

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err)
    }

    const body = fields
    console.log('fields:' + JSON.stringify(fields))

    console.log(files.image.path)
    console.log(typeof files.image.path)
    if (
      files.image.path.indexOf('.jpg') > -1 ||
      files.image.path.indexOf('.png') > -1 ||
      files.image.path.indexOf('.ico') > -1
    ) {
      body.image = basename(files.image.path)

      // 2、操作数据库
      Advert.findOneAndUpdate(
        { _id: body.id },
        {
          $set: {
            _id: body.id,
            title: body.title,
            image: body.image,
            link: body.link,

            start_time: body.start_time,
            end_time: body.end_time,
            last_modified: Date.now()
          }
        },
        (err, result) => {
          console.log('进来第一个')
          if (err) {
            return next(err)
          }

          console.log(result, '添加数据')
          res.json({
            error_code: 0
          })
        }
      )
    } else {
      // 2、操作数据库
      Advert.findOneAndUpdate(
        { _id: body.id },
        {
          $set: {
            _id: body.id,
            title: body.title,
            link: body.link,
            start_time: body.start_time,
            end_time: body.end_time,
            last_modified: Date.now()
          }
        },
        (err, result) => {
          if (err) {
            return next(err)
          }

          console.log(result, '添加数据')

          // 这里删除无效的空文件
          // if (files.image.path) {
           
          //   const delUrl = config.uploadDir + './' + files.image.path
          //   console.log(delUrl)
          //   fs.unlink(delUrl, err => {
          //     if (err) {
          //       return next(err)
          //     }
              res.json({
                error_code: 0
              })
            //   console.log('删除无效文件成功')
            // })
          // }
        }
      )
    }
  })
})

// // 同步刪除
// router.get('/advert/remove/:advertId', (req, res, next) => {

//   Advert.remove({ _id: req.params.advertId }, err => {
//     if (err) {
//       return next(err)
//     }
//     console.log('删除成功')
//     res.json({
//       error_code: 0
//     })
//   })
// })

// 異步刪除
router.get('/advert/remove', (req, res, next) => {
  const advertId = req.query.id

  Advert.deleteOne({ _id: advertId }, err => {
    if (err) {
      return next(err)
    }
    console.log('异步删除成功')
    res.json({
      error_code: 0
    })
  })
})

/*
 1：通过export default暴露的借口成员不能  定义的同时直接暴露口
 2：最好先定义，再暴露
 3：export default 可以直接暴露字面量 {}、 123
*/

export default router
