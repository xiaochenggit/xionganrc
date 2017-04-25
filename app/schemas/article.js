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
  },
  // 关键词
  keyword : {
    type : Array,
    default : []
  },
  content : String,
  // 分类
  categories: [{
    articlecategory: {
      type: ObjectId,
      ref : 'articleCategory'
    }
  }],
  // 浏览的人
  browseUsers: [{
    user : {
      name : String,
      _id : '',
    },
    time : {
      type : Date,
      default : Date.now()
    }
  }],
  // 注册时间
  createAt: {
    type : Date,
    default : Date.now()
  },
  // 更新状态的时间
  updateAt: {
    type : Date,
    default : Date.now()
  }
});
ArticleSchema.pre('save', (next) => {
  // let user = this;
  if (this.isNew) {
    this.createAt = this.updateAt = this.loadTime = Date.now();
  } else {
    this.updateAt = Date.now();
  }
  next();
});
module.exports = ArticleSchema;