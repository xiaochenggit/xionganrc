var mongoose = require('mongoose');

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var UserSchema = new Schema({
  // 用户性别
  sex : {
    type : String,
    default : 'noFind'
  },
  isLook: {
    type: Object,
    default: {
      des: true,
      motto:true
    }
  },
  // 专业
  major : {
    type : String,
    default : '胡吃海喝'
  },
  // 学校
  school : {
    type : String,
    default : '家里蹲'
  },
  // 爱好
  hobby : {
    type : Array,
    default : ['option0','option1']
  },
  // 个人介绍
  des : {
    type : String,
    default : '暂无'
  },
  // 座右铭
  motto : {
    type : String,
    default : '暂无'
  },
  // 主人寄语
  message : {
    type : String,
    default : '希望大家喜欢我'
  },
  // 用户头像
  userImg : {
    type : String,
    default : 'userImg.jpg'
  },
  articles : [{
    article : {
      type : ObjectId,
      ref : 'Article'
    }
  }],
  // 最近浏览
  browseUsers: [{
    user : {
      type : ObjectId,
      ref : 'User'
    },
    time : {
      type : Date,
      default : Date.now()
    }
  }],
  // 关注
  follows: [{
    user : {
      type : ObjectId,
      ref : 'User'
    },
    time : {
      type : Date,
      default : Date.now()
    }
  }],
  // 用户名字 , 必须唯一
  name : {
    type : String,
    unique : true
  },
  // 用户的密码
  password : '',
  // 用户的邮箱
  email : String,
  // 用户的问题
  question : String,
  // 用户的答案
  key : String,
  // 用户的等级
  role : {
    type : Number,
    default : 0
  },
  // 用户最近登录时间
  loadTime: {
      type : Date,
      default : Date.now()
  },
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
UserSchema.pre('save', (next) => {
  // let user = this;
  if (this.isNew) {
    this.createAt = this.updateAt = this.loadTime = Date.now();
  } else {
    this.updateAt = Date.now();
  }
  next();
});
module.exports = UserSchema;