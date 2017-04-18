// 模式
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var userCommentSchema = new Schema({
	user : {
		type : ObjectId,
		ref : 'User'
	},
	from : {
		type : ObjectId,
		ref : 'User'
	},
	reply :[{
		from : {
			type : ObjectId,
			ref : 'User'
		},
		to : {
			type : ObjectId,
			ref : 'User',
		},
		content : String,
	    createAt: {
	      type : Date,
	      default : Date.now()
	    },
	    updateAt: {
	      type : Date,
	      default : Date.now()
	    }
	}],
	content : String,
    createAt: {
      type : Date,
      default : Date.now()
    },
    updateAt: {
      type : Date,
      default : Date.now()
    }
});
// userCommentSchema.pre('save', (next) => {
//   // let user = this;
//   if (this.isNew) {
//     this.createAt = this.updateAt = Date.now();
//   } else {
//     this.updateAt = Date.now();
//   }
//   next();
// });
module.exports = userCommentSchema;