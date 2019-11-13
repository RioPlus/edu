import queryString from 'querystring'

// 相当于自己实现的解析表单post数据中间件
export default (req,res,next)=>{
if(req.method.toLowerCase()==='get'){
   return next() // 因为异步 不加return 下面还是会执行
}


// 如果是普通表单，咋们自己处理
// 如果有文件的表单post，跳过下面操作不处理

if(req.headers['content-type'].startsWith('multipart/form-data')){
    console.log('判断类型')
    return next()
}

let data=''
req.on('data',chunk=>{
    data+=chunk
})

req.on('end',()=>{
    req.body=queryString.parse(data)
    next()
})
}