import mongoose from "mongoose";


const msgSchema = mongoose.Schema({
   text: {
       type: String,
       required: true
   },
   sender: {
       type: String,
       required: true
   },
   receiver: {
       type: String,
       required: true
   },
},{timestamps:true});


const conversationSchema = mongoose.Schema({
   users: [{
       type: String,
       required: true
   }],
   msgs: [msgSchema]
});


const Conversation = mongoose.model('Conversation', conversationSchema);


export default Conversation;