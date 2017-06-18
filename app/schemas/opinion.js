/**
 * 意见反馈模式
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var opinionSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'User'
	},
	content: String,
	createAt: {
      type : Number,
      default : new Date().getTime()
    }
});

module.exports = opinionSchema;