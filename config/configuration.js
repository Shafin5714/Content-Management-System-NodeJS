
module.exports = {
    mongodbUrl:'mongodb+srv://Shafin5714:04216777@cluster0-zeucv.mongodb.net/CMS?retryWrites=true&w=majority',
    PORT:process.env.PORT || 3000,
    globalVariables:(req,res,next)=>{
        res.locals.success_message= req.flash('success-message')
        res.locals.error_message= req.flash('error-message')
        res.locals.user = req.user || null  
        next()
    }
}