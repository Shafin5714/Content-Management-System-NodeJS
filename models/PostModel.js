const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema({
    title:{
    type:String,
    require:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    status:{
        type:String,
        default:'public'
    },
    description:{
        type:String,
        required:true
    },
    creationDate:{
        type:Date,
        default:Date.now()
    },
    // to set the type as object id
    category:{
        type:Schema.Types.ObjectId,
        ref:'category'
    },
    
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'comment'
        }
    ],
    allowComments:{
        type:Boolean,
        default:false
    },
    file:{
        type:String,
        default:''
    }


})
const Post = mongoose.model('post',PostSchema)
module.exports = Post