import fs from 'fs'
import path from 'path'

import Mongodb from 'mongodb'

const MongodbClient = Mongodb.MongoClient

const url = 'mongodb://localhost:27017'

export default (errLog, req, res, next) => {
  const err_log = `
  ======================
  错误名：${errLog.name}
  错误消息：${errLog.message}
  错误堆栈:${errLog.stack}
  错误发生时间:${new Date().toLocaleString()}
  `

  fs.appendFile(path.join(__dirname, './../../err_log.txt'), err_log, err => {
    if (err) {
      return console.log('打印错误日志失败')
    }
    console.log('打印错误日志成功')
  })

  MongodbClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        throw err
      } else {
        const db = client.db('edu')

        db.collection('error_logs').insertOne(
          {
            name: errLog.name,
            message: errLog.message,
            stack: errLog.stack,
            time: new Date().toLocaleString()
          },
          (err, result) => {
            if (err) {
              throw err
            }

            res.json({
              error: 500,
              message: errLog.message
            })
          }
        )
      }

      client.close()
    }
  )

  // const err_log=`
  // ======================
  // 错误名：${err.name}
  // 错误消息：${err.message}
  // 错误堆栈:${err.stack}
  // 错误发生时间:${new Date().toLocaleString()}
  // `
}
