const Post = require('../models/PostModel')
const flash = require('connect-flash')
const Category = require('../models/CategoryModel')
const {isEmpty} = require('../config/customFunctions')
const Comment = require('../models/CommentModel')

module.exports ={
    index:(req,res)=>{
        res.render('admin/index')
     },
     getPosts:(req,res)=>{
         Post.find().populate('category').then(posts=>{   ///populate get everything under id
            res.render('admin/posts/index',{posts:posts})
         })
        
     },
     submitPosts:(req,res)=>{
        //  for checkbox (ternary operator) if allowComments then true
        const commentsAllowed = req.body.allowComments ? true: false

        // check for any input file
        let filename = ''
        if(!isEmpty(req.files)){
            let file = req.files.uploadedFile
            filename = file.name
            let uploadDir ='./public/uploads/'
            file.mv(uploadDir+filename,(err)=>{
                if(err){
                    throw err
                }
            })
        }
        

         const newPost = new Post({
             title:req.body.title,   ///matches the name value
             description:req.body.description,
             status:req.body.status,
             allowComments: commentsAllowed,
             category:req.body.category,
             file:`/uploads/${filename}`,
             user: req.user.id

         })
         newPost.save().then(post=>{
             console.log(post);
             req.flash('success-message', 'Post created successfully')
             res.redirect('/admin/posts')
             
         })
     },
     createPosts:(req,res)=>{
         Category.find().then(cats=>{
            res.render('admin/posts/create',{categories:cats})

         })
     },
     editPost:(req,res)=>{
        const id = req.params.id
        Post.findById(id)
        .then(post=>{
            Category.find().then(cats=>{
                res.render('admin/posts/edit',{post:post,categories:cats})
            })
           
        })

         
     },
     editPostSubmit:(req,res)=>{
        const commentsAllowed = req.body.allowComments ? true: false
        const id = req.params.id
        Post.findById(id)
        .then(post=>{
          post.title=req.body.title;
          post.status=req.body.status;
          post.allowComments=req.body.allowComments;
          post.description=req.body.description;
          post.category=req.body.category;
          post.save().then(updatedPost=>{
              req.flash('success-message',`The Post ${updatedPost.title} has been updated`)
              res.redirect('/admin/posts')
          })
           
        })

     },
     deletePosts:(req,res)=>{
         Post.findByIdAndDelete(req.params.id).then(deletePost=>{
             req.flash('success-message',`The post ${deletePost.title} has been deleted`)
             res.redirect('/admin/posts')
         })
     },
    //  All category methods
    getCategories:(req,res)=>{
        Category.find().then(cats=>{
            res.render('admin/category/index',{categories:cats})
        })
    },
    createCategories:(req,res)=>{
        var categoryName = req.body.name
        if(categoryName){
            const newCategory = new Category({
                title:categoryName
            })
            newCategory.save().then(category=>{
                res.status(200).json(category)
            })
        }
        
    },
    editCategoriesGetRoute:async(req,res)=>{
        const catId = req.params.id
        const cats = await Category.find()
        Category.findById(catId).then(cat=>{
            res.render('admin/category/edit',{category:cat,categories:cats})
        })
    },
    editCategoriesPostRoute:(req,res)=>{
        const catId = req.params.id;
        const newTitle = req.body.name
        if(newTitle){
            Category.findById(catId).then(category=>{
                category.title = newTitle;
                category.save().then(updated=>{
                    res.status(200).json({url:'/admin/category'})
                })
            })
        }
    },
    deleteCategory:(req,res)=>{
        Category.findByIdAndDelete(req.params.id).then(deletePost=>{
            req.flash('success-message',`The post ${deletePost.title} has been deleted`)
            res.redirect('/admin/category')

        })
    },
    getComments:(req,res)=>{
        Comment.find().populate('user').then(comments=>{
            res.render('admin/comments/index',{comments:comments})
        })
    },
    approveComments: async(req, res) => {
        const id = req.params.id;
       
        try{
            update = await Comment.findByIdAndUpdate(id,{
                commentIsApproved: true
            });

        }catch(e){
            console.log(e);
            
        }
        res.redirect('/admin/comment')
       
    }
}