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
    type : Date,
    default : Date.now()
  },
  // 更新状态的时间
  updateAt: {
    type : Date,
    default : Date.now()
  }
});
ArticleCategorySchema.pre('save', (next) => {
  // let user = this;
  if (this.isNew) {
    this.createAt = this.updateAt = this.loadTime = Date.now();
  } else {
    this.updateAt = Date.now();
  }
  next();
});
module.exports = ArticleCategorySchema;