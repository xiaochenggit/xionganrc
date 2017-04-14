var mongoose = require('mongoose');
var User = mongoose.Schema;
var UserSchema = new User({
  name : {
    type : String,
    unique : true
  },
  role : {
    type : Number,
    default : 0
  },
  password : '',
  meta: {
    createAt: {
      type : Date,
      default : Date.now()
    },
    updateAt: {
      type : Date,
      default : Date.now()
    },
    loadTime: {
      type : Date,
      default : Date.now()
    }
  }
});

UserSchema.pre('save', (next) => {
  let user = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
module.exports = UserSchema;