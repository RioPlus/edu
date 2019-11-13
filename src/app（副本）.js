// const express=require('express')
// 安裝了babel後，使用es6語法導入
import express from 'express'
// import {foo,f} from './config'

/* 1：通过export导出的成员必须通过解构赋值，
    或者通过 * as 变量名 的形式加载所有通过export导出的接口成员 */
import {foo} from "./config"
import * as allConfig  from './config'


/* 2：通过export default 加载导出的成员必须通过 import 变量名 from ‘模块标识’ 进行加载 */
import defaultConfig from './config'

console.log(`export: ${foo}`)
console.log(`allConfig: ${allConfig}`)
console.log(`defaultConfig: ${defaultConfig}`)

/* 3：export 和export default可以共存 */

/* 这种方式会去被加载模块中通过export default导出的成员 */
// import config  from './config' // 拿不到,undefined


const app=express()



// app.get('/',(req,res)=>{
//     res.end('hello world')
// })


// // 注釋了app.listen後，然後執行npm run start，
// // 會依次執行npm run prestart =>npm run start =>npm run endstart
// app.listen(3000,()=>{
//     console.log('server is run on port 3000')
// })                          