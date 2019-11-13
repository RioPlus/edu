import express from 'express'
import * as indexController from './../controllers/index'

// 每个模块文件 都可以加载express.Router,因为我们看到Router()是一个方法，所以可以多次调用
const router=express.Router() 

// 涉及配置路由
router.get('/', indexController.showIndex)
// 每个模块文件 都可以加载express.Router,也都可以向外暴露，最终都会挂载app(服务实例)上
export default router  