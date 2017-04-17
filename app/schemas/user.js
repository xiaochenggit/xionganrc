var mongoose = require('mongoose');
var User = mongoose.Schema;
var UserSchema = new User({
  userImg : {
    type : String,
    default : 'userImg.jpg'
  },
  name : {
    type : String,
    unique : true
  },
  password : '',
  email : String,
  question : String,
  key : String,
  role : {
    type : Number,
    default : 0
  },
  loadTime: {
      type : Date,
      default : Date.now()
  },
  createAt: {
    type : Date,
    default : Date.now()
  },
  updateAt: {
    type : Date,
    default : Date.now()
  }
});

UserSchema.pre('save', (next) => {
  // let user = this;
  if (this.isNew) {
    this.createAt = Date.now();
    this.updateAt = Date.now();
  } else {
    this.updateAt = Date.now();
  }
  next();
});
module.exports = UserSchema;