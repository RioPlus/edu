// 需求：导出三个成员：分别是 foo：bar  f:function  num:18
// exports.foo='bar'
// exports.f=function(){}
// exports.num=10

/* 以上为node之前写法，下面是es6写法 */

/* 写法一：  */
// export const  foo="bar"
// export const f=function(){}

// export const num=18

/* 写法一：  */
const foo = 'bar'
const f = function () {}

//  const num=18

export const num = -10 // export 可以使用多次，这里可以混搭
export { foo, f }

export default {
  fff () {
    console.log('fff')
  }
}
