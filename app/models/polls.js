var mongoose = require('mongoose');
var OptionSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
    }, 
    votes: {
        type: Number,
        required: true
    }
})
var PollSchema = new mongoose.Schema({
    ownerID: {
        type: String,
        required: true
    },
    ownerName:{
        type:String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    options: [OptionSchema]
});

var Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;