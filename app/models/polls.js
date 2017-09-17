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
PollSchema.statics.registerVote = function(id, OptionID){
    Poll.findOneAndUpdate(
        {"_id":id, "options._id": OptionID}, 
        {$inc :
            {"options.$.votes":1}},
        function(err, option){
            if(err) {console.log(err)}
            else{
                console.log(option);
            }
        })
}
var Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;