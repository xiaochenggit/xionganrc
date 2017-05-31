// 文章分类模型
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var ArticleCategorySchema = new Schema({
  // 标题
  name : {
    type : String,
    unique : true
  },
  articles: [{
    article : {
      type : ObjectId,
      ref : 'Article'
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
ArticleCategorySchema.pre('save', (next) => {
  // let user = this;
  if (this.isNew) {
    this.createAt = this.updateAt = this.loadTime = new Date().getTime();
  } else {
    this.updateAt = new Date().getTime();
  }
  next();
});
module.exports = ArticleCategorySchema;