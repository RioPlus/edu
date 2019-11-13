import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/edu',{ useNewUrlParser:true,useUnifiedTopology: true })

const advertSchema=mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  last_modified: {
    type: Date,
    default: Date.now
  }
})

// 向外暴露 发布的广告模型
export default mongoose.model('Advert',advertSchema)

