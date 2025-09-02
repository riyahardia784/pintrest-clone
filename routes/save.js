const mongoose= require('mongoose');


const saveSchema =mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  title:String,
  description: String,
  image: String,
  profileImage: String
});



module.exports= mongoose.model("save", saveSchema);