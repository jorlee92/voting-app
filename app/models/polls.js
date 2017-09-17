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
PollSchema.statics.addOption = function(pollID, name){
    Poll.findOneAndUpdate(
        {"_id": pollID},
        {$push:{
            options:{ name: name, votes:0}
        }}
    , function(err, result){
        if (err) console.log(err)
        else{
            console.log(result);
        }
    })
}
PollSchema.statics.listByUserID = function(userID){
    Poll.find({ownerID: userID },function(err, results){
        if(err) console.log(err);
        else{
            console.log(results);
            return results;
        }
    });
}
var Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;