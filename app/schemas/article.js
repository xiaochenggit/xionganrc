// 文章模型
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var ArticleSchema = new Schema({
  // 标题 
  title : {
    type : String,
    unique : true
  },
  // 作者
  author : {
    name : String,
    _id : '',
    userImg: '',
    sex: ''
  },
  collectionUsers:[{
    user: {
      type : ObjectId,
      ref: 'User'
    },
    time : {
      type : Number,
      default : new Date().getTime()
    }
  }],
  // 关键词
  desc : {
    type : String,
    default : "描述"
  },
  content : String,
  markDown: String,
  // 分类
  categories: [{
   name:''
  }],
  // 浏览的人
  browseUsers: [{
    user : {
      type : ObjectId,
      ref: 'User'
    },
    time : {
      type : Number,
      default : new Date().getTime()
    }
  }],
  // 注册时间
  createAt: {
    type : Number,
    default : new Date().getTime()
  },
  // 更新状态的时间
  updateAt: {
    type : Number,
    default : new Date().getTime()
  }
});
ArticleSchema.pre('save', (next) => {
  // let user = this;
  if (this.isNew) {
    this.createAt = this.updateAt = this.loadTime = new Date().getTime();
  } else {
    this.updateAt = new Date().getTime();
  }
  next();
});
module.exports = ArticleSchema;