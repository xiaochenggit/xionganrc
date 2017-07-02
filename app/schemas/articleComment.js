// 模式
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const articleCommentSchema = new Schema({
	article : {
		type : ObjectId,
		ref : 'Article'
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
	      type : Number,
	      default : new Date().getTime()
	    },
	    updateAt: {
	      type : Number,
	      default : new Date().getTime()
	    }
	}],
	content : String,
    createAt: {
      type : Number,
      default : new Date().getTime()
    },
    updateAt: {
      type : Number,
      default : new Date().getTime()
    }
});
module.exports = articleCommentSchema;