const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController')
const {isUserAuthenticated} = require('../config/customFunctions')

// routers with every route starting with admin (works as a middleware)
router.all('/*',isUserAuthenticated,(req,res,next)=>{
    req.app.locals.layout='admin'  ///use the admin layout
    next()
})

router.route('/').get(adminController.index)
router.route('/posts').get(adminController.getPosts)
router.route('/posts/create').get(adminController.createPosts).post(adminController.submitPosts)

router.route('/posts/edit/:id').get(adminController.editPost).put(adminController.editPostSubmit)
router.route('/posts/delete/:id').delete(adminController.deletePosts)

// Admin category routes
router.route('/category').get(adminController.getCategories).post(adminController.createCategories)
router.route('/category/edit/:id').get(adminController.editCategoriesGetRoute).post(adminController.editCategoriesPostRoute)
router.route('/category/delete/:id').delete(adminController.deleteCategory)

// /admin/category/{{_id}}
// admin comment routes
router.route('/comment').get(adminController.getComments)
router.route('/comment/approve/:id').post(adminController.approveComments);

module.exports = router