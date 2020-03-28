const Post= require('../models/PostModel')
const Category = require('../models/CategoryModel')
const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const Comment = require('../models/CommentModel')
module.exports={
    index:async(req,res)=>{
    let perPage = 1
    let page = req.params.page || 1

       const posts = await Post.find().populate({path:'user',model:'user'}).skip((perPage * page) - perPage)
       .limit(perPage)
    

       
       const categories = await Category.find()

       
       res.render('default/index',{posts:posts, categories:categories, current: page})
     },
     indexWithPage:async(req,res)=>{
        let perPage = 1
        let page = parseInt(req.params.page) || 1
    
           const posts = await Post.find().populate({path:'user',model:'user'}).skip((perPage * page) - perPage)
           .limit(perPage)

           const count = await Post.find().countDocuments()
           
        
    
           
           const categories = await Category.find()
    
           
           res.render('default/index',{posts:posts, categories:categories, current: page,pages: Math.ceil(count / perPage)})



     },
     loginGet:(req,res)=>{
         res.render('default/login');
         
     },
     loginPost:(req,res)=>{
         
     },
     registerGet:(req,res)=>{
         res.render('default/register')
         
     },
     registerPost:(req,res)=>{
        let errors = [];
        if(!req.body.firstName){
            errors.push({message:'First name is mandatory'})
        }
        if(!req.body.lastName){
            errors.push({message:'Last name is mandatory'})
        }
        if(!req.body.email){
            errors.push({message:'email is mandatory'})
        }
        if(req.body.password!==req.body.passwordConfirm){
            errors.push({message:'passwords do not match'})
        }
        if(errors.length>0){
            res.render('default/register',{
                errors:errors,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email

            })
        }
        else{
            User.findOne({email:req.body.email}).then(user=>{
                if(user){
                    req.flash('error-message','Email already exists')
                    res.redirect('/login')
                }
                else{
                    const newUser = new User(req.body)
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            newUser.password= hash
                            newUser.save().then(user=>{
                                req.flash('success-message','You are now registered')
                                res.redirect('/login')
                            })
                        })
                    })
                }
            })

        }
     },
     singlePost:(req,res)=>{
         const id = req.params.id
        //  Multiple populate
        //  chaining populate first populate comments in post the populate user in comments
         Post.findById(id).populate([{path:'comments',populate:{path:'user',model:'user'}},{path:'user',model:'user'}]).then(post=>{
            //  console.log(post);
             
             if(!post){
                 res.status(404).json({message:'NO post found'})
             }
             else{
                 
                 res.render('default/singlePost',{post:post})
             }
         })
    
     },
     submitComment:(req,res)=>{
         if(req.user){
             Post.findById(req.body.id).then(post=>{
                 const newComment = new Comment({
                     user: req.user.id,
                     body: req.body.comment_body
                 })
                 post.comments.push(newComment)
                 post.save().then(savePost=>{
                    newComment.save().then(savedComment=>{
                        req.flash('success-message','Your comment was submitted for review')
                        res.redirect(`/post/${post._id}`)
                    })
                 })

             })
         }
         else{
             req.flash('error-message','Login first to comment')
            res.redirect('/login')
         }
     },
     autocomplete:async(req,res)=>{
        try{
            let regex = new RegExp(req.query["term"],'i');
            let post =await Post.find({title:regex},{'title':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20)
            console.log(post);
            
            let result =[]
            if(post){
                post.forEach(p=>{
                    let obj={
                        id:p.id,
                        label:p.title
                    }
                    result.push(obj)
                })
                res.jsonp(result)
            }
        }catch(err){
            console.log(err);
            
        }
       
    }


}